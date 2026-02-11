"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendQuoteEmail } from "@/lib/email";

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
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
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
