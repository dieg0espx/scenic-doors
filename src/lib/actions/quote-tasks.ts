"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { QuoteTask } from "@/lib/types";

export async function getQuoteTasks(quoteId: string): Promise<QuoteTask[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quote_tasks")
    .select("*")
    .eq("quote_id", quoteId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createQuoteTask(
  quoteId: string,
  title: string,
  dueDate?: string,
  createdBy?: string
): Promise<QuoteTask> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quote_tasks")
    .insert({
      quote_id: quoteId,
      title,
      due_date: dueDate || null,
      created_by: createdBy || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/quotes/${quoteId}`);
  return data;
}

export async function toggleQuoteTask(
  taskId: string,
  completed: boolean,
  quoteId: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("quote_tasks")
    .update({ completed })
    .eq("id", taskId);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/quotes/${quoteId}`);
}

export async function deleteQuoteTask(
  taskId: string,
  quoteId: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("quote_tasks")
    .delete()
    .eq("id", taskId);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/quotes/${quoteId}`);
}
