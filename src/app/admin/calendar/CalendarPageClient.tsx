"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Settings,
  X,
  User,
  Mail,
  Phone,
  FileText,
  Eye,
  Pencil,
  Trash2,
  Check,
  Loader2,
  AlertCircle,
  LayoutGrid,
  Columns3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ScheduleSetting, Appointment } from "@/lib/actions/appointments";
import {
  getAppointmentsByDateRange,
  getScheduleSettings,
  upsertDefaultSchedule,
  upsertOverrideSchedule,
  deleteOverride,
  updateAppointment,
  cancelAppointment,
  rescheduleAppointment,
} from "@/lib/actions/appointments";
import AppointmentScheduler from "@/components/AppointmentScheduler";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatTime12(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });
}

function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function getMonthCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const startPad = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

type ViewMode = "week" | "month";

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  scheduled: { bg: "bg-blue-400/10", text: "text-blue-400", label: "Scheduled" },
  completed: { bg: "bg-green-400/10", text: "text-green-400", label: "Completed" },
  cancelled: { bg: "bg-red-400/10", text: "text-red-400", label: "Cancelled" },
  no_show: { bg: "bg-amber-400/10", text: "text-amber-400", label: "No Show" },
  rescheduled: { bg: "bg-violet-400/10", text: "text-violet-400", label: "Rescheduled" },
};

interface CalendarPageClientProps {
  initialSettings: ScheduleSetting[];
  initialAppointments: Appointment[];
  currentUserId: string;
}

