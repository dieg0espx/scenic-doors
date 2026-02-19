"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendQuoteToClient } from "@/lib/actions/quotes";
import { Send, Copy, Check, FileText, Loader2, Pencil } from "lucide-react";

interface Quote {
  id: string;
  quote_number: string;
  client_name: string;
  client_email: string;
  door_type: string;
  cost: number;
  grand_total?: number;
  status: string;
  created_at: string;
}

const statusConfig: Record<string, { dot: string; bg: string; text: string }> = {
  draft: { dot: "bg-gray-400", bg: "bg-gray-400/10", text: "text-gray-300" },
  sent: { dot: "bg-blue-400", bg: "bg-blue-400/10", text: "text-blue-300" },
  viewed: { dot: "bg-amber-400", bg: "bg-amber-400/10", text: "text-amber-300" },
  accepted: { dot: "bg-emerald-400", bg: "bg-emerald-400/10", text: "text-emerald-300" },
  declined: { dot: "bg-red-400", bg: "bg-red-400/10", text: "text-red-300" },
};

export default function QuotesList({ quotes }: { quotes: Quote[] }) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  async function handleCopyLink(id: string) {
    const url = `${window.location.origin}/quote/${id}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleSendQuote(id: string) {
    setSendingId(id);
    setSendError(null);
    try {
      await sendQuoteToClient(id, window.location.origin);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Failed to send email");
      setTimeout(() => setSendError(null), 4000);
    } finally {
      setSendingId(null);
    }
  }

  if (quotes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.08] p-12 sm:p-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-7 h-7 text-violet-400/60" />
        </div>
        <h3 className="text-lg font-semibold text-white/60 mb-1">No quotes yet</h3>
        <p className="text-white/30 text-sm">Create your first quote to get started.</p>
      </div>
    );
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${config.bg} ${config.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <>
      {sendError && (
        <div className="mb-4 text-red-400 text-sm bg-red-500/[0.08] border border-red-500/20 rounded-xl px-4 py-3">
          {sendError}
        </div>
      )}

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {quotes.map((q) => (
          <div key={q.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0">
                <p className="text-white font-medium text-[15px]">{q.client_name}</p>
                <p className="text-white/30 text-xs truncate">{q.client_email}</p>
              </div>
              <StatusBadge status={q.status} />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Quote</p>
                <p className="text-white/70 font-mono text-xs mt-0.5">{q.quote_number}</p>
              </div>
              <div>
                <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Cost</p>
                <p className="text-white font-semibold text-sm mt-0.5">
                  ${Number(q.grand_total || q.cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Type</p>
                <p className="text-white/50 text-xs mt-0.5">{q.door_type}</p>
              </div>
              <div>
                <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Date</p>
                <p className="text-white/40 text-xs mt-0.5">{new Date(q.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-white/[0.06] space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopyLink(q.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.08] text-sm font-medium transition-all cursor-pointer active:scale-95"
                >
                  {copiedId === q.id ? <><Check className="w-4 h-4 text-emerald-400" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
                {q.status === "draft" && (
                  <button
                    onClick={() => router.push(`/admin/quotes/${q.id}/edit`)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.08] text-sm font-medium transition-all cursor-pointer active:scale-95"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                )}
              </div>
              {q.status === "draft" && (
                <button
                  onClick={() => handleSendQuote(q.id)}
                  disabled={sendingId === q.id}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium transition-all cursor-pointer hover:bg-violet-500/15 disabled:opacity-50 active:scale-95"
                >
                  {sendingId === q.id
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    : <><Send className="w-4 h-4" /> Send to Client</>
                  }
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl border border-white/[0.06] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Quote #</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Client</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Door Type</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Cost</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Status</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Date</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {quotes.map((q) => (
              <tr key={q.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4 text-white/60 font-mono text-xs">{q.quote_number}</td>
                <td className="px-5 py-4">
                  <p className="text-white font-medium text-[13px]">{q.client_name}</p>
                  <p className="text-white/30 text-xs">{q.client_email}</p>
                </td>
                <td className="px-5 py-4 text-white/50 text-[13px]">{q.door_type}</td>
                <td className="px-5 py-4 text-white font-semibold text-[13px]">
                  ${Number(q.grand_total || q.cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-5 py-4"><StatusBadge status={q.status} /></td>
                <td className="px-5 py-4 text-white/30 text-xs">{new Date(q.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleCopyLink(q.id)} title="Copy public link" className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white transition-all cursor-pointer">
                      {copiedId === q.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    {q.status === "draft" && (
                      <>
                        <button
                          onClick={() => router.push(`/admin/quotes/${q.id}/edit`)}
                          title="Edit quote"
                          className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white transition-all cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSendQuote(q.id)}
                          disabled={sendingId === q.id}
                          title="Send quote to client via email"
                          className="p-2 rounded-lg hover:bg-violet-500/10 text-white/30 hover:text-violet-400 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {sendingId === q.id
                            ? <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                            : <Send className="w-4 h-4" />
                          }
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
