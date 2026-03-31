"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendAppointmentConfirmationEmail, sendInternalNotificationEmail } from "@/lib/email";
import { getNotificationEmailsByType } from "@/lib/actions/notification-settings";

// ── Types ──

export interface ScheduleSetting {
  id: string;
  setting_type: "default" | "override";
  day_of_week: number | null;
  specific_date: string | null;
  is_open: boolean;
  open_time: string;
  close_time: string;
  slot_duration_minutes: number;
}

export interface Appointment {
  id: string;
  quote_id: string | null;
  lead_id: string | null;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  scheduled_at: string;
  duration_minutes: number;
  status: "scheduled" | "completed" | "cancelled" | "no_show" | "rescheduled";
  notes: string | null;
  booked_by: "client" | "admin";
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  time: string;     // "08:00"
  datetime: string; // ISO string
}

// ── Schedule Settings ──

export async function getScheduleSettings(): Promise<ScheduleSetting[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schedule_settings")
    .select("*")
    .order("setting_type")
    .order("day_of_week")
    .order("specific_date");

  if (error) {
    if (error.message.includes("schema cache")) return [];
    throw new Error(error.message);
  }
  return data ?? [];
}

export async function upsertDefaultSchedule(
  dayOfWeek: number,
  updates: { is_open: boolean; open_time: string; close_time: string }
) {
  const supabase = await createClient();

  // Check if row exists
  const { data: existing } = await supabase
    .from("schedule_settings")
    .select("id")
    .eq("setting_type", "default")
    .eq("day_of_week", dayOfWeek)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("schedule_settings")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("schedule_settings")
      .insert({ setting_type: "default", day_of_week: dayOfWeek, ...updates });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/calendar");
}

export async function upsertOverrideSchedule(
  date: string,
  updates: { is_open: boolean; open_time: string; close_time: string }
) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("schedule_settings")
    .select("id")
    .eq("setting_type", "override")
    .eq("specific_date", date)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("schedule_settings")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("schedule_settings")
      .insert({ setting_type: "override", specific_date: date, ...updates });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/calendar");
}

export async function deleteOverride(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("schedule_settings")
    .delete()
    .eq("id", id)
    .eq("setting_type", "override");

  if (error) throw new Error(error.message);
  revalidatePath("/admin/calendar");
}

// ── Available Slots ──

