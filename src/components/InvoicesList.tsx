"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Receipt, Download, Loader2, CheckCircle2, Send, Copy, Check, ExternalLink } from "lucide-react";
import { generateInvoicePdf } from "@/lib/generateInvoicePdf";
import { sendInvoiceToClient } from "@/lib/actions/payments";

interface Payment {
  id: string;
  client_name: string;
  amount: number;
  payment_type: string;
  status: string;
  created_at: string;
  payment_method?: string | null;
  payment_reference?: string | null;
  quotes: {
    quote_number: string;
    door_type: string;
    cost: number;
    material: string;
    color: string;
    glass_type: string;
    size: string;
    client_email: string;
    delivery_type?: string;
    delivery_address?: string;
  };
}

const statusConfig: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  pending: { dot: "bg-amber-400", bg: "bg-amber-400/10", text: "text-amber-300", label: "Unpaid" },
  completed: { dot: "bg-emerald-400", bg: "bg-emerald-400/10", text: "text-emerald-300", label: "Paid" },
  on_hold: { dot: "bg-orange-400", bg: "bg-orange-400/10", text: "text-orange-300", label: "Awaiting Verification" },
};

const typeLabels: Record<string, string> = {
  advance_50: "50% Advance",
  balance_50: "50% Balance",
};

const methodLabels: Record<string, string> = {
  bank_transfer: "Bank Transfer",
  zelle: "Zelle",
  check: "Check",
  cash: "Cash",
};

function getInvoiceNumber(payment: Payment) {
  const isAdvance = payment.payment_type === "advance_50";
  return `INV-${payment.quotes.quote_number.replace("QT-", "")}${isAdvance ? "-A" : "-B"}`;
}

export default function InvoicesList({ payments }: { payments: Payment[] }) {
  const router = useRouter();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  async function handleDownload(payment: Payment) {
    setDownloadingId(payment.id);
    try {
      const doc = await generateInvoicePdf(payment);
      doc.save(`${getInvoiceNumber(payment)}.pdf`);
    } catch (err) {
      console.error("Failed to generate invoice PDF:", err);
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleSendInvoice(payment: Payment) {
    setSendingId(payment.id);
    setSendError(null);
    try {
      await sendInvoiceToClient(payment.id, window.location.origin);
      router.refresh();
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Failed to send invoice");
      setTimeout(() => setSendError(null), 4000);
    } finally {
      setSendingId(null);
    }
  }

  async function handleCopyLink(payment: Payment) {
    const url = `${window.location.origin}/invoice/${payment.id}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(payment.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  if (payments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.08] p-12 sm:p-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center mx-auto mb-4">
          <Receipt className="w-7 h-7 text-sky-400/60" />
        </div>
        <h3 className="text-lg font-semibold text-white/60 mb-1">No invoices yet</h3>
        <p className="text-white/30 text-sm">Invoices are generated when payments are created.</p>
      </div>
    );
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const isPaid = status === "completed";
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${config.bg} ${config.text}`}>
        {isPaid ? (
          <CheckCircle2 className="w-3 h-3" />
        ) : (
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        )}
        {config.label}
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
        {payments.map((p) => (
          <div key={p.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-white font-medium text-[15px]">{p.client_name}</p>
                <p className="text-white/30 text-xs font-mono">{getInvoiceNumber(p)}</p>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Amount</p>
                <p className="text-white font-bold text-base mt-0.5">${Number(p.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Type</p>
                <p className="text-white/50 text-xs mt-0.5">{typeLabels[p.payment_type] || p.payment_type}</p>
              </div>
              <div>
                <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Date</p>
                <p className="text-white/40 text-xs mt-0.5">{new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
              </div>
              {p.status === "on_hold" && p.payment_method && (
                <div>
                  <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Method</p>
                  <p className="text-orange-300 text-xs mt-0.5">{methodLabels[p.payment_method] || p.payment_method}</p>
                </div>
              )}
            </div>
            {p.status === "on_hold" && p.payment_reference && (
              <div className="mt-3 pt-3 border-t border-white/[0.04]">
                <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Reference</p>
                <p className="text-white/50 font-mono text-xs mt-0.5">{p.payment_reference}</p>
              </div>
            )}
            <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(p)}
                  disabled={downloadingId === p.id}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 text-sm font-medium transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  {downloadingId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} PDF
                </button>
                <button
                  onClick={() => handleCopyLink(p)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/50 hover:text-white text-sm font-medium transition-all cursor-pointer active:scale-95"
                >
                  {copiedId === p.id ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Link</>}
                </button>
              </div>
              {p.status === "pending" && (
                <button
                  onClick={() => handleSendInvoice(p)}
                  disabled={sendingId === p.id}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  {sendingId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Send Invoice
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
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Invoice #</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Client</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Amount</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Type</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Status</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Payment Info</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4 text-white/60 font-mono text-xs">{getInvoiceNumber(p)}</td>
                <td className="px-5 py-4">
                  <p className="text-white font-medium text-[13px]">{p.client_name}</p>
                  <p className="text-white/30 text-xs">{p.quotes?.client_email}</p>
                </td>
                <td className="px-5 py-4 text-white font-semibold text-[13px]">${Number(p.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                <td className="px-5 py-4 text-white/50 text-[13px]">{typeLabels[p.payment_type] || p.payment_type}</td>
                <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                <td className="px-5 py-4">
                  {p.status === "on_hold" || p.status === "completed" ? (
                    <div>
                      {p.payment_method && (
                        <p className="text-white/50 text-xs">{methodLabels[p.payment_method] || p.payment_method}</p>
                      )}
                      {p.payment_reference && (
                        <p className="text-white/30 font-mono text-[11px] mt-0.5">Ref: {p.payment_reference}</p>
                      )}
                    </div>
                  ) : (
                    <span className="text-white/20 text-xs">-</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDownload(p)}
                      disabled={downloadingId === p.id}
                      title="Download invoice PDF"
                      className="p-2 rounded-lg hover:bg-sky-500/10 text-white/30 hover:text-sky-400 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {downloadingId === p.id ? <Loader2 className="w-4 h-4 animate-spin text-sky-400" /> : <Download className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleCopyLink(p)}
                      title="Copy invoice link"
                      className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white transition-all cursor-pointer"
                    >
                      {copiedId === p.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <a
                      href={`/invoice/${p.id}`}
                      target="_blank"
                      title="View public invoice page"
                      className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    {p.status === "pending" && (
                      <button
                        onClick={() => handleSendInvoice(p)}
                        disabled={sendingId === p.id}
                        title="Send invoice to client via email"
                        className="p-2 rounded-lg hover:bg-emerald-500/10 text-white/30 hover:text-emerald-400 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {sendingId === p.id ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : <Send className="w-4 h-4" />}
                      </button>
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
