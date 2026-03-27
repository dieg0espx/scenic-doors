import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Tag,
  Link2,
  FileText,
  Plus,
  CheckCircle2,
  Circle,
  Activity,
} from "lucide-react";
import { getLeadById, getLeadPipelineDetails } from "@/lib/actions/leads";
import type { QuotePipeline } from "@/lib/actions/leads";
import { getQuotesByLeadId } from "@/lib/actions/quotes";
import { getFollowUpsByLeadId } from "@/lib/actions/follow-ups";
import { getAdminUsers } from "@/lib/actions/admin-users";
import { getAppointmentByLeadId } from "@/lib/actions/appointments";
import { getCurrentAdminUser } from "@/lib/auth";
import LeadDetailClient from "@/components/admin/LeadDetailClient";
import LeadShareCard from "@/components/admin/LeadShareCard";

export const dynamic = "force-dynamic";

const tempConfig: Record<string, { bg: string; text: string }> = {
  hot: { bg: "bg-orange-400/10", text: "text-orange-300" },
  warm: { bg: "bg-amber-400/10", text: "text-amber-300" },
  cold: { bg: "bg-sky-400/10", text: "text-sky-300" },
};

const workflowConfig: Record<string, { bg: string; text: string }> = {
  contacted: { bg: "bg-violet-400/10", text: "text-violet-300" },
  qualified: { bg: "bg-emerald-400/10", text: "text-emerald-300" },
  lost: { bg: "bg-red-400/10", text: "text-red-300" },
};

