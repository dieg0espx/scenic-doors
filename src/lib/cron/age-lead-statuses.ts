import { createServiceClient } from "@/lib/supabase/server";

/**
 * Automatic lead status aging based on inactivity.
 *
 * Rules (moderate thresholds):
 *   new / hot  → warm      after 3 days of no admin activity
 *   warm       → cold      after 7 days of no admin activity
 *   cold       → archived  after 14 days of no admin activity
 *
 * Excluded: hold, order, converted, closed, archived
 * Any admin activity (note, email, status change, assignment) resets the timer
 * by updating `last_activity_at`.
 */
export async function ageLeadStatuses(): Promise<{ aged: number }> {
  const supabase = createServiceClient();
  const now = new Date();

  // Thresholds in days
  const THRESHOLDS = [
    // Process most-aged first so a quote stuck at "cold" for 14+ days gets archived
    // before we check warm→cold, avoiding double-updates in the same run.
    { fromStatuses: ["cold"], toStatus: "archived", days: 14 },
    { fromStatuses: ["warm"], toStatus: "cold", days: 7 },
    { fromStatuses: ["new", "hot"], toStatus: "warm", days: 3 },
  ];

  let totalAged = 0;

  for (const { fromStatuses, toStatus, days } of THRESHOLDS) {
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

  return { aged: totalAged };
}
