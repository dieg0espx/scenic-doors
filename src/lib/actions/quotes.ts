"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendQuoteEmail, sendNewQuoteNotificationEmail, sendInternalNotificationEmail, sendQuoteApprovedEmail, sendEstimateConfirmationEmail } from "@/lib/email";
import { sendSlackNotification } from "@/lib/slack";
import { recordEmailSent } from "@/lib/actions/email-history";
import { getNotificationEmailsByType } from "@/lib/actions/notification-settings";
import { scheduleFollowUps } from "@/lib/actions/follow-ups";
import type { Quote, DashboardMetrics } from "@/lib/types";

export async function createQuote(formData: {
  client_name: string;
  client_email: string;
  door_type: string;
  material: string;
  color: string;
  glass_type: string;
  size: string;
  cost: number;
  notes?: string;
  delivery_type?: string;
  delivery_address?: string;
  client_id?: string;
  save_as_client?: boolean;
  client_phone?: string;
  client_company?: string;
  customer_type?: string;
  customer_phone?: string;
  customer_zip?: string;
  assigned_to?: string;
  lead_status?: string;
  items?: string; // JSON string
  subtotal?: number;
  installation_cost?: number;
  delivery_cost?: number;
  tax?: number;
  grand_total?: number;
  follow_up_date?: string;
  lead_id?: string;
  created_by?: string;
  shared_with?: string[];
  intent_level?: string;
  discount_percent?: number;
  discount_amount?: number;
  discount_name?: string;
}) {
  const supabase = createServiceClient();

  let clientId = formData.client_id || null;

  // If save_as_client and no existing client_id, create a new client
  if (formData.save_as_client && !clientId) {
    const { data: newClient, error: clientError } = await supabase
      .from("clients")
      .insert({
        name: formData.client_name,
        email: formData.client_email,
        phone: formData.client_phone || null,
        company: formData.client_company || null,
      })
      .select()
      .single();

    if (clientError) {
      // If duplicate email, try to find existing client
      if (clientError.code === "23505") {
        const { data: existing } = await supabase
          .from("clients")
          .select("id")
          .eq("email", formData.client_email)
          .single();
        if (existing) clientId = existing.id;
      } else {
        throw new Error(clientError.message);
      }
    } else {
      clientId = newClient.id;

      // Save delivery address as the client's default address
      if (formData.delivery_type === "delivery" && formData.delivery_address) {
        await supabase.from("client_addresses").insert({
          client_id: newClient.id,
          label: "Primary",
          address: formData.delivery_address,
          is_default: true,
        });
      }
    }
  }

  const { data, error } = await supabase
    .from("quotes")
    .insert({
      client_name: formData.client_name,
      client_email: formData.client_email,
      door_type: formData.door_type,
      material: formData.material,
      color: formData.color,
      glass_type: formData.glass_type,
      size: formData.size,
      cost: formData.cost,
      notes: formData.notes || null,
      delivery_type: formData.delivery_type || "delivery",
      delivery_address: formData.delivery_address || null,
      client_id: clientId,
      customer_type: formData.customer_type || "residential",
      customer_phone: formData.customer_phone || null,
      customer_zip: formData.customer_zip || null,
      assigned_to: formData.assigned_to || null,
      assigned_date: formData.assigned_to ? new Date().toISOString() : null,
      lead_status: formData.lead_status || "new",
      items: formData.items ? JSON.parse(formData.items) : [],
      subtotal: formData.subtotal || 0,
      installation_cost: formData.installation_cost || 0,
      delivery_cost: formData.delivery_cost || 0,
      tax: formData.tax || 0,
      grand_total: formData.grand_total || formData.cost || 0,
      follow_up_date: formData.follow_up_date || null,
      lead_id: formData.lead_id || null,
      created_by: formData.created_by || null,
      shared_with: formData.shared_with || [],
      intent_level: formData.intent_level || "full",
      ...(formData.discount_percent ? {
        discount_percent: formData.discount_percent,
        discount_amount: formData.discount_amount,
        discount_name: formData.discount_name,
      } : {}),
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Auto-schedule follow-up emails (3 follow-ups at 4-day intervals)
  try {
    await scheduleFollowUps(formData.lead_id || null, data.id);
  } catch (err) {
    console.error("[Follow-up scheduling error]", err);
  }

  revalidatePath("/admin/quotes");
  revalidatePath("/admin/clients");
  return data;
}

export async function getQuotes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .select("*, quote_notes(id), quote_tasks(id), admin_users(name)")
    .order("created_at", { ascending: false });

  if (error) {
    // Fallback: if related tables don't exist yet, query without joins
    if (error.message.includes("relationship")) {
      const { data: fallback, error: fbErr } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });
      if (fbErr) throw new Error(fbErr.message);
      return fallback ?? [];
    }
    throw new Error(error.message);
  }
  return data ?? [];
}

