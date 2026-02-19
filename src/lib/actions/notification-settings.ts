"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { NotificationSettings } from "@/lib/types";

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
  return data ?? [];
}

export async function getNotificationEmailsByType(type: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notification_settings")
    .select("emails")
    .eq("type", type)
    .single();

  if (error || !data) return [];
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
