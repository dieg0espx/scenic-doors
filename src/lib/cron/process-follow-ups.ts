import { createServiceClient } from "@/lib/supabase/server";
import { sendFollowUpEmail } from "@/lib/email";

export async function sendPendingFollowUps(origin: string): Promise<{ sent: number; errors: number }> {
  const supabase = createServiceClient();

  // Get all due pending follow-ups
  const { data: pending, error } = await supabase
    .from("follow_up_schedule")
    .select("*")
    .eq("status", "pending")
    .lte("scheduled_for", new Date().toISOString())
    .order("scheduled_for", { ascending: true });

  if (error) throw new Error(error.message);
  if (!pending || pending.length === 0) return { sent: 0, errors: 0 };

  let sent = 0;
  let errors = 0;

  for (const followUp of pending) {
    try {
      // Fetch the related quote
      const { data: quote } = await supabase
        .from("quotes")
        .select("id, client_name, client_email, quote_number, door_type, lead_status, intent_level")
        .eq("id", followUp.quote_id)
        .single();

      if (!quote) {
        await supabase
          .from("follow_up_schedule")
          .update({ status: "cancelled" })
          .eq("id", followUp.id);
        continue;
      }

      // Skip if quote is already converted, closed, or became an order
      if (["converted", "closed", "order"].includes(quote.lead_status)) {
        await supabase
          .from("follow_up_schedule")
          .update({ status: "cancelled" })
          .eq("id", followUp.id);
        continue;
      }

      // Send the follow-up email — full tier links to portal, browse/medium links to contact
      const isFullTier = quote.intent_level === "full" || !quote.intent_level;
      await sendFollowUpEmail({
        clientName: quote.client_name,
        clientEmail: quote.client_email,
        quoteNumber: quote.quote_number,
        doorType: quote.door_type,
        sequenceNumber: followUp.sequence_number,
        quoteUrl: isFullTier ? `${origin}/portal/${quote.id}` : null,
      });

      // Mark as sent
      await supabase
        .from("follow_up_schedule")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", followUp.id);

      // Record in email history
      await supabase.from("email_history").insert({
        quote_id: followUp.quote_id,
        recipient_email: quote.client_email,
        subject: `Follow-up #${followUp.sequence_number} — Quote ${quote.quote_number}`,
        type: "follow_up",
      });

      // After 3rd follow-up sent with no response, mark lead as cold
      if (followUp.sequence_number >= 3) {
        const { data: remaining } = await supabase
          .from("follow_up_schedule")
          .select("id")
          .eq("quote_id", followUp.quote_id)
          .eq("status", "pending");

        if (!remaining || remaining.length === 0) {
          await supabase
            .from("quotes")
            .update({ lead_status: "cold" })
            .eq("id", followUp.quote_id)
            .in("lead_status", ["new", "warm", "hot"]);
        }
      }

      sent++;
    } catch {
      errors++;
    }
  }

  return { sent, errors };
}
