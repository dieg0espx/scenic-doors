"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendFollowUpEmail } from "@/lib/email";
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
  leadId: string,
  quoteId: string,
  intervalDays: number = 4,
  count: number = 3
): Promise<FollowUpEntry[]> {
  const supabase = await createClient();

  // Validate lead exists
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("id")
    .eq("id", leadId)
    .maybeSingle();

  if (leadError) throw new Error(leadError.message);
  if (!lead) throw new Error("Lead not found — cannot schedule follow-ups without a valid lead");

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

export async function sendPendingFollowUps(origin: string): Promise<{ sent: number; errors: number }> {
  const supabase = createServiceClient();

  // Get all due pending follow-ups
  const { data: pending, error } = await supabase
    .from("follow_up_schedule")
    .select("*")
    .eq("status", "pending")
    .lte("scheduled_for", new Date().toISOString())
    .order("scheduled_for", { ascending: true });

  if (error) throw new Error(error.message);
  if (!pending || pending.length === 0) return { sent: 0, errors: 0 };

  let sent = 0;
  let errors = 0;

  for (const followUp of pending) {
    try {
      // Fetch the related quote
      const { data: quote } = await supabase
        .from("quotes")
        .select("id, client_name, client_email, quote_number, door_type, lead_status")
        .eq("id", followUp.quote_id)
        .single();

      if (!quote) {
        // Quote deleted — cancel remaining follow-ups
        await supabase
          .from("follow_up_schedule")
          .update({ status: "cancelled" })
          .eq("id", followUp.id);
        continue;
      }

      // Skip if quote is already accepted/declined or lead is not active
      if (quote.lead_status === "converted" || quote.lead_status === "closed") {
        await supabase
          .from("follow_up_schedule")
          .update({ status: "cancelled" })
          .eq("id", followUp.id);
        continue;
      }

      // Send the follow-up email
      await sendFollowUpEmail({
        clientName: quote.client_name,
        clientEmail: quote.client_email,
        quoteNumber: quote.quote_number,
        doorType: quote.door_type,
        sequenceNumber: followUp.sequence_number,
        quoteUrl: `${origin}/quote/${quote.id}`,
      });

      // Mark as sent
      await supabase
        .from("follow_up_schedule")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", followUp.id);

      // Record in email history
      await supabase.from("email_history").insert({
        quote_id: followUp.quote_id,
        recipient_email: quote.client_email,
        subject: `Follow-up #${followUp.sequence_number} — Quote ${quote.quote_number}`,
        type: "follow_up",
      });

      // After 3rd follow-up sent with no response, mark lead as cold
      if (followUp.sequence_number >= 3) {
        const { data: remaining } = await supabase
          .from("follow_up_schedule")
          .select("id")
          .eq("quote_id", followUp.quote_id)
          .eq("status", "pending");

        if (!remaining || remaining.length === 0) {
          await supabase
            .from("quotes")
            .update({ lead_status: "cold" })
            .eq("id", followUp.quote_id)
            .in("lead_status", ["new", "warm", "hot"]);
        }
      }

      sent++;
    } catch {
      errors++;
    }
  }

  return { sent, errors };
}
