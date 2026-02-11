"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendInvoiceEmail, sendPaymentReceiptEmail } from "@/lib/email";

export async function createPayment({
  quoteId,
  contractId,
  clientName,
  amount,
  paymentType = "advance_50",
}: {
  quoteId: string;
  contractId: string;
  clientName: string;
  amount: number;
  paymentType?: "advance_50" | "balance_50";
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .insert({
      quote_id: quoteId,
      contract_id: contractId,
      client_name: clientName,
      amount,
      payment_type: paymentType,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/payments");
  return data;
}

export async function getPayments() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*, quotes(quote_number, door_type)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getPaymentsForInvoices() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*, quotes(quote_number, door_type, cost, material, color, glass_type, size, client_email, delivery_type, delivery_address)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getPaymentsByQuoteId(quoteId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("quote_id", quoteId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updatePaymentStatus(
  id: string,
  status: "pending" | "completed" | "on_hold"
) {
  const supabase = await createClient();
  const updates: Record<string, unknown> = { status };
  if (status === "completed") {
    updates.paid_at = new Date().toISOString();
  }
  const { error } = await supabase
    .from("payments")
    .update(updates)
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/payments");
  revalidatePath("/admin/invoices");
}

export async function sendInvoiceToClient(id: string, origin: string) {
  const supabase = await createClient();
  const { data: payment, error } = await supabase
    .from("payments")
    .select("*, quotes(quote_number, client_name, client_email)")
    .eq("id", id)
    .single();

  if (error || !payment) throw new Error("Payment not found");

  const quotes = payment.quotes as { quote_number: string; client_name: string; client_email: string };
  const isAdvance = payment.payment_type === "advance_50";
  const invoiceNumber = `INV-${quotes.quote_number.replace("QT-", "")}${isAdvance ? "-A" : "-B"}`;

  await sendInvoiceEmail({
    clientName: quotes.client_name,
    clientEmail: quotes.client_email,
    invoiceNumber,
    quoteNumber: quotes.quote_number,
    paymentType: payment.payment_type,
    amount: payment.amount,
    invoiceUrl: `${origin}/invoice/${payment.id}`,
  });

  revalidatePath("/admin/invoices");
}

export async function getPaymentById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*, quotes(quote_number, door_type, cost, material, color, glass_type, size, client_name, client_email, delivery_type, delivery_address)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function submitPaymentConfirmation(
  id: string,
  paymentMethod: string,
  paymentReference: string
) {
  const supabase = await createClient();
  const paidAt = new Date().toISOString();
  const { error } = await supabase
    .from("payments")
    .update({
      payment_method: paymentMethod,
      payment_reference: paymentReference,
      status: "completed",
      paid_at: paidAt,
    })
    .eq("id", id)
    .eq("status", "pending");

  if (error) throw new Error(error.message);

  // Send receipt email + auto-complete order if balance paid
  try {
    const { data: payment } = await supabase
      .from("payments")
      .select("*, quotes(quote_number, client_name, client_email)")
      .eq("id", id)
      .single();

    if (payment) {
      const quotes = payment.quotes as { quote_number: string; client_name: string; client_email: string };
      const isAdvance = payment.payment_type === "advance_50";
      const invoiceNumber = `INV-${quotes.quote_number.replace("QT-", "")}${isAdvance ? "-A" : "-B"}`;

      await sendPaymentReceiptEmail({
        clientName: quotes.client_name,
        clientEmail: quotes.client_email,
        invoiceNumber,
        quoteNumber: quotes.quote_number,
        paymentType: payment.payment_type,
        amount: payment.amount,
        paymentMethod,
        paymentReference,
        paidAt,
      });

      // Auto-update order status based on payment type
      if (payment.payment_type === "balance_50") {
        // Balance paid → order completed
        await supabase
          .from("orders")
          .update({ status: "completed" })
          .eq("quote_id", payment.quote_id);
      } else if (payment.payment_type === "advance_50") {
        // Advance paid → order in progress
        await supabase
          .from("orders")
          .update({ status: "in_progress" })
          .eq("quote_id", payment.quote_id);
      }
    }
  } catch {
    // Don't fail the payment if email/order-update fails
  }

  revalidatePath("/admin/payments");
  revalidatePath("/admin/invoices");
  revalidatePath("/admin/orders");
}

export async function createBalancePayment({
  quoteId,
  contractId,
  clientName,
  amount,
}: {
  quoteId: string;
  contractId: string;
  clientName: string;
  amount: number;
}) {
  return createPayment({
    quoteId,
    contractId,
    clientName,
    amount,
    paymentType: "balance_50",
  });
}

export async function createAndSendBalanceInvoice({
  quoteId,
  contractId,
  clientName,
  amount,
  origin,
}: {
  quoteId: string;
  contractId: string;
  clientName: string;
  amount: number;
  origin: string;
}) {
  const payment = await createBalancePayment({
    quoteId,
    contractId,
    clientName,
    amount,
  });

  await sendInvoiceToClient(payment.id, origin);
  revalidatePath("/admin/orders");
  return payment;
}
