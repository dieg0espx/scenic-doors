import Link from "next/link";
import { Plus, FileText, DollarSign, TrendingUp, Users, Clock } from "lucide-react";
import { getQuotesForUser } from "@/lib/actions/quotes";
import { getAdminUsers } from "@/lib/actions/admin-users";
import { getCurrentAdminUser } from "@/lib/auth";
import QuotesPageClient from "./QuotesPageClient";

export const dynamic = "force-dynamic";

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const [adminUser, allAdminUsers] = await Promise.all([
    getCurrentAdminUser(),
    getAdminUsers(),
  ]);
  const userId = adminUser?.id ?? "";
  const userName = adminUser?.name ?? "";
  const userRole = adminUser?.role ?? "sales";

  // Build ID→name map for shared_with display
  const userNameMap: Record<string, string> = {};
  for (const u of allAdminUsers) {
    userNameMap[u.id] = u.name;
  }

  const quotes = await getQuotesForUser(userId, userName, userRole, {
    lead_status: params.status || "all",
    search: params.search,
    sort: params.sort,
    due_today: params.due_today === "true",
  });

  // Count quotes by lead_status (scoped to user's visible quotes)
  const allQuotes = await getQuotesForUser(userId, userName, userRole);
  const counts: Record<string, number> = {};
  for (const q of allQuotes) {
    const s = q.lead_status || "new";
    counts[s] = (counts[s] || 0) + 1;
  }

  // Compute summary stats
  const totalValue = allQuotes.reduce((sum, q) => sum + Number(q.grand_total || q.cost || 0), 0);
  const hotCount = counts["hot"] || 0;
  const newThisWeek = allQuotes.filter((q) => {
    const created = new Date(q.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return created >= weekAgo;
  }).length;
  const pendingApproval = allQuotes.filter((q) => q.status === "pending_approval").length;

  const stats = [
    {
      label: "Total Quotes",
      value: allQuotes.length.toString(),
      icon: FileText,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      label: "Pipeline Value",
      value: `$${totalValue >= 1000 ? `${(totalValue / 1000).toFixed(1)}k` : totalValue.toLocaleString("en-US")}`,
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Hot Leads",
      value: hotCount.toString(),
      icon: TrendingUp,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
    {
      label: "New This Week",
      value: newThisWeek.toString(),
      icon: Users,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
    },
    ...(pendingApproval > 0 ? [{
      label: "Pending Approval",
      value: pendingApproval.toString(),
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    }] : []),
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <FileText className="w-5 h-5 text-violet-400" />
            <p className="text-violet-400/80 text-sm font-medium">Sales</p>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Quotes</h1>
          <p className="text-white/35 text-sm mt-1.5">
            Manage customer quotes and lead pipeline.
          </p>
        </div>
        <Link
          href="/admin/quotes/new"
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          New Quote
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
                </div>
                <span className="text-white/25 text-[11px] uppercase tracking-wider font-medium">{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <QuotesPageClient quotes={quotes} counts={counts} userNameMap={userNameMap} />
    </div>
  );
}
