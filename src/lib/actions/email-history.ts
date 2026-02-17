"use server";

import { createClient } from "@/lib/supabase/server";
import type { EmailHistoryEntry } from "@/lib/types";

export async function getEmailHistory(
  quoteId: string
): Promise<EmailHistoryEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("email_history")
    .select("*")
    .eq("quote_id", quoteId)
    .order("sent_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function recordEmailSent(entry: {
  quote_id?: string;
  recipient_email: string;
  subject?: string;
  type?: string;
}): Promise<EmailHistoryEntry> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("email_history")
    .insert({
      quote_id: entry.quote_id || null,
      recipient_email: entry.recipient_email,
      subject: entry.subject || null,
      type: entry.type || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
