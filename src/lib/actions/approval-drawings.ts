"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendInternalNotificationEmail, sendApprovalDrawingEmail } from "@/lib/email";
import { sendSlackNotification } from "@/lib/slack";
import { getNotificationEmailsByType } from "@/lib/actions/notification-settings";
import { recordEmailSent } from "@/lib/actions/email-history";
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
  frame_color?: string;
  hardware_color?: string;
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
      frame_color: formData.frame_color || "Black",
      hardware_color: formData.hardware_color || "Black",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Sync drawing values back to quote
  const quoteUpdates: Record<string, unknown> = {
    portal_stage: "approval_pending",
    size: `${formData.overall_width}" x ${formData.overall_height}"`,
  };
  if (formData.frame_color) quoteUpdates.color = formData.frame_color;

  await supabase
    .from("quotes")
    .update(quoteUpdates)
    .eq("id", formData.quote_id);

  // Sync item-level fields to the first quote item
  const { data: quote } = await supabase
    .from("quotes")
    .select("items")
    .eq("id", formData.quote_id)
    .single();

  if (quote?.items && Array.isArray(quote.items) && quote.items.length > 0) {
    const items = [...quote.items];
    const first = { ...items[0] };
    first.width = formData.overall_width;
    first.height = formData.overall_height;
    first.panelCount = formData.panel_count;
    if (formData.frame_color) first.exteriorFinish = formData.frame_color;
    if (formData.hardware_color) first.hardwareFinish = formData.hardware_color;
    const desc = `${first.width}" x ${first.height}" | ${first.exteriorFinish || ""}${first.interiorFinish ? ` / ${first.interiorFinish} interior` : ""} | ${first.glassType || ""} | ${first.hardwareFinish || ""}`;
    first.description = desc;
    items[0] = first;
    await supabase
      .from("quotes")
      .update({ items })
      .eq("id", formData.quote_id);
  }

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
    frame_color: string;
    hardware_color: string;
    status: string;
  }>
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("approval_drawings")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  // Fetch the quote_id so we can revalidate the correct page
  const { data: drawing } = await supabase
    .from("approval_drawings")
    .select("quote_id")
    .eq("id", id)
    .single();

  if (drawing?.quote_id) {
    revalidatePath(`/admin/quotes/${drawing.quote_id}`);
  }
}

