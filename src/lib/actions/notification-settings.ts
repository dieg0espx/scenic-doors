"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { NotificationSettings } from "@/lib/types";

const ALL_NOTIFICATION_TYPES = [
  "lead",
  "new_quote",
  "quote_pending_approval",
  "quote_accepted",
  "quote_declined",
  "payment_received",
  "approval_signed",
  "order_stage_change",
  "contract_signed",
];

export async function getNotificationSettings(): Promise<NotificationSettings[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notification_settings")
    .select("*")
    .order("type");

  if (error) {
    if (error.message.includes("schema cache")) return [];
    throw new Error(error.message);
  }

  const existing = data ?? [];
  const existingTypes = new Set(existing.map((s) => s.type));
  const missing = ALL_NOTIFICATION_TYPES.filter((t) => !existingTypes.has(t));

  if (missing.length > 0) {
    await supabase
      .from("notification_settings")
      .insert(missing.map((type) => ({ type, emails: [] })));

    // Re-fetch to include newly created rows
    const { data: refreshed } = await supabase
      .from("notification_settings")
      .select("*")
      .order("type");
    return refreshed ?? existing;
  }

  return existing;
}

export async function getNotificationEmailsByType(type: string): Promise<string[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("notification_settings")
    .select("emails")
    .eq("type", type)
    .maybeSingle();

  if (error) {
    console.error(`[Notification settings fetch error] type=${type}`, error.message);
    return [];
  }

  if (!data) {
    // Row doesn't exist — create it so the admin can configure it later
    console.log(`[Notification settings] No row for type="${type}", creating one`);
    await supabase
      .from("notification_settings")
      .upsert({ type, emails: [] }, { onConflict: "type" });
    return [];
  }

  console.log(`[Notification settings] type="${type}" emails=`, data.emails);
  return data.emails ?? [];
}

export async function updateNotificationEmails(
  type: string,
  emails: string[]
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("notification_settings")
    .update({ emails })
    .eq("type", type);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/notifications");
}
