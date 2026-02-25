"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendInternalNotificationEmail } from "@/lib/email";
import { sendSlackNotification } from "@/lib/slack";
import { getNotificationEmailsByType } from "@/lib/actions/notification-settings";
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
      customer_type: formData.customer_type || "homeowner",
      timeline: formData.timeline || null,
      source: formData.source || null,
      status: formData.status || "new",
      referral_code: formData.referral_code || null,
      notes: formData.notes || null,
    })
    .select()
    .single();

  if (error) {
    // Table may not exist if migration 008 hasn't been applied — return a placeholder lead
    if (error.message.includes("schema cache")) {
      return {
        id: crypto.randomUUID(),
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        zip: formData.zip || null,
        customer_type: formData.customer_type || "homeowner",
        timeline: formData.timeline || null,
        source: formData.source || null,
        status: formData.status || "new",
        referral_code: formData.referral_code || null,
        has_quote: false,
        notes: formData.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Lead;
    }
    throw new Error(error.message);
  }
  revalidatePath("/admin/leads");

  // Send internal notification
  try {
    const emails = await getNotificationEmailsByType("lead");
    if (emails.length > 0) {
      const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://scenicdoors.com";
      await sendInternalNotificationEmail(
        {
          heading: "New Lead",
          headingColor: "#0d9488",
          headingBg: "#f0fdfa",
          headingBorder: "#ccfbf1",
          message: "A new lead has been created and is ready for follow-up.",
          details: [
            { label: "Name", value: data.name },
            ...(data.email ? [{ label: "Email", value: data.email }] : []),
            ...(data.phone ? [{ label: "Phone", value: data.phone }] : []),
            ...(data.zip ? [{ label: "Zip", value: data.zip }] : []),
            { label: "Type", value: data.customer_type || "homeowner" },
          ],
          adminUrl: `${origin}/admin/leads`,
        },
        emails
      );
    }
  } catch {
    // Don't fail lead creation if notification fails
  }

  // Slack notification
  try {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://scenicdoors.com";
    await sendSlackNotification({
      heading: "New Lead",
      message: `A new lead has been created and is ready for follow-up.`,
      color: "#0d9488",
      details: [
        { label: "Name", value: data.name },
        ...(data.email ? [{ label: "Email", value: data.email }] : []),
        ...(data.phone ? [{ label: "Phone", value: data.phone }] : []),
        ...(data.zip ? [{ label: "Zip", value: data.zip }] : []),
        { label: "Type", value: data.customer_type || "homeowner" },
      ],
      adminUrl: `${origin}/admin/leads`,
    });
  } catch {
    // Don't fail lead creation if Slack notification fails
  }

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
  revalidatePath("/admin/leads/" + id);
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

export async function getLeadsForUser(
  userId: string,
  role: string
): Promise<Lead[]> {
  // Admin sees everything
  if (role === "admin") {
    return getLeads();
  }

  // Sales rep sees only leads shared with them
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .contains("shared_with", [userId])
    .order("created_at", { ascending: false });

  if (error) {
    if (error.message.includes("schema cache")) return [];
    throw new Error(error.message);
  }
  return data ?? [];
}

export async function getLeadMetricsForUser(
  userId: string,
  role: string
): Promise<LeadMetrics> {
  // Admin sees global metrics
  if (role === "admin") {
    return getLeadMetrics();
  }

  // Sales rep sees metrics only for their shared leads
  const leads = await getLeadsForUser(userId, role);
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return {
    total: leads.length,
    withoutQuotes: leads.filter((l) => !l.has_quote).length,
    withQuotes: leads.filter((l) => l.has_quote).length,
    newThisWeek: leads.filter((l) => new Date(l.created_at).getTime() > oneWeekAgo).length,
  };
}

export async function updateLeadSharedWith(
  leadId: string,
  userIds: string[]
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ shared_with: userIds })
    .eq("id", leadId);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
}
