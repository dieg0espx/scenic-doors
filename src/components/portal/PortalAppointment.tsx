"use client";

import { useState } from "react";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import type { Appointment } from "@/lib/actions/appointments";
import { cancelAppointment } from "@/lib/actions/appointments";
import AppointmentScheduler from "@/components/AppointmentScheduler";

interface PortalAppointmentProps {
  quoteId: string;
  leadId?: string | null;
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  appointment: Appointment | null;
  onUpdate?: () => void;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  scheduled: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", label: "Scheduled" },
  completed: { bg: "bg-green-50 border-green-200", text: "text-green-700", label: "Completed" },
  cancelled: { bg: "bg-red-50 border-red-200", text: "text-red-700", label: "Cancelled" },
  no_show: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", label: "No Show" },
  rescheduled: { bg: "bg-violet-50 border-violet-200", text: "text-violet-700", label: "Rescheduled" },
};

export default function PortalAppointment({
  quoteId,
  leadId,
  clientName,
  clientEmail,
  clientPhone,
  appointment,
  onUpdate,
}: PortalAppointmentProps) {
  const [currentAppointment, setCurrentAppointment] = useState(appointment);
  const [showScheduler, setShowScheduler] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  async function handleCancel() {
    if (!currentAppointment) return;
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    setCancelling(true);
    try {
      await cancelAppointment(currentAppointment.id);
      setCurrentAppointment({ ...currentAppointment, status: "cancelled" });
      onUpdate?.();
    } catch {
      // silent
    } finally {
      setCancelling(false);
    }
  }

  // No appointment yet - show scheduler
  if (!currentAppointment || currentAppointment.status === "cancelled" || currentAppointment.status === "no_show") {
    if (showScheduler || !currentAppointment) {
      return (
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-ocean-900 mb-1">Schedule a Consultation</h2>
            <p className="text-sm text-ocean-500">
              Pick a date and time to meet with one of our specialists.
            </p>
          </div>

          {currentAppointment && (currentAppointment.status === "cancelled" || currentAppointment.status === "no_show") && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4 text-sm text-amber-700">
              Your previous appointment was {currentAppointment.status === "cancelled" ? "cancelled" : "marked as no-show"}.
              You can schedule a new one below.
            </div>
          )}

          <AppointmentScheduler
            quoteId={quoteId}
            leadId={leadId}
            clientName={clientName}
            clientEmail={clientEmail}
            clientPhone={clientPhone}
            bookedBy="client"
            onBooked={(id, scheduledAt) => {
              setCurrentAppointment({
                id,
                quote_id: quoteId,
                lead_id: leadId || null,
                client_name: clientName,
                client_email: clientEmail,
                client_phone: clientPhone || null,
                scheduled_at: scheduledAt,
                duration_minutes: 15,
                status: "scheduled",
                notes: null,
                booked_by: "client",
                created_by: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
              setShowScheduler(false);
              onUpdate?.();
            }}
          />
        </div>
      );
    }

    return (
      <div className="text-center py-8 px-4">
        <CalendarDays className="w-10 h-10 text-ocean-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-ocean-900 mb-1">No Active Appointment</h2>
        <p className="text-sm text-ocean-500 mb-5">
          Your previous appointment was {currentAppointment.status === "cancelled" ? "cancelled" : "marked as no-show"}.
        </p>
        <button
          onClick={() => setShowScheduler(true)}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer active:scale-[0.98]"
        >
          <CalendarDays className="w-4 h-4" />
          Schedule New Appointment
        </button>
      </div>
    );
  }

  // Show existing appointment
  const isActive = currentAppointment.status === "scheduled" || currentAppointment.status === "rescheduled";
  const sc = STATUS_STYLES[currentAppointment.status] || STATUS_STYLES.scheduled;
  const time = new Date(currentAppointment.scheduled_at);

  if (showScheduler) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-lg font-bold text-ocean-900 mb-1">Reschedule Appointment</h2>
          <p className="text-sm text-ocean-500">Pick a new date and time.</p>
        </div>
        <AppointmentScheduler
          quoteId={quoteId}
          leadId={leadId}
          clientName={clientName}
          clientEmail={clientEmail}
          clientPhone={clientPhone}
          bookedBy="client"
          rescheduleFromId={currentAppointment.id}
          onBooked={(id, scheduledAt) => {
            setCurrentAppointment({
              ...currentAppointment,
              id,
              scheduled_at: scheduledAt,
              status: "scheduled",
            });
            setShowScheduler(false);
            onUpdate?.();
          }}
          onCancel={() => setShowScheduler(false)}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-ocean-900 mb-1">Your Appointment</h2>
        <p className="text-sm text-ocean-500">Your scheduled consultation with our team.</p>
      </div>

      <div className={`rounded-xl border p-4 sm:p-6 ${sc.bg}`}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white shadow-sm flex flex-col items-center justify-center shrink-0">
              <span className="text-primary-600 text-[10px] sm:text-xs font-bold">
                {time.toLocaleDateString("en-US", { month: "short" })}
              </span>
              <span className="text-ocean-900 font-bold text-lg sm:text-xl leading-none">
                {time.getDate()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-ocean-900 text-sm sm:text-base">
                <span className="sm:hidden">
                  {time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </span>
                <span className="hidden sm:inline">
                  {time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </span>
              </p>
              <p className="text-primary-600 font-bold text-base sm:text-lg">
                {time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <Clock className="w-3 h-3 text-ocean-400" />
                <span className="text-xs text-ocean-500">{currentAppointment.duration_minutes} min</span>
              </div>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 self-start ${sc.text}`}>
            {currentAppointment.status === "scheduled" || currentAppointment.status === "rescheduled" ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : (
              <XCircle className="w-3 h-3" />
            )}
            {sc.label}
          </span>
        </div>

        {currentAppointment.notes && (
          <div className="bg-white/70 rounded-lg px-3 sm:px-4 py-2.5 mb-4 text-sm text-ocean-600">
            {currentAppointment.notes}
          </div>
        )}

        {isActive && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 border-t border-ocean-200/50">
            <button
              onClick={() => setShowScheduler(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 text-sm font-medium text-ocean-600 hover:text-ocean-800 border border-ocean-200 rounded-lg hover:bg-white/50 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reschedule
            </button>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              {cancelling ? "Cancelling..." : "Cancel"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
