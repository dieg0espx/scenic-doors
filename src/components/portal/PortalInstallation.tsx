"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, CheckCircle2, Loader2, FileText, CreditCard } from "lucide-react";
import SignaturePad from "@/components/SignaturePad";
import { approveInstallationQuote } from "@/lib/actions/installation-quotes";
import type { InstallationQuote } from "@/lib/actions/installation-quotes";

interface Props {
  installationQuote: InstallationQuote;
  clientName: string;
}

export default function PortalInstallation({ installationQuote, clientName }: Props) {
  const router = useRouter();
  const [signatureData, setSignatureData] = useState("");
  const [signerName, setSignerName] = useState(clientName);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { status, items, total } = installationQuote;
  const isPaid = status === "paid";
  const isApproved = status === "approved";

  async function handleApprove() {
    if (!signatureData || !signerName.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const paymentId = await approveInstallationQuote(installationQuote.id, signatureData, signerName.trim());
      router.push(`/invoice/${paymentId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-ocean-200 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-ocean-100 bg-ocean-50/50">
          <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-sky-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-ocean-900">Installation Quote</h2>
            <p className="text-xs text-ocean-400">Review the installation details below</p>
          </div>
          {isPaid && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" /> Paid
            </span>
          )}
          {isApproved && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" /> Approved
            </span>
          )}
          {status === "sent" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-amber-100 text-amber-700">
              <FileText className="w-3.5 h-3.5" /> Awaiting Approval
            </span>
          )}
        </div>

        {/* Line items */}
        <div className="p-5">
          <div className="space-y-0">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between py-3 ${idx < items.length - 1 ? "border-b border-ocean-100" : ""}`}
              >
                <span className="text-sm text-ocean-700">{item.description}</span>
                <span className="text-sm font-semibold text-ocean-900 ml-4 shrink-0">
                  ${Number(item.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t-2 border-ocean-200">
            <span className="text-sm font-bold text-ocean-900">Total</span>
            <span className="text-xl font-bold text-ocean-900">
              ${Number(total).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Approval section — only for "sent" status */}
      {status === "sent" && (
        <div className="bg-white rounded-2xl border border-ocean-200 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-ocean-100 bg-ocean-50/50">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ocean-900">Approve Installation</h3>
              <p className="text-xs text-ocean-400">Sign below to approve and proceed to payment</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-ocean-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-ocean-200 text-ocean-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
              />
            </div>

            {/* Signature */}
            <div>
              <label className="block text-sm font-medium text-ocean-700 mb-1.5">Signature</label>
              <SignaturePad onSignature={setSignatureData} theme="light" typedName={signerName} />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              onClick={handleApprove}
              disabled={submitting || !signatureData || !signerName.trim()}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all cursor-pointer"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Approving...</>
              ) : (
                <>Approve & Proceed to Payment</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Approved — link to pay */}
      {isApproved && installationQuote.payment_id && (
        <div className="bg-white rounded-2xl border border-ocean-200 p-5 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center mx-auto">
            <CreditCard className="w-6 h-6 text-sky-600" />
          </div>
          <p className="text-sm text-ocean-600">Your installation quote has been approved. Please proceed to payment.</p>
          <a
            href={`/invoice/${installationQuote.payment_id}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all"
          >
            <CreditCard className="w-4 h-4" />
            Pay Now
          </a>
        </div>
      )}

      {/* Paid — confirmation */}
      {isPaid && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-6 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-ocean-900">Installation Paid</h3>
          <p className="text-sm text-ocean-500">
            Thank you! Your installation payment has been completed
            {installationQuote.signed_at && (
              <>. Approved on {new Date(installationQuote.signed_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</>
            )}
            .
          </p>
        </div>
      )}
    </div>
  );
}
