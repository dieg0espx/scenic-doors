"use client";

import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle2,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAvailableSlots, createAppointment, rescheduleAppointment } from "@/lib/actions/appointments";
import type { TimeSlot } from "@/lib/actions/appointments";

interface AppointmentSchedulerProps {
  quoteId?: string | null;
  leadId?: string | null;
  clientName: string;
  clientEmail?: string | null;
  clientPhone?: string | null;
  bookedBy?: "client" | "admin";
  createdBy?: string | null;
  onBooked?: (appointmentId: string, scheduledAt: string) => void;
  onCancel?: () => void;
  showClientFields?: boolean;
  compact?: boolean;
  /** When rescheduling, pass the old appointment ID so its slot is freed first */
  rescheduleFromId?: string | null;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatTime12(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function getDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function AppointmentScheduler({
  quoteId,
  leadId,
  clientName: initialName,
  clientEmail: initialEmail,
  clientPhone: initialPhone,
  bookedBy = "client",
  createdBy,
  onBooked,
  onCancel,
  showClientFields = false,
  compact = false,
  rescheduleFromId,
}: AppointmentSchedulerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookedTime, setBookedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Client fields (for admin booking)
  const [clientName, setClientName] = useState(initialName);
  const [clientEmail, setClientEmail] = useState(initialEmail || "");
  const [clientPhone, setClientPhone] = useState(initialPhone || "");

  // Load slots when date is selected
  useEffect(() => {
    if (!selectedDate) return;
    let cancelled = false;
    setLoadingSlots(true);
    setSlots([]);
    setSelectedSlot(null);
    setError(null);

    getAvailableSlots(getDateStr(selectedDate))
      .then((s) => {
        if (!cancelled) setSlots(s);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load available times");
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => { cancelled = true; };
  }, [selectedDate]);

  async function handleBook() {
    if (!selectedSlot) return;
    if (showClientFields && !clientName.trim()) {
      setError("Client name is required");
      return;
    }

    setBooking(true);
    setError(null);

    try {
      const newData = {
        quote_id: quoteId || null,
        lead_id: leadId || null,
        client_name: clientName,
        client_email: clientEmail || null,
        client_phone: clientPhone || null,
        scheduled_at: selectedSlot.datetime,
        notes: notes || null,
        booked_by: bookedBy,
        created_by: createdBy || null,
      };

      const appointment = rescheduleFromId
        ? await rescheduleAppointment(rescheduleFromId, newData)
        : await createAppointment(newData);

      setBooked(true);
      setBookedTime(selectedSlot.datetime);
      onBooked?.(appointment.id, selectedSlot.datetime);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to book appointment");
    } finally {
      setBooking(false);
    }
  }

  // Calendar grid
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startDay = firstDayOfMonth.getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  function isDateSelectable(date: Date): boolean {
    const day = date.getDay();
    // Mon-Sat (1-6), not past
    if (day === 0) return false;
    if (date < today) return false;
    return true;
  }

  // Success state
  if (booked) {
    const d = new Date(bookedTime);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-6"
      >
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-lg font-bold text-ocean-900 mb-1">Appointment Booked!</h3>
        <p className="text-ocean-500 text-sm mb-1">
          {d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
        <p className="text-primary-600 font-semibold">
          {d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
        </p>
        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-4 text-sm text-ocean-400 hover:text-ocean-600 underline cursor-pointer"
          >
            Close
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      {/* Client fields (admin only) */}
      {showClientFields && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-ocean-600 mb-1">
              <User className="w-3 h-3 inline mr-1" />Name *
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3 py-2 border border-ocean-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Client name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ocean-600 mb-1">
              <Mail className="w-3 h-3 inline mr-1" />Email
            </label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full px-3 py-2 border border-ocean-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Email"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ocean-600 mb-1">
              <Phone className="w-3 h-3 inline mr-1" />Phone
            </label>
            <input
              type="tel"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="w-full px-3 py-2 border border-ocean-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Phone"
            />
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 ${compact ? "lg:grid-cols-2" : "md:grid-cols-2"} gap-4`}>
        {/* Calendar */}
        <div className="bg-white rounded-xl border border-ocean-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              disabled={currentYear === today.getFullYear() && currentMonth <= today.getMonth()}
              className="p-1.5 rounded-lg hover:bg-ocean-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-ocean-600" />
            </button>
            <h4 className="text-sm font-semibold text-ocean-900">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h4>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-ocean-100 cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-ocean-600" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAY_NAMES.map((d) => (
              <div key={d} className="text-center text-[10px] font-medium text-ocean-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(currentYear, currentMonth, day);
              const selectable = isDateSelectable(date);
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const isToday = isSameDay(date, today);

              return (
                <button
                  key={day}
                  onClick={() => selectable && setSelectedDate(date)}
                  disabled={!selectable}
                  className={`
                    aspect-square flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer min-h-[40px]
                    ${isSelected
                      ? "bg-primary-500 text-white shadow-sm"
                      : isToday
                        ? "bg-primary-50 text-primary-700 ring-1 ring-primary-200"
                        : selectable
                          ? "text-ocean-700 hover:bg-ocean-100 active:bg-ocean-200"
                          : "text-ocean-300 cursor-not-allowed"
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        <div className="bg-white rounded-xl border border-ocean-200 p-4">
          {!selectedDate ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <CalendarIcon className="w-8 h-8 text-ocean-300 mb-2" />
              <p className="text-sm text-ocean-400">Select a date to see available times</p>
            </div>
          ) : loadingSlots ? (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <Loader2 className="w-5 h-5 text-primary-500 animate-spin mb-2" />
              <p className="text-sm text-ocean-400">Loading available times...</p>
            </div>
          ) : slots.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <Clock className="w-8 h-8 text-ocean-300 mb-2" />
              <p className="text-sm text-ocean-500 font-medium">No available times</p>
              <p className="text-xs text-ocean-400 mt-1">Please try another date</p>
            </div>
          ) : (
            <div>
              <h4 className="text-sm font-semibold text-ocean-900 mb-3">
                {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-[280px] overflow-y-auto pr-1 -mr-1">
                <AnimatePresence mode="wait">
                  {slots.map((slot, i) => {
                    const isSelected = selectedSlot?.time === slot.time;
                    return (
                      <motion.button
                        key={slot.time}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.015 }}
                        onClick={() => setSelectedSlot(slot)}
                        className={`
                          px-2 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer min-h-[40px] active:scale-95
                          ${isSelected
                            ? "bg-primary-500 text-white shadow-sm"
                            : "bg-ocean-50 text-ocean-700 hover:bg-primary-50 hover:text-primary-700"
                          }
                        `}
                      >
                        {formatTime12(slot.time)}
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {selectedSlot && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <label className="block text-xs font-medium text-ocean-600 mb-1">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-ocean-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            placeholder="Anything you'd like us to know..."
          />
        </motion.div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 sm:justify-end">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-3 sm:py-2.5 text-sm font-medium text-ocean-600 hover:text-ocean-800 cursor-pointer rounded-lg border border-ocean-200 sm:border-0"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleBook}
          disabled={!selectedSlot || booking}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer active:scale-[0.98]"
        >
          {booking ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Booking...
            </>
          ) : (
            <>
              <CalendarIcon className="w-4 h-4" />
              Confirm Appointment
            </>
          )}
        </button>
      </div>
    </div>
  );
}
