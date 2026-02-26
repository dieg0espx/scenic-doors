import Link from "next/link";
import {
  FileText,
  Package,
  UserPlus,
  Users,
  ArrowRight,
  DollarSign,
  Clock,
  Plus,
  ArrowUpRight,
  TrendingUp,
  BarChart3,
  Flame,
  CalendarClock,
} from "lucide-react";
import { getDashboardMetrics, getQuotesForUser } from "@/lib/actions/quotes";
import { getCurrentAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const leadStatusConfig: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  new: { dot: "bg-blue-400", bg: "bg-blue-400/10", text: "text-blue-300", label: "New" },
  hot: { dot: "bg-red-400", bg: "bg-red-400/10", text: "text-red-300", label: "Hot" },
  warm: { dot: "bg-amber-400", bg: "bg-amber-400/10", text: "text-amber-300", label: "Warm" },
  cold: { dot: "bg-sky-400", bg: "bg-sky-400/10", text: "text-sky-300", label: "Cold" },
  hold: { dot: "bg-gray-400", bg: "bg-gray-400/10", text: "text-gray-300", label: "Hold" },
  archived: { dot: "bg-zinc-500", bg: "bg-zinc-500/10", text: "text-zinc-400", label: "Archived" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function AdminDashboard() {
  const adminUser = await getCurrentAdminUser();
  const userId = adminUser?.id ?? "";
  const userName = adminUser?.name ?? "";
  const userRole = adminUser?.role ?? "sales";
  const isAdmin = userRole === "admin";

  const [metrics, recentQuotes] = await Promise.all([
    isAdmin
      ? getDashboardMetrics()
      : (async () => {
          // Sales rep: compute scoped metrics from their own quotes
          const { createClient } = await import("@/lib/supabase/server");
          const supabase = await createClient();
          const myQuotes = await getQuotesForUser(userId, userName, userRole);
          const totalQuoteValue = myQuotes.reduce(
            (sum, q) => sum + Number(q.grand_total || q.cost || 0),
            0
          );
          // Leads are visible to all
          const leadsRes = await supabase
            .from("leads")
            .select("id", { count: "exact", head: true });
          return {
            totalLeads: leadsRes.count ?? 0,
            totalQuotes: myQuotes.length,
            totalQuoteValue,
            pendingOrders: 0,
            totalOrders: 0,
            conversionRate: 0,
            averageOrderVolume: 0,
          };
        })(),
    getQuotesForUser(userId, userName, userRole, { sort: "newest" }),
  ]);

  const latestQuotes = recentQuotes.slice(0, 10);

  // Pipeline breakdown counts
  const pipelineCounts = { new: 0, hot: 0, warm: 0, cold: 0 };
  for (const q of recentQuotes) {
    const s = q.lead_status || "new";
    if (s in pipelineCounts) pipelineCounts[s as keyof typeof pipelineCounts]++;
  }

  // Follow-up reminders
  const today = new Date().toISOString().split("T")[0];
  const followUpsDue = recentQuotes.filter(
    (q) => q.follow_up_date && q.follow_up_date <= today
  );

  // Sales-rep specific counts
  const hotLeadsCount = recentQuotes.filter((q) => q.lead_status === "hot").length;
  const followUpsDueCount = followUpsDue.length;

  const statCards = [
    {
      label: "Total Leads",
      value: metrics.totalLeads,
      icon: UserPlus,
      color: "teal",
      href: "/admin/leads",
    },
    {
      label: isAdmin ? "Total Quotes" : "My Quotes",
      value: metrics.totalQuotes,
      icon: FileText,
      color: "violet",
      href: "/admin/quotes",
    },
    {
      label: isAdmin ? "Total Quote Value" : "My Quote Value",
      value: `$${metrics.totalQuoteValue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      color: "emerald",
      href: "/admin/quotes",
      large: true,
    },
    ...(isAdmin
      ? [
          {
            label: "Pending Orders",
            value: metrics.pendingOrders,
            icon: Clock,
            color: "amber",
            href: "/admin/orders",
          },
          {
            label: "Total Orders",
            value: metrics.totalOrders,
            icon: Package,
            color: "sky",
            href: "/admin/orders",
          },
          {
            label: "Conversion Rate",
            value: `${metrics.conversionRate.toFixed(1)}%`,
            icon: TrendingUp,
            color: "rose",
            href: "/admin/marketing",
          },
          {
            label: "Avg Order Volume",
            value: `$${metrics.averageOrderVolume.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            icon: BarChart3,
            color: "indigo",
            href: "/admin/marketing",
          },
        ]
      : [
          {
            label: "Hot Leads",
            value: hotLeadsCount,
            icon: Flame,
            color: "rose",
            href: "/admin/quotes?status=hot",
          },
          {
            label: "Follow-Ups Due",
            value: followUpsDueCount,
            icon: CalendarClock,
            color: "amber",
            href: "/admin/quotes?due_today=true",
          },
        ]),
  ];

  const colorMap: Record<string, { border: string; bg: string; iconBg: string; iconText: string; arrow: string }> = {
    teal: { border: "border-teal-500/15", bg: "from-teal-500/[0.06]", iconBg: "bg-teal-500/15", iconText: "text-teal-400", arrow: "group-hover:text-teal-400/50" },
    violet: { border: "border-violet-500/15", bg: "from-violet-500/[0.06]", iconBg: "bg-violet-500/15", iconText: "text-violet-400", arrow: "group-hover:text-violet-400/50" },
    emerald: { border: "border-emerald-500/15", bg: "from-emerald-500/[0.08]", iconBg: "bg-emerald-500/15", iconText: "text-emerald-400", arrow: "group-hover:text-emerald-400/50" },
    amber: { border: "border-amber-500/15", bg: "from-amber-500/[0.06]", iconBg: "bg-amber-500/15", iconText: "text-amber-400", arrow: "group-hover:text-amber-400/50" },
    sky: { border: "border-sky-500/15", bg: "from-sky-500/[0.06]", iconBg: "bg-sky-500/15", iconText: "text-sky-400", arrow: "group-hover:text-sky-400/50" },
    rose: { border: "border-rose-500/15", bg: "from-rose-500/[0.06]", iconBg: "bg-rose-500/15", iconText: "text-rose-400", arrow: "group-hover:text-rose-400/50" },
    indigo: { border: "border-indigo-500/15", bg: "from-indigo-500/[0.06]", iconBg: "bg-indigo-500/15", iconText: "text-indigo-400", arrow: "group-hover:text-indigo-400/50" },
  };

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-7xl">
      {/* Header — personalized greeting */}
      <div className="mb-8 sm:mb-10">
        <p className="text-amber-400/80 text-sm font-medium mb-1">{formattedDate}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Welcome back, {userName || "there"}
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {statCards.map((card) => {
          const c = colorMap[card.color];
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className={`group rounded-2xl border ${c.border} bg-gradient-to-br ${c.bg} to-transparent p-5 sm:p-6 transition-all hover:border-opacity-40 ${
                card.large ? "col-span-2 sm:col-span-1" : ""
              } relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${c.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-4.5 h-4.5 ${c.iconText}`} />
                  </div>
                  <ArrowUpRight className={`w-4 h-4 text-white/15 ${c.arrow} transition-colors`} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {card.value}
                </p>
                <p className="text-white/35 text-xs mt-1 font-medium">{card.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pipeline Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
        {(["new", "hot", "warm", "cold"] as const).map((status) => {
          const sc = leadStatusConfig[status];
          return (
            <Link
              key={status}
              href={`/admin/quotes?status=${status}`}
              className={`group rounded-xl border border-white/[0.06] bg-white/[0.015] p-3 sm:p-4 hover:bg-white/[0.03] transition-colors`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                <span className={`text-xs font-medium ${sc.text}`}>{sc.label}</span>
              </div>
              <p className="text-xl font-bold text-white">{pipelineCounts[status]}</p>
            </Link>
          );
        })}
      </div>

      {/* Follow-Up Reminders */}
      {followUpsDue.length > 0 && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] mb-6">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-amber-500/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                <CalendarClock className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-sm font-semibold text-amber-300">
                Follow-Up Reminders
              </h3>
              <span className="text-amber-400/60 text-xs font-medium">{followUpsDue.length}</span>
            </div>
          </div>
          <div className="divide-y divide-amber-500/[0.08]">
            {followUpsDue.slice(0, 5).map((q) => (
              <Link
                key={q.id}
                href={`/admin/quotes/${q.id}`}
                className="px-5 py-3 flex items-center justify-between hover:bg-amber-500/[0.04] transition-colors"
              >
                <div className="min-w-0">
                  <span className="text-white text-sm font-medium truncate block">{q.client_name}</span>
                  <span className="text-white/30 font-mono text-[11px]">{q.quote_number}</span>
                </div>
                <span className="text-amber-300/70 text-xs shrink-0 ml-3">
                  {q.follow_up_date === today ? "Today" : q.follow_up_date}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
        <Link
          href="/admin/quotes/new"
          className="inline-flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium hover:bg-violet-500/15 transition-colors active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> New Quote
        </Link>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 text-sm font-medium hover:bg-sky-500/15 transition-colors active:scale-95"
        >
          <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> View All Orders
        </Link>
        {isAdmin && (
          <>
            <Link
              href="/admin/marketing"
              className="inline-flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium hover:bg-emerald-500/15 transition-colors active:scale-95"
            >
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Generate Report
            </Link>
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 text-sm font-medium hover:bg-teal-500/15 transition-colors active:scale-95"
            >
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Manage Users
            </Link>
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-violet-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
          </div>
          <Link
            href="/admin/quotes"
            className="text-xs text-white/30 hover:text-violet-300 transition-colors font-medium flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {latestQuotes.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-white/25 text-sm">No quotes yet</p>
            </div>
          ) : (
            latestQuotes.map((q) => {
              const status = q.lead_status || "new";
              const sc = leadStatusConfig[status] || leadStatusConfig.new;
              const isFollowUpDue = q.follow_up_date && q.follow_up_date <= today;
              return (
                <Link
                  key={q.id}
                  href={`/admin/quotes/${q.id}`}
                  className="px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-8 h-8 rounded-lg ${sc.bg} flex items-center justify-center shrink-0`}>
                      <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium truncate">
                          {q.client_name}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${sc.bg} ${sc.text}`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                        {q.customer_type && q.customer_type !== "residential" && (
                          <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-400/10 text-indigo-300">
                            {q.customer_type}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-white/25 font-mono text-[11px]">
                          {q.quote_number}
                        </span>
                        <span className="text-white/15">&middot;</span>
                        <span className="text-white/30 text-[11px]">
                          {q.door_type}
                        </span>
                        {q.created_by && (
                          <>
                            <span className="hidden sm:inline text-white/15">&middot;</span>
                            <span className="hidden sm:inline text-white/25 text-[11px]">
                              by {q.created_by}
                            </span>
                          </>
                        )}
                        {isFollowUpDue && (
                          <>
                            <span className="hidden sm:inline text-white/15">&middot;</span>
                            <span className="hidden sm:inline text-amber-400/70 text-[11px] font-medium">
                              Follow-up due
                            </span>
                          </>
                        )}
                        <span className="hidden sm:inline text-white/15">&middot;</span>
                        <span className="hidden sm:inline text-white/25 text-[11px]">
                          {timeAgo(q.created_at)}
                        </span>
                      </div>
                    </div>
                    <span className="text-white font-semibold text-sm shrink-0 sm:hidden">
                      ${Number(q.grand_total || q.cost || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 pl-11 sm:pl-0">
                    <span className="text-white/25 text-[11px] sm:hidden">
                      {timeAgo(q.created_at)}
                    </span>
                    <span className="hidden sm:inline text-white font-semibold text-sm shrink-0">
                      ${Number(q.grand_total || q.cost || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
