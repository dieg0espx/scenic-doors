import { UserPlus, Users, FileText, CalendarPlus, AlertTriangle } from "lucide-react";
import { getLeadsForUser, getLeadMetricsForUser } from "@/lib/actions/leads";
import { getFollowUpsDueToday } from "@/lib/actions/follow-ups";
import { getCurrentAdminUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import LeadsList from "@/components/admin/LeadsList";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const currentUser = await getCurrentAdminUser();
  if (!currentUser) redirect("/login");

  const isAdmin = currentUser.role === "admin";

  const [leads, metrics, followUpsDueToday] = await Promise.all([
    getLeadsForUser(currentUser.id, currentUser.role),
    getLeadMetricsForUser(currentUser.id, currentUser.role),
    getFollowUpsDueToday().catch(() => []),
  ]);

  // Compute "needs attention" set:
  // - leads with follow-ups due today
  // - "new" status leads older than 48h
  const followUpLeadIds = new Set(
    followUpsDueToday
      .filter((fu) => fu.lead_id)
      .map((fu) => fu.lead_id!)
  );

  const fortyEightHoursAgo = Date.now() - 48 * 60 * 60 * 1000;
  const needsAttentionIds = new Set<string>();

  for (const lead of leads) {
    if (followUpLeadIds.has(lead.id)) {
      needsAttentionIds.add(lead.id);
    }
    if (
      lead.status === "hot" &&
      new Date(lead.created_at).getTime() < fortyEightHoursAgo
    ) {
      needsAttentionIds.add(lead.id);
    }
  }

  const metricCards = [
    { label: "Total Leads", value: metrics.total, icon: Users, color: "teal" },
    { label: "Without Quotes", value: metrics.withoutQuotes, icon: UserPlus, color: "amber" },
    { label: "With Quotes", value: metrics.withQuotes, icon: FileText, color: "emerald" },
    { label: "New This Week", value: metrics.newThisWeek, icon: CalendarPlus, color: "violet" },
    { label: "Needs Attention", value: needsAttentionIds.size, icon: AlertTriangle, color: "orange" },
  ];

  const colorMap: Record<string, { border: string; bg: string; iconBg: string; iconText: string }> = {
    teal: { border: "border-teal-500/15", bg: "from-teal-500/[0.06]", iconBg: "bg-teal-500/15", iconText: "text-teal-400" },
    amber: { border: "border-amber-500/15", bg: "from-amber-500/[0.06]", iconBg: "bg-amber-500/15", iconText: "text-amber-400" },
    emerald: { border: "border-emerald-500/15", bg: "from-emerald-500/[0.06]", iconBg: "bg-emerald-500/15", iconText: "text-emerald-400" },
    violet: { border: "border-violet-500/15", bg: "from-violet-500/[0.06]", iconBg: "bg-violet-500/15", iconText: "text-violet-400" },
    orange: { border: "border-orange-500/15", bg: "from-orange-500/[0.06]", iconBg: "bg-orange-500/15", iconText: "text-orange-400" },
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <UserPlus className="w-5 h-5 text-teal-400" />
          <p className="text-teal-400/80 text-sm font-medium">Pipeline</p>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Leads</h1>
        <p className="text-white/35 text-sm mt-1.5">
          Track and manage incoming leads.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
        {metricCards.map((card) => {
          const c = colorMap[card.color];
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`rounded-2xl border ${c.border} bg-gradient-to-br ${c.bg} to-transparent p-5`}
            >
              <div className={`w-9 h-9 rounded-xl ${c.iconBg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4.5 h-4.5 ${c.iconText}`} />
              </div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-white/35 text-xs mt-1 font-medium">{card.label}</p>
            </div>
          );
        })}
      </div>

      <LeadsList leads={leads} needsAttentionIds={needsAttentionIds} isAdmin={isAdmin} />
    </div>
  );
}
