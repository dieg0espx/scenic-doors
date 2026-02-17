"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ApprovalDrawing } from "@/lib/types";

export async function getApprovalDrawing(quoteId: string): Promise<ApprovalDrawing | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("approval_drawings")
    .select("*")
    .eq("quote_id", quoteId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function createApprovalDrawing(formData: {
  quote_id: string;
  overall_width: number;
  overall_height: number;
  panel_count: number;
  slide_direction: string;
  in_swing: string;
  system_type: string;
  configuration: string;
  additional_notes?: string;
}): Promise<ApprovalDrawing> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("approval_drawings")
    .insert({
      quote_id: formData.quote_id,
      overall_width: formData.overall_width,
      overall_height: formData.overall_height,
      panel_count: formData.panel_count,
      slide_direction: formData.slide_direction,
      in_swing: formData.in_swing,
      system_type: formData.system_type,
      configuration: formData.configuration,
      additional_notes: formData.additional_notes || "",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Update quote portal stage
  await supabase
    .from("quotes")
    .update({ portal_stage: "approval_pending" })
    .eq("id", formData.quote_id);

  revalidatePath(`/admin/quotes/${formData.quote_id}`);
  return data;
}

export async function updateApprovalDrawing(
  id: string,
  updates: Partial<{
    overall_width: number;
    overall_height: number;
    panel_count: number;
    slide_direction: string;
    in_swing: string;
    system_type: string;
    configuration: string;
    additional_notes: string;
    status: string;
  }>
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("approval_drawings")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function sendApprovalDrawing(id: string, quoteId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("approval_drawings")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await supabase
    .from("quotes")
    .update({ portal_stage: "approval_pending" })
    .eq("id", quoteId);

  revalidatePath(`/admin/quotes/${quoteId}`);
}

export async function signApprovalDrawing(
  id: string,
  customerName: string,
  signatureData: string
): Promise<void> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data: drawing, error: fetchError } = await supabase
    .from("approval_drawings")
    .select("quote_id, status")
    .eq("id", id)
    .single();

  if (fetchError || !drawing) throw new Error("Approval drawing not found");

  // Idempotency: already signed
  if (drawing.status === "signed") return;

  // Only allow signing drawings that have been sent
  if (drawing.status !== "sent") {
    throw new Error("Approval drawing must be sent before it can be signed");
  }

  const { error } = await supabase
    .from("approval_drawings")
    .update({
      status: "signed",
      signed_at: now,
      customer_name: customerName,
      signature_date: now.split("T")[0],
      signature_data: signatureData,
      updated_at: now,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  // Advance portal stage
  await supabase
    .from("quotes")
    .update({ portal_stage: "approval_signed" })
    .eq("id", drawing.quote_id);
}
