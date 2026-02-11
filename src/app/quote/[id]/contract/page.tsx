"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { getQuoteById } from "@/lib/actions/quotes";
import { getContractByQuoteId, createContract } from "@/lib/actions/contracts";
import { createPayment, getPaymentsByQuoteId } from "@/lib/actions/payments";
import { createOrder } from "@/lib/actions/orders";
import SignaturePad from "@/components/SignaturePad";
import ProgressStepper from "@/components/ProgressStepper";
import { ScrollText, ShieldCheck, User, CheckCircle2, XCircle, ArrowRight, FileText, Truck, MapPin } from "lucide-react";

interface Quote {
  id: string;
  quote_number: string;
  client_name: string;
  client_email: string;
  door_type: string;
  material: string;
  color: string;
  glass_type: string;
  size: string;
  cost: number;
  notes: string | null;
  status: string;
  delivery_type?: string;
  delivery_address?: string;
}

function CenteredCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] px-4">
      <div className="w-full max-w-md relative z-10">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8 sm:p-10 text-center">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ContractPage() {
  const params = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadySigned, setAlreadySigned] = useState(false);
  const [advancePaymentId, setAdvancePaymentId] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState("");
  const [clientName, setClientName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const quoteData = await getQuoteById(params.id as string);
      if (!quoteData || quoteData.status !== "accepted") {
        setLoading(false);
        return;
      }
      setQuote(quoteData);
      setClientName(quoteData.client_name);

      const existing = await getContractByQuoteId(quoteData.id);
      if (existing) {
        setAlreadySigned(true);
        const existingPayments = await getPaymentsByQuoteId(quoteData.id);
        const advance = existingPayments.find((p: { payment_type: string }) => p.payment_type === "advance_50");
        if (advance) setAdvancePaymentId(advance.id);
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!quote || !signatureData || !clientName.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const contract = await createContract({
        quoteId: quote.id,
        clientName: clientName.trim(),
        signatureDataUrl: signatureData,
        ipAddress: "client-side",
        userAgent: navigator.userAgent,
      });

      const advanceAmount = Number(quote.cost) * 0.5;
      const payment = await createPayment({
        quoteId: quote.id,
        contractId: contract.id,
        clientName: clientName.trim(),
        amount: advanceAmount,
      });

      await createOrder({
        quoteId: quote.id,
        contractId: contract.id,
        paymentId: payment.id,
        clientName: clientName.trim(),
        clientEmail: quote.client_email,
      });

      router.push(`/invoice/${payment.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit contract");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
        <div className="flex items-center gap-3 text-white/30">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white/50 rounded-full animate-spin" />
          Loading contract...
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <CenteredCard>
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-7 h-7 text-red-400/60" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Contract Unavailable</h1>
        <p className="text-white/30 text-sm">
          This quote must be accepted before signing a contract.
        </p>
      </CenteredCard>
    );
  }

  if (alreadySigned) {
    return (
      <CenteredCard>
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-emerald-400/60" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Contract Already Signed</h1>
        <p className="text-white/30 text-sm mb-6">
          The contract for this quote has already been signed.
        </p>
        {advancePaymentId && (
          <a
            href={`/invoice/${advancePaymentId}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-500/20"
          >
            View Invoice & Pay <ArrowRight className="w-4 h-4" />
          </a>
        )}
      </CenteredCard>
    );
  }

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#0d1117] py-6 sm:py-16 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/[0.03] rounded-full blur-3xl -translate-y-1/2" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Brand */}
        <div className="text-center mb-8 sm:mb-10">
          <Image
            src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif"
            alt="Scenic Doors"
            width={180}
            height={50}
            className="h-10 sm:h-12 w-auto mx-auto mb-4 brightness-0 invert"
          />
          <p className="text-white/25 text-sm mt-1">Service Agreement</p>
        </div>

        <ProgressStepper currentStep={2} />

        <form onSubmit={handleSubmit}>
          {/* Contract Document */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5 sm:p-8 mb-5">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <ScrollText className="w-4.5 h-4.5 text-amber-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Service Agreement & Contract</h2>
            </div>

            <div className="space-y-5 text-white/50 text-sm leading-relaxed">
              {/* Meta info */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-2.5 sm:p-3.5">
                  <p className="text-white/25 text-[10px] sm:text-[11px] uppercase tracking-wider font-medium mb-1">Date</p>
                  <p className="text-white/70 text-xs sm:text-sm font-medium">{today}</p>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-2.5 sm:p-3.5">
                  <p className="text-white/25 text-[10px] sm:text-[11px] uppercase tracking-wider font-medium mb-1">Quote Ref</p>
                  <p className="text-white/70 text-xs sm:text-sm font-mono font-medium">{quote.quote_number}</p>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-2.5 sm:p-3.5">
                  <p className="text-white/25 text-[10px] sm:text-[11px] uppercase tracking-wider font-medium mb-1">Client</p>
                  <p className="text-white/70 text-xs sm:text-sm font-medium truncate">{quote.client_name}</p>
                </div>
              </div>

              {/* Specs */}
              <div className="border-t border-white/[0.06] pt-5 scroll-mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-violet-500/15 text-violet-400 text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                  <h3 className="text-white font-semibold text-sm">Project Specifications</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { label: "Door Type", value: quote.door_type },
                    { label: "Material", value: quote.material },
                    { label: "Color", value: quote.color },
                    { label: "Glass", value: quote.glass_type },
                    { label: "Size", value: quote.size },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-baseline gap-2">
                      <span className="text-white/25 text-xs font-medium shrink-0">{label}:</span>
                      <span className="text-white/60 text-sm">{value}</span>
                    </div>
                  ))}
                  {quote.delivery_type && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-white/25 text-xs font-medium shrink-0 flex items-center gap-1">
                        {quote.delivery_type === "delivery" ? <Truck className="w-3 h-3 inline" /> : <MapPin className="w-3 h-3 inline" />}
                        Delivery:
                      </span>
                      <span className="text-white/60 text-sm">
                        {quote.delivery_type === "delivery" && quote.delivery_address
                          ? `Delivery to: ${quote.delivery_address}`
                          : quote.delivery_type === "pickup"
                            ? "Client Pickup"
                            : "Delivery (address TBD)"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Terms */}
              <div className="border-t border-white/[0.06] pt-5 scroll-mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                  <h3 className="text-white font-semibold text-sm">Payment Terms</h3>
                </div>
                <div className="rounded-xl bg-gradient-to-r from-emerald-500/[0.06] to-emerald-500/[0.02] border border-emerald-500/[0.08] p-4">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-emerald-500/[0.08]">
                    <span className="text-white/40 text-xs">Total Project Cost</span>
                    <span className="text-white font-bold">
                      ${Number(quote.cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-xs">50% Advance Payment</span>
                    <span className="text-emerald-400 text-lg font-bold">
                      ${(Number(quote.cost) * 0.5).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <p className="text-white/35 text-[13px] mt-3">
                  The remaining balance is due upon project completion.
                </p>
              </div>

              {/* Terms */}
              <div className="border-t border-white/[0.06] pt-5 scroll-mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0">3</span>
                  <h3 className="text-white font-semibold text-sm">Terms & Conditions</h3>
                </div>
                <ol className="space-y-2 list-decimal list-inside text-white/40 text-[13px] leading-loose">
                  <li>Scenic Doors agrees to supply and install the specified door system according to the specifications above.</li>
                  <li>The estimated timeline for completion will be communicated upon receipt of the advance payment.</li>
                  <li>Any changes to the original specifications may result in additional charges.</li>
                  <li>All materials come with manufacturer warranties. Installation is warranted for 5 years.</li>
                  <li>Cancellation within 72 hours of signing is eligible for a full refund of the advance payment.</li>
                </ol>
              </div>

              {/* Notes */}
              {quote.notes && (
                <div className="border-t border-white/[0.06] pt-5">
                  <h3 className="text-white font-semibold text-sm mb-2">Additional Notes</h3>
                  <p className="text-white/40 text-[13px]">{quote.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Signature Section */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5 sm:p-8 mt-6">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <ScrollText className="w-4.5 h-4.5 text-violet-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Sign Below</h3>
            </div>

            <div className="mb-5">
              <label className="flex items-center gap-2 text-[13px] font-medium text-white/40 mb-2">
                <User className="w-3.5 h-3.5" /> Full Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/30 transition-all hover:border-white/15"
                placeholder="Your full legal name"
              />
            </div>

            <div className="mb-5">
              <label className="flex items-center gap-2 text-[13px] font-medium text-white/40 mb-2">
                Signature
              </label>
              <SignaturePad onSignature={setSignatureData} />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5">
                {error}
              </div>
            )}

            <p className="text-white/25 text-xs mb-5 leading-relaxed">
              By signing this document, you agree to the terms and conditions outlined above
              and authorize Scenic Doors to proceed with the project.
            </p>

            <div className="sticky bottom-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117] to-transparent pt-6 pb-4 -mx-5 px-5 sm:static sm:bg-transparent sm:p-0 sm:m-0">
              <button
                type="submit"
                disabled={submitting || !signatureData || !clientName.trim()}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-base sm:text-sm transition-all shadow-lg shadow-violet-500/20 cursor-pointer active:scale-[0.98]"
              >
                {submitting ? "Submitting..." : <>Sign & Submit Contract <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          </div>
        </form>

        <p className="text-center text-white/10 text-xs mt-10">
          &copy; {new Date().getFullYear()} Scenic Doors. All rights reserved.
        </p>
      </div>
    </div>
  );
}
