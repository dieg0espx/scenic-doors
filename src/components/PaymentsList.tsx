"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, CheckCircle2 } from "lucide-react";
import { updatePaymentStatus } from "@/lib/actions/payments";

interface Payment {
  id: string;
  client_name: string;
  amount: number;
  payment_type: string;
  status: string;
  created_at: string;
  quotes: { quote_number: string; door_type: string };
}

const statusConfig: Record<string, { dot: string; bg: string; text: string }> = {
  pending: { dot: "bg-amber-400", bg: "bg-amber-400/10", text: "text-amber-300" },
  completed: { dot: "bg-emerald-400", bg: "bg-emerald-400/10", text: "text-emerald-300" },
  on_hold: { dot: "bg-orange-400", bg: "bg-orange-400/10", text: "text-orange-300" },
};

const typeLabels: Record<string, string> = {
  advance_50: "50% Advance",
  balance_50: "50% Balance",
};

export default function PaymentsList({ payments }: { payments: Payment[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (payments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.08] p-12 sm:p-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-7 h-7 text-emerald-400/60" />
        </div>
        <h3 className="text-lg font-semibold text-white/60 mb-1">No payments yet</h3>
        <p className="text-white/30 text-sm">Payments will appear after contracts are signed.</p>
      </div>
    );
  }

  async function handleMarkCompleted(id: string) {
    setLoadingId(id);
    setErrorMsg(null);
    try {
      await updatePaymentStatus(id, "completed");
      router.refresh();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to update payment status");
      setTimeout(() => setErrorMsg(null), 4000);
    } finally {
      setLoadingId(null);
    }
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${config.bg} ${config.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {status.replace("_", " ")}
      </span>
    );
  };

  const ActionButton = ({ payment }: { payment: Payment }) => {
    if (payment.status === "completed") {
      return (
        <span className="inline-flex items-center gap-1 text-emerald-400/60 text-xs">
          <CheckCircle2 className="w-3.5 h-3.5" /> Done
        </span>
      );
    }
    if (payment.status === "pending" || payment.status === "on_hold") {
      const isLoading = loadingId === payment.id;
      return (
        <button
          onClick={() => handleMarkCompleted(payment.id)}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-sm sm:text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer active:scale-95"
        >
          {isLoading ? (
            <><Loader2 className="w-3.5 h-3.5 sm:w-3 sm:h-3 animate-spin" /> Updating...</>
          ) : (
            "Mark Completed"
          )}
        </button>
      );
    }
    return null;
  };

  return (
    <>
      {errorMsg && (
        <div className="mb-4 text-red-400 text-sm bg-red-500/[0.08] border border-red-500/20 rounded-xl px-4 py-3">
          {errorMsg}
        </div>
      )}

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {payments.map((p) => (
          <div key={p.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-white font-medium text-[15px]">{p.client_name}</p>
                <p className="text-white/30 text-xs font-mono">{p.quotes?.quote_number}</p>
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
              <div className="flex items-end justify-end">
                <ActionButton payment={p} />
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
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Quote #</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Client</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Amount</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Type</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Status</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Date</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4 text-white/60 font-mono text-xs">{p.quotes?.quote_number}</td>
                <td className="px-5 py-4 text-white font-medium text-[13px]">{p.client_name}</td>
                <td className="px-5 py-4 text-white font-semibold text-[13px]">${Number(p.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                <td className="px-5 py-4 text-white/50 text-[13px]">{typeLabels[p.payment_type] || p.payment_type}</td>
                <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                <td className="px-5 py-4 text-white/30 text-xs">{new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                <td className="px-5 py-4"><ActionButton payment={p} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
