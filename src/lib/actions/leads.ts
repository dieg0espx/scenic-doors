"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Lead, LeadMetrics } from "@/lib/types";

export async function getLeads(): Promise<Lead[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    // Table may not exist if migration 008 hasn't been applied
    if (error.message.includes("schema cache")) return [];
    throw new Error(error.message);
  }
  return data ?? [];
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function createLead(formData: {
  name: string;
  email?: string;
  phone?: string;
  zip?: string;
  customer_type?: string;
  timeline?: string;
  source?: string;
  status?: string;
  referral_code?: string;
  notes?: string;
}): Promise<Lead> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .insert({
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      zip: formData.zip || null,
      customer_type: formData.customer_type || "residential",
      timeline: formData.timeline || null,
      source: formData.source || null,
      status: formData.status || "new",
      referral_code: formData.referral_code || null,
      notes: formData.notes || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/leads");
  return data;
}

export async function updateLead(
  id: string,
  formData: Partial<{
    name: string;
    email: string;
    phone: string;
    zip: string;
    customer_type: string;
    timeline: string;
    source: string;
    status: string;
    referral_code: string;
    has_quote: boolean;
    notes: string;
  }>
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update(formData)
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/leads");
}

export async function deleteLead(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/leads");
}

export async function getLeadMetrics(): Promise<LeadMetrics> {
  const supabase = await createClient();

  const [totalRes, withoutQuotesRes, withQuotesRes, newThisWeekRes] =
    await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("has_quote", false),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("has_quote", true),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .gte(
          "created_at",
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        ),
    ]);

  // Return zeros if table doesn't exist yet
  if (totalRes.error?.message?.includes("schema cache")) {
    return { total: 0, withoutQuotes: 0, withQuotes: 0, newThisWeek: 0 };
  }

  return {
    total: totalRes.count ?? 0,
    withoutQuotes: withoutQuotesRes.count ?? 0,
    withQuotes: withQuotesRes.count ?? 0,
    newThisWeek: newThisWeekRes.count ?? 0,
  };
}
