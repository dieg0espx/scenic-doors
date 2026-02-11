"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createOrder({
  quoteId,
  contractId,
  paymentId,
  clientName,
  clientEmail,
}: {
  quoteId: string;
  contractId: string;
  paymentId: string;
  clientName: string;
  clientEmail: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      quote_id: quoteId,
      contract_id: contractId,
      payment_id: paymentId,
      client_name: clientName,
      client_email: clientEmail,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
  return data;
}

export async function getOrders() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, quotes(quote_number, door_type, cost), contracts(signature_url), payments(amount, status)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  // Sync order statuses based on actual payment states
  if (data) {
    for (const order of data) {
      const { data: payments } = await supabase
        .from("payments")
        .select("payment_type, status")
        .eq("quote_id", order.quote_id);

      if (!payments) continue;

      const advancePaid = payments.some(
        (p) => p.payment_type === "advance_50" && p.status === "completed"
      );
      const balancePaid = payments.some(
        (p) => p.payment_type === "balance_50" && p.status === "completed"
      );

      let correctStatus = order.status;
      if (balancePaid) correctStatus = "completed";
      else if (advancePaid) correctStatus = "in_progress";

      if (correctStatus !== order.status) {
        await supabase
          .from("orders")
          .update({ status: correctStatus })
          .eq("id", order.id);
        order.status = correctStatus;
      }
    }
  }

  return data;
}

export async function getOrderById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, quotes(*), contracts(client_name, signature_url, signed_at, ip_address)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function updateOrderStatus(
  id: string,
  status: "pending" | "in_progress" | "completed" | "cancelled"
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
}

/**
 * Checks payment states and corrects the order status if it's out of sync.
 * Returns the corrected status if changed, or null if no change needed.
 */
export async function syncOrderStatus(
  orderId: string,
  quoteId: string,
  currentStatus: string
): Promise<string | null> {
  const supabase = await createClient();
  const { data: payments } = await supabase
    .from("payments")
    .select("payment_type, status")
    .eq("quote_id", quoteId);

  if (!payments) return null;

  const advancePaid = payments.some(
    (p) => p.payment_type === "advance_50" && p.status === "completed"
  );
  const balancePaid = payments.some(
    (p) => p.payment_type === "balance_50" && p.status === "completed"
  );

  let correctStatus = currentStatus;
  if (balancePaid) {
    correctStatus = "completed";
  } else if (advancePaid) {
    correctStatus = "in_progress";
  }

  if (correctStatus !== currentStatus) {
    await supabase
      .from("orders")
      .update({ status: correctStatus })
      .eq("id", orderId);
    revalidatePath("/admin/orders");
    return correctStatus;
  }

  return null;
}
