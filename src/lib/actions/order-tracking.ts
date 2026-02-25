"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendInternalNotificationEmail, sendShippingNotificationEmail } from "@/lib/email";
import { getNotificationEmailsByType } from "@/lib/actions/notification-settings";
import { recordEmailSent } from "@/lib/actions/email-history";
import type { OrderTracking } from "@/lib/types";

// Valid stage transitions: current stage → allowed next stages
const VALID_TRANSITIONS: Record<string, string[]> = {
  deposit_1_pending: ["manufacturing"],
  manufacturing: ["deposit_2_pending"],
  deposit_2_pending: ["shipping"],
  shipping: ["delivered"],
  delivered: [],
};

export async function getOrderTracking(quoteId: string): Promise<OrderTracking | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("order_tracking")
    .select("*")
    .eq("quote_id", quoteId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function createOrderTracking(quoteId: string, totalAmount: number): Promise<OrderTracking> {
  const supabase = await createClient();
  const halfAmount = Math.round(totalAmount * 50) / 100;

  // Verify approval drawing is signed before allowing order tracking
  const { data: drawing } = await supabase
    .from("approval_drawings")
    .select("status")
    .eq("quote_id", quoteId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!drawing || drawing.status !== "signed") {
    throw new Error("Approval drawing must be signed before initializing order tracking");
  }

  // Prevent duplicate tracking
  const { data: existing } = await supabase
    .from("order_tracking")
    .select("id")
    .eq("quote_id", quoteId)
    .maybeSingle();

  if (existing) {
    throw new Error("Order tracking already exists for this quote");
  }

  const { data, error } = await supabase
    .from("order_tracking")
    .insert({
      quote_id: quoteId,
      stage: "deposit_1_pending",
      deposit_1_amount: halfAmount,
      deposit_2_amount: halfAmount,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await supabase
    .from("quotes")
    .update({ portal_stage: "deposit_1_pending" })
    .eq("id", quoteId);

  revalidatePath(`/admin/quotes/${quoteId}`);
  return data;
}

export async function updateOrderStage(
  trackingId: string,
  quoteId: string,
  stage: string,
  additionalUpdates?: Partial<{
    tracking_number: string;
    shipping_carrier: string;
    estimated_completion: string;
    estimated_delivery: string;
    notes: string;
  }>
): Promise<void> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // Fetch current stage and validate transition
  const { data: current, error: fetchError } = await supabase
    .from("order_tracking")
    .select("stage")
    .eq("id", trackingId)
    .single();

  if (fetchError || !current) throw new Error("Order tracking not found");

  const allowed = VALID_TRANSITIONS[current.stage] || [];
  if (!allowed.includes(stage)) {
    throw new Error(
      `Invalid transition: cannot move from "${current.stage}" to "${stage}". Allowed: ${allowed.join(", ") || "none"}`
    );
  }

  const stageTimestamps: Record<string, Record<string, string>> = {
    manufacturing: { manufacturing_started_at: now },
    deposit_2_pending: { manufacturing_completed_at: now },
    shipping: { shipped_at: now },
    delivered: { delivered_at: now },
  };

  const { error } = await supabase
    .from("order_tracking")
    .update({
      stage,
      ...stageTimestamps[stage],
      ...additionalUpdates,
      updated_at: now,
    })
    .eq("id", trackingId);

  if (error) throw new Error(error.message);

  await supabase
    .from("quotes")
    .update({ portal_stage: stage })
    .eq("id", quoteId);

  revalidatePath(`/admin/quotes/${quoteId}`);

  // Send internal notification
  try {
    const emails = await getNotificationEmailsByType("order_stage_change");
    if (emails.length > 0) {
      const { data: quote } = await supabase
        .from("quotes")
        .select("quote_number, client_name")
        .eq("id", quoteId)
        .single();

      const stageLabels: Record<string, string> = {
        manufacturing: "Manufacturing",
        deposit_2_pending: "Deposit 2 Pending",
        shipping: "Shipping",
        delivered: "Delivered",
      };

      const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://scenicdoors.com";
      await sendInternalNotificationEmail(
        {
          heading: `Order Stage: ${stageLabels[stage] || stage}`,
          headingColor: "#d97706",
          headingBg: "#fffbeb",
          headingBorder: "#fef3c7",
          message: `An order has moved to the "${stageLabels[stage] || stage}" stage.`,
          details: [
            { label: "Quote", value: quote?.quote_number ?? "—" },
            { label: "Client", value: quote?.client_name ?? "—" },
            { label: "Previous", value: current.stage.replace(/_/g, " ") },
            { label: "New Stage", value: stageLabels[stage] || stage },
          ],
          adminUrl: `${origin}/admin/quotes/${quoteId}`,
        },
        emails
      );
    }
  } catch {
    // Don't fail the stage update if notification fails
  }
}

export async function markDepositPaid(
  trackingId: string,
  quoteId: string,
  depositNumber: 1 | 2
): Promise<void> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // Fetch current tracking to validate
  const { data: current, error: fetchError } = await supabase
    .from("order_tracking")
    .select("stage, deposit_1_paid, deposit_2_paid")
    .eq("id", trackingId)
    .single();

  if (fetchError || !current) throw new Error("Order tracking not found");

  if (depositNumber === 1) {
    if (current.deposit_1_paid) return; // Idempotent
    if (current.stage !== "deposit_1_pending") {
      throw new Error("Deposit 1 can only be marked paid when stage is deposit_1_pending");
    }
  } else {
    if (current.deposit_2_paid) return; // Idempotent
    if (current.stage !== "deposit_2_pending") {
      throw new Error("Deposit 2 can only be marked paid when stage is deposit_2_pending");
    }
  }

  const update = depositNumber === 1
    ? { deposit_1_paid: true, deposit_1_paid_at: now, stage: "manufacturing" }
    : { deposit_2_paid: true, deposit_2_paid_at: now, stage: "shipping" };

  const portalStage = depositNumber === 1 ? "manufacturing" : "shipping";

  const { error } = await supabase
    .from("order_tracking")
    .update({ ...update, updated_at: now })
    .eq("id", trackingId);

  if (error) throw new Error(error.message);

  await supabase
    .from("quotes")
    .update({ portal_stage: portalStage })
    .eq("id", quoteId);

  revalidatePath(`/admin/quotes/${quoteId}`);
}

export async function updateTrackingInfo(
  trackingId: string,
  quoteId: string,
  trackingNumber: string,
  shippingCarrier: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("order_tracking")
    .update({
      tracking_number: trackingNumber || null,
      shipping_carrier: shippingCarrier || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", trackingId);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/orders`);
  revalidatePath(`/portal/${quoteId}`);

  // Send shipping notification email to client
  if (trackingNumber) {
    try {
      const { data: quote } = await supabase
        .from("quotes")
        .select("quote_number, client_name, client_email, order_number")
        .eq("id", quoteId)
        .single();

      if (quote?.client_email) {
        const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://scenicdoors.com";
        await sendShippingNotificationEmail({
          clientName: quote.client_name || "Customer",
          clientEmail: quote.client_email,
          quoteNumber: quote.quote_number || "",
          orderNumber: quote.order_number || "",
          trackingNumber,
          shippingCarrier: shippingCarrier || "",
          portalUrl: `${origin}/portal/${quoteId}`,
        });

        await recordEmailSent({
          quote_id: quoteId,
          recipient_email: quote.client_email,
          subject: `Your Order Has Shipped — ${quote.order_number || quote.quote_number} | Scenic Doors`,
          type: "shipping_notification",
        });
      }
    } catch {
      // Don't fail the tracking update if email fails
    }
  }
}

export async function addShippingUpdate(
  trackingId: string,
  quoteId: string,
  update: { date: string; status: string; location?: string }
): Promise<void> {
  const supabase = await createClient();

  // Get current updates
  const { data: current } = await supabase
    .from("order_tracking")
    .select("shipping_updates")
    .eq("id", trackingId)
    .single();

  const updates = [...(Array.isArray(current?.shipping_updates) ? current.shipping_updates : []), update];

  const { error } = await supabase
    .from("order_tracking")
    .update({ shipping_updates: updates, updated_at: new Date().toISOString() })
    .eq("id", trackingId);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/quotes/${quoteId}`);
}
