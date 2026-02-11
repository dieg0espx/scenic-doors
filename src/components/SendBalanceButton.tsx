"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { createAndSendBalanceInvoice } from "@/lib/actions/payments";

export default function SendBalanceButton({
  quoteId,
  contractId,
  clientName,
  amount,
}: {
  quoteId: string;
  contractId: string;
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
      await createAndSendBalanceInvoice({
        quoteId,
        contractId,
        clientName,
        amount,
        origin: window.location.origin,
      });
      setSent(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send balance invoice");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
        <CheckCircle2 className="w-4 h-4" /> Balance invoice sent
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleSend}
        disabled={loading}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-300 text-sm font-medium transition-all cursor-pointer disabled:opacity-50 active:scale-95"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
        ) : (
          <><Send className="w-4 h-4" /> Send Balance Invoice</>
        )}
      </button>
      {error && (
        <p className="text-red-400 text-xs mt-2">{error}</p>
      )}
    </div>
  );
}
