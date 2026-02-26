"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { QuoteDocument } from "@/lib/types";

export async function getQuoteDocuments(quoteId: string): Promise<QuoteDocument[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quote_documents")
    .select("*")
    .eq("quote_id", quoteId)
    .order("created_at", { ascending: false });

  if (error) {
    if (error.message.includes("schema cache") || error.message.includes("relation")) return [];
    throw new Error(error.message);
  }
  return data ?? [];
}

export async function addQuoteDocument(input: {
  quote_id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  uploaded_by?: string;
}): Promise<QuoteDocument> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quote_documents")
    .insert({
      quote_id: input.quote_id,
      file_url: input.file_url,
      file_name: input.file_name,
      file_type: input.file_type,
      file_size: input.file_size,
      uploaded_by: input.uploaded_by || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/quotes/${input.quote_id}`);
  revalidatePath(`/admin/orders`);
  return data;
}

export async function deleteQuoteDocument(docId: string, quoteId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("quote_documents")
    .delete()
    .eq("id", docId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/quotes/${quoteId}`);
  revalidatePath(`/admin/orders`);
}
