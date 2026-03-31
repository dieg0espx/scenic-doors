"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendManufacturingStartedEmail, sendManufacturingCompletedEmail, sendDeliveryThankYouEmail } from "@/lib/email";
import { recordEmailSent } from "@/lib/actions/email-history";
import { createAndSendBalanceInvoice } from "@/lib/actions/payments";

export async function createOrder({
  quoteId,
  contractId,
  paymentId,
  clientName,
  clientEmail,
}: {
  quoteId: string;
  contractId: string;
  paymentId: string;
  clientName: string;
  clientEmail: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      quote_id: quoteId,
      contract_id: contractId,
      payment_id: paymentId,
      client_name: clientName,
      client_email: clientEmail,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
  return data;
}

export async function getOrders() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, quotes(quote_number, door_type, cost), contracts(signature_url), payments(amount, status)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  // Sync order statuses based on actual payment states (batch query)
  if (data && data.length > 0) {
    const quoteIds = [...new Set(data.map((o) => o.quote_id))];
    const { data: allPayments } = await supabase
      .from("payments")
      .select("quote_id, payment_type, status")
      .in("quote_id", quoteIds);

    const paymentsByQuote = new Map<string, typeof allPayments>();
    for (const p of allPayments ?? []) {
      if (!paymentsByQuote.has(p.quote_id)) paymentsByQuote.set(p.quote_id, []);
      paymentsByQuote.get(p.quote_id)!.push(p);
    }

    for (const order of data) {
      const payments = paymentsByQuote.get(order.quote_id) ?? [];

      const advancePaid = payments.some(
        (p) => p.payment_type === "advance_50" && p.status === "completed"
      );
      const balancePaid = payments.some(
        (p) => p.payment_type === "balance_50" && p.status === "completed"
      );

      let correctStatus = order.status;
      if (balancePaid) correctStatus = "completed";
      else if (advancePaid) correctStatus = "in_progress";

      if (correctStatus !== order.status) {
        await supabase
          .from("orders")
          .update({ status: correctStatus })
          .eq("id", order.id);
        order.status = correctStatus;
      }
    }
  }

  return data;
}

export async function getOrderById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, quotes(*), contracts(client_name, signature_url, signed_at, ip_address)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function updateOrderStatus(
  id: string,
  status: "pending" | "in_progress" | "completed" | "cancelled"
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
}

/**
 * Checks payment states and corrects the order status if it's out of sync.
 * Returns the corrected status if changed, or null if no change needed.
 */
export async function syncOrderStatus(
  orderId: string,
  quoteId: string,
  currentStatus: string
): Promise<string | null> {
  const supabase = await createClient();
  const { data: payments } = await supabase
    .from("payments")
    .select("payment_type, status")
    .eq("quote_id", quoteId);

  if (!payments) return null;

  const advancePaid = payments.some(
    (p) => p.payment_type === "advance_50" && p.status === "completed"
  );
  const balancePaid = payments.some(
    (p) => p.payment_type === "balance_50" && p.status === "completed"
  );

  let correctStatus = currentStatus;
  if (balancePaid) {
    correctStatus = "completed";
  } else if (advancePaid) {
    correctStatus = "in_progress";
  }

  if (correctStatus !== currentStatus) {
    await supabase
      .from("orders")
      .update({ status: correctStatus })
      .eq("id", orderId);
    revalidatePath("/admin/orders");
    return correctStatus;
  }

  return null;
}