export async function getAvailableSlots(dateStr: string): Promise<TimeSlot[]> {
  const supabase = await createServiceClient();

  const requestedDate = new Date(dateStr + "T00:00:00");
  const dayOfWeek = requestedDate.getDay(); // 0=Sun..6=Sat

  // 1. Get schedule for this date (override takes priority)
  const { data: overrideSetting } = await supabase
    .from("schedule_settings")
    .select("*")
    .eq("setting_type", "override")
    .eq("specific_date", dateStr)
    .maybeSingle();

  let setting: ScheduleSetting | null = overrideSetting;

  if (!setting) {
    const { data: defaultSetting } = await supabase
      .from("schedule_settings")
      .select("*")
      .eq("setting_type", "default")
      .eq("day_of_week", dayOfWeek)
      .maybeSingle();
    setting = defaultSetting;
  }

  // No setting or closed
  if (!setting || !setting.is_open) return [];

  // 2. Generate all possible slots
  const [openH, openM] = setting.open_time.split(":").map(Number);
  const [closeH, closeM] = setting.close_time.split(":").map(Number);
  const interval = setting.slot_duration_minutes || 15;

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  // Determine EST (-05:00) vs EDT (-04:00) for the requested date
  function getEasternOffset(date: string, hour: number): string {
    const tempDate = new Date(`${date}T${String(hour).padStart(2, "0")}:00:00Z`);
    const eastern = tempDate.toLocaleString("en-US", { timeZone: "America/New_York", hour12: false, hour: "2-digit" });
    const utcHour = tempDate.getUTCHours();
    const etHour = parseInt(eastern);
    let diff = etHour - utcHour;
    if (diff > 12) diff -= 24;
    if (diff < -12) diff += 24;
    const absDiff = Math.abs(diff);
    const sign = diff >= 0 ? "+" : "-";
    return `${sign}${String(absDiff).padStart(2, "0")}:00`;
  }

  const allSlots: TimeSlot[] = [];
  for (let m = openMinutes; m + interval <= closeMinutes; m += interval) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    const time = `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
    const offset = getEasternOffset(dateStr, h);
    const datetime = `${dateStr}T${time}:00${offset}`;
    allSlots.push({ time, datetime });
  }

  // 3. Get booked appointments for this date
  const dayStart = new Date(requestedDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(requestedDate);
  dayEnd.setHours(23, 59, 59, 999);

  const { data: booked } = await supabase
    .from("appointments")
    .select("scheduled_at, duration_minutes")
    .gte("scheduled_at", dayStart.toISOString())
    .lte("scheduled_at", dayEnd.toISOString())
    .eq("status", "scheduled");

  const bookedTimes = new Set(
    (booked ?? []).map((a) => {
      const d = new Date(a.scheduled_at);
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    })
  );

  // 4. Filter out booked and past slots
  const now = new Date();
  return allSlots.filter((slot) => {
    if (bookedTimes.has(slot.time)) return false;
    // If today, filter out past slots (with 5 min buffer)
    const slotDate = new Date(slot.datetime);
    if (slotDate.getTime() < now.getTime() + 5 * 60 * 1000) return false;
    return true;
  });
}

// ── Appointments CRUD ──

export async function createAppointment(data: {
  quote_id?: string | null;
  lead_id?: string | null;
  client_name: string;
  client_email?: string | null;
  client_phone?: string | null;
  scheduled_at: string;
  notes?: string | null;
  booked_by?: "client" | "admin";
  created_by?: string | null;
}) {
  const supabase = await createServiceClient();

  const { data: appointment, error } = await supabase
    .from("appointments")
    .insert({
      quote_id: data.quote_id || null,
      lead_id: data.lead_id || null,
      client_name: data.client_name,
      client_email: data.client_email || null,
      client_phone: data.client_phone || null,
      scheduled_at: data.scheduled_at,
      duration_minutes: 15,
      notes: data.notes || null,
      booked_by: data.booked_by || "client",
      created_by: data.created_by || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Send confirmation email to client
  if (data.client_email) {
    const portalUrl = data.quote_id
      ? `${process.env.NEXT_PUBLIC_SITE_URL || "https://scenicdoors.co"}/portal/${data.quote_id}?tab=appointment`
      : undefined;

    sendAppointmentConfirmationEmail({
      clientName: data.client_name,
      clientEmail: data.client_email,
      scheduledAt: data.scheduled_at,
      durationMinutes: 15,
      portalUrl,
    }).catch(() => {
      // Don't block on email failure
    });
  }

  // Send internal notification to admins
  try {
    const emails = await getNotificationEmailsByType("appointment_booked");
    if (emails.length > 0) {
      const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://scenicdoors.co";
      const scheduledDate = new Date(data.scheduled_at);
      const formattedDate = scheduledDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "America/New_York",
      });
      const formattedTime = scheduledDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/New_York",
      });

      await sendInternalNotificationEmail(
        {
          heading: "New Appointment Booked",
          headingColor: "#0891b2",
          headingBg: "#ecfeff",
          headingBorder: "#cffafe",
          message: `A new appointment has been booked${data.booked_by === "admin" ? " by an admin" : " by a client"}.`,
          details: [
            { label: "Client", value: data.client_name },
            ...(data.client_email ? [{ label: "Email", value: data.client_email }] : []),
            ...(data.client_phone ? [{ label: "Phone", value: data.client_phone }] : []),
            { label: "Date", value: formattedDate },
            { label: "Time", value: `${formattedTime} EST` },
            ...(data.quote_id ? [{ label: "Quote", value: "Linked to quote" }] : []),
          ],
          adminUrl: `${origin}/admin/calendar`,
          ctaLabel: "View Calendar",
        },
        emails
      );
    }
  } catch (err) {
    console.error("[Appointment notification error]", err);
  }

  revalidatePath("/admin/calendar");
  revalidatePath("/admin/leads");
  revalidatePath("/admin/quotes");

  return appointment as Appointment;
}

export async function getAppointmentsByDateRange(
  start: string,
  end: string
): Promise<Appointment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .gte("scheduled_at", start)
    .lte("scheduled_at", end)
    .neq("status", "rescheduled")
    .order("scheduled_at", { ascending: true });

  if (error) {
    if (error.message.includes("schema cache")) return [];
    throw new Error(error.message);
  }
  return data ?? [];
}

export async function getAppointmentByQuoteId(quoteId: string): Promise<Appointment | null> {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("quote_id", quoteId)
    .eq("status", "scheduled")
    .order("scheduled_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return null;
  return data;
}

export async function getAppointmentByLeadId(leadId: string): Promise<Appointment | null> {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("lead_id", leadId)
    .eq("status", "scheduled")
    .order("scheduled_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return null;
  return data;
}

export async function updateAppointment(
  id: string,
  updates: {
    scheduled_at?: string;
    status?: string;
    notes?: string;
    client_name?: string;
    client_email?: string;
    client_phone?: string;
  }
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("appointments")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/calendar");
  revalidatePath("/admin/leads");
  revalidatePath("/admin/quotes");
}

export async function cancelAppointment(id: string) {
  const supabase = await createServiceClient();
  const { error } = await supabase
    .from("appointments")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/calendar");
  revalidatePath("/admin/leads");
  revalidatePath("/admin/quotes");
}

export async function rescheduleAppointment(
  oldAppointmentId: string,
  newData: {
    quote_id?: string | null;
    lead_id?: string | null;
    client_name: string;
    client_email?: string | null;
    client_phone?: string | null;
    scheduled_at: string;
    notes?: string | null;
    booked_by?: "client" | "admin";
    created_by?: string | null;
  }
) {
  // Mark old appointment as rescheduled FIRST to free the slot
  const supabase = await createServiceClient();
  const { error: cancelError } = await supabase
    .from("appointments")
    .update({ status: "rescheduled", updated_at: new Date().toISOString() })
    .eq("id", oldAppointmentId);

  if (cancelError) throw new Error(cancelError.message);

  // Now create the new appointment (slot is free)
  return createAppointment(newData);
}
