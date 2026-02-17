"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { OrderTracking } from "@/lib/types";

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
}

export async function markDepositPaid(
  trackingId: string,
  quoteId: string,
  depositNumber: 1 | 2
): Promise<void> {
  const supabase = await createClient();
  const now = new Date().toISOString();

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

  const updates = [...(current?.shipping_updates || []), update];

  const { error } = await supabase
    .from("order_tracking")
    .update({ shipping_updates: updates, updated_at: new Date().toISOString() })
    .eq("id", trackingId);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/quotes/${quoteId}`);
}