export async function getQuotesWithFilters(filters?: {
  lead_status?: string;
  intent_level?: string;
  search?: string;
  sort?: string;
  due_today?: boolean;
}): Promise<Quote[]> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function applyFilters(query: any, safeOnly = false) {
    let q = query;
    // lead_status and follow_up_date are from migration 008 — skip if safeOnly
    if (!safeOnly && filters?.lead_status && filters.lead_status !== "all") {
      const statuses = filters.lead_status.split(",").filter(Boolean);
      if (statuses.length === 1) {
        q = q.eq("lead_status", statuses[0]);
      } else {
        q = q.in("lead_status", statuses);
      }
    } else if (!safeOnly) {
      // Exclude orders from the quotes list — they belong on the Orders page
      q = q.neq("lead_status", "order");
    }
    if (!safeOnly && filters?.intent_level && filters.intent_level !== "all") {
      const intents = filters.intent_level.split(",").filter(Boolean);
      const includesFull = intents.includes("full");
      const others = intents.filter((i) => i !== "full");
      if (includesFull && others.length > 0) {
        // "full" includes rows with NULL intent_level (legacy quotes)
        q = q.or(`intent_level.in.(${intents.join(",")}),intent_level.is.null`);
      } else if (includesFull) {
        q = q.or("intent_level.eq.full,intent_level.is.null");
      } else if (others.length === 1) {
        q = q.eq("intent_level", others[0]);
      } else {
        q = q.in("intent_level", others);
      }
    }
    if (filters?.search) {
      const s = `%${filters.search}%`;
      q = q.or(
        `client_name.ilike.${s},client_email.ilike.${s},quote_number.ilike.${s}`
      );
    }
    if (!safeOnly && filters?.due_today) {
      const today = new Date().toISOString().split("T")[0];
      q = q.eq("follow_up_date", today);
    }
    if (filters?.sort === "oldest") {
      q = q.order("created_at", { ascending: true });
    } else {
      q = q.order("created_at", { ascending: false });
    }
    return q;
  }

  const { data, error } = await applyFilters(
    supabase.from("quotes").select("*, quote_notes(id), quote_tasks(id), admin_users(name)")
  );

  if (error) {
    // Fallback: query without joins and skip migration-008 column filters
    const { data: fallback, error: fbErr } = await applyFilters(
      supabase.from("quotes").select("*"),
      true
    );
    if (fbErr) throw new Error(fbErr.message);
    return (fallback ?? []) as Quote[];
  }
  return (data ?? []) as Quote[];
}

