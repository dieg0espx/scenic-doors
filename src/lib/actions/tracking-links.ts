"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface TrackingLink {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export async function getTrackingLinks(): Promise<TrackingLink[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tracking_links")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    if (error.message.includes("schema cache")) return [];
    throw new Error(error.message);
  }
  return data ?? [];
}

export async function createTrackingLink(name: string, slug: string) {
  const supabase = await createClient();

  // Normalize slug: lowercase, replace spaces with hyphens, strip non-alphanumeric
  const normalizedSlug = slug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "");

  if (!normalizedSlug) throw new Error("Slug cannot be empty");
  if (!name.trim()) throw new Error("Name cannot be empty");

  const { data, error } = await supabase
    .from("tracking_links")
    .insert({ name: name.trim(), slug: normalizedSlug })
    .select()
    .single();

  if (error) {
    if (error.message.includes("duplicate")) throw new Error("A tracking link with that identifier already exists");
    throw new Error(error.message);
  }

  revalidatePath("/admin/marketing");
  return data as TrackingLink;
}

export async function deleteTrackingLink(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tracking_links")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/marketing");
}
