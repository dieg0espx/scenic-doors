import { createServiceClient } from "@/lib/supabase/server";

/**
 * Automatic status aging based on inactivity for both quotes and leads.
 *
 * Quote aging rules:
 *   new / hot  → warm      after 3 days of no admin activity
 *   warm       → cold      after 7 days of no admin activity
 *   cold       → archived  after 14 days of no admin activity
 *
 * Lead aging rules (temperature column only):
 *   hot  → warm   after 3 days of no admin activity
 *   warm → cold   after 7 days of no admin activity
 *   (no cold → archived for leads)
 *
 * workflow_status is independent and never touched by cron.
 * Any admin activity (note, status change, sharing) resets the timer
 * by updating `last_activity_at`.
 */
export async function ageLeadStatuses(): Promise<{ aged: number }> {
  const supabase = createServiceClient();
  const now = new Date();

  let totalAged = 0;

  // ── Quote aging ──────────────────────────────────────
  const QUOTE_THRESHOLDS = [
    { fromStatuses: ["cold"], toStatus: "archived", days: 14 },
    { fromStatuses: ["warm"], toStatus: "cold", days: 7 },
    { fromStatuses: ["new", "hot"], toStatus: "warm", days: 3 },
  ];

  for (const { fromStatuses, toStatus, days } of QUOTE_THRESHOLDS) {
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("quotes")
      .update({ lead_status: toStatus })
      .in("lead_status", fromStatuses)
      .lt("last_activity_at", cutoff)
      .select("id");

    if (!error && data) {
      totalAged += data.length;
    }
  }

  // ── Lead aging (temperature only) ────────────────────
  const LEAD_THRESHOLDS = [
    { fromStatuses: ["warm"], toStatus: "cold", days: 7 },
    { fromStatuses: ["hot"], toStatus: "warm", days: 3 },
  ];

  for (const { fromStatuses, toStatus, days } of LEAD_THRESHOLDS) {
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("leads")
      .update({ status: toStatus })
      .in("status", fromStatuses)
      .lt("last_activity_at", cutoff)
      .select("id");

    if (!error && data) {
      totalAged += data.length;
    }
  }

  return { aged: totalAged };
}
