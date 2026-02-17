"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendQuoteEmail } from "@/lib/email";
import { recordEmailSent } from "@/lib/actions/email-history";
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
}) {
  const supabase = await createClient();

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
      portal_stage: "quote_sent",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
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

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getQuotesWithFilters(filters?: {
  lead_status?: string;
  search?: string;
  sort?: string;
  due_today?: boolean;
}): Promise<Quote[]> {
  const supabase = await createClient();
  let query = supabase
    .from("quotes")
    .select("*, quote_notes(id), quote_tasks(id), admin_users(name)");

  if (filters?.lead_status && filters.lead_status !== "all") {
    query = query.eq("lead_status", filters.lead_status);
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
  if (error) throw new Error(error.message);
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

  if (error) return null;
  return data;
}

export async function updateQuoteStatus(
  id: string,
  status: "draft" | "sent" | "viewed" | "accepted" | "declined"
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
}

export async function updateQuoteLeadStatus(
  id: string,
  lead_status: string
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("quotes")
    .update({ lead_status })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/quotes");
}

export async function assignQuote(
  id: string,
  assignedTo: string
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("quotes")
    .update({
      assigned_to: assignedTo,
      assigned_date: new Date().toISOString(),
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

  // Send the email
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
    quoteUrl: `${origin}/quote/${quote.id}`,
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
  const { error } = await supabase
    .from("quotes")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/quotes");
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
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/quotes");
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

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient();

  const [leadsRes, quotesRes, quoteTotalsRes, pendingOrdersRes, ordersRes, paymentsRes] =
    await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase.from("quotes").select("id", { count: "exact", head: true }),
      supabase.from("quotes").select("grand_total, cost"),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase
        .from("payments")
        .select("amount")
        .eq("status", "completed"),
    ]);

  const totalQuoteValue = (quoteTotalsRes.data ?? []).reduce(
    (sum, q) => sum + Number(q.grand_total || q.cost || 0),
    0
  );

  const totalOrders = ordersRes.count ?? 0;
  const totalQuotes = quotesRes.count ?? 0;
  const conversionRate =
    totalQuotes > 0 ? (totalOrders / totalQuotes) * 100 : 0;

  const totalPayments = (paymentsRes.data ?? []).reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );
  const averageOrderVolume =
    totalOrders > 0 ? totalPayments / totalOrders : 0;

  return {
    totalLeads: leadsRes.count ?? 0,
    totalQuotes,
    totalQuoteValue,
    pendingOrders: pendingOrdersRes.count ?? 0,
    totalOrders,
    conversionRate,
    averageOrderVolume,
  };
}