export async function startManufacturing(orderId: string): Promise<void> {
  const supabase = createServiceClient();

  // Fetch order with quote data
  const { data: order, error } = await supabase
    .from("orders")
    .select("*, quotes(quote_number, client_name, client_email, door_type)")
    .eq("id", orderId)
    .single();

  if (error || !order) throw new Error("Order not found");

  const now = new Date().toISOString();
  const quote = order.quotes as { quote_number: string; client_name: string; client_email: string; door_type: string } | null;

  // Try to update existing order_tracking row
  const { data: updatedTracking, error: trackingErr } = await supabase
    .from("order_tracking")
    .update({
      stage: "manufacturing",
      manufacturing_started_at: now,
    })
    .eq("quote_id", order.quote_id)
    .select();

  if (trackingErr) throw new Error(`Failed to update tracking: ${trackingErr.message}`);

  // If no tracking row exists, create one
  if (!updatedTracking || updatedTracking.length === 0) {
    const { error: insertErr } = await supabase
      .from("order_tracking")
      .insert({
        quote_id: order.quote_id,
        stage: "manufacturing",
        manufacturing_started_at: now,
      });
    if (insertErr) throw new Error(`Failed to create tracking: ${insertErr.message}`);
  }

  // Update portal stage
  const { error: portalErr } = await supabase
    .from("quotes")
    .update({ portal_stage: "manufacturing" })
    .eq("id", order.quote_id);

  if (portalErr) throw new Error(`Failed to update portal stage: ${portalErr.message}`);

  // Send email to client
  if (quote?.client_email) {
    try {
      const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://scenicdoors.co";
      await sendManufacturingStartedEmail({
        clientName: quote.client_name,
        clientEmail: quote.client_email,
        quoteNumber: quote.quote_number,
        orderNumber: order.order_number,
        doorType: quote.door_type,
        portalUrl: `${origin}/portal/${order.quote_id}`,
      });

      await recordEmailSent({
        quote_id: order.quote_id,
        recipient_email: quote.client_email,
        subject: `Your Doors Are Now in Manufacturing — ${order.order_number}`,
        type: "manufacturing_started",
      });
    } catch {
      // Don't fail if email fails
    }
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath(`/portal/${order.quote_id}`);
}

export async function completeManufacturing(orderId: string): Promise<void> {
  const supabase = createServiceClient();

  // Fetch order with quote data
  const { data: order, error } = await supabase
    .from("orders")
    .select("*, quotes(quote_number, client_name, client_email, door_type, cost, grand_total, installation_cost)")
    .eq("id", orderId)
    .single();

  if (error || !order) throw new Error("Order not found");

  const now = new Date().toISOString();
  const quote = order.quotes as { quote_number: string; client_name: string; client_email: string; door_type: string; cost: number; grand_total: number; installation_cost: number } | null;

  // Update order_tracking: manufacturing → deposit_2_pending
  const { data: updatedTracking, error: trackingErr } = await supabase
    .from("order_tracking")
    .update({
      stage: "deposit_2_pending",
      manufacturing_completed_at: now,
    })
    .eq("quote_id", order.quote_id)
    .select();

  if (trackingErr) throw new Error(`Failed to update tracking: ${trackingErr.message}`);
  if (!updatedTracking || updatedTracking.length === 0) {
    const { error: insertErr } = await supabase
      .from("order_tracking")
      .insert({
        quote_id: order.quote_id,
        stage: "deposit_2_pending",
        manufacturing_completed_at: now,
      });
    if (insertErr) throw new Error(`Failed to create tracking: ${insertErr.message}`);
  }

  // Update portal stage
  const { error: portalErr } = await supabase
    .from("quotes")
    .update({ portal_stage: "deposit_2_pending" })
    .eq("id", order.quote_id);

  if (portalErr) throw new Error(`Failed to update portal stage: ${portalErr.message}`);

  // Send manufacturing completed email to client
  if (quote?.client_email) {
    try {
      const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://scenicdoors.co";
      await sendManufacturingCompletedEmail({
        clientName: quote.client_name,
        clientEmail: quote.client_email,
        quoteNumber: quote.quote_number,
        orderNumber: order.order_number,
        doorType: quote.door_type,
        portalUrl: `${origin}/portal/${order.quote_id}`,
      });

      await recordEmailSent({
        quote_id: order.quote_id,
        recipient_email: quote.client_email,
        subject: `Manufacturing Complete — ${order.order_number} | Scenic Doors`,
        type: "manufacturing_completed",
      });
    } catch {
      // Don't fail if email fails
    }
  }

  // Auto-send balance invoice
  if (quote) {
    try {
      const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://scenicdoors.co";
      const totalCost = Number(quote.grand_total ?? quote.cost ?? 0);

      // Get the advance payment amount to calculate the real remaining balance
      const { data: advancePayments } = await supabase
        .from("payments")
        .select("amount")
        .eq("quote_id", order.quote_id)
        .eq("payment_type", "advance_50")
        .eq("status", "completed");

      const advancePaid = (advancePayments ?? []).reduce(
        (sum: number, p: { amount: number }) => sum + Number(p.amount), 0
      );
      const balanceAmount = Math.round((totalCost - advancePaid) * 100) / 100;

      await createAndSendBalanceInvoice({
        quoteId: order.quote_id,
        contractId: order.contract_id,
        clientName: quote.client_name,
        amount: balanceAmount,
        origin,
      });

      await recordEmailSent({
        quote_id: order.quote_id,
        recipient_email: quote.client_email,
        subject: `Balance Invoice — ${order.order_number} | Scenic Doors`,
        type: "balance_invoice",
      });
    } catch {
      // Don't fail if balance invoice fails
    }
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath(`/portal/${order.quote_id}`);
}

export async function markAsDelivered(orderId: string): Promise<void> {
  const supabase = createServiceClient();

  // Fetch order with quote data
  const { data: order, error } = await supabase
    .from("orders")
    .select("*, quotes(quote_number, client_name, client_email, door_type)")
    .eq("id", orderId)
    .single();

  if (error || !order) throw new Error("Order not found");

  const now = new Date().toISOString();
  const quote = order.quotes as { quote_number: string; client_name: string; client_email: string; door_type: string } | null;

  // Update order_tracking stage to delivered
  const { data: updatedTracking, error: trackingErr } = await supabase
    .from("order_tracking")
    .update({
      stage: "delivered",
      delivered_at: now,
      updated_at: now,
    })
    .eq("quote_id", order.quote_id)
    .select();

  if (trackingErr) throw new Error(`Failed to update tracking: ${trackingErr.message}`);
  if (!updatedTracking || updatedTracking.length === 0) {
    const { error: insertErr } = await supabase
      .from("order_tracking")
      .insert({
        quote_id: order.quote_id,
        stage: "delivered",
        delivered_at: now,
      });
    if (insertErr) throw new Error(`Failed to create tracking: ${insertErr.message}`);
  }

  // Update portal stage
  await supabase
    .from("quotes")
    .update({ portal_stage: "delivered" })
    .eq("id", order.quote_id);

  // Update order status to completed
  await supabase
    .from("orders")
    .update({ status: "completed" })
    .eq("id", orderId);

  // Send thank-you email to client
  if (quote?.client_email) {
    try {
      const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://scenicdoors.co";
      await sendDeliveryThankYouEmail({
        clientName: quote.client_name,
        clientEmail: quote.client_email,
        quoteNumber: quote.quote_number,
        orderNumber: order.order_number,
        portalUrl: `${origin}/portal/${order.quote_id}`,
      });

      await recordEmailSent({
        quote_id: order.quote_id,
        recipient_email: quote.client_email,
        subject: `Your Order Has Been Delivered — ${order.order_number} | Scenic Doors`,
        type: "delivery_thank_you",
      });
    } catch {
      // Don't fail if email fails
    }
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath(`/portal/${order.quote_id}`);
}