const quoteStatusConfig: Record<string, { bg: string; text: string }> = {
  draft: { bg: "bg-white/[0.06]", text: "text-white/50" },
  sent: { bg: "bg-sky-400/10", text: "text-sky-300" },
  viewed: { bg: "bg-violet-400/10", text: "text-violet-300" },
  accepted: { bg: "bg-emerald-400/10", text: "text-emerald-300" },
  pending_approval: { bg: "bg-amber-400/10", text: "text-amber-300" },
  declined: { bg: "bg-red-400/10", text: "text-red-300" },
};

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentAdminUser();
  if (!currentUser) redirect("/login");

  const isAdmin = currentUser.role === "admin";

  const [lead, quotes, followUps, allUsers, appointment] = await Promise.all([
    getLeadById(id),
    getQuotesByLeadId(id).catch(() => []),
    getFollowUpsByLeadId(id).catch(() => []),
    isAdmin ? getAdminUsers() : Promise.resolve([]),
    getAppointmentByLeadId(id).catch(() => null),
  ]);

  if (!lead) redirect("/admin/leads");

  // Fetch detailed pipeline for each quote
  const pipelines = quotes.length > 0
    ? await getLeadPipelineDetails(quotes.map((q) => q.id)).catch(() => [])
    : [];

  // Sales reps can only access leads shared with them
  if (!isAdmin && !(lead.shared_with ?? []).includes(currentUser.id)) {
    redirect("/admin/leads");
  }

  const salesReps = allUsers
    .filter((u) => u.role === "sales" && u.status === "active")
    .map((u) => ({ id: u.id, name: u.name }));

  const tc = tempConfig[lead.status] || tempConfig.hot;
  const wc = lead.workflow_status ? workflowConfig[lead.workflow_status] : null;

  const createQuoteParams = new URLSearchParams({
    leadId: lead.id,
    ...(lead.name && { name: lead.name }),
    ...(lead.email && { email: lead.email }),
    ...(lead.phone && { phone: lead.phone }),
    ...(lead.zip && { zip: lead.zip }),
    ...(lead.customer_type && { customerType: lead.customer_type }),
  }).toString();

  return (
    <div>
      {/* Back bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Link
          href="/admin/leads"
          className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Leads
        </Link>
        <Link
          href={`/admin/quotes/new?${createQuoteParams}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 text-sm font-medium hover:bg-teal-500/15 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Quote
        </Link>
      </div>

      {/* Header card */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] mb-6 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-3 sm:gap-4 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{lead.name}</h1>
                <p className="text-white/35 text-xs sm:text-sm mt-0.5">
                  Created{" "}
                  {new Date(lead.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${tc.bg} ${tc.text}`}>
                {lead.status}
              </span>
              {wc && (
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${wc.bg} ${wc.text}`}>
                  {lead.workflow_status}
                </span>
              )}
              {lead.customer_type && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-400/10 text-indigo-300 capitalize">
                  {lead.customer_type}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          {/* Lead Info */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-teal-400" />
              </div>
              <h2 className="text-base font-semibold text-white">Lead Information</h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {lead.email && (
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-2.5 sm:p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-3.5 h-3.5 text-white/20" />
                      <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Email</p>
                    </div>
                    <p className="text-white font-medium text-sm truncate">{lead.email}</p>
                  </div>
                )}
                {lead.phone && (
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-2.5 sm:p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Phone className="w-3.5 h-3.5 text-white/20" />
                      <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Phone</p>
                    </div>
                    <p className="text-white font-medium text-sm">{lead.phone}</p>
                  </div>
                )}
                {lead.zip && (
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-2.5 sm:p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-white/20" />
                      <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">ZIP Code</p>
                    </div>
                    <p className="text-white font-medium text-sm">{lead.zip}</p>
                  </div>
                )}
                {lead.timeline && (
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-2.5 sm:p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-3.5 h-3.5 text-white/20" />
                      <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Timeline</p>
                    </div>
                    <p className="text-white font-medium text-sm">{lead.timeline}</p>
                  </div>
                )}
                {lead.source && (
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-2.5 sm:p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Tag className="w-3.5 h-3.5 text-white/20" />
                      <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Source</p>
                    </div>
                    <p className="text-white font-medium text-sm capitalize">{lead.source.replace(/_/g, " ")}</p>
                  </div>
                )}
                {lead.referral_code && (
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-2.5 sm:p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Link2 className="w-3.5 h-3.5 text-white/20" />
                      <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Referral Code</p>
                    </div>
                    <p className="text-white font-medium text-sm">{lead.referral_code}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Appointment */}
          {appointment && (
            <div className="rounded-2xl border border-sky-500/15 bg-sky-500/[0.04]">
              <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-sky-500/10 bg-sky-500/[0.02] rounded-t-2xl">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-sky-400" />
                </div>
                <h2 className="text-base font-semibold text-white">Scheduled Appointment</h2>
                <Link
                  href="/admin/calendar"
                  className="ml-auto text-xs text-sky-400 hover:text-sky-300 font-medium"
                >
                  View Calendar
                </Link>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex flex-col items-center justify-center">
                    <span className="text-sky-400 text-xs font-bold">
                      {new Date(appointment.scheduled_at).toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="text-white font-bold text-lg leading-none">
                      {new Date(appointment.scheduled_at).getDate()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {new Date(appointment.scheduled_at).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sky-400 font-semibold text-sm">
                      {new Date(appointment.scheduled_at).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                    <p className="text-white/30 text-xs mt-0.5">
                      {appointment.duration_minutes} min &middot; Booked by {appointment.booked_by}
                    </p>
                  </div>
                </div>
                {appointment.notes && (
                  <p className="text-white/40 text-xs mt-3 bg-white/[0.02] rounded-lg px-3 py-2">{appointment.notes}</p>
                )}
              </div>
            </div>
          )}

          {/* Pipeline Progress */}
          {pipelines.length > 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
              <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="text-base font-semibold text-white">Pipeline Progress</h2>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {pipelines.map((pipeline) => (
                  <div key={pipeline.quoteId} className="p-4 sm:p-6">
                    {pipelines.length > 1 && (
                      <div className="flex items-center justify-between mb-4">
                        <Link
                          href={`/admin/quotes/${pipeline.quoteId}`}
                          className="text-sm font-medium text-violet-300 hover:text-violet-200 transition-colors"
                        >
                          {pipeline.quoteNumber}
                        </Link>
                        <span className="text-white/40 text-xs font-medium">
                          ${pipeline.grandTotal.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="relative">
                      {pipeline.steps.map((step, i) => {
                        const isLast = i === pipeline.steps.length - 1;
                        return (
                          <div key={step.key} className="flex gap-3 sm:gap-4">
                            {/* Timeline line + dot */}
                            <div className="flex flex-col items-center">
                              {step.status === "completed" ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                              ) : step.status === "current" ? (
                                <div className="w-5 h-5 rounded-full border-2 border-violet-400 bg-violet-400/20 shrink-0 flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                                </div>
                              ) : (
                                <Circle className="w-5 h-5 text-white/15 shrink-0" />
                              )}
                              {!isLast && (
                                <div className={`w-px flex-1 min-h-[28px] ${
                                  step.status === "completed" ? "bg-emerald-400/30" : "bg-white/[0.06]"
                                }`} />
                              )}
                            </div>
                            {/* Content */}
                            <div className={`pb-4 ${isLast ? "pb-0" : ""}`}>
                              <p className={`text-sm font-medium ${
                                step.status === "completed"
                                  ? "text-emerald-300"
                                  : step.status === "current"
                                    ? "text-violet-300"
                                    : "text-white/25"
                              }`}>
                                {step.label}
                              </p>
                              {step.detail && (
                                <p className={`text-xs mt-0.5 ${
                                  step.status === "upcoming" ? "text-white/15" : "text-white/40"
                                }`}>
                                  {step.detail}
                                </p>
                              )}
                              {step.date && (
                                <p className="text-[10px] text-white/20 mt-0.5">{step.date}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Associated Quotes */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-violet-400" />
                </div>
                <h2 className="text-base font-semibold text-white">Associated Quotes</h2>
              </div>
              <span className="text-white/20 text-xs font-medium">{quotes.length}</span>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {quotes.length === 0 ? (
                <div className="px-4 sm:px-5 py-6 text-center">
                  <p className="text-white/25 text-sm">No quotes linked to this lead</p>
                </div>
              ) : (
                quotes.map((q) => {
                  const qsc = quoteStatusConfig[q.status] || quoteStatusConfig.draft;
                  return (
                    <Link
                      key={q.id}
                      href={`/admin/quotes/${q.id}`}
                      className="flex items-center justify-between px-4 sm:px-5 py-3 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-violet-500/[0.06] flex items-center justify-center shrink-0">
                          <FileText className="w-3.5 h-3.5 text-violet-400/60" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white/70 text-sm font-medium truncate">{q.quote_number}</p>
                          <p className="text-white/25 text-[10px]">
                            {new Date(q.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${qsc.bg} ${qsc.text}`}>
                          {q.status}
                        </span>
                        <span className="text-white/50 text-sm font-medium">
                          ${Number(q.grand_total || q.cost || 0).toLocaleString()}
                        </span>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6">
          <LeadDetailClient
            leadId={lead.id}
            initialStatus={lead.status}
            initialWorkflow={lead.workflow_status}
            initialNotes={lead.notes || ""}
          />

          {/* Share with sales reps (admin only) */}
          {isAdmin && (
            <LeadShareCard
              leadId={lead.id}
              salesReps={salesReps}
              initialSharedWith={lead.shared_with ?? []}
            />
          )}

          {/* Follow-ups */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Follow-ups</h3>
              </div>
              <span className="text-white/20 text-xs font-medium">{followUps.length}</span>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {followUps.length === 0 ? (
                <div className="px-4 sm:px-5 py-6 text-center">
                  <p className="text-white/25 text-sm">No follow-ups scheduled</p>
                </div>
              ) : (
                followUps.map((fu) => (
                  <div key={fu.id} className="px-4 sm:px-5 py-3 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-white/60 text-xs capitalize">{fu.email_type} #{fu.sequence_number}</p>
                      <p className="text-white/25 text-[10px]">
                        {new Date(fu.scheduled_for).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${
                      fu.status === "sent"
                        ? "bg-emerald-400/10 text-emerald-300"
                        : fu.status === "cancelled"
                        ? "bg-red-400/10 text-red-300"
                        : "bg-amber-400/10 text-amber-300"
                    }`}>
                      {fu.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
