"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getQuoteById } from "@/lib/actions/quotes";
import { getPaymentsByQuoteId } from "@/lib/actions/payments";
import { CheckCircle2, CreditCard, XCircle, Clock, PartyPopper, ArrowRight } from "lucide-react";
import ProgressStepper from "@/components/ProgressStepper";

interface Quote {
  id: string;
  quote_number: string;
  client_name: string;
  cost: number;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  payment_type: string;
  created_at: string;
}

const typeLabels: Record<string, string> = {
  advance_50: "50% Advance",
  balance_50: "50% Balance",
};

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

export default function PaymentPage() {
  const params = useParams();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const quoteData = await getQuoteById(params.id as string);
      if (quoteData) {
        setQuote(quoteData);
        const paymentsData = await getPaymentsByQuoteId(quoteData.id);
        setPayments(paymentsData);
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
        <div className="flex items-center gap-3 text-white/30">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white/50 rounded-full animate-spin" />
          Loading payment details...
        </div>
      </div>
    );
  }

  if (!quote || payments.length === 0) {
    return (
      <CenteredCard>
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-7 h-7 text-red-400/60" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Payment Not Found</h1>
        <p className="text-white/30 text-sm">
          No payment record found. Please ensure you have signed the contract first.
        </p>
      </CenteredCard>
    );
  }

  const allCompleted = payments.every((p) => p.status === "completed");
  const totalPaid = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="min-h-screen bg-[#0d1117] py-6 sm:py-16 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-3xl -translate-y-1/2" />

      <div className="max-w-lg mx-auto relative z-10">
        {/* Brand */}
        <div className="text-center mb-8 sm:mb-10">
          <Image
            src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif"
            alt="Scenic Doors"
            width={180}
            height={50}
            className="h-10 sm:h-12 w-auto mx-auto mb-4 brightness-0 invert"
          />
          <p className="text-white/25 text-sm mt-1">Payment</p>
        </div>

        <ProgressStepper currentStep={allCompleted ? 4 : 3} />

        {/* All Complete Banner */}
        {allCompleted ? (
          <div className="rounded-2xl border border-emerald-500/[0.2] bg-emerald-500/[0.04] p-6 sm:p-8 mb-5 text-center ring-1 ring-emerald-500/[0.08] animate-pulse [animation-duration:3s]">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <PartyPopper className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">All Payments Complete</h2>
            <p className="text-white/35 text-sm">
              Thank you, <span className="text-white/60 font-medium">{quote.client_name}</span>! All payments for quote{" "}
              <span className="text-white/60 font-mono font-medium">{quote.quote_number}</span> have been received.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-500/[0.12] bg-emerald-500/[0.04] p-6 sm:p-8 mb-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Contract Signed Successfully</h2>
            <p className="text-white/35 text-sm">
              Thank you, <span className="text-white/60 font-medium">{quote.client_name}</span>! Your contract for quote{" "}
              <span className="text-white/60 font-mono font-medium">{quote.quote_number}</span> has been signed.
            </p>
          </div>
        )}

        {/* Payment Summary Card */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5 sm:p-8">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CreditCard className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Payment Summary</h3>
          </div>

          {/* Project Total */}
          <div className="flex justify-between items-center py-3 border-b border-white/[0.04] mb-4">
            <span className="text-white/35 text-sm">Project Total</span>
            <span className="text-white/70 font-medium text-sm">
              ${Number(quote.cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Payment Items */}
          <div className="space-y-3 mb-6">
            {payments.map((p) => (
              <div
                key={p.id}
                className={`rounded-xl border p-5 border-l-4 ${
                  p.status === "completed"
                    ? "border-emerald-500/[0.1] bg-emerald-500/[0.04] border-l-emerald-500"
                    : "border-amber-500/[0.1] bg-amber-500/[0.04] border-l-amber-500"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/60 text-sm font-medium">
                    {typeLabels[p.payment_type] || p.payment_type}
                  </span>
                  <span className="text-white font-bold">
                    ${Number(p.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {p.status === "completed" ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-xs font-medium">Paid</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-amber-400 text-xs font-medium">
                          {p.status === "on_hold" ? "On Hold" : "Pending"}
                        </span>
                      </>
                    )}
                  </div>
                  <a
                    href={`/invoice/${p.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-white/40 hover:text-white/70 transition-colors"
                  >
                    View Invoice <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Paid vs Remaining */}
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/35 text-xs">Total Paid</span>
              <span className="text-emerald-400 font-semibold text-sm">
                ${totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/35 text-xs">Remaining</span>
              <span className="text-white/50 font-semibold text-sm">
                ${(Number(quote.cost) - totalPaid).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Info note for pending payments */}
          {!allCompleted && (
            <div className="mt-5 rounded-xl bg-white/[0.03] border border-white/[0.05] p-4 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-white/25 shrink-0 mt-0.5" />
              <p className="text-white/35 text-sm leading-relaxed">
                Our team will contact you with payment instructions for any pending amounts.
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-white/10 text-xs mt-10">
          &copy; {new Date().getFullYear()} Scenic Doors. All rights reserved.
        </p>
      </div>
    </div>
  );
}