export async function updateApprovalDrawingAndSyncQuote(
  drawingId: string,
  quoteId: string,
  updates: Partial<{
    overall_width: number;
    overall_height: number;
    panel_count: number;
    slide_direction: string;
    in_swing: string;
    system_type: string;
    configuration: string;
    additional_notes: string;
    frame_color: string;
    hardware_color: string;
  }>
): Promise<ApprovalDrawing> {
  const supabase = await createClient();

  // 1. Update the approval_drawings record
  const { data: updated, error } = await supabase
    .from("approval_drawings")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", drawingId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  // 2. Sync relevant fields back to the quote
  const quoteUpdates: Record<string, unknown> = {};
  if (updates.frame_color) {
    quoteUpdates.color = updates.frame_color;
  }
  if (updates.overall_width !== undefined || updates.overall_height !== undefined) {
    const w = updates.overall_width ?? updated.overall_width;
    const h = updates.overall_height ?? updated.overall_height;
    quoteUpdates.size = `${w}" x ${h}"`;
  }

  if (Object.keys(quoteUpdates).length > 0) {
    await supabase
      .from("quotes")
      .update(quoteUpdates)
      .eq("id", quoteId);
  }

  // Sync item-level fields back to the first quote item
  if (updates.overall_width !== undefined || updates.overall_height !== undefined ||
      updates.panel_count !== undefined || updates.frame_color !== undefined ||
      updates.hardware_color !== undefined) {
    const { data: quote } = await supabase
      .from("quotes")
      .select("items")
      .eq("id", quoteId)
      .single();

    if (quote?.items && Array.isArray(quote.items) && quote.items.length > 0) {
      const items = [...quote.items];
      const first = { ...items[0] };
      if (updates.overall_width !== undefined) first.width = updates.overall_width;
      if (updates.overall_height !== undefined) first.height = updates.overall_height;
      if (updates.panel_count !== undefined) first.panelCount = updates.panel_count;
      if (updates.frame_color !== undefined) first.exteriorFinish = updates.frame_color;
      if (updates.hardware_color !== undefined) first.hardwareFinish = updates.hardware_color;
      // Rebuild description
      const desc = `${first.width}" x ${first.height}" | ${first.exteriorFinish || ""}${first.interiorFinish ? ` / ${first.interiorFinish} interior` : ""} | ${first.glassType || ""} | ${first.hardwareFinish || ""}`;
      first.description = desc;
      items[0] = first;
      await supabase
        .from("quotes")
        .update({ items })
        .eq("id", quoteId);
    }
  }

  revalidatePath(`/admin/quotes/${quoteId}`);
  revalidatePath(`/portal/${quoteId}`);

  return updated;
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

  // Send email notification to client
  try {
    const { data: quote } = await supabase
      .from("quotes")
      .select("client_name, client_email, quote_number")
      .eq("id", quoteId)
      .single();

    if (quote?.client_email) {
      const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://scenicdoors.com";
      const portalUrl = `${origin}/portal/${quoteId}`;
      const subject = `Approval Drawing Ready — Quote ${quote.quote_number} | Scenic Doors`;

      await sendApprovalDrawingEmail({
        clientName: quote.client_name,
        clientEmail: quote.client_email,
        quoteNumber: quote.quote_number,
        portalUrl,
      });

      await recordEmailSent({
        quote_id: quoteId,
        recipient_email: quote.client_email,
        subject,
        type: "approval_drawing_sent",
      });
    }
  } catch {
    // Don't fail the send if email notification fails
  }

  revalidatePath(`/admin/quotes/${quoteId}`);
}

