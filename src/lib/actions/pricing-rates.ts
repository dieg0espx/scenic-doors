"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { RATES_PER_SQFT } from "@/lib/quote-wizard/pricing";

export interface PricingRate {
  id: string;
  door_slug: string;
  rate_per_sqft: number;
  updated_at: string;
}

/**
 * Returns the effective rate map: DB overrides merged over hardcoded defaults.
 */
export async function getEffectiveRates(): Promise<Record<string, number>> {
  const defaults = { ...RATES_PER_SQFT };
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("pricing_rates")
      .select("door_slug, rate_per_sqft");
    if (data) {
      for (const row of data) {
        defaults[row.door_slug] = Number(row.rate_per_sqft);
      }
    }
  } catch {
    // Fall back to hardcoded defaults
  }
  return defaults;
}

/**
 * Returns all custom rates from the DB.
 */
export async function getPricingRates(): Promise<PricingRate[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pricing_rates")
    .select("*")
    .order("door_slug");
  if (error) throw new Error(error.message);
  return (data ?? []) as PricingRate[];
}

/**
 * Upsert a rate for a door slug.
 */
export async function upsertPricingRate(doorSlug: string, ratePerSqFt: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("pricing_rates")
    .upsert(
      { door_slug: doorSlug, rate_per_sqft: ratePerSqFt, updated_at: new Date().toISOString() },
      { onConflict: "door_slug" }
    );
  if (error) throw new Error(error.message);
  revalidatePath("/admin/discounts");
  revalidatePath("/");
}

/**
 * Reset a door slug back to its hardcoded default (delete from DB).
 */
export async function resetPricingRate(doorSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("pricing_rates")
    .delete()
    .eq("door_slug", doorSlug);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/discounts");
  revalidatePath("/");
}