export async function getQuotesForUser(
  userId: string,
  userName: string,
  role: string,
  filters?: {
    lead_status?: string;
    intent_level?: string;
    search?: string;
    sort?: string;
    due_today?: boolean;
  }
): Promise<Quote[]> {
  // Admin sees everything
  if (role === "admin") {
    return getQuotesWithFilters(filters);
  }

  // Sales rep sees own + assigned + shared quotes
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from("quotes")
    .select("*, quote_notes(id), quote_tasks(id), admin_users(name)")
    .or(`assigned_to.eq.${userId},created_by.eq.${userName},shared_with.cs.{${userId}}`);

  if (filters?.lead_status && filters.lead_status !== "all") {
    const statuses = filters.lead_status.split(",").filter(Boolean);
    if (statuses.length === 1) {
      query = query.eq("lead_status", statuses[0]);
    } else {
      query = query.in("lead_status", statuses);
    }
  } else {
    query = query.neq("lead_status", "order");
  }

  if (filters?.intent_level && filters.intent_level !== "all") {
    const intents = filters.intent_level.split(",").filter(Boolean);
    const includesFull = intents.includes("full");
    const others = intents.filter((i) => i !== "full");
    if (includesFull && others.length > 0) {
      query = query.or(`intent_level.in.(${intents.join(",")}),intent_level.is.null`);
    } else if (includesFull) {
      query = query.or("intent_level.eq.full,intent_level.is.null");
    } else if (others.length === 1) {
      query = query.eq("intent_level", others[0]);
    } else {
      query = query.in("intent_level", others);
    }
  }

  if (filters?.search) {
    const s = `%${filters.search}%`;
    query = query.or(
      `client_name.ilike.${s},client_email.ilike.${s},quote_number.ilike.${s}`
    );
  }

  if (filters?.due_today) {
    const today = new Date().toISOString().split("T")[0];
    query = query.eq("follow_up_date", today);
  }

  if (filters?.sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    // Fallback: query without joins
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fallbackQuery: any = supabase
      .from("quotes")
      .select("*")
      .or(`assigned_to.eq.${userId},created_by.eq.${userName},shared_with.cs.{${userId}}`);

    if (filters?.sort === "oldest") {
      fallbackQuery = fallbackQuery.order("created_at", { ascending: true });
    } else {
      fallbackQuery = fallbackQuery.order("created_at", { ascending: false });
    }

    const { data: fallback, error: fbErr } = await fallbackQuery;
    if (fbErr) throw new Error(fbErr.message);
    return (fallback ?? []) as Quote[];
  }

  return (data ?? []) as Quote[];
}

export async function getQuoteById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function getQuoteDetail(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .select("*, admin_users(name, email)")
    .eq("id", id)
    .single();

  if (error) {
    // Fallback if admin_users relationship doesn't exist
    if (error.message.includes("relationship")) {
      const { data: fallback, error: fbErr } = await supabase
        .from("quotes")
        .select("*")
        .eq("id", id)
        .single();
      if (fbErr) return null;
      return fallback;
    }
    return null;
  }
  return data;
}

