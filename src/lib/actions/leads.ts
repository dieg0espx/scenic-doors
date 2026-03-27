"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendInternalNotificationEmail } from "@/lib/email";
import { sendSlackNotification } from "@/lib/slack";
import { getNotificationEmailsByType } from "@/lib/actions/notification-settings";
import { getUserByReferralCode } from "@/lib/actions/admin-users";
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
      status: formData.status || "hot",
      referral_code: formData.referral_code || null,
      notes: formData.notes || null,
      last_activity_at: new Date().toISOString(),
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
        status: formData.status || "hot",
        workflow_status: null,
        referral_code: formData.referral_code || null,
        has_quote: false,
        notes: formData.notes || null,
        shared_with: [],
        last_activity_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Lead;
    }
    throw new Error(error.message);
  }
  revalidatePath("/admin/leads");

  // Auto-assign lead to referring user if referral code was provided
  if (formData.referral_code) {
    try {
      const referrer = await getUserByReferralCode(formData.referral_code);
      if (referrer) {
        const serviceClient = createServiceClient();
        await serviceClient
          .from("leads")
          .update({ shared_with: [referrer.id] })
          .eq("id", data.id);
      }
    } catch {
      // Don't fail lead creation if referral assignment fails
    }
  }

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

  // Bump last_activity_at when admin changes notes
  const payload: Record<string, unknown> = { ...formData };
  if (formData.notes !== undefined) {
    payload.last_activity_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("leads")
    .update(payload)
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/leads");
  revalidatePath("/admin/leads/" + id);
}

export async function updateLeadWorkflow(
  id: string,
  workflowStatus: string
): Promise<void> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // Setting a workflow status resets temperature to "hot" and bumps last_activity_at
  const { error } = await supabase
    .from("leads")
    .update({
      workflow_status: workflowStatus,
      status: "hot",
      last_activity_at: now,
    })
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

/**
 * Returns a map of lead_id → most advanced portal_stage among its quotes.
 */
export async function getLeadPipelineStages(
  leadIds: string[]
): Promise<Record<string, string>> {
  if (leadIds.length === 0) return {};
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .select("lead_id, portal_stage, status")
    .in("lead_id", leadIds);

  if (error) {
    if (error.message.includes("schema cache")) return {};
    throw new Error(error.message);
  }

  // Stage ordering — higher index = further along
  const stageOrder: Record<string, number> = {
    quote_sent: 0,
    drawing_requested: 1,
    approval_pending: 2,
    approval_signed: 3,
    deposit_1_pending: 4,
    manufacturing: 5,
    deposit_2_pending: 6,
    shipping: 7,
    delivered: 8,
  };

  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    if (!row.lead_id) continue;
    const stage = row.portal_stage || "quote_sent";
    const current = map[row.lead_id];
    if (!current || (stageOrder[stage] ?? 0) > (stageOrder[current] ?? 0)) {
      map[row.lead_id] = stage;
    }
    // If quote was declined, mark it unless there's a further stage already
    if (row.status === "declined" && !current) {
      map[row.lead_id] = "declined";
    }
  }
  return map;
}

export interface PipelineStep {
  key: string;
  label: string;
  status: "completed" | "current" | "upcoming";
  date: string | null;
  detail: string | null;
}

export interface QuotePipeline {
  quoteId: string;
  quoteNumber: string;
  grandTotal: number;
  steps: PipelineStep[];
}

/**
 * Returns detailed pipeline timeline for each quote linked to a lead.
 */
