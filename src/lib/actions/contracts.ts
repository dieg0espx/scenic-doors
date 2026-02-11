"use server";

import { createClient } from "@/lib/supabase/server";
import { uploadSignature } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function createContract({
  quoteId,
  clientName,
  signatureDataUrl,
  ipAddress,
  userAgent,
}: {
  quoteId: string;
  clientName: string;
  signatureDataUrl: string;
  ipAddress: string;
  userAgent: string;
}) {
  // Upload signature to Cloudinary
  const { secure_url, public_id } = await uploadSignature(signatureDataUrl);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contracts")
    .insert({
      quote_id: quoteId,
      client_name: clientName,
      signature_url: secure_url,
      signature_public_id: public_id,
      ip_address: ipAddress,
      user_agent: userAgent,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/contracts");
  return data;
}

export async function getContracts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contracts")
    .select("*, quotes(quote_number, door_type, cost, material, color, glass_type, size, client_email, delivery_type, delivery_address)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getContractById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contracts")
    .select("*, quotes(quote_number, door_type, cost, material, color, glass_type, size, client_email, delivery_type, delivery_address)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function getContractByQuoteId(quoteId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contracts")
    .select("*")
    .eq("quote_id", quoteId)
    .single();

  return data;
}
