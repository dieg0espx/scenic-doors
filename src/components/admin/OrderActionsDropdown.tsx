"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, DollarSign, CreditCard, Send, Loader2, CheckCircle2 } from "lucide-react";
import { createAndSendDepositInvoice, createAndSendBalanceInvoice } from "@/lib/actions/payments";

type ActionState = "idle" | "loading" | "sent" | "error";

export default function OrderActionsDropdown({
  quoteId,
  contractId,
  clientName,
  depositAmount,
  balanceAmount,
  canSendDeposit,
  canSendBalance,
}: {
  quoteId: string;
  contractId?: string;
  clientName: string;
  depositAmount: number;
  balanceAmount: number;
  canSendDeposit: boolean;
  canSendBalance: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  const [depositState, setDepositState] = useState<ActionState>("idle");
  const [depositError, setDepositError] = useState("");
  const [balanceState, setBalanceState] = useState<ActionState>("idle");
  const [balanceError, setBalanceError] = useState("");

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, close]);

  const hasActions = canSendDeposit || canSendBalance;
  if (!hasActions) return null;

  async function handleDeposit() {
    setDepositState("loading");
    setDepositError("");
    try {
      await createAndSendDepositInvoice({
        quoteId,
        clientName,
        amount: depositAmount,
        origin: window.location.origin,
      });
      setDepositState("sent");
      router.refresh();
    } catch (err) {
      setDepositError(err instanceof Error ? err.message : "Failed to send");
      setDepositState("error");
    }
  }

  async function handleBalance() {
    setBalanceState("loading");
    setBalanceError("");
    try {
      await createAndSendBalanceInvoice({
        quoteId,
        contractId,
        clientName,
        amount: balanceAmount,
        origin: window.location.origin,
      });
      setBalanceState("sent");
      router.refresh();
    } catch (err) {
      setBalanceError(err instanceof Error ? err.message : "Failed to send");
      setBalanceState("error");
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border text-white/40 hover:text-white/70 transition-all cursor-pointer active:scale-95 ${
          open
            ? "bg-white/[0.06] border-white/[0.12] ring-2 ring-white/[0.06]"
            : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]"
        }`}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1.5 w-72 rounded-xl border border-white/[0.08] bg-[#161b22] shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 border-b border-white/[0.06]">
            <p className="text-white/30 text-[10px] uppercase tracking-wider font-semibold">Actions</p>
          </div>
          <div className="p-1.5 space-y-0.5">
            {canSendDeposit && (
              <div>
                <button
                  type="button"
                  onClick={handleDeposit}
                  disabled={depositState === "loading" || depositState === "sent"}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer disabled:cursor-default hover:bg-white/[0.04] disabled:hover:bg-transparent"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                    {depositState === "loading" ? (
                      <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    ) : depositState === "sent" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${depositState === "sent" ? "text-emerald-400" : "text-white/70"}`}>
                      {depositState === "sent" ? "Deposit invoice sent" : "Send Deposit Invoice"}
                    </p>
                    <p className="text-white/25 text-[10px]">
                      50% — ${depositAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  {depositState === "idle" && <Send className="w-3 h-3 text-white/20 shrink-0" />}
                </button>
                {depositState === "error" && (
                  <p className="text-red-400 text-[10px] px-3 pb-1">{depositError}</p>
                )}
              </div>
            )}
            {canSendBalance && (
              <div>
                <button
                  type="button"
                  onClick={handleBalance}
                  disabled={balanceState === "loading" || balanceState === "sent"}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer disabled:cursor-default hover:bg-white/[0.04] disabled:hover:bg-transparent"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                    {balanceState === "loading" ? (
                      <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    ) : balanceState === "sent" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${balanceState === "sent" ? "text-emerald-400" : "text-white/70"}`}>
                      {balanceState === "sent" ? "Balance invoice sent" : "Send Balance Invoice"}
                    </p>
                    <p className="text-white/25 text-[10px]">
                      Remaining — ${balanceAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  {balanceState === "idle" && <Send className="w-3 h-3 text-white/20 shrink-0" />}
                </button>
                {balanceState === "error" && (
                  <p className="text-red-400 text-[10px] px-3 pb-1">{balanceError}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
