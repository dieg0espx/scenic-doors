"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getQuoteById, markQuoteViewed, updateQuoteStatus } from "@/lib/actions/quotes";
import { FileText, CheckCircle2, XCircle, DoorOpen, Layers, Palette, GlassWater, Ruler, ArrowRight, Truck, MapPin, Clock } from "lucide-react";
import ProgressStepper from "@/components/ProgressStepper";

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

const statusColors: Record<string, { dot: string; bg: string; text: string }> = {
  draft: { dot: "bg-gray-400", bg: "bg-gray-400/10", text: "text-gray-300" },
  sent: { dot: "bg-blue-400", bg: "bg-blue-400/10", text: "text-blue-300" },
  viewed: { dot: "bg-amber-400", bg: "bg-amber-400/10", text: "text-amber-300" },
  pending_approval: { dot: "bg-amber-400", bg: "bg-amber-400/10", text: "text-amber-300" },
  accepted: { dot: "bg-emerald-400", bg: "bg-emerald-400/10", text: "text-emerald-300" },
  declined: { dot: "bg-red-400", bg: "bg-red-400/10", text: "text-red-300" },
};

function CenteredCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] px-4">
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-violet-500/[0.03] rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-amber-500/[0.03] rounded-full blur-3xl" />
      <div className="w-full max-w-md relative z-10">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8 sm:p-10 text-center">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function PublicQuotePage() {
  const params = useParams();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getQuoteById(params.id as string);
      if (data) {
        setQuote(data);
        await markQuoteViewed(data.id);
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  async function handleAccept() {
    if (!quote) return;
    setActionLoading(true);
    await updateQuoteStatus(quote.id, "pending_approval");
    setQuote({ ...quote, status: "pending_approval" });
    setActionLoading(false);
  }

  async function handleDecline() {
    if (!quote) return;
    setActionLoading(true);
    await updateQuoteStatus(quote.id, "declined");
    setDeclined(true);
    setActionLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
        <div className="flex items-center gap-3 text-white/30">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white/50 rounded-full animate-spin" />
          Loading quote...
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
        <h1 className="text-xl font-bold text-white mb-2">Quote Not Found</h1>
        <p className="text-white/30 text-sm">This quote does not exist or has been removed.</p>
      </CenteredCard>
    );
  }

  if (declined) {
    return (
      <CenteredCard>
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-7 h-7 text-red-400/60" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Quote Declined</h1>
        <p className="text-white/30 text-sm">
          Thank you for your time. If you change your mind or have any questions,
          please don&apos;t hesitate to contact us.
        </p>
      </CenteredCard>
    );
  }

  if (quote.status === "pending_approval") {
    return (
      <CenteredCard>
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-7 h-7 text-amber-400/60" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Acceptance Submitted</h1>
        <p className="text-white/30 text-sm">
          Thank you for accepting the quote! Our team is reviewing your acceptance and you&apos;ll receive an email with the next steps shortly.
        </p>
      </CenteredCard>
    );
  }

  if (quote.status === "accepted") {
    return (
      <CenteredCard>
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-emerald-400/60" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Quote Accepted</h1>
        <p className="text-white/30 text-sm mb-6">
          This quote has already been accepted. Please proceed to sign the contract.
        </p>
        <a
          href={`/quote/${quote.id}/contract`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-500/20"
        >
          Sign Contract <ArrowRight className="w-4 h-4" />
        </a>
      </CenteredCard>
    );
  }

  if (quote.status === "declined") {
    return (
      <CenteredCard>
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-7 h-7 text-red-400/60" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Quote Declined</h1>
        <p className="text-white/30 text-sm">
          This quote has been declined. Please contact us if you&apos;d like to discuss further.
        </p>
      </CenteredCard>
    );
  }

  const sc = statusColors[quote.status] || statusColors.draft;

  const specs = [
    { label: "Door Type", value: quote.door_type, icon: DoorOpen },
    { label: "Material", value: quote.material, icon: Layers },
    { label: "Color", value: quote.color, icon: Palette },
    { label: "Glass Type", value: quote.glass_type, icon: GlassWater },
    { label: "Size", value: quote.size, icon: Ruler },
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] py-6 sm:py-16 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/[0.03] rounded-full blur-3xl -translate-y-1/2" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Brand */}
        <div className="text-center mb-8 sm:mb-10">
          <Image
            src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif"
            alt="Scenic Doors"
            width={180}
            height={50}
            className="h-10 sm:h-12 w-auto mx-auto mb-4 brightness-0 invert"
          />
          <p className="text-white/25 text-sm mt-1">Premium Door Solutions</p>
        </div>

        <ProgressStepper currentStep={1} />

        {/* Quote Card */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5 sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-violet-400" />
                <span className="text-white/30 text-xs font-medium uppercase tracking-wider">Quote</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">{quote.quote_number}</h2>
              <p className="text-white/30 text-sm mt-0.5">Prepared for {quote.client_name}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${sc.bg} ${sc.text} shrink-0`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
            </span>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
            {specs.map(({ label, value, icon: Icon }, index) => (
              <div key={label} className={`rounded-xl bg-white/[0.03] border border-white/[0.04] p-3.5${specs.length % 2 !== 0 && index === specs.length - 1 ? " col-span-2" : ""}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className="w-3.5 h-3.5 text-white/20" />
                  <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">{label}</p>
                </div>
                <p className="text-white font-medium text-sm">{value}</p>
              </div>
            ))}
          </div>

          {/* Delivery Info */}
          {quote.delivery_type && (
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-3.5 mb-6">
              <div className="flex items-center gap-2 mb-1.5">
                {quote.delivery_type === "delivery" ? (
                  <Truck className="w-3.5 h-3.5 text-sky-400" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                )}
                <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">
                  {quote.delivery_type === "delivery" ? "Delivery" : "Pickup"}
                </p>
              </div>
              <p className="text-white font-medium text-sm">
                {quote.delivery_type === "delivery" && quote.delivery_address
                  ? quote.delivery_address
                  : quote.delivery_type === "pickup"
                    ? "Client will pick up"
                    : "Address not specified"}
              </p>
            </div>
          )}

          {/* Notes */}
          {quote.notes && (
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-3.5 mb-6">
              <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium mb-1.5">Notes</p>
              <p className="text-white/50 text-sm">{quote.notes}</p>
            </div>
          )}

          {/* Total */}
          <div className="rounded-xl bg-gradient-to-r from-violet-500/[0.08] to-violet-500/[0.04] border border-violet-500/[0.1] p-5 mb-8 ring-1 ring-violet-500/[0.08]">
            <div className="flex items-center justify-between">
              <p className="text-white/40 text-xs uppercase tracking-wider font-medium">Total Cost</p>
              <p className="text-3xl font-bold text-white">
                ${Number(quote.cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAccept}
              disabled={actionLoading}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-base sm:text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-[0.98]"
            >
              {actionLoading ? "Processing..." : <>Accept Quote <ArrowRight className="w-4 h-4" /></>}
            </button>
            <button
              onClick={handleDecline}
              disabled={actionLoading}
              className="flex-1 py-4 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] disabled:opacity-50 disabled:cursor-not-allowed text-white/40 hover:text-white/60 font-medium text-base sm:text-sm transition-all cursor-pointer active:scale-[0.98]"
            >
              Decline
            </button>
          </div>
        </div>

        <p className="text-center text-white/10 text-xs mt-10">
          &copy; {new Date().getFullYear()} Scenic Doors. All rights reserved.
        </p>
      </div>
    </div>
  );
}
