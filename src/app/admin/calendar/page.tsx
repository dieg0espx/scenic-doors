import { getScheduleSettings, getAppointmentsByDateRange } from "@/lib/actions/appointments";
import { getCurrentAdminUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import CalendarPageClient from "./CalendarPageClient";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const currentUser = await getCurrentAdminUser();
  if (!currentUser) redirect("/login");

  // Load default week of data (current week)
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const [scheduleSettings, appointments] = await Promise.all([
    getScheduleSettings(),
    getAppointmentsByDateRange(startOfWeek.toISOString(), endOfWeek.toISOString()),
  ]);

  return (
    <CalendarPageClient
      initialSettings={scheduleSettings}
      initialAppointments={appointments}
      currentUserId={currentUser.id}
    />
  );
}