export async function updateQuoteStatus(
  id: string,
  status: "draft" | "sent" | "viewed" | "pending_approval" | "accepted" | "declined"
) {
  const supabase = await createClient();
  const updates: Record<string, unknown> = { status };

  if (status === "sent") updates.sent_at = new Date().toISOString();
  if (status === "viewed") updates.viewed_at = new Date().toISOString();
  if (status === "accepted") updates.accepted_at = new Date().toISOString();
  if (status === "declined") updates.declined_at = new Date().toISOString();

  const { error } = await supabase.from("quotes").update(updates).eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/quotes");

  // Send internal notifications for pending_approval/declined
  if (status === "pending_approval" || status === "declined") {
    try {
      const { data: quote } = await supabase
        .from("quotes")
        .select("quote_number, client_name, client_email, door_type, grand_total, cost")
        .eq("id", id)
        .single();
      if (!quote) return;

      const type = status === "pending_approval" ? "quote_pending_approval" : "quote_declined";
      const emails = await getNotificationEmailsByType(type);
      if (emails.length === 0) return;

      const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://scenicdoors.co";
      const total = Number(quote.grand_total || quote.cost).toLocaleString("en-US", { minimumFractionDigits: 2 });

      await sendInternalNotificationEmail(
        {
          heading: status === "pending_approval" ? `Quote ${quote.quote_number} Awaiting Approval` : `Quote ${quote.quote_number} Declined`,
          headingColor: status === "pending_approval" ? "#d97706" : "#dc2626",
          headingBg: status === "pending_approval" ? "#fffbeb" : "#fef2f2",
          headingBorder: status === "pending_approval" ? "#fef3c7" : "#fecaca",
          message: status === "pending_approval"
            ? `${quote.client_name} has accepted their quote and is awaiting your approval before the contract is sent.`
            : `${quote.client_name} has declined their quote. Consider following up to understand why.`,
          details: [
            { label: "Quote", value: quote.quote_number },
            { label: "Client", value: quote.client_name },
            { label: "Email", value: quote.client_email },
            { label: "Door Type", value: quote.door_type },
            { label: "Total", value: `$${total}` },
          ],
          adminUrl: `${origin}/admin/quotes/${id}`,
          ctaLabel: status === "pending_approval" ? "Review & Approve" : "View in Admin",
        },
        emails
      );
    } catch (err) {
      console.error("[Quote status notification error]", err);
    }

    // Slack notification
    try {
      const { data: sq } = await supabase
        .from("quotes")
        .select("quote_number, client_name, door_type, grand_total, cost")
        .eq("id", id)
        .single();
      if (sq) {
        const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://scenicdoors.co";
        const slackTotal = Number(sq.grand_total || sq.cost).toLocaleString("en-US", { minimumFractionDigits: 2 });
        await sendSlackNotification({
          heading: status === "pending_approval"
            ? `Quote ${sq.quote_number} Awaiting Approval`
            : `Quote ${sq.quote_number} Declined`,
          message: status === "pending_approval"
            ? `*${sq.client_name}* has accepted their quote and is awaiting your approval.`
            : `*${sq.client_name}* has declined their quote.`,
          color: status === "pending_approval" ? "#d97706" : "#dc2626",
          details: [
            { label: "Quote", value: sq.quote_number },
            { label: "Client", value: sq.client_name },
            { label: "Door Type", value: sq.door_type },
            { label: "Total", value: `$${slackTotal}` },
          ],
          adminUrl: `${origin}/admin/quotes/${id}`,
        });
      }
    } catch (err) {
      console.error("[Slack notification error]", err);
    }
  }
}