export default function CalendarPageClient({
  initialSettings,
  initialAppointments,
  currentUserId,
}: CalendarPageClientProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [weekStart, setWeekStart] = useState(() => getWeekStart(today));
  const [monthDate, setMonthDate] = useState(() => getMonthStart(today));
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [settings, setSettings] = useState<ScheduleSetting[]>(initialSettings);
  const [loading, setLoading] = useState(false);

  // Modals
  const [showSettings, setShowSettings] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showReschedule, setShowReschedule] = useState(false);

  const weekDays = getWeekDays(weekStart);

  const loadData = useCallback(async (start: Date, end: Date) => {
    setLoading(true);
    try {
      const [appts, setts] = await Promise.all([
        getAppointmentsByDateRange(start.toISOString(), end.toISOString()),
        getScheduleSettings(),
      ]);
      setAppointments(appts);
      setSettings(setts);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  function loadWeekData(ws: Date) {
    const end = new Date(ws);
    end.setDate(ws.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    loadData(ws, end);
  }

  function loadMonthData(md: Date) {
    loadData(getMonthStart(md), getMonthEnd(md));
  }

  function prevPeriod() {
    if (viewMode === "week") {
      const ws = new Date(weekStart);
      ws.setDate(ws.getDate() - 7);
      setWeekStart(ws);
      loadWeekData(ws);
    } else {
      const md = new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1);
      setMonthDate(md);
      loadMonthData(md);
    }
  }

  function nextPeriod() {
    if (viewMode === "week") {
      const ws = new Date(weekStart);
      ws.setDate(ws.getDate() + 7);
      setWeekStart(ws);
      loadWeekData(ws);
    } else {
      const md = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1);
      setMonthDate(md);
      loadMonthData(md);
    }
  }

  function goToday() {
    if (viewMode === "week") {
      const ws = getWeekStart(today);
      setWeekStart(ws);
      loadWeekData(ws);
    } else {
      const md = getMonthStart(today);
      setMonthDate(md);
      loadMonthData(md);
    }
  }

  function switchView(mode: ViewMode) {
    setViewMode(mode);
    if (mode === "month") {
      loadMonthData(monthDate);
    } else {
      loadWeekData(weekStart);
    }
  }

  function getAppointmentsForDay(date: Date): Appointment[] {
    const dateStr = getDateStr(date);
    return appointments.filter((a) => {
      const d = new Date(a.scheduled_at);
      return getDateStr(d) === dateStr && a.status !== "cancelled" && a.status !== "rescheduled";
    });
  }

  function getDaySchedule(date: Date): { isOpen: boolean; openTime: string; closeTime: string } | null {
    const dateStr = getDateStr(date);
    const override = settings.find(
      (s) => s.setting_type === "override" && s.specific_date === dateStr
    );
    if (override) return { isOpen: override.is_open, openTime: override.open_time, closeTime: override.close_time };

    const dayOfWeek = date.getDay();
    const def = settings.find(
      (s) => s.setting_type === "default" && s.day_of_week === dayOfWeek
    );
    if (def) return { isOpen: def.is_open, openTime: def.open_time, closeTime: def.close_time };

    return null;
  }

  async function handleCancelAppointment(id: string) {
    try {
      await cancelAppointment(id);
      setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: "cancelled" } : a));
      setSelectedAppointment(null);
    } catch {
      // silent
    }
  }

  async function handleStatusChange(id: string, status: string) {
    try {
      await updateAppointment(id, { status });
      setAppointments((prev) =>
        prev.map((a) => a.id === id ? { ...a, status: status as Appointment["status"] } : a)
      );
      if (selectedAppointment?.id === id) {
        setSelectedAppointment({ ...selectedAppointment, status: status as Appointment["status"] });
      }
    } catch {
      // silent
    }
  }

  // Count stats — only "scheduled" are active; "rescheduled" means the old one was replaced
  const activeAppts = appointments.filter((a) => a.status === "scheduled");
  const todayAppts = appointments.filter((a) => {
    const d = new Date(a.scheduled_at);
    return getDateStr(d) === getDateStr(today) && a.status === "scheduled";
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Calendar</h1>
          <p className="text-white/40 text-sm mt-1">Manage appointments and schedule settings</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="inline-flex items-center gap-2 p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.1] text-sm font-medium transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Schedule Settings</span>
          </button>
          <button
            onClick={() => setShowBooking(true)}
            className="inline-flex items-center gap-2 p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/20 text-amber-400 hover:bg-amber-500/25 text-sm font-medium transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 sm:p-4">
          <p className="text-white/40 text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1 truncate">{viewMode === "week" ? "This Week" : "This Month"}</p>
          <p className="text-xl sm:text-2xl font-bold text-white">{activeAppts.length}</p>
          <p className="text-white/30 text-[10px] sm:text-xs hidden sm:block">appointments</p>
        </div>
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 sm:p-4">
          <p className="text-white/40 text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1">Today</p>
          <p className="text-xl sm:text-2xl font-bold text-amber-400">{todayAppts.length}</p>
          <p className="text-white/30 text-[10px] sm:text-xs hidden sm:block">upcoming</p>
        </div>
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 sm:p-4">
          <p className="text-white/40 text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1">Cancelled</p>
          <p className="text-xl sm:text-2xl font-bold text-red-400">{appointments.filter((a) => a.status === "cancelled").length}</p>
          <p className="text-white/30 text-[10px] sm:text-xs hidden sm:block">{viewMode === "week" ? "this week" : "this month"}</p>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="flex items-center justify-between bg-white/[0.04] border border-white/[0.06] rounded-xl px-2 sm:px-4 py-3">
        <button onClick={prevPeriod} className="p-2 sm:p-1.5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors shrink-0">
          <ChevronLeft className="w-5 h-5 text-white/60" />
        </button>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <h2 className="text-xs sm:text-sm font-semibold text-white truncate">
            {viewMode === "week" ? (
              <>
                <span className="sm:hidden">
                  {weekDays[0].getMonth() + 1}/{weekDays[0].getDate()} – {weekDays[6].getMonth() + 1}/{weekDays[6].getDate()}
                </span>
                <span className="hidden sm:inline">
                  {MONTH_NAMES[weekDays[0].getMonth()]} {weekDays[0].getDate()} – {MONTH_NAMES[weekDays[6].getMonth()]} {weekDays[6].getDate()}, {weekDays[6].getFullYear()}
                </span>
              </>
            ) : (
              <>{MONTH_NAMES[monthDate.getMonth()]} {monthDate.getFullYear()}</>
            )}
          </h2>
          <button onClick={goToday} className="text-xs text-amber-400 hover:text-amber-300 font-medium cursor-pointer shrink-0">
            Today
          </button>
          {loading && <Loader2 className="w-4 h-4 text-white/30 animate-spin shrink-0" />}
          {/* View toggle */}
          <div className="hidden sm:flex items-center bg-white/[0.06] rounded-lg p-0.5 ml-1">
            <button
              onClick={() => switchView("week")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "week" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
              }`}
            >
              <Columns3 className="w-3 h-3" />
              Week
            </button>
            <button
              onClick={() => switchView("month")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "month" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
              }`}
            >
              <LayoutGrid className="w-3 h-3" />
              Month
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* Mobile view toggle */}
          <button
            onClick={() => switchView(viewMode === "week" ? "month" : "week")}
            className="sm:hidden p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors shrink-0"
            title={viewMode === "week" ? "Switch to month" : "Switch to week"}
          >
            {viewMode === "week" ? <LayoutGrid className="w-5 h-5 text-white/60" /> : <Columns3 className="w-5 h-5 text-white/60" />}
          </button>
          <button onClick={nextPeriod} className="p-2 sm:p-1.5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors shrink-0">
            <ChevronRight className="w-5 h-5 text-white/60" />
          </button>
        </div>
      </div>

      {/* Week grid */}
      {viewMode === "week" && (
        <div className="md:grid md:grid-cols-7 md:gap-3 flex md:flex-none overflow-x-auto gap-2 pb-2 md:pb-0 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
          {weekDays.map((day) => {
            const schedule = getDaySchedule(day);
            const dayAppts = getAppointmentsForDay(day);
            const isToday = getDateStr(day) === getDateStr(today);
            const isClosed = schedule && !schedule.isOpen;

            return (
              <div
                key={getDateStr(day)}
                className={`rounded-xl border transition-colors snap-start shrink-0 w-[140px] md:w-auto ${
                  isToday
                    ? "bg-amber-500/[0.06] border-amber-500/20"
                    : isClosed
                      ? "bg-white/[0.02] border-white/[0.04] opacity-50"
                      : "bg-white/[0.04] border-white/[0.06]"
                }`}
              >
                <div className={`px-3 py-2 border-b ${isToday ? "border-amber-500/15" : "border-white/[0.06]"}`}>
                  <div className="flex items-center justify-between md:block">
                    <div className="flex items-baseline gap-2 md:block">
                      <p className={`text-xs font-medium ${isToday ? "text-amber-400" : "text-white/40"}`}>
                        {DAY_SHORT[day.getDay()]}
                      </p>
                      <p className={`text-lg font-bold ${isToday ? "text-amber-400" : "text-white/80"}`}>
                        {day.getDate()}
                      </p>
                    </div>
                    {dayAppts.length > 0 && (
                      <span className="md:hidden inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-400/15 text-blue-400 text-[10px] font-bold">
                        {dayAppts.length}
                      </span>
                    )}
                  </div>
                  {schedule && (
                    <p className="text-[10px] text-white/25">
                      {schedule.isOpen ? `${formatTime12(schedule.openTime)} – ${formatTime12(schedule.closeTime)}` : "Closed"}
                    </p>
                  )}
                </div>

                <div className="p-1.5 sm:p-2 space-y-1 sm:space-y-1.5 min-h-[80px]">
                  {dayAppts.length === 0 && (
                    <p className="text-[10px] text-white/20 text-center py-3">No appts</p>
                  )}
                  {dayAppts.map((appt) => {
                    const aTime = new Date(appt.scheduled_at);
                    const aSc = STATUS_CONFIG[appt.status] || STATUS_CONFIG.scheduled;
                    return (
                      <button
                        key={appt.id}
                        onClick={() => setSelectedAppointment(appt)}
                        className={`w-full text-left px-2 py-2 sm:py-1.5 rounded-lg ${aSc.bg} hover:opacity-80 active:scale-[0.97] transition-all cursor-pointer`}
                      >
                        <p className={`text-[10px] font-semibold ${aSc.text}`}>
                          {aTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                        </p>
                        <p className="text-[11px] text-white/70 truncate">{appt.client_name}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Month grid */}
      {viewMode === "month" && (
        <div>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-px mb-px">
            {DAY_SHORT.map((d) => (
              <div key={d} className="text-center text-[10px] sm:text-xs font-medium text-white/30 py-2">
                <span className="sm:hidden">{d[0]}</span>
                <span className="hidden sm:inline">{d}</span>
              </div>
            ))}
          </div>
          {/* Day cells */}
          <div className="grid grid-cols-7 gap-px bg-white/[0.03] rounded-xl overflow-hidden border border-white/[0.06]">
            {getMonthCalendarDays(monthDate.getFullYear(), monthDate.getMonth()).map((day, i) => {
              if (!day) {
                return <div key={`pad-${i}`} className="bg-[#0a0f1a] min-h-[48px] sm:min-h-[90px]" />;
              }
              const dayAppts = getAppointmentsForDay(day);
              const isToday = getDateStr(day) === getDateStr(today);
              const schedule = getDaySchedule(day);
              const isClosed = schedule && !schedule.isOpen;
              const hasAppts = dayAppts.length > 0;

              return (
                <div
                  key={getDateStr(day)}
                  className={`min-h-[48px] sm:min-h-[90px] p-1 sm:p-1.5 transition-colors ${
                    isToday
                      ? "bg-amber-500/[0.06]"
                      : isClosed
                        ? "bg-[#0a0f1a] opacity-40"
                        : "bg-[#0d1220]"
                  }`}
                >
                  <div className="flex items-center justify-between sm:block">
                    <p className={`text-[11px] sm:text-xs font-semibold mb-0 sm:mb-1 ${
                      isToday ? "text-amber-400" : "text-white/50"
                    }`}>
                      {day.getDate()}
                    </p>
                    {/* Mobile: dot indicators */}
                    {hasAppts && (
                      <div className="flex gap-0.5 sm:hidden">
                        {dayAppts.slice(0, 3).map((appt) => (
                          <span key={appt.id} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        ))}
                        {dayAppts.length > 3 && <span className="w-1.5 h-1.5 rounded-full bg-white/20" />}
                      </div>
                    )}
                  </div>
                  {/* Mobile: tap entire cell to see first appointment */}
                  {hasAppts && (
                    <button
                      onClick={() => setSelectedAppointment(dayAppts[0])}
                      className="sm:hidden w-full mt-0.5 text-center cursor-pointer"
                    >
                      <p className="text-[9px] text-blue-400 font-medium truncate">{dayAppts.length} appt{dayAppts.length > 1 ? "s" : ""}</p>
                    </button>
                  )}
                  {/* Desktop: individual appointment pills */}
                  <div className="hidden sm:block space-y-0.5">
                    {dayAppts.slice(0, 3).map((appt) => {
                      const aTime = new Date(appt.scheduled_at);
                      const aSc = STATUS_CONFIG[appt.status] || STATUS_CONFIG.scheduled;
                      return (
                        <button
                          key={appt.id}
                          onClick={() => setSelectedAppointment(appt)}
                          className={`w-full text-left px-1.5 py-1 rounded-md ${aSc.bg} hover:opacity-80 active:scale-[0.97] transition-all cursor-pointer`}
                        >
                          <p className={`text-[10px] font-semibold ${aSc.text} truncate`}>
                            {aTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                            {" "}{appt.client_name}
                          </p>
                        </button>
                      );
                    })}
                    {dayAppts.length > 3 && (
                      <p className="text-[10px] text-white/30 text-center cursor-default">+{dayAppts.length - 3} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Appointment Detail Modal */}
      <AnimatePresence>
        {selectedAppointment && !showReschedule && (
          <AppointmentDetailModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
            onCancel={handleCancelAppointment}
            onStatusChange={handleStatusChange}
            onReschedule={() => setShowReschedule(true)}
          />
        )}
      </AnimatePresence>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {showReschedule && selectedAppointment && (
          <ModalOverlay onClose={() => setShowReschedule(false)}>
            <div className="bg-[#0f1629] border border-white/10 rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-bold text-white">Reschedule</h3>
                <button onClick={() => setShowReschedule(false)} className="p-1.5 text-white/40 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-white/50 mb-4">
                Rescheduling for <span className="text-white/80 font-medium">{selectedAppointment.client_name}</span>
              </p>
              <div className="bg-ocean-50 rounded-xl p-3 sm:p-4">
                <AppointmentScheduler
                  quoteId={selectedAppointment.quote_id}
                  leadId={selectedAppointment.lead_id}
                  clientName={selectedAppointment.client_name}
                  clientEmail={selectedAppointment.client_email}
                  clientPhone={selectedAppointment.client_phone}
                  bookedBy="admin"
                  createdBy={currentUserId}
                  rescheduleFromId={selectedAppointment.id}
                  onBooked={() => {
                    setShowReschedule(false);
                    setSelectedAppointment(null);
                    viewMode === "week" ? loadWeekData(weekStart) : loadMonthData(monthDate);
                  }}
                  onCancel={() => setShowReschedule(false)}
                />
              </div>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Book New Appointment Modal */}
      <AnimatePresence>
        {showBooking && (
          <ModalOverlay onClose={() => setShowBooking(false)}>
            <div className="bg-[#0f1629] border border-white/10 rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-bold text-white">Book Appointment</h3>
                <button onClick={() => setShowBooking(false)} className="p-1.5 text-white/40 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-ocean-50 rounded-xl p-3 sm:p-4">
                <AppointmentScheduler
                  clientName=""
                  bookedBy="admin"
                  createdBy={currentUserId}
                  showClientFields
                  onBooked={() => {
                    setShowBooking(false);
                    viewMode === "week" ? loadWeekData(weekStart) : loadMonthData(monthDate);
                  }}
                  onCancel={() => setShowBooking(false)}
                />
              </div>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Schedule Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <ScheduleSettingsModal
            settings={settings}
            onClose={() => {
              setShowSettings(false);
              viewMode === "week" ? loadWeekData(weekStart) : loadMonthData(monthDate);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Appointment Detail Modal ── */

function AppointmentDetailModal({
  appointment,
  onClose,
  onCancel,
  onStatusChange,
  onReschedule,
}: {
  appointment: Appointment;
  onClose: () => void;
  onCancel: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onReschedule: () => void;
}) {
  const time = new Date(appointment.scheduled_at);
  const sc = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.scheduled;
  const isActive = appointment.status === "scheduled" || appointment.status === "rescheduled";

  return (
    <ModalOverlay onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="bg-[#0f1629] border-t sm:border border-white/10 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[92vh] sm:max-h-[85vh] overflow-y-auto"
      >
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/15" />
        </div>

        {/* Date hero card */}
        <div className="px-5 sm:px-6 pt-3 sm:pt-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sc.text.replace("text-", "bg-")}`} />
              {sc.label}
            </span>
            <button onClick={onClose} className="p-2 -mr-2 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] cursor-pointer transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/[0.06] flex flex-col items-center justify-center shrink-0">
              <span className="text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                {time.toLocaleDateString("en-US", { month: "short" })}
              </span>
              <span className="text-white font-bold text-2xl leading-none">
                {time.getDate()}
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-white truncate">{appointment.client_name}</h3>
              <p className="text-white/50 text-sm">
                {time.toLocaleDateString("en-US", { weekday: "long" })}
              </p>
              <p className="text-blue-400 font-semibold text-base">
                {time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/New_York" })}
                <span className="text-white/30 font-normal text-xs ml-1.5">{appointment.duration_minutes} min · EST</span>
              </p>
            </div>
          </div>
        </div>

        {/* Contact & details */}
        <div className="px-5 sm:px-6 pb-4">
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] divide-y divide-white/[0.06]">
            {appointment.client_email && (
              <a href={`mailto:${appointment.client_email}`} className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.02] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider">Email</p>
                  <p className="text-sm text-white/70 truncate">{appointment.client_email}</p>
                </div>
              </a>
            )}
            {appointment.client_phone && (
              <a href={`tel:${appointment.client_phone}`} className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.02] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider">Phone</p>
                  <p className="text-sm text-white/70">{appointment.client_phone}</p>
                </div>
              </a>
            )}
            {appointment.quote_id && (
              <a href={`/admin/quotes/${appointment.quote_id}`} className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.02] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-violet-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider">Quote</p>
                  <p className="text-sm text-violet-400">View linked quote</p>
                </div>
              </a>
            )}
          </div>

          {appointment.notes && (
            <div className="mt-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
              <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider mb-1">Notes</p>
              <p className="text-sm text-white/50 leading-relaxed">{appointment.notes}</p>
            </div>
          )}

          <p className="text-[11px] text-white/20 mt-3 px-1">
            Booked by {appointment.booked_by} &middot; {new Date(appointment.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>

        {/* Actions */}
        {isActive && (
          <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1">
            <div className="h-px bg-white/[0.06] mb-4" />
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onStatusChange(appointment.id, "completed")}
                className="inline-flex items-center justify-center gap-2 px-3 py-3 sm:py-2.5 rounded-xl bg-green-500/10 border border-green-500/15 text-green-400 text-sm font-medium hover:bg-green-500/20 active:scale-[0.97] cursor-pointer transition-all"
              >
                <Check className="w-4 h-4" />
                Completed
              </button>
              <button
                onClick={() => onStatusChange(appointment.id, "no_show")}
                className="inline-flex items-center justify-center gap-2 px-3 py-3 sm:py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/15 text-amber-400 text-sm font-medium hover:bg-amber-500/20 active:scale-[0.97] cursor-pointer transition-all"
              >
                <AlertCircle className="w-4 h-4" />
                No Show
              </button>
              <button
                onClick={onReschedule}
                className="inline-flex items-center justify-center gap-2 px-3 py-3 sm:py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/15 text-violet-400 text-sm font-medium hover:bg-violet-500/20 active:scale-[0.97] cursor-pointer transition-all"
              >
                <Pencil className="w-4 h-4" />
                Reschedule
              </button>
              <button
                onClick={() => onCancel(appointment.id)}
                className="inline-flex items-center justify-center gap-2 px-3 py-3 sm:py-2.5 rounded-xl bg-red-500/10 border border-red-500/15 text-red-400 text-sm font-medium hover:bg-red-500/20 active:scale-[0.97] cursor-pointer transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </ModalOverlay>
  );
}

/* ── Schedule Settings Modal ── */

function ScheduleSettingsModal({
  settings: initialSettings,
  onClose,
}: {
  settings: ScheduleSetting[];
  onClose: () => void;
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState<number | string | null>(null);
  const [overrideDate, setOverrideDate] = useState("");
  const [overrideOpen, setOverrideOpen] = useState(true);
  const [overrideStart, setOverrideStart] = useState("08:00");
  const [overrideEnd, setOverrideEnd] = useState("18:00");
  const [addingOverride, setAddingOverride] = useState(false);

  const defaults = settings.filter((s) => s.setting_type === "default").sort((a, b) => (a.day_of_week ?? 0) - (b.day_of_week ?? 0));
  const overrides = settings.filter((s) => s.setting_type === "override").sort((a, b) => (a.specific_date || "").localeCompare(b.specific_date || ""));

  async function saveDefault(dayOfWeek: number, updates: { is_open: boolean; open_time: string; close_time: string }) {
    setSaving(dayOfWeek);
    try {
      await upsertDefaultSchedule(dayOfWeek, updates);
      const fresh = await getScheduleSettings();
      setSettings(fresh);
    } catch {
      // silent
    } finally {
      setSaving(null);
    }
  }

  async function addOverride() {
    if (!overrideDate) return;
    setAddingOverride(true);
    try {
      await upsertOverrideSchedule(overrideDate, {
        is_open: overrideOpen,
        open_time: overrideStart,
        close_time: overrideEnd,
      });
      const fresh = await getScheduleSettings();
      setSettings(fresh);
      setOverrideDate("");
    } catch {
      // silent
    } finally {
      setAddingOverride(false);
    }
  }

  async function removeOverride(id: string) {
    setSaving(id);
    try {
      await deleteOverride(id);
      setSettings((prev) => prev.filter((s) => s.id !== id));
    } catch {
      // silent
    } finally {
      setSaving(null);
    }
  }

  return (
    <ModalOverlay onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0f1629] border border-white/10 rounded-2xl p-4 sm:p-6 w-full max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base sm:text-lg font-bold text-white">Schedule Settings</h3>
          <button onClick={onClose} className="p-1.5 text-white/40 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Default weekly hours */}
        <h4 className="text-sm font-semibold text-white/70 mb-3">Default Weekly Hours</h4>
        <div className="space-y-2 mb-6">
          {[0, 1, 2, 3, 4, 5, 6].map((dow) => {
            const setting = defaults.find((s) => s.day_of_week === dow);
            const isOpen = setting?.is_open ?? (dow >= 1 && dow <= 6);
            const openTime = setting?.open_time || "08:00";
            const closeTime = setting?.close_time || "18:00";

            return (
              <div key={dow} className="bg-white/[0.04] rounded-lg px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-white/60 w-16 sm:w-20 shrink-0">{DAY_SHORT[dow]}</span>
                  <label className="flex items-center gap-2 cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={isOpen}
                      onChange={(e) => saveDefault(dow, { is_open: e.target.checked, open_time: openTime, close_time: closeTime })}
                      className="rounded border-white/20 bg-white/10 text-primary-500 focus:ring-primary-500 cursor-pointer"
                    />
                    <span className="text-xs text-white/40 w-10">{isOpen ? "Open" : "Closed"}</span>
                  </label>
                  {isOpen && (
                    <div className="flex items-center gap-1.5 ml-auto">
                      <input
                        type="time"
                        value={openTime}
                        onChange={(e) => saveDefault(dow, { is_open: true, open_time: e.target.value, close_time: closeTime })}
                        className="bg-white/10 border border-white/10 rounded px-1.5 sm:px-2 py-1 text-[11px] sm:text-xs text-white/70 w-[80px] sm:w-[100px]"
                      />
                      <span className="text-white/30 text-[10px]">–</span>
                      <input
                        type="time"
                        value={closeTime}
                        onChange={(e) => saveDefault(dow, { is_open: true, open_time: openTime, close_time: e.target.value })}
                        className="bg-white/10 border border-white/10 rounded px-1.5 sm:px-2 py-1 text-[11px] sm:text-xs text-white/70 w-[80px] sm:w-[100px]"
                      />
                    </div>
                  )}
                  {saving === dow && <Loader2 className="w-3 h-3 text-white/30 animate-spin shrink-0" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Date overrides */}
        <h4 className="text-sm font-semibold text-white/70 mb-3">Date Overrides</h4>
        <p className="text-xs text-white/30 mb-3">Override hours for specific dates (holidays, special hours, etc.)</p>

        <div className="space-y-3 mb-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-white/40 block mb-1">Date</label>
              <input
                type="date"
                value={overrideDate}
                onChange={(e) => setOverrideDate(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white/70"
              />
            </div>
            <label className="flex items-center gap-1.5 pb-2.5 cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={overrideOpen}
                onChange={(e) => setOverrideOpen(e.target.checked)}
                className="rounded border-white/20 bg-white/10 text-primary-500 cursor-pointer"
              />
              <span className="text-xs text-white/50">Open</span>
            </label>
          </div>
          {overrideOpen && (
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="text-[10px] text-white/40 block mb-1">From</label>
                <input
                  type="time"
                  value={overrideStart}
                  onChange={(e) => setOverrideStart(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-2 py-2.5 text-xs text-white/70"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-white/40 block mb-1">To</label>
                <input
                  type="time"
                  value={overrideEnd}
                  onChange={(e) => setOverrideEnd(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-2 py-2.5 text-xs text-white/70"
                />
              </div>
            </div>
          )}
          <button
            onClick={addOverride}
            disabled={!overrideDate || addingOverride}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-500 disabled:opacity-50 cursor-pointer transition-colors"
          >
            {addingOverride ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>Add Override</span>
          </button>
        </div>

        {overrides.length > 0 && (
          <div className="space-y-2">
            {overrides.map((o) => (
              <div key={o.id} className="flex items-center justify-between bg-white/[0.04] rounded-lg px-3 py-2">
                <div>
                  <p className="text-sm text-white/70">{o.specific_date}</p>
                  <p className="text-xs text-white/40">
                    {o.is_open ? `${formatTime12(o.open_time)} – ${formatTime12(o.close_time)}` : "Closed"}
                  </p>
                </div>
                <button
                  onClick={() => removeOverride(o.id)}
                  disabled={saving === o.id}
                  className="text-red-400/60 hover:text-red-400 cursor-pointer"
                >
                  {saving === o.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </ModalOverlay>
  );
}

/* ── Modal Overlay ── */

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full sm:w-auto sm:contents">
        {children}
      </div>
    </motion.div>
  );
}
