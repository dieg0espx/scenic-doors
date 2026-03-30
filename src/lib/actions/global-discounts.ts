"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface GlobalDiscount {
  id: string;
  name: string;
  percentage: number;
  door_types: string[] | null;
  start_date: string;
  end_date: string;
  active: boolean;
  created_at: string;
}

export async function getGlobalDiscounts(): Promise<GlobalDiscount[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("global_discounts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as GlobalDiscount[];
}

export async function getActiveDiscounts(): Promise<GlobalDiscount[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("global_discounts")
    .select("*")
    .eq("active", true)
    .lte("start_date", today)
    .gte("end_date", today);
  if (error) throw new Error(error.message);
  return (data ?? []) as GlobalDiscount[];
}

export async function createGlobalDiscount(form: {
  name: string;
  percentage: number;
  door_types: string[] | null;
  start_date: string;
  end_date: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("global_discounts").insert({
    name: form.name,
    percentage: form.percentage,
    door_types: form.door_types,
    start_date: form.start_date,
    end_date: form.end_date,
    active: true,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/discounts");
  revalidatePath("/");
}

export async function updateGlobalDiscount(
  id: string,
  form: {
    name?: string;
    percentage?: number;
    door_types?: string[] | null;
    start_date?: string;
    end_date?: string;
    active?: boolean;
  }
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("global_discounts")
    .update(form)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/discounts");
  revalidatePath("/");
}

export async function deleteGlobalDiscount(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("global_discounts")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/discounts");
  revalidatePath("/");
}