export async function approveQuote(id: string) {
  const supabase = await createClient();

  // Verify quote is in pending_approval status
  const { data: quote, error: fetchError } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !quote) throw new Error("Quote not found");
  if (quote.status !== "pending_approval") throw new Error("Quote is not pending approval");

  // Update to accepted
  const { error } = await supabase
    .from("quotes")
    .update({ status: "accepted", accepted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/quotes");

  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://scenicdoors.co";

  // Send approval email to client
  try {
    await sendQuoteApprovedEmail({
      clientName: quote.client_name,
      clientEmail: quote.client_email,
      quoteNumber: quote.quote_number,
      contractUrl: `${origin}/quote/${id}/contract`,
    });

    await recordEmailSent({
      quote_id: id,
      recipient_email: quote.client_email,
      subject: `Quote ${quote.quote_number} Approved — Sign Your Contract`,
      type: "approval",
    });
  } catch (err) {
    console.error("[Quote approval email error]", err);
  }

  // Notify admin team via quote_accepted notification type
  try {
    const emails = await getNotificationEmailsByType("quote_accepted");
    if (emails.length > 0) {
      const total = Number(quote.grand_total || quote.cost).toLocaleString("en-US", { minimumFractionDigits: 2 });
      await sendInternalNotificationEmail(
        {
          heading: `Quote ${quote.quote_number} Approved`,
          headingColor: "#16a34a",
          headingBg: "#f0fdf4",
          headingBorder: "#dcfce7",
          message: `Quote for ${quote.client_name} has been approved. The client has been sent a link to sign the contract.`,
          details: [
            { label: "Quote", value: quote.quote_number },
            { label: "Client", value: quote.client_name },
            { label: "Email", value: quote.client_email },
            { label: "Door Type", value: quote.door_type },
            { label: "Total", value: `$${total}` },
          ],
          adminUrl: `${origin}/admin/quotes/${id}`,
        },
        emails
      );
    }
  } catch (err) {
    console.error("[Quote approval notification error]", err);
  }

  // Slack notification for approval
  try {
    const total = Number(quote.grand_total || quote.cost).toLocaleString("en-US", { minimumFractionDigits: 2 });
    await sendSlackNotification({
      heading: `Quote ${quote.quote_number} Approved`,
      message: `Quote for *${quote.client_name}* has been approved. Contract link sent to client.`,
      color: "#16a34a",
      details: [
        { label: "Quote", value: quote.quote_number },
        { label: "Client", value: quote.client_name },
        { label: "Door Type", value: quote.door_type },
        { label: "Total", value: `$${total}` },
      ],
      adminUrl: `${origin}/admin/quotes/${id}`,
    });
  } catch (err) {
    console.error("[Slack notification error]", err);
  }
}

export async function updateQuoteLeadStatus(
  id: string,
  lead_status: string
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("quotes")
    .update({ lead_status, last_activity_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/quotes");
}

export async function assignQuote(
  id: string,
  assignedTo: string
) {
  const supabase = await createClient();
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("quotes")
    .update({
      assigned_to: assignedTo,
      assigned_date: now,
      last_activity_at: now,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/quotes");
}

export async function deleteQuote(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("quotes").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/quotes");
}

export async function sendQuoteToClient(id: string, origin: string) {
  const supabase = await createClient();

  // Fetch the quote
  const { data: quote, error: fetchError } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !quote) throw new Error("Quote not found");

  // Send the email — link to client portal instead of quote acceptance page
  await sendQuoteEmail({
    clientName: quote.client_name,
    clientEmail: quote.client_email,
    quoteNumber: quote.quote_number,
    doorType: quote.door_type,
    material: quote.material,
    color: quote.color,
    glassType: quote.glass_type,
    size: quote.size,
    cost: quote.cost,
    quoteUrl: `${origin}/portal/${quote.id}`,
    deliveryType: quote.delivery_type,
    deliveryAddress: quote.delivery_address,
  });

  // Record in email history
  await recordEmailSent({
    quote_id: id,
    recipient_email: quote.client_email,
    subject: `Quote ${quote.quote_number} from Scenic Doors`,
    type: "quote",
  });

  // Update status to sent
  const sentNow = new Date().toISOString();
  const { error } = await supabase
    .from("quotes")
    .update({ status: "sent", sent_at: sentNow, last_activity_at: sentNow })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/quotes");
}

export async function notifyNewQuote(quoteId: string, origin: string) {
  const supabase = await createClient();

  // Fetch quote with assigned rep info
  const { data: quote, error } = await supabase
    .from("quotes")
    .select("*, admin_users(name, email)")
    .eq("id", quoteId)
    .single();

  if (error || !quote) {
    // Fallback without join
    const { data: fallback } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", quoteId)
      .single();
    if (!fallback) return;
    const emails = await getNotificationEmailsByType("new_quote");
    if (emails.length > 0) {
      await sendNewQuoteNotificationEmail(
        {
          clientName: fallback.client_name,
          clientEmail: fallback.client_email,
          quoteNumber: fallback.quote_number,
          doorType: fallback.door_type,
          cost: fallback.grand_total || fallback.cost,
          assignedRepName: null,
          adminUrl: `${origin}/admin/quotes/${quoteId}`,
        },
        emails
      );
    }

    // Slack notification (fallback path)
    try {
      const total = Number(fallback.grand_total || fallback.cost).toLocaleString("en-US", { minimumFractionDigits: 2 });
      await sendSlackNotification({
        heading: `New Quote ${fallback.quote_number}`,
        message: `A new quote has been created for *${fallback.client_name}*.`,
        color: "#7c3aed",
        details: [
          { label: "Client", value: fallback.client_name },
          { label: "Email", value: fallback.client_email },
          { label: "Door Type", value: fallback.door_type },
          { label: "Total", value: `$${total}` },
        ],
        adminUrl: `${origin}/admin/quotes/${quoteId}`,
      });
    } catch (err) {
      console.error("[Slack notification error]", err);
    }
    return;
  }

  // Collect notification recipients: configured emails + assigned rep email
  const configuredEmails = await getNotificationEmailsByType("new_quote");
  const repName = quote.admin_users?.name ?? null;
  const repEmail = quote.admin_users?.email ?? null;

  const allEmails = [...configuredEmails];
  if (repEmail && !allEmails.includes(repEmail)) {
    allEmails.push(repEmail);
  }

  if (allEmails.length > 0) {
    await sendNewQuoteNotificationEmail(
      {
        clientName: quote.client_name,
        clientEmail: quote.client_email,
        quoteNumber: quote.quote_number,
        doorType: quote.door_type,
        cost: quote.grand_total || quote.cost,
        assignedRepName: repName,
        adminUrl: `${origin}/admin/quotes/${quoteId}`,
      },
      allEmails
    );

    await recordEmailSent({
      quote_id: quoteId,
      recipient_email: allEmails.join(", "),
      subject: `New Quote ${quote.quote_number} — ${quote.client_name}`,
      type: "notification",
    });
  }

  // Slack notification — always attempt regardless of email config
  try {
    const total = Number(quote.grand_total || quote.cost).toLocaleString("en-US", { minimumFractionDigits: 2 });
    await sendSlackNotification({
      heading: `New Quote ${quote.quote_number}`,
      message: `A new quote has been created for *${quote.client_name}*.`,
      color: "#7c3aed",
      details: [
        { label: "Client", value: quote.client_name },
        { label: "Email", value: quote.client_email },
        { label: "Door Type", value: quote.door_type },
        { label: "Total", value: `$${total}` },
        ...(repName ? [{ label: "Assigned To", value: repName }] : []),
      ],
      adminUrl: `${origin}/admin/quotes/${quoteId}`,
    });
  } catch (err) {
    console.error("[Slack notification error]", err);
  }
}

export async function overrideQuotePrice(
  quoteId: string,
  newGrandTotal: number
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("quotes")
    .update({
      grand_total: newGrandTotal,
      cost: newGrandTotal,
      last_activity_at: new Date().toISOString(),
    })
    .eq("id", quoteId);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/quotes/${quoteId}`);
  revalidatePath("/admin/quotes");
  revalidatePath("/admin/orders");
}

export async function updateLineItemPrices(
  quoteId: string,
  updatedItems: { id?: string; name: string; description?: string; quantity: number; unit_price: number; total: number; [key: string]: unknown }[],
  discountPercent: number
) {
  const supabase = await createClient();

  // Fetch current quote to get existing fields
  const { data: quote, error: fetchError } = await supabase
    .from("quotes")
    .select("subtotal, delivery_cost, tax, installation_cost")
    .eq("id", quoteId)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  // Recalculate subtotal from items
  const subtotal = updatedItems.reduce((sum, item) => sum + Number(item.total), 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const afterDiscount = subtotal - discountAmount;
  const delivery = Number(quote.delivery_cost || 0);
  const installation = Number(quote.installation_cost || 0);
  const taxableAmount = afterDiscount + delivery + installation;
  const tax = Math.round(taxableAmount * 0.08 * 100) / 100;
  const grandTotal = taxableAmount + tax;

  const { error } = await supabase
    .from("quotes")
    .update({
      items: updatedItems,
      subtotal: Math.round(subtotal * 100) / 100,
      discount_percent: discountPercent > 0 ? discountPercent : null,
      discount_amount: discountPercent > 0 ? Math.round(discountAmount * 100) / 100 : null,
      tax: Math.round(tax * 100) / 100,
      grand_total: Math.round(grandTotal * 100) / 100,
      cost: Math.round(grandTotal * 100) / 100,
      last_activity_at: new Date().toISOString(),
    })
    .eq("id", quoteId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
}

export async function updateQuote(
  id: string,
  formData: {
    client_name: string;
    client_email: string;
    door_type: string;
    material: string;
    color: string;
    glass_type: string;
    size: string;
    cost: number;
    notes?: string;
    delivery_type?: string;
    delivery_address?: string;
    client_id?: string;
    customer_type?: string;
    customer_phone?: string;
    customer_zip?: string;
    assigned_to?: string;
    lead_status?: string;
    items?: string; // JSON string
    subtotal?: number;
    installation_cost?: number;
    delivery_cost?: number;
    tax?: number;
    grand_total?: number;
    follow_up_date?: string;
    shared_with?: string[];
  }
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("quotes")
    .update({
      client_name: formData.client_name,
      client_email: formData.client_email,
      door_type: formData.door_type,
      material: formData.material,
      color: formData.color,
      glass_type: formData.glass_type,
      size: formData.size,
      cost: formData.cost,
      notes: formData.notes || null,
      delivery_type: formData.delivery_type || "delivery",
      delivery_address: formData.delivery_address || null,
      client_id: formData.client_id || null,
      customer_type: formData.customer_type || "residential",
      customer_phone: formData.customer_phone || null,
      customer_zip: formData.customer_zip || null,
      assigned_to: formData.assigned_to || null,
      lead_status: formData.lead_status || undefined,
      items: formData.items ? JSON.parse(formData.items) : undefined,
      subtotal: formData.subtotal,
      installation_cost: formData.installation_cost,
      delivery_cost: formData.delivery_cost,
      tax: formData.tax,
      grand_total: formData.grand_total,
      follow_up_date: formData.follow_up_date || null,
      shared_with: formData.shared_with,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  // Sync approval drawing if one exists and isn't already signed
  if (formData.items) {
    try {
      const items = JSON.parse(formData.items);
      if (items.length > 0) {
        const firstItem = items[0];
        const { data: drawing } = await supabase
          .from("approval_drawings")
          .select("id, status")
          .eq("quote_id", id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (drawing && drawing.status !== "signed") {
          const drawingUpdates: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
          };
          if (firstItem.width) drawingUpdates.overall_width = firstItem.width;
          if (firstItem.height) drawingUpdates.overall_height = firstItem.height;
          if (firstItem.panelCount) drawingUpdates.panel_count = firstItem.panelCount;
          if (firstItem.panelLayout) drawingUpdates.configuration = firstItem.panelLayout;

          await supabase
            .from("approval_drawings")
            .update(drawingUpdates)
            .eq("id", drawing.id);
        }
      }
    } catch (err) {
      console.error("[Approval drawing sync error]", err);
    }
  }

  revalidatePath("/admin/quotes");
  revalidatePath(`/admin/quotes/${id}`);
}

export async function markQuoteViewed(id: string) {
  const supabase = await createClient();

  // Only mark viewed if currently "sent"
  const { data: quote } = await supabase
    .from("quotes")
    .select("status")
    .eq("id", id)
    .single();

  if (quote?.status === "sent") {
    await supabase
      .from("quotes")
      .update({
        status: "viewed",
        viewed_at: new Date().toISOString(),
      })
      .eq("id", id);
  }
}

export async function updateDeliveryAddress(
  quoteId: string,
  address: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("quotes")
    .update({
      delivery_address: address,
      delivery_type: "delivery",
    })
    .eq("id", quoteId);

  if (error) throw new Error(error.message);
  revalidatePath(`/portal/${quoteId}`);
  revalidatePath(`/admin/quotes/${quoteId}`);
}

export async function getQuotesByLeadId(leadId: string): Promise<Quote[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) {
    // Graceful fallback if lead_id column doesn't exist
    if (error.message.includes("column") || error.message.includes("schema")) {
      return [];
    }
    throw new Error(error.message);
  }
  return (data ?? []) as Quote[];
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient();

  // Each query is individually safe — missing tables return defaults instead of crashing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const safe = async (query: PromiseLike<any>, fallbackData: unknown = [], fallbackCount = 0) => {
    const r = await query;
    return r.error ? { data: fallbackData, count: fallbackCount } : { data: r.data ?? fallbackData, count: r.count ?? fallbackCount };
  };

  const [leadsRes, quotesRes, quoteTotalsRes, pendingOrdersRes, ordersRes, paymentsRes] =
    await Promise.all([
      safe(supabase.from("leads").select("id", { count: "exact", head: true })),
      safe(supabase.from("quotes").select("id", { count: "exact", head: true })),
      safe(supabase.from("quotes").select("grand_total, cost")),
      safe(supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending")),
      safe(supabase.from("orders").select("id", { count: "exact", head: true })),
      safe(supabase.from("payments").select("amount").eq("status", "completed")),
    ]);

  const totalQuoteValue = (Array.isArray(quoteTotalsRes.data) ? quoteTotalsRes.data : []).reduce(
    (sum: number, q: { grand_total?: number; cost?: number }) => sum + Number(q.grand_total || q.cost || 0),
    0
  );

  const totalOrders = ordersRes.count as number;
  const totalQuotes = quotesRes.count as number;
  const conversionRate =
    totalQuotes > 0 ? (totalOrders / totalQuotes) * 100 : 0;

  const totalPayments = (Array.isArray(paymentsRes.data) ? paymentsRes.data : []).reduce(
    (sum: number, p: { amount?: number }) => sum + Number(p.amount || 0),
    0
  );
  const averageOrderVolume =
    totalOrders > 0 ? totalPayments / totalOrders : 0;

  return {
    totalLeads: leadsRes.count as number,
    totalQuotes,
    totalQuoteValue,
    pendingOrders: pendingOrdersRes.count as number,
    totalOrders,
    conversionRate,
    averageOrderVolume,
  };
}

export async function updateQuoteSharedWith(
  quoteId: string,
  userIds: string[]
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("quotes")
    .update({ shared_with: userIds })
    .eq("id", quoteId);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/quotes/${quoteId}`);
  revalidatePath("/admin/quotes");
}

export async function sendEstimateConfirmation(quoteId: string) {
  const supabase = await createClient();
  const { data: quote, error } = await supabase
    .from("quotes")
    .select("client_name, client_email, quote_number, door_type")
    .eq("id", quoteId)
    .single();

  if (error || !quote) return;

  await sendEstimateConfirmationEmail({
    clientName: quote.client_name,
    clientEmail: quote.client_email,
    quoteNumber: quote.quote_number,
    doorType: quote.door_type,
  });

  await recordEmailSent({
    quote_id: quoteId,
    recipient_email: quote.client_email,
    subject: `We Received Your Inquiry — ${quote.quote_number}`,
    type: "confirmation",
  });
}

export async function updateInstallationCost(quoteId: string, installationCost: number) {
  const supabase = await createClient();

  // Fetch current quote to recalculate grand_total
  const { data: quote, error: fetchErr } = await supabase
    .from("quotes")
    .select("subtotal, delivery_cost, tax, grand_total, cost")
    .eq("id", quoteId)
    .single();

  if (fetchErr || !quote) throw new Error("Quote not found");

  const subtotal = Number(quote.subtotal || 0);
  const deliveryCost = Number(quote.delivery_cost || 0);
  const taxableAmount = subtotal + installationCost + deliveryCost;
  const TAX_RATE = 0.08;
  const tax = Math.round(taxableAmount * TAX_RATE * 100) / 100;
  const grandTotal = Math.round((taxableAmount + tax) * 100) / 100;

  const { error } = await supabase
    .from("quotes")
    .update({
      installation_cost: installationCost,
      tax,
      grand_total: grandTotal,
      cost: grandTotal,
    })
    .eq("id", quoteId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/orders`);
  revalidatePath(`/admin/quotes/${quoteId}`);
}
