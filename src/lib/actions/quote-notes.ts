"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { QuoteNote } from "@/lib/types";

export async function getQuoteNotes(quoteId: string): Promise<QuoteNote[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quote_notes")
    .select("*")
    .eq("quote_id", quoteId)
    .order("created_at", { ascending: false });

  if (error) {
    if (error.message.includes("schema cache")) return [];
    throw new Error(error.message);
  }
  return data ?? [];
}

export async function createQuoteNote(
  quoteId: string,
  content: string,
  createdBy?: string
): Promise<QuoteNote> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quote_notes")
    .insert({
      quote_id: quoteId,
      content,
      created_by: createdBy || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/quotes/${quoteId}`);
  return data;
}

export async function deleteQuoteNote(
  noteId: string,
  quoteId: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("quote_notes")
    .delete()
    .eq("id", noteId);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/quotes/${quoteId}`);
}
