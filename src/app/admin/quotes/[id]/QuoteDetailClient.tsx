"use client";

import { useState } from "react";
import { Send, Download } from "lucide-react";
import { sendQuoteToClient } from "@/lib/actions/quotes";

interface Props {
  quoteId: string;
  quoteEmail: string;
}

export default function QuoteDetailClient({ quoteId, quoteEmail }: Props) {
  const [sending, setSending] = useState(false);

  async function handleSendEmail() {
    if (!confirm(`Send quote to ${quoteEmail}?`)) return;
    setSending(true);
    try {
      await sendQuoteToClient(quoteId, window.location.origin);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to send email");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        onClick={handleSendEmail}
        disabled={sending}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-medium hover:bg-sky-500/15 transition-colors cursor-pointer disabled:opacity-50"
      >
        <Send className="w-3.5 h-3.5" /> {sending ? "Sending..." : "Email"}
      </button>
      <a
        href={`/admin/quotes/${quoteId}/print`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/50 text-xs font-medium hover:bg-white/[0.06] hover:text-white/80 transition-colors"
      >
        <Download className="w-3.5 h-3.5" /> Export PDF
      </a>
    </>
  );
}
