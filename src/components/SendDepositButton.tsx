"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { createAndSendDepositInvoice } from "@/lib/actions/payments";

export default function SendDepositButton({
  quoteId,
  clientName,
  amount,
}: {
  quoteId: string;
  clientName: string;
  amount: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSend() {
    setLoading(true);
    setError("");
    try {
      await createAndSendDepositInvoice({
        quoteId,
        clientName,
        amount,
        origin: window.location.origin,
      });
      setSent(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send deposit invoice");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
        <CheckCircle2 className="w-4 h-4" /> Deposit invoice sent
      </div>
    );
  }

  return (
    <div>
      <p className="text-white/40 text-sm mb-3">
        Send the 50% deposit invoice (${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}) to the client.
      </p>
      <button
        onClick={handleSend}
        disabled={loading}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-300 text-sm font-medium transition-all cursor-pointer disabled:opacity-50 active:scale-95"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
        ) : (
          <><Send className="w-4 h-4" /> Send Deposit Invoice</>
        )}
      </button>
      {error && (
        <p className="text-red-400 text-xs mt-2">{error}</p>
      )}
    </div>
  );
}
