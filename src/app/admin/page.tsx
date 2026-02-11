import Link from "next/link";
import {
  FileText,
  Package,
  Users,
  ArrowRight,
  DollarSign,
  Clock,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Eye,
  Send,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const supabase = await createClient();

  const [quotes, orders, clients, pendingPayments, revenue, recentQuotes, recentOrders] = await Promise.all([
    supabase.from("quotes").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("clients").select("id", { count: "exact", head: true }),
    supabase
      .from("payments")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("payments")
      .select("amount")
      .eq("status", "completed"),
    supabase
      .from("quotes")
      .select("id, quote_number, client_name, door_type, cost, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("orders")
      .select("id, order_number, client_name, status, created_at, quotes(door_type, cost)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const totalRevenue = (revenue.data ?? []).reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );

  return {
    counts: {
      quotes: quotes.count ?? 0,
      orders: orders.count ?? 0,
      clients: clients.count ?? 0,
      pendingPayments: pendingPayments.count ?? 0,
      totalRevenue,
    },
    recentQuotes: recentQuotes.data ?? [],
    recentOrders: recentOrders.data ?? [],
  };
}

const quoteStatusConfig: Record<string, { dot: string; bg: string; text: string; icon: typeof Eye }> = {
  draft: { dot: "bg-gray-400", bg: "bg-gray-400/10", text: "text-gray-300", icon: FileText },
  sent: { dot: "bg-blue-400", bg: "bg-blue-400/10", text: "text-blue-300", icon: Send },
  viewed: { dot: "bg-amber-400", bg: "bg-amber-400/10", text: "text-amber-300", icon: Eye },
  accepted: { dot: "bg-emerald-400", bg: "bg-emerald-400/10", text: "text-emerald-300", icon: CheckCircle2 },
  declined: { dot: "bg-red-400", bg: "bg-red-400/10", text: "text-red-300", icon: FileText },
};

const orderStatusConfig: Record<string, { dot: string; bg: string; text: string }> = {
  pending: { dot: "bg-amber-400", bg: "bg-amber-400/10", text: "text-amber-300" },
  in_progress: { dot: "bg-sky-400", bg: "bg-sky-400/10", text: "text-sky-300" },
  completed: { dot: "bg-emerald-400", bg: "bg-emerald-400/10", text: "text-emerald-300" },
  cancelled: { dot: "bg-red-400", bg: "bg-red-400/10", text: "text-red-300" },
};

export default async function AdminDashboard() {
  const { counts, recentQuotes, recentOrders } = await getDashboardData();

  return (
    <div className="max-w-7xl">
      {/* ── Header ── */}
      <div className="mb-8 sm:mb-10">
        <p className="text-amber-400/80 text-sm font-medium mb-1">Dashboard</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Overview</h1>
      </div>

      {/* ── Top stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {/* Revenue — spans 2 cols on mobile */}
        <div className="col-span-2 rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.08] to-transparent p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.04] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <DollarSign className="w-4.5 h-4.5 text-emerald-400" />
              </div>
              <span className="text-white/40 text-sm font-medium">Total Revenue</span>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              ${counts.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-emerald-400/60 text-xs mt-1.5 font-medium">From completed payments</p>
          </div>
        </div>

        {/* Pending Payments */}
        <Link
          href="/admin/orders"
          className="group rounded-2xl border border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] to-transparent p-5 sm:p-6 transition-all hover:border-amber-500/25"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <Clock className="w-4.5 h-4.5 text-amber-400" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-white/15 group-hover:text-amber-400/50 transition-colors" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{counts.pendingPayments}</p>
          <p className="text-white/35 text-xs mt-1 font-medium">Pending Payments</p>
        </Link>

        {/* Clients */}
        <Link
          href="/admin/clients"
          className="group rounded-2xl border border-teal-500/15 bg-gradient-to-br from-teal-500/[0.06] to-transparent p-5 sm:p-6 transition-all hover:border-teal-500/25"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 flex items-center justify-center">
              <Users className="w-4.5 h-4.5 text-teal-400" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-white/15 group-hover:text-teal-400/50 transition-colors" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{counts.clients}</p>
          <p className="text-white/35 text-xs mt-1 font-medium">Clients</p>
        </Link>
      </div>

      {/* ── Quotes + Orders row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
        <Link
          href="/admin/quotes"
          className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:bg-white/[0.04] hover:border-violet-500/15"
        >
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-violet-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-2xl font-bold text-white">{counts.quotes}</p>
            <p className="text-white/35 text-sm font-medium">Total Quotes</p>
          </div>
          <ArrowRight className="w-4 h-4 text-white/15 group-hover:text-violet-400/50 group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>
        <Link
          href="/admin/orders"
          className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:bg-white/[0.04] hover:border-sky-500/15"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-sky-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-2xl font-bold text-white">{counts.orders}</p>
            <p className="text-white/35 text-sm font-medium">Total Orders</p>
          </div>
          <ArrowRight className="w-4 h-4 text-white/15 group-hover:text-sky-400/50 group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>
      </div>

      {/* ── Quick Actions ── */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
        <Link
          href="/admin/quotes/new"
          className="inline-flex items-center gap-2 px-5 py-3 sm:px-4 sm:py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium hover:bg-violet-500/15 transition-colors active:scale-95"
        >
          <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> New Quote
        </Link>
        <Link
          href="/admin/clients/new"
          className="inline-flex items-center gap-2 px-5 py-3 sm:px-4 sm:py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 text-sm font-medium hover:bg-teal-500/15 transition-colors active:scale-95"
        >
          <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> New Client
        </Link>
      </div>

      {/* ── Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Quotes */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-violet-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">Recent Quotes</h3>
            </div>
            <Link href="/admin/quotes" className="text-xs text-white/30 hover:text-violet-300 transition-colors font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {recentQuotes.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-white/25 text-sm">No quotes yet</p>
              </div>
            ) : (
              recentQuotes.map((q: { id: string; quote_number: string; client_name: string; door_type: string; cost: number; status: string; created_at: string }) => {
                const sc = quoteStatusConfig[q.status] || quoteStatusConfig.draft;
                return (
                  <div key={q.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
                    <div className={`w-8 h-8 rounded-lg ${sc.bg} flex items-center justify-center shrink-0`}>
                      <sc.icon className={`w-3.5 h-3.5 ${sc.text}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium truncate">{q.client_name}</span>
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${sc.bg} ${sc.text}`}>
                          {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-white/25 font-mono text-[11px]">{q.quote_number}</span>
                        <span className="text-white/15">·</span>
                        <span className="text-white/30 text-[11px]">{q.door_type}</span>
                      </div>
                    </div>
                    <span className="text-white font-semibold text-sm shrink-0">
                      ${Number(q.cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                <Package className="w-4 h-4 text-sky-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">Recent Orders</h3>
            </div>
            <Link href="/admin/orders" className="text-xs text-white/30 hover:text-sky-300 transition-colors font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {recentOrders.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-white/25 text-sm">No orders yet</p>
              </div>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              recentOrders.map((o: any) => {
                const sc = orderStatusConfig[o.status] || orderStatusConfig.pending;
                const quote = o.quotes;
                return (
                  <Link key={o.id} href={`/admin/orders/${o.id}`} className="px-5 py-3.5 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
                    <div className={`w-8 h-8 rounded-lg ${sc.bg} flex items-center justify-center shrink-0`}>
                      <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium truncate">{o.client_name}</span>
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${sc.bg} ${sc.text}`}>
                          {o.status.replace("_", " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-white/25 font-mono text-[11px]">{o.order_number}</span>
                        <span className="text-white/15">·</span>
                        <span className="text-white/30 text-[11px]">{quote?.door_type}</span>
                      </div>
                    </div>
                    <span className="text-white font-semibold text-sm shrink-0">
                      ${quote?.cost ? Number(quote.cost).toLocaleString("en-US", { minimumFractionDigits: 2 }) : "—"}
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
