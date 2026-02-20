"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { FollowUpEntry } from "@/lib/types";

export async function getFollowUps(quoteId: string): Promise<FollowUpEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("follow_up_schedule")
    .select("*")
    .eq("quote_id", quoteId)
    .order("scheduled_for", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function scheduleFollowUps(
  leadId: string | null,
  quoteId: string,
  intervalDays: number = 4,
  count: number = 3
): Promise<FollowUpEntry[]> {
  const supabase = await createClient();

  // Validate lead exists if provided
  if (leadId) {
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("id")
      .eq("id", leadId)
      .maybeSingle();

    if (leadError) throw new Error(leadError.message);
    if (!lead) leadId = null; // Lead not found, proceed without it
  }

  // Prevent duplicate scheduling
  const { data: existing } = await supabase
    .from("follow_up_schedule")
    .select("id")
    .eq("quote_id", quoteId)
    .eq("status", "pending")
    .limit(1);

  if (existing && existing.length > 0) {
    throw new Error("Follow-ups already scheduled for this quote");
  }

  const now = new Date();

  const entries = Array.from({ length: count }, (_, i) => {
    const scheduledFor = new Date(now);
    scheduledFor.setDate(scheduledFor.getDate() + intervalDays * (i + 1));
    return {
      lead_id: leadId,
      quote_id: quoteId,
      scheduled_for: scheduledFor.toISOString(),
      email_type: "follow_up",
      sequence_number: i + 1,
      status: "pending",
    };
  });

  const { data, error } = await supabase
    .from("follow_up_schedule")
    .insert(entries)
    .select();

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/quotes/${quoteId}`);
  return data ?? [];
}

export async function cancelFollowUp(id: string, quoteId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("follow_up_schedule")
    .update({ status: "cancelled" })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/quotes/${quoteId}`);
}

export async function markFollowUpSent(id: string, quoteId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("follow_up_schedule")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/quotes/${quoteId}`);
}

export async function getPendingFollowUps(): Promise<FollowUpEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("follow_up_schedule")
    .select("*")
    .eq("status", "pending")
    .lte("scheduled_for", new Date().toISOString())
    .order("scheduled_for", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

