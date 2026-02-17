"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { QuotePhoto } from "@/lib/types";

export async function getQuotePhotos(quoteId: string): Promise<QuotePhoto[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quote_photos")
    .select("*")
    .eq("quote_id", quoteId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function addQuotePhoto(formData: {
  quote_id: string;
  photo_url: string;
  photo_type: string;
  caption?: string;
  uploaded_by?: string;
  lead_id?: string;
}): Promise<QuotePhoto> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quote_photos")
    .insert({
      quote_id: formData.quote_id,
      photo_url: formData.photo_url,
      photo_type: formData.photo_type,
      caption: formData.caption || null,
      uploaded_by: formData.uploaded_by || null,
      lead_id: formData.lead_id || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/quotes/${formData.quote_id}`);
  return data;
}

export async function deleteQuotePhoto(photoId: string, quoteId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("quote_photos")
    .delete()
    .eq("id", photoId);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/quotes/${quoteId}`);
}
