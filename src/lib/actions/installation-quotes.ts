"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendInstallationQuoteEmail, sendInternalNotificationEmail } from "@/lib/email";
import { getNotificationEmailsByType } from "@/lib/actions/notification-settings";

export interface InstallationQuoteItem {
  id?: string;
  description: string;
  price: number;
  sort_order?: number;
}

export interface InstallationQuote {
  id: string;
  quote_id: string;
  status: string;
  total: number;
  signature_data: string | null;
  signed_by: string | null;
  signed_at: string | null;
  sent_at: string | null;
  payment_id: string | null;
  created_at: string;
  updated_at: string;
  items: InstallationQuoteItem[];
}

export async function getInstallationQuoteByQuoteId(quoteId: string): Promise<InstallationQuote | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("installation_quotes")
    .select("*, items:installation_quote_items(*)")
    .eq("quote_id", quoteId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  // Sort items by sort_order
  const items = (data.items || []).sort(
    (a: InstallationQuoteItem, b: InstallationQuoteItem) => (a.sort_order || 0) - (b.sort_order || 0)
  );

  return { ...data, items } as InstallationQuote;
}

export async function createInstallationQuote(
  quoteId: string,
  items: { description: string; price: number }[]
) {
  const supabase = await createClient();
  const total = items.reduce((sum, item) => sum + Number(item.price), 0);

  const { data: iq, error } = await supabase
    .from("installation_quotes")
    .insert({ quote_id: quoteId, total, status: "draft" })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Insert items
  const itemRows = items.map((item, i) => ({
    installation_quote_id: iq.id,
    description: item.description,
    price: item.price,
    sort_order: i,
  }));

  const { error: itemError } = await supabase
    .from("installation_quote_items")
    .insert(itemRows);

  if (itemError) throw new Error(itemError.message);

  revalidatePath("/admin/orders");
  return iq;
}

export async function updateInstallationQuote(
  installationQuoteId: string,
  items: { description: string; price: number }[]
) {
  const supabase = await createClient();
  const total = items.reduce((sum, item) => sum + Number(item.price), 0);

  // Delete old items
  await supabase
    .from("installation_quote_items")
    .delete()
    .eq("installation_quote_id", installationQuoteId);

  // Insert new items
  const itemRows = items.map((item, i) => ({
    installation_quote_id: installationQuoteId,
    description: item.description,
    price: item.price,
    sort_order: i,
  }));

  await supabase.from("installation_quote_items").insert(itemRows);

  // Update total
  const { error } = await supabase
    .from("installation_quotes")
    .update({ total, updated_at: new Date().toISOString() })
    .eq("id", installationQuoteId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
}

export async function sendInstallationQuote(installationQuoteId: string, origin: string) {
  const supabase = await createClient();

  // Get the installation quote with items
  const { data: iq, error } = await supabase
    .from("installation_quotes")
    .select("*, items:installation_quote_items(*), quotes(quote_number, client_name, client_email)")
    .eq("id", installationQuoteId)
    .single();

  if (error || !iq) throw new Error("Installation quote not found");

  const quotes = iq.quotes as { quote_number: string; client_name: string; client_email: string };
  const items = ((iq.items || []) as InstallationQuoteItem[]).sort(
    (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
  );

  // Update status
  await supabase
    .from("installation_quotes")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", installationQuoteId);

  // Send email
  await sendInstallationQuoteEmail({
    clientName: quotes.client_name,
    clientEmail: quotes.client_email,
    quoteNumber: quotes.quote_number,
    items: items.map((i) => ({ description: i.description, price: Number(i.price) })),
    total: Number(iq.total),
    portalUrl: `${origin}/portal/${iq.quote_id}?tab=installation`,
  });

  // Internal notification
  const notifyEmails = await getNotificationEmailsByType("payment_received");
  if (notifyEmails.length > 0) {
    await sendInternalNotificationEmail(
      {
        heading: `Installation Quote Sent — ${quotes.quote_number}`,
        headingColor: "#0284c7",
        headingBg: "#f0f9ff",
        headingBorder: "#e0f2fe",
        message: `Installation quote sent to ${quotes.client_name}.`,
        details: [
          { label: "Client", value: quotes.client_name },
          { label: "Total", value: `$${Number(iq.total).toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
          { label: "Items", value: String(items.length) },
        ],
        adminUrl: `${origin}/admin/orders`,
      },
      notifyEmails
    );
  }

  revalidatePath("/admin/orders");
}

export async function approveInstallationQuote(
  installationQuoteId: string,
  signatureData: string,
  signedBy: string
) {
  const supabase = await createClient();
  const signedAt = new Date().toISOString();

  // Get the installation quote
  const { data: iq, error: fetchErr } = await supabase
    .from("installation_quotes")
    .select("*, quotes(client_name, client_email, quote_number)")
    .eq("id", installationQuoteId)
    .single();

  if (fetchErr || !iq) throw new Error("Installation quote not found");

  const quotes = iq.quotes as { client_name: string; client_email: string; quote_number: string };

  // Create a payment record for this installation
  const { data: payment, error: payErr } = await supabase
    .from("payments")
    .insert({
      quote_id: iq.quote_id,
      client_name: quotes.client_name,
      amount: iq.total,
      payment_type: "installation",
      status: "pending",
    })
    .select()
    .single();

  if (payErr) throw new Error(payErr.message);

  // Update installation quote
  const { error } = await supabase
    .from("installation_quotes")
    .update({
      status: "approved",
      signature_data: signatureData,
      signed_by: signedBy,
      signed_at: signedAt,
      payment_id: payment.id,
      updated_at: signedAt,
    })
    .eq("id", installationQuoteId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/orders");
  revalidatePath("/admin/payments");
  return payment.id;
}

export async function deleteInstallationQuote(installationQuoteId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("installation_quotes")
    .delete()
    .eq("id", installationQuoteId)
    .eq("status", "draft");

  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
}
