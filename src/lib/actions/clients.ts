"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createClientAction(formData: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  addresses?: { label: string; address: string; is_default: boolean }[];
}) {
  const supabase = await createClient();

  const { data: client, error } = await supabase
    .from("clients")
    .insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      company: formData.company || null,
      notes: formData.notes || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (formData.addresses && formData.addresses.length > 0) {
    const { error: addrError } = await supabase
      .from("client_addresses")
      .insert(
        formData.addresses.map((a) => ({
          client_id: client.id,
          label: a.label,
          address: a.address,
          is_default: a.is_default,
        }))
      );
    if (addrError) throw new Error(addrError.message);
  }

  revalidatePath("/admin/clients");
  return client;
}

export async function updateClient(
  id: string,
  formData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    notes?: string;
  }
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("clients")
    .update({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      company: formData.company || null,
      notes: formData.notes || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${id}`);
}

export async function getClients() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*, client_addresses(*)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getClientById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*, client_addresses(*)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function getClientWithHistory(id: string) {
  const supabase = await createClient();

  const { data: client, error } = await supabase
    .from("clients")
    .select("*, client_addresses(*)")
    .eq("id", id)
    .single();

  if (error || !client) return null;

  // Get quotes linked by client_id or email fallback
  const { data: quotes } = await supabase
    .from("quotes")
    .select("*")
    .or(`client_id.eq.${id},client_email.eq.${client.email}`)
    .order("created_at", { ascending: false });

  // Get orders linked by client email
  const { data: orders } = await supabase
    .from("orders")
    .select("*, quotes(quote_number, door_type, cost)")
    .eq("client_email", client.email)
    .order("created_at", { ascending: false });

  return {
    ...client,
    quotes: quotes || [],
    orders: orders || [],
  };
}

export async function addClientAddress(
  clientId: string,
  data: { label: string; address: string; is_default: boolean }
) {
  const supabase = await createClient();

  // If setting as default, unset other defaults first
  if (data.is_default) {
    await supabase
      .from("client_addresses")
      .update({ is_default: false })
      .eq("client_id", clientId);
  }

  const { data: addr, error } = await supabase
    .from("client_addresses")
    .insert({
      client_id: clientId,
      label: data.label,
      address: data.address,
      is_default: data.is_default,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/clients/${clientId}`);
  return addr;
}

export async function updateClientAddress(
  id: string,
  clientId: string,
  data: { label: string; address: string; is_default: boolean }
) {
  const supabase = await createClient();

  if (data.is_default) {
    await supabase
      .from("client_addresses")
      .update({ is_default: false })
      .eq("client_id", clientId);
  }

  const { error } = await supabase
    .from("client_addresses")
    .update({
      label: data.label,
      address: data.address,
      is_default: data.is_default,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function deleteClientAddress(id: string, clientId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("client_addresses")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function searchClients(query: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("id, name, email, client_addresses(*)")
    .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
    .order("name")
    .limit(10);

  if (error) throw new Error(error.message);
  return data;
}
