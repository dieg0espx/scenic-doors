"use client";

import { useState } from "react";
import { Send, Download, CheckCircle2, XCircle } from "lucide-react";
import { sendQuoteToClient, approveQuote, updateQuoteStatus } from "@/lib/actions/quotes";
import { useRouter } from "next/navigation";

interface Props {
  quoteId: string;
  quoteEmail: string;
  quoteStatus: string;
}

export default function QuoteDetailClient({ quoteId, quoteEmail, quoteStatus }: Props) {
  const [sending, setSending] = useState(false);
  const [approving, setApproving] = useState(false);
  const [declining, setDeclining] = useState(false);
  const router = useRouter();

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

  async function handleApprove() {
    if (!confirm("Approve this quote? The client will receive an email with a link to sign the contract.")) return;
    setApproving(true);
    try {
      await approveQuote(quoteId);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve quote");
    } finally {
      setApproving(false);
    }
  }

  async function handleDecline() {
    if (!confirm("Decline this quote? The client will see the quote as declined.")) return;
    setDeclining(true);
    try {
      await updateQuoteStatus(quoteId, "declined");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to decline quote");
    } finally {
      setDeclining(false);
    }
  }

  return (
    <>
      {quoteStatus === "pending_approval" && (
        <>
          <button
            onClick={handleApprove}
            disabled={approving}
            title="Approve"
            className="inline-flex items-center gap-1.5 p-2.5 sm:px-3 sm:py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium hover:bg-emerald-500/15 transition-colors cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{approving ? "Approving..." : "Approve"}</span>
          </button>
          <button
            onClick={handleDecline}
            disabled={declining}
            title="Decline"
            className="inline-flex items-center gap-1.5 p-2.5 sm:px-3 sm:py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-medium hover:bg-red-500/15 transition-colors cursor-pointer disabled:opacity-50"
          >
            <XCircle className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{declining ? "Declining..." : "Decline"}</span>
          </button>
        </>
      )}
      <button
        onClick={handleSendEmail}
        disabled={sending}
        title="Send email"
        className="inline-flex items-center gap-1.5 p-2.5 sm:px-3 sm:py-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-medium hover:bg-sky-500/15 transition-colors cursor-pointer disabled:opacity-50"
      >
        <Send className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{sending ? "Sending..." : "Email"}</span>
      </button>
      <a
        href={`/admin/quotes/${quoteId}/print`}
        target="_blank"
        rel="noopener noreferrer"
        title="Export PDF"
        className="inline-flex items-center gap-1.5 p-2.5 sm:px-3 sm:py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/50 text-xs font-medium hover:bg-white/[0.06] hover:text-white/80 transition-colors"
      >
        <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Export PDF</span>
      </a>
    </>
  );
}
