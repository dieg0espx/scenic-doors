"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { AdminUser } from "@/lib/types";
import { sendWelcomeEmail } from "@/lib/email";

function generatePassword(length = 14): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const all = upper + lower + digits;
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  // Ensure at least one uppercase, one lowercase, one digit
  const chars = [
    upper[array[0] % upper.length],
    lower[array[1] % lower.length],
    digits[array[2] % digits.length],
  ];
  for (let i = 3; i < length; i++) {
    chars.push(all[array[i] % all.length]);
  }
  // Shuffle
  for (let i = chars.length - 1; i > 0; i--) {
    const j = array[i] % (i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAdminUsers] Error:", error.message);
    if (error.message.includes("schema cache") || error.message.includes("relation")) return [];
    throw new Error(error.message);
  }
  return data ?? [];
}

export async function getAdminUserById(id: string): Promise<AdminUser | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function createAdminUser(formData: {
  name: string;
  prefix?: string;
  email?: string;
  phone?: string;
  home_zipcode?: string;
  role?: string;
  zipcodes?: string[];
  referral_codes?: string[];
  start_date?: string;
  location_code?: string;
}): Promise<AdminUser> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_users")
    .insert({
      name: formData.name,
      prefix: formData.prefix || null,
      email: formData.email || null,
      phone: formData.phone || null,
      home_zipcode: formData.home_zipcode || null,
      role: formData.role || "sales",
      zipcodes: formData.zipcodes || [],
      referral_codes: formData.referral_codes || [],
      start_date: formData.start_date || null,
      location_code: formData.location_code || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // If user has email, create auth account and send welcome email
  if (formData.email) {
    try {
      const serviceClient = createServiceClient();
      const password = generatePassword();

      const { data: authData, error: authErr } = await serviceClient.auth.admin.createUser({
        email: formData.email,
        password,
        email_confirm: true,
      });

      if (!authErr && authData?.user) {
        console.log("[createAdminUser] Auth account created for:", formData.email, "auth_id:", authData.user.id);
        const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://scenicdoors.com";
        await sendWelcomeEmail({
          name: formData.name,
          email: formData.email,
          password,
          role: formData.role || "sales",
          loginUrl: `${origin}/login`,
        });
      } else {
        console.error("[createAdminUser] Auth account creation failed:", authErr?.message || "No user returned");
      }
    } catch (emailErr) {
      console.error("[createAdminUser] Welcome email failed:", emailErr);
    }
  }

  revalidatePath("/admin/users");
  return data;
}

export async function updateAdminUser(
  id: string,
  formData: Partial<{
    name: string;
    prefix: string;
    email: string;
    phone: string;
    home_zipcode: string;
    role: string;
    zipcodes: string[];
    referral_codes: string[];
    start_date: string;
    location_code: string;
    status: string;
  }>
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("admin_users")
    .update(formData)
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/users");
}

export async function deleteAdminUser(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("admin_users")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/users");
}

export async function getNextSalesRep(): Promise<{ id: string; name: string; email: string | null } | null> {
  const supabase = await createClient();

  // Get all active sales reps
  const { data: reps, error } = await supabase
    .from("admin_users")
    .select("id, name, email")
    .eq("role", "sales")
    .eq("status", "active");

  if (error || !reps || reps.length === 0) return null;

  // Find who was assigned least recently by checking quotes.assigned_date
  const { data: recentAssignments } = await supabase
    .from("quotes")
    .select("assigned_to, assigned_date")
    .not("assigned_to", "is", null)
    .order("assigned_date", { ascending: false });

  // Build a map of rep ID → most recent assignment date
  const lastAssigned = new Map<string, string>();
  for (const q of recentAssignments ?? []) {
    if (q.assigned_to && !lastAssigned.has(q.assigned_to)) {
      lastAssigned.set(q.assigned_to, q.assigned_date ?? "");
    }
  }

  // Sort reps: those never assigned first, then by oldest assignment date
  reps.sort((a, b) => {
    const aDate = lastAssigned.get(a.id) ?? "";
    const bDate = lastAssigned.get(b.id) ?? "";
    return aDate.localeCompare(bDate);
  });

  return reps[0];
}

export async function getAdminUserCounts(): Promise<{
  total: number;
  active: number;
  inactive: number;
  byRole: Record<string, number>;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("admin_users").select("role, status");

  if (error) {
    if (error.message.includes("schema cache"))
      return { total: 0, active: 0, inactive: 0, byRole: {} };
    throw new Error(error.message);
  }
  const users = data ?? [];

  const byRole: Record<string, number> = {};
  let active = 0;
  let inactive = 0;

  for (const u of users) {
    byRole[u.role] = (byRole[u.role] || 0) + 1;
    if (u.status === "active") active++;
    else inactive++;
  }

  return { total: users.length, active, inactive, byRole };
}

export async function getUserStats(): Promise<Record<string, { quotes: number; orders: number }>> {
  const supabase = await createClient();
  const stats: Record<string, { quotes: number; orders: number }> = {};

  // Quote counts per assigned_to
  const { data: quoteCounts } = await supabase
    .from("quotes")
    .select("assigned_to")
    .not("assigned_to", "is", null);

  for (const q of quoteCounts ?? []) {
    if (q.assigned_to) {
      if (!stats[q.assigned_to]) stats[q.assigned_to] = { quotes: 0, orders: 0 };
      stats[q.assigned_to].quotes++;
    }
  }

  // Order counts per assigned user (via quote)
  const { data: orderCounts } = await supabase
    .from("orders")
    .select("quote_id, quotes(assigned_to)");

  for (const o of orderCounts ?? []) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const assignedTo = (o as any).quotes?.assigned_to;
    if (assignedTo) {
      if (!stats[assignedTo]) stats[assignedTo] = { quotes: 0, orders: 0 };
      stats[assignedTo].orders++;
    }
  }

  return stats;
}

export async function assignPassword(
  adminUserId: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();
  const serviceClient = createServiceClient();

  // Get admin user email
  const { data: adminUser, error: fetchErr } = await supabase
    .from("admin_users")
    .select("email")
    .eq("id", adminUserId)
    .single();

  if (fetchErr || !adminUser?.email) {
    return { success: false, message: "User not found or has no email" };
  }

  // Check if a Supabase Auth user already exists with this email
  const { data: existingUsers } = await serviceClient.auth.admin.listUsers();
  const existingAuth = existingUsers?.users?.find(
    (u) => u.email === adminUser.email
  );

  if (existingAuth) {
    // Update existing auth user's password
    const { error } = await serviceClient.auth.admin.updateUserById(
      existingAuth.id,
      { password }
    );
    if (error) return { success: false, message: error.message };
    return { success: true, message: "Password updated" };
  }

  // Create new Supabase Auth user
  const { error: createErr } = await serviceClient.auth.admin.createUser({
    email: adminUser.email,
    password,
    email_confirm: true,
  });

  if (createErr) return { success: false, message: createErr.message };
  return { success: true, message: "Auth account created with password" };
}

export async function resetPassword(
  adminUserId: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  // Get admin user email
  const { data: adminUser, error: fetchErr } = await supabase
    .from("admin_users")
    .select("email")
    .eq("id", adminUserId)
    .single();

  if (fetchErr || !adminUser?.email) {
    return { success: false, message: "User not found or has no email" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(adminUser.email);
  if (error) return { success: false, message: error.message };
  return { success: true, message: `Password reset email sent to ${adminUser.email}` };
}

export async function changeOwnPassword(
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { success: false, message: error.message };
  return { success: true, message: "Password updated successfully" };
}