export async function getLeadPipelineDetails(
  quoteIds: string[]
): Promise<QuotePipeline[]> {
  if (quoteIds.length === 0) return [];
  const supabase = await createClient();

  // Fetch all related data in parallel
  const [quotesRes, drawingsRes, paymentsRes, ordersRes] = await Promise.all([
    supabase.from("quotes").select("id, quote_number, portal_stage, status, grand_total, cost, sent_at, viewed_at, accepted_at, declined_at, created_at").in("id", quoteIds),
    supabase.from("approval_drawings").select("quote_id, status, sent_at, signed_at, customer_name").in("quote_id", quoteIds),
    supabase.from("payments").select("quote_id, payment_type, status, amount, paid_at, created_at").in("quote_id", quoteIds).order("created_at", { ascending: true }),
    supabase.from("order_tracking").select("quote_id, manufacturing_started_at, manufacturing_completed_at, shipped_at, delivered_at, tracking_number").in("quote_id", quoteIds),
  ]);

  const quotes = quotesRes.data ?? [];
  const drawings = drawingsRes.data ?? [];
  const payments = paymentsRes.data ?? [];
  const orders = ordersRes.data ?? [];

  // Index by quote_id
  const drawingsByQuote: Record<string, typeof drawings> = {};
  for (const d of drawings) {
    (drawingsByQuote[d.quote_id] ??= []).push(d);
  }
  const paymentsByQuote: Record<string, typeof payments> = {};
  for (const p of payments) {
    (paymentsByQuote[p.quote_id] ??= []).push(p);
  }
  const orderByQuote: Record<string, (typeof orders)[0]> = {};
  for (const o of orders) {
    orderByQuote[o.quote_id] = o;
  }

  // Stage ordering for "current" detection
  const stageOrder: Record<string, number> = {
    quote_sent: 0, drawing_requested: 1, approval_pending: 2,
    approval_signed: 3, deposit_1_pending: 4, manufacturing: 5,
    deposit_2_pending: 6, shipping: 7, delivered: 8,
  };

  function fmt(d: string | null): string | null {
    if (!d) return null;
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return quotes.map((q) => {
    const qDrawings = drawingsByQuote[q.id] ?? [];
    const qPayments = paymentsByQuote[q.id] ?? [];
    const order = orderByQuote[q.id];
    const stage = q.portal_stage || "quote_sent";
    const currentIdx = stageOrder[stage] ?? 0;

    // Find specific data
    const bestDrawing = qDrawings.find((d) => d.status === "signed") || qDrawings[0];
    const deposit = qPayments.find((p) => p.payment_type === "advance_50");
    const balance = qPayments.find((p) => p.payment_type === "balance_50");

    function stepStatus(idx: number): "completed" | "current" | "upcoming" {
      if (idx < currentIdx) return "completed";
      if (idx === currentIdx) return "current";
      return "upcoming";
    }

    const steps: PipelineStep[] = [
      {
        key: "quote_sent",
        label: "Quote Sent",
        status: stepStatus(0),
        date: fmt(q.sent_at || q.created_at),
        detail: q.sent_at ? "Sent to client" : "Quote created",
      },
      {
        key: "approval_pending",
        label: "Approval Drawing",
        status: bestDrawing
          ? bestDrawing.status === "signed" ? "completed"
          : bestDrawing.sent_at ? stepStatus(2)
          : stepStatus(1)
          : stepStatus(2),
        date: bestDrawing?.sent_at ? fmt(bestDrawing.sent_at) : null,
        detail: bestDrawing
          ? bestDrawing.status === "signed"
            ? `Signed by ${bestDrawing.customer_name || "client"}`
            : bestDrawing.sent_at ? "Sent, awaiting signature" : "Draft created"
          : null,
      },
      {
        key: "deposit_1_pending",
        label: "50% Deposit",
        status: deposit?.status === "completed" ? "completed" : stepStatus(4),
        date: deposit?.paid_at ? fmt(deposit.paid_at) : deposit?.created_at ? fmt(deposit.created_at) : null,
        detail: deposit
          ? deposit.status === "completed"
            ? `$${Number(deposit.amount).toLocaleString()} paid`
            : `$${Number(deposit.amount).toLocaleString()} pending`
          : null,
      },
      {
        key: "manufacturing",
        label: "Manufacturing",
        status: order?.manufacturing_completed_at ? "completed" : stepStatus(5),
        date: order?.manufacturing_started_at ? fmt(order.manufacturing_started_at) : null,
        detail: order
          ? order.manufacturing_completed_at ? `Completed ${fmt(order.manufacturing_completed_at)}` : order.manufacturing_started_at ? "In progress" : null
          : null,
      },
      {
        key: "deposit_2_pending",
        label: "Final Payment",
        status: balance?.status === "completed" ? "completed" : stepStatus(6),
        date: balance?.paid_at ? fmt(balance.paid_at) : balance?.created_at ? fmt(balance.created_at) : null,
        detail: balance
          ? balance.status === "completed"
            ? `$${Number(balance.amount).toLocaleString()} paid`
            : `$${Number(balance.amount).toLocaleString()} pending`
          : null,
      },
      {
        key: "shipping",
        label: "Shipping",
        status: order?.delivered_at ? "completed" : stepStatus(7),
        date: order?.shipped_at ? fmt(order.shipped_at) : null,
        detail: order?.tracking_number ? `Tracking: ${order.tracking_number}` : order?.shipped_at ? "Shipped" : null,
      },
      {
        key: "delivered",
        label: "Delivered",
        status: stepStatus(8),
        date: order?.delivered_at ? fmt(order.delivered_at) : null,
        detail: order?.delivered_at ? "Order delivered" : null,
      },
    ];

    return {
      quoteId: q.id,
      quoteNumber: q.quote_number,
      grandTotal: Number(q.grand_total || q.cost || 0),
      steps,
    };
  });
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
    .update({ shared_with: userIds, last_activity_at: new Date().toISOString() })
    .eq("id", leadId);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
}
