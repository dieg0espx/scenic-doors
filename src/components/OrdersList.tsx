import Link from "next/link";
import { Package, Eye } from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  client_name: string;
  client_email: string;
  status: string;
  created_at: string;
  quotes: { quote_number: string; door_type: string; cost: number };
}

const statusConfig: Record<string, { dot: string; bg: string; text: string }> = {
  pending: { dot: "bg-amber-400", bg: "bg-amber-400/10", text: "text-amber-300" },
  in_progress: { dot: "bg-sky-400", bg: "bg-sky-400/10", text: "text-sky-300" },
  completed: { dot: "bg-emerald-400", bg: "bg-emerald-400/10", text: "text-emerald-300" },
  cancelled: { dot: "bg-red-400", bg: "bg-red-400/10", text: "text-red-300" },
};

export default function OrdersList({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.08] p-12 sm:p-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center mx-auto mb-4">
          <Package className="w-7 h-7 text-sky-400/60" />
        </div>
        <h3 className="text-lg font-semibold text-white/60 mb-1">No orders yet</h3>
        <p className="text-white/30 text-sm">Orders are created after contract signing.</p>
      </div>
    );
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${config.bg} ${config.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
      </span>
    );
  };

  return (
    <>
      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0">
                <Link href={`/admin/orders/${o.id}`} className="text-white font-medium text-[15px] hover:text-violet-300 transition-colors">{o.client_name}</Link>
                <p className="text-white/30 text-xs truncate">{o.client_email}</p>
              </div>
              <StatusBadge status={o.status} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Order</p>
                <Link href={`/admin/orders/${o.id}`} className="text-white/70 font-mono text-xs mt-0.5 hover:text-violet-300 transition-colors">{o.order_number}</Link>
              </div>
              <div>
                <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Quote</p>
                <p className="text-white/50 font-mono text-xs mt-0.5">{o.quotes?.quote_number}</p>
              </div>
              <div>
                <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Cost</p>
                <p className="text-white font-semibold text-sm mt-0.5">
                  ${o.quotes?.cost ? Number(o.quotes.cost).toLocaleString("en-US", { minimumFractionDigits: 2 }) : "-"}
                </p>
              </div>
              <div>
                <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Type</p>
                <p className="text-white/50 text-xs mt-0.5">{o.quotes?.door_type}</p>
              </div>
              <div className="col-span-2 flex items-center justify-between pt-3 border-t border-white/[0.04]">
                <p className="text-white/40 text-xs">{new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 transition-colors active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5" /> View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl border border-white/[0.06] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Order #</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Quote #</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Client</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Cost</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Door Type</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Status</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Created</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4"><Link href={`/admin/orders/${o.id}`} className="text-white/70 font-mono text-xs hover:text-violet-300 transition-colors">{o.order_number}</Link></td>
                <td className="px-5 py-4 text-white/50 font-mono text-xs">{o.quotes?.quote_number}</td>
                <td className="px-5 py-4">
                  <Link href={`/admin/orders/${o.id}`} className="text-white font-medium text-[13px] hover:text-violet-300 transition-colors">{o.client_name}</Link>
                  <p className="text-white/30 text-xs">{o.client_email}</p>
                </td>
                <td className="px-5 py-4 text-white font-semibold text-[13px]">
                  ${o.quotes?.cost ? Number(o.quotes.cost).toLocaleString("en-US", { minimumFractionDigits: 2 }) : "-"}
                </td>
                <td className="px-5 py-4 text-white/50 text-[13px]">{o.quotes?.door_type}</td>
                <td className="px-5 py-4"><StatusBadge status={o.status} /></td>
                <td className="px-5 py-4 text-white/30 text-xs">{new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 transition-colors"
                  >
                    <Eye className="w-3 h-3" /> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
