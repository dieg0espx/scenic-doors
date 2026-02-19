"use server";

import { createClient } from "@/lib/supabase/server";
import { uploadSignature } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { sendInternalNotificationEmail } from "@/lib/email";
import { getNotificationEmailsByType } from "@/lib/actions/notification-settings";

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

  // Send internal notification
  try {
    const emails = await getNotificationEmailsByType("contract_signed");
    if (emails.length > 0) {
      const { data: quote } = await supabase
        .from("quotes")
        .select("quote_number, client_email, door_type, grand_total, cost")
        .eq("id", quoteId)
        .single();

      const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://scenicdoors.com";
      const total = quote ? Number(quote.grand_total || quote.cost).toLocaleString("en-US", { minimumFractionDigits: 2 }) : "—";

      await sendInternalNotificationEmail(
        {
          heading: "Contract Signed",
          headingColor: "#2563eb",
          headingBg: "#eff6ff",
          headingBorder: "#dbeafe",
          message: `${clientName} has signed the contract. The deal is locked in.`,
          details: [
            { label: "Quote", value: quote?.quote_number ?? "—" },
            { label: "Client", value: clientName },
            { label: "Door Type", value: quote?.door_type ?? "—" },
            { label: "Total", value: `$${total}` },
          ],
          adminUrl: `${origin}/admin/quotes/${quoteId}`,
        },
        emails
      );
    }
  } catch {
    // Don't fail the contract creation if notification fails
  }

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
