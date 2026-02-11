import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, User, MapPin, FileText, Package } from "lucide-react";
import { getClientWithHistory } from "@/lib/actions/clients";
import ClientContactInfo from "@/components/ClientContactInfo";
import ClientAddresses from "@/components/ClientAddresses";

export const dynamic = "force-dynamic";

const quoteStatusConfig: Record<string, { dot: string; bg: string; text: string }> = {
  draft: { dot: "bg-gray-400", bg: "bg-gray-400/10", text: "text-gray-300" },
  sent: { dot: "bg-blue-400", bg: "bg-blue-400/10", text: "text-blue-300" },
  viewed: { dot: "bg-amber-400", bg: "bg-amber-400/10", text: "text-amber-300" },
  accepted: { dot: "bg-emerald-400", bg: "bg-emerald-400/10", text: "text-emerald-300" },
  declined: { dot: "bg-red-400", bg: "bg-red-400/10", text: "text-red-300" },
};

const orderStatusConfig: Record<string, { dot: string; bg: string; text: string }> = {
  pending: { dot: "bg-amber-400", bg: "bg-amber-400/10", text: "text-amber-300" },
  in_progress: { dot: "bg-sky-400", bg: "bg-sky-400/10", text: "text-sky-300" },
  completed: { dot: "bg-emerald-400", bg: "bg-emerald-400/10", text: "text-emerald-300" },
  cancelled: { dot: "bg-red-400", bg: "bg-red-400/10", text: "text-red-300" },
};

function StatusBadge({ status, config }: { status: string; config: Record<string, { dot: string; bg: string; text: string }> }) {
  const c = config[status] || { dot: "bg-gray-400", bg: "bg-gray-400/10", text: "text-gray-300" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
    </span>
  );
}

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await getClientWithHistory(id);

  if (!client) redirect("/admin/clients");

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/clients" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Clients
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">{client.name}</h1>
        <p className="text-white/40 text-sm mt-1">{client.email}</p>
      </div>

      <div className="space-y-6">
        {/* ── Contact Info ── */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
          <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <User className="w-4 h-4 text-teal-400" />
            </div>
            <h3 className="text-base font-semibold text-white">Contact Info</h3>
          </div>
          <div className="p-5 sm:p-6">
            <ClientContactInfo client={{
              id: client.id,
              name: client.name,
              email: client.email,
              phone: client.phone,
              company: client.company,
              notes: client.notes,
            }} />
          </div>
        </div>

        {/* ── Addresses ── */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
          <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-base font-semibold text-white">Addresses</h3>
          </div>
          <div className="p-5 sm:p-6">
            <ClientAddresses clientId={id} addresses={client.client_addresses || []} />
          </div>
        </div>

        {/* ── Quotes ── */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
          <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-violet-400" />
            </div>
            <h3 className="text-base font-semibold text-white">Quotes</h3>
            <span className="text-white/30 text-sm">{client.quotes?.length || 0}</span>
          </div>
          <div className="p-5 sm:p-6">
            {client.quotes && client.quotes.length > 0 ? (
              <div className="space-y-2">
                {client.quotes.map((q: { id: string; quote_number: string; door_type: string; cost: number; status: string; created_at: string }) => (
                  <Link
                    key={q.id}
                    href={`/admin/quotes`}
                    className="block rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1 sm:mb-0">
                      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                        <span className="text-white/50 font-mono text-xs">{q.quote_number}</span>
                        <span className="text-white text-sm truncate hidden sm:inline">{q.door_type}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <span className="text-white font-semibold text-sm">
                          ${Number(q.cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                        <StatusBadge status={q.status} config={quoteStatusConfig} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:hidden">
                      <span className="text-white/40 text-xs">{q.door_type}</span>
                      <span className="text-white/30 text-xs">
                        {new Date(q.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <span className="text-white/30 text-xs hidden sm:block mt-0.5">
                      {q.door_type} · {new Date(q.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-white/30 text-sm text-center py-4">No quotes yet</p>
            )}
          </div>
        </div>

        {/* ── Orders ── */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
          <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
              <Package className="w-4 h-4 text-sky-400" />
            </div>
            <h3 className="text-base font-semibold text-white">Orders</h3>
            <span className="text-white/30 text-sm">{client.orders?.length || 0}</span>
          </div>
          <div className="p-5 sm:p-6">
            {client.orders && client.orders.length > 0 ? (
              <div className="space-y-2">
                {client.orders.map((o: { id: string; order_number: string; status: string; created_at: string; quotes: { quote_number: string; door_type: string; cost: number } }) => (
                  <Link
                    key={o.id}
                    href={`/admin/orders/${o.id}`}
                    className="block rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1 sm:mb-0">
                      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                        <span className="text-white/50 font-mono text-xs">{o.order_number}</span>
                        <span className="text-white text-sm truncate hidden sm:inline">{o.quotes?.door_type}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <span className="text-white font-semibold text-sm">
                          ${o.quotes?.cost ? Number(o.quotes.cost).toLocaleString("en-US", { minimumFractionDigits: 2 }) : "—"}
                        </span>
                        <StatusBadge status={o.status} config={orderStatusConfig} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:hidden">
                      <span className="text-white/40 text-xs">{o.quotes?.door_type}</span>
                      <span className="text-white/30 text-xs">
                        {new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <span className="text-white/30 text-xs hidden sm:block mt-0.5">
                      {o.quotes?.door_type} · {new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-white/30 text-sm text-center py-4">No orders yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