export async function requestApprovalDrawing(quoteId: string): Promise<void> {
  const supabase = await createClient();

  // Update portal stage to indicate drawing was requested
  const { error } = await supabase
    .from("quotes")
    .update({ portal_stage: "drawing_requested", last_activity_at: new Date().toISOString() })
    .eq("id", quoteId);

  if (error) throw new Error(error.message);

  // Notify admin team
  try {
    const { data: quote } = await supabase
      .from("quotes")
      .select("quote_number, client_name, client_email, door_type, grand_total, cost")
      .eq("id", quoteId)
      .single();

    if (quote) {
      const emails = await getNotificationEmailsByType("new_quote");
      if (emails.length > 0) {
        const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://scenicdoors.com";
        const total = Number(quote.grand_total || quote.cost || 0).toLocaleString("en-US", { minimumFractionDigits: 2 });
        await sendInternalNotificationEmail(
          {
            heading: `Approval Drawing Requested — ${quote.quote_number}`,
            headingColor: "#d97706",
            headingBg: "#fffbeb",
            headingBorder: "#fef3c7",
            message: `${quote.client_name} has reviewed their quote and is requesting an approval drawing. Please prepare the drawing and send it for their review.`,
            details: [
              { label: "Quote", value: quote.quote_number },
              { label: "Client", value: quote.client_name },
              { label: "Email", value: quote.client_email },
              { label: "Door Type", value: quote.door_type },
              { label: "Total", value: `$${total}` },
            ],
            adminUrl: `${origin}/admin/quotes/${quoteId}`,
            ctaLabel: "Create Approval Drawing",
          },
          emails
        );
      }
    }
  } catch {
    // Don't fail the request if notification fails
  }

  // Slack notification
  try {
    const { data: sq } = await supabase
      .from("quotes")
      .select("quote_number, client_name, door_type, grand_total, cost")
      .eq("id", quoteId)
      .single();
    if (sq) {
      const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://scenicdoors.com";
      const total = Number(sq.grand_total || sq.cost || 0).toLocaleString("en-US", { minimumFractionDigits: 2 });
      await sendSlackNotification({
        heading: `Approval Drawing Requested — ${sq.quote_number}`,
        message: `*${sq.client_name}* has reviewed their quote and is requesting an approval drawing.`,
        color: "#d97706",
        details: [
          { label: "Quote", value: sq.quote_number },
          { label: "Client", value: sq.client_name },
          { label: "Door Type", value: sq.door_type },
          { label: "Total", value: `$${total}` },
        ],
        adminUrl: `${origin}/admin/quotes/${quoteId}`,
      });
    }
  } catch {
    // Don't fail request if Slack fails
  }

  revalidatePath(`/admin/quotes/${quoteId}`);
  revalidatePath(`/portal/${quoteId}`);
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

  // Fetch quote data for order creation and notification
  const { data: quote } = await supabase
    .from("quotes")
    .select("quote_number, client_name, client_email, grand_total")
    .eq("id", drawing.quote_id)
    .single();

  // Auto-create order tracking (move to orders)
  const totalAmount = quote?.grand_total || 0;
  const halfAmount = Math.round(totalAmount * 50) / 100;

  // Check no duplicate tracking exists
  const { data: existingTracking } = await supabase
    .from("order_tracking")
    .select("id")
    .eq("quote_id", drawing.quote_id)
    .maybeSingle();

  if (!existingTracking) {
    await supabase
      .from("order_tracking")
      .insert({
        quote_id: drawing.quote_id,
        stage: "deposit_1_pending",
        deposit_1_amount: halfAmount,
        deposit_2_amount: halfAmount,
      });
  }

  // Auto-create orders record (so it shows on admin orders page)
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id")
    .eq("quote_id", drawing.quote_id)
    .maybeSingle();

  if (!existingOrder) {
    const { error: orderErr } = await supabase
      .from("orders")
      .insert({
        quote_id: drawing.quote_id,
        client_name: quote?.client_name ?? customerName,
        client_email: quote?.client_email ?? "",
      });
    if (orderErr) {
      console.error("Failed to create order record:", orderErr.message);
    }
  }

  // Advance portal stage directly to deposit_1_pending (order created)
  await supabase
    .from("quotes")
    .update({ portal_stage: "deposit_1_pending", lead_status: "order" })
    .eq("id", drawing.quote_id);

  // Send internal notification
  try {
    const emails = await getNotificationEmailsByType("approval_signed");
    if (emails.length > 0) {
      const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://scenicdoors.com";
      await sendInternalNotificationEmail(
        {
          heading: "Approval Drawing Signed — Order Created",
          headingColor: "#2563eb",
          headingBg: "#eff6ff",
          headingBorder: "#dbeafe",
          message: `${customerName} has signed the approval drawing. An order has been automatically created and is awaiting the first deposit.`,
          details: [
            { label: "Quote", value: quote?.quote_number ?? "—" },
            { label: "Client", value: quote?.client_name ?? customerName },
            { label: "Signed By", value: customerName },
            { label: "Order Total", value: totalAmount ? `$${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—" },
          ],
          adminUrl: `${origin}/admin/quotes/${drawing.quote_id}`,
        },
        emails
      );
    }
  } catch {
    // Don't fail the signing if notification fails
  }

  // Slack notification
  try {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://scenicdoors.com";
    await sendSlackNotification({
      heading: "Approval Drawing Signed — Order Created",
      message: `*${customerName}* has signed the approval drawing. An order has been created and is awaiting the first deposit.`,
      color: "#2563eb",
      details: [
        { label: "Quote", value: quote?.quote_number ?? "—" },
        { label: "Client", value: quote?.client_name ?? customerName },
        { label: "Signed By", value: customerName },
        ...(totalAmount ? [{ label: "Order Total", value: `$${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}` }] : []),
      ],
      adminUrl: `${origin}/admin/quotes/${drawing.quote_id}`,
    });
  } catch {
    // Don't fail signing if Slack fails
  }

  revalidatePath(`/admin/quotes/${drawing.quote_id}`);
  revalidatePath(`/portal/${drawing.quote_id}`);
}
