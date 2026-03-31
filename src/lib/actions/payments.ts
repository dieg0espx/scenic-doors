"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendInvoiceEmail, sendPaymentReceiptEmail, sendInternalNotificationEmail } from "@/lib/email";
import { sendSlackNotification } from "@/lib/slack";
import { getNotificationEmailsByType } from "@/lib/actions/notification-settings";

export async function createPayment({
  quoteId,
  contractId,
  clientName,
  amount,
  paymentType = "advance_50",
}: {
  quoteId: string;
  contractId?: string;
  clientName: string;
  amount: number;
  paymentType?: "advance_50" | "balance_50" | "installation";
}) {
  const supabase = await createClient();
  const insert: Record<string, unknown> = {
    quote_id: quoteId,
    client_name: clientName,
    amount,
    payment_type: paymentType,
    status: "pending",
  };
  if (contractId) insert.contract_id = contractId;

  const { data, error } = await supabase
    .from("payments")
    .insert(insert)
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
    .select("*, quotes(quote_number, door_type, cost, material, color, glass_type, size, client_email, delivery_type, delivery_address, subtotal, installation_cost, delivery_cost, tax, grand_total)")
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
  const suffix = payment.payment_type === "advance_50" ? "-A" : payment.payment_type === "installation" ? "-I" : "-B";
  const invoiceNumber = `INV-${quotes.quote_number.replace("QT-", "")}${suffix}`;

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
    .select("*, quotes(quote_number, door_type, cost, material, color, glass_type, size, client_name, client_email, delivery_type, delivery_address, subtotal, installation_cost, delivery_cost, tax, grand_total)")
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
      const suffix = payment.payment_type === "advance_50" ? "-A" : payment.payment_type === "installation" ? "-I" : "-B";
      const invoiceNumber = `INV-${quotes.quote_number.replace("QT-", "")}${suffix}`;

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

      // Auto-update order status and tracking based on payment type
      if (payment.payment_type === "balance_50") {
        // Balance paid → order completed
        await supabase
          .from("orders")
          .update({ status: "completed" })
          .eq("quote_id", payment.quote_id);
        // Sync order_tracking
        await supabase
          .from("order_tracking")
          .update({ deposit_2_paid: true, deposit_2_paid_at: paidAt, stage: "shipping" })
          .eq("quote_id", payment.quote_id);
        // Advance portal stage
        await supabase
          .from("quotes")
          .update({ portal_stage: "shipping" })
          .eq("id", payment.quote_id);
      } else if (payment.payment_type === "advance_50") {
        // Advance paid → create order + order_tracking if they don't exist yet
        const { data: existingOrder } = await supabase
          .from("orders")
          .select("id")
          .eq("quote_id", payment.quote_id)
          .maybeSingle();

        if (!existingOrder) {
          // Fetch quote grand_total for deposit amounts
          const { data: quoteData } = await supabase
            .from("quotes")
            .select("grand_total")
            .eq("id", payment.quote_id)
            .single();
          const totalAmount = Number(quoteData?.grand_total || 0);
          const halfAmount = Math.round(totalAmount * 50) / 100;

          await supabase
            .from("orders")
            .insert({
              quote_id: payment.quote_id,
              client_name: quotes.client_name,
              client_email: quotes.client_email,
              status: "in_progress",
            });

          await supabase
            .from("order_tracking")
            .insert({
              quote_id: payment.quote_id,
              stage: "manufacturing",
              deposit_1_amount: halfAmount,
              deposit_2_amount: halfAmount,
              deposit_1_paid: true,
              deposit_1_paid_at: paidAt,
            });
        } else {
          // Order already exists, just update status
          await supabase
            .from("orders")
            .update({ status: "in_progress" })
            .eq("quote_id", payment.quote_id);

          await supabase
            .from("order_tracking")
            .update({ deposit_1_paid: true, deposit_1_paid_at: paidAt, stage: "manufacturing" })
            .eq("quote_id", payment.quote_id);
        }

        // Set lead_status to "order" so it moves from quotes to orders list
        await supabase
          .from("quotes")
          .update({ portal_stage: "manufacturing", lead_status: "order" })
          .eq("id", payment.quote_id);
      } else if (payment.payment_type === "installation") {
        // Mark installation quote as paid
        await supabase
          .from("installation_quotes")
          .update({ status: "paid", updated_at: paidAt })
          .eq("quote_id", payment.quote_id)
          .eq("payment_id", id);
      }

      // Send internal notification
      const notifyEmails = await getNotificationEmailsByType("payment_received");
      if (notifyEmails.length > 0) {
        const typeLabel = payment.payment_type === "advance_50" ? "50% Advance" : payment.payment_type === "installation" ? "Installation" : "50% Balance";
        const formattedAmt = Number(payment.amount).toLocaleString("en-US", { minimumFractionDigits: 2 });
        const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://scenicdoors.co";
        await sendInternalNotificationEmail(
          {
            heading: `Payment Received — ${invoiceNumber}`,
            headingColor: "#16a34a",
            headingBg: "#f0fdf4",
            headingBorder: "#dcfce7",
            message: `${quotes.client_name} has completed a payment.`,
            details: [
              { label: "Invoice", value: invoiceNumber },
              { label: "Client", value: quotes.client_name },
              { label: "Type", value: typeLabel },
              { label: "Amount", value: `$${formattedAmt}` },
              { label: "Method", value: paymentMethod },
              { label: "Reference", value: paymentReference },
            ],
            adminUrl: `${origin}/admin/quotes/${payment.quote_id}`,
          },
          notifyEmails
        );
      }
    }
  } catch (err) {
    console.error("[Payment notification error]", err);
  }

  // Slack notification
  try {
    const { data: sp } = await supabase
      .from("payments")
      .select("*, quotes(quote_number, client_name)")
      .eq("id", id)
      .single();
    if (sp) {
      const sq = sp.quotes as { quote_number: string; client_name: string };
      const isAdv = sp.payment_type === "advance_50";
      const invoiceNum = `INV-${sq.quote_number.replace("QT-", "")}${isAdv ? "-A" : "-B"}`;
      const typeLabel = isAdv ? "50% Advance" : "50% Balance";
      const formattedAmt = Number(sp.amount).toLocaleString("en-US", { minimumFractionDigits: 2 });
      const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://scenicdoors.co";
      await sendSlackNotification({
        heading: `Payment Received — ${invoiceNum}`,
        message: `*${sq.client_name}* has completed a payment.`,
        color: "#16a34a",
        details: [
          { label: "Invoice", value: invoiceNum },
          { label: "Client", value: sq.client_name },
          { label: "Type", value: typeLabel },
          { label: "Amount", value: `$${formattedAmt}` },
          { label: "Method", value: paymentMethod },
          { label: "Reference", value: paymentReference },
        ],
        adminUrl: `${origin}/admin/quotes/${sp.quote_id}`,
      });
    }
  } catch (err) {
    console.error("[Slack notification error]", err);
  }

  // Fetch quote_id for portal revalidation
  const { data: pmt } = await supabase.from("payments").select("quote_id").eq("id", id).single();

  revalidatePath("/admin/payments");
  revalidatePath("/admin/invoices");
  revalidatePath("/admin/orders");
  if (pmt?.quote_id) {
    revalidatePath(`/portal/${pmt.quote_id}`);
    revalidatePath(`/admin/quotes/${pmt.quote_id}`);
  }
}

export async function createBalancePayment({
  quoteId,
  contractId,
  clientName,
  amount,
}: {
  quoteId: string;
  contractId?: string;
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
  contractId?: string;
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

export async function createAndSendDepositInvoice({
  quoteId,
  clientName,
  amount,
  origin,
}: {
  quoteId: string;
  clientName: string;
  amount: number;
  origin: string;
}) {
  const payment = await createPayment({
    quoteId,
    clientName,
    amount,
    paymentType: "advance_50",
  });

  await sendInvoiceToClient(payment.id, origin);

  // Advance portal stage to deposit_1_pending
  const supabase = await createClient();
  await supabase
    .from("quotes")
    .update({ portal_stage: "deposit_1_pending" })
    .eq("id", quoteId);

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/quotes/${quoteId}`);
  revalidatePath(`/portal/${quoteId}`);
  return payment;
}
