"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  FileText,
  ClipboardCheck,
  CreditCard,
  Truck,
  Loader2,
  XCircle,
} from "lucide-react";
import { getQuoteById } from "@/lib/actions/quotes";
import { getApprovalDrawing } from "@/lib/actions/approval-drawings";
import { getOrderTracking } from "@/lib/actions/order-tracking";
import { getQuotePhotos } from "@/lib/actions/quote-photos";
import type { ApprovalDrawing, OrderTracking, QuotePhoto } from "@/lib/types";
import PortalQuoteView from "@/components/portal/PortalQuoteView";
import PortalApprovalDrawing from "@/components/portal/PortalApprovalDrawing";
import PortalPayments from "@/components/portal/PortalPayments";
import PortalTracking from "@/components/portal/PortalTracking";

interface QuoteData {
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
  delivery_type: string | null;
  items: Array<{
    id: string;
    name: string;
    description?: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
  subtotal: number;
  installation_cost: number;
  delivery_cost: number;
  tax: number;
  grand_total: number;
  portal_stage?: string;
}

const TABS = [
  { id: "quote", label: "Quote", icon: FileText },
  { id: "approval", label: "Approval Drawing", icon: ClipboardCheck },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "tracking", label: "Tracking", icon: Truck },
];

export default function PortalClient({ quoteId }: { quoteId: string }) {
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [drawing, setDrawing] = useState<ApprovalDrawing | null>(null);
  const [tracking, setTracking] = useState<OrderTracking | null>(null);
  const [photos, setPhotos] = useState<QuotePhoto[]>([]);
  const [activeTab, setActiveTab] = useState("quote");

  useEffect(() => {
    async function load() {
      try {
        const [q, d, t, p] = await Promise.all([
          getQuoteById(quoteId),
          getApprovalDrawing(quoteId).catch(() => null),
          getOrderTracking(quoteId).catch(() => null),
          getQuotePhotos(quoteId).catch(() => []),
        ]);
        setQuote(q);
        setDrawing(d);
        setTracking(t);
        setPhotos(p);
      } catch {
        // quote not found
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [quoteId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ocean-50">
        <div className="flex items-center gap-3 text-ocean-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading your portal...
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ocean-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-ocean-900 mb-2">Portal Not Found</h1>
          <p className="text-ocean-500 text-sm">
            This portal link is invalid or has expired. Please contact us if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ocean-50">
      {/* Header */}
      <header className="bg-white border-b border-ocean-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif"
              alt="Scenic Doors"
              width={140}
              height={40}
              className="h-8 w-auto"
            />
            <div className="hidden sm:block h-6 w-px bg-ocean-200" />
            <span className="hidden sm:block text-sm text-ocean-400">Client Portal</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-ocean-900">{quote.client_name}</p>
            <p className="text-xs text-ocean-400">{quote.quote_number}</p>
          </div>
        </div>
      </header>

      {/* Stage Progress Bar */}
      <PortalStageBar stage={quote.portal_stage || "quote_sent"} />

      {/* Tab Nav */}
      <div className="bg-white border-b border-ocean-200">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="flex gap-0 overflow-x-auto">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-ocean-400 hover:text-ocean-600"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === "quote" && (
          <PortalQuoteView quote={quote} photos={photos} />
        )}
        {activeTab === "approval" && (
          <PortalApprovalDrawing drawing={drawing} quoteName={quote.client_name} quoteId={quoteId} />
        )}
        {activeTab === "payments" && (
          <PortalPayments tracking={tracking} grandTotal={quote.grand_total} />
        )}
        {activeTab === "tracking" && (
          <PortalTracking tracking={tracking} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-ocean-200 bg-white mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <p className="text-ocean-400 text-xs">
            &copy; {new Date().getFullYear()} Scenic Doors. All rights reserved. &middot;{" "}
            <a href="tel:818-427-6690" className="text-primary-500 hover:text-primary-600">
              818-427-6690
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

const STAGES = [
  { key: "quote_sent", label: "Quote" },
  { key: "approval_pending", label: "Approval" },
  { key: "approval_signed", label: "Signed" },
  { key: "deposit_1_pending", label: "Deposit" },
  { key: "manufacturing", label: "Manufacturing" },
  { key: "deposit_2_pending", label: "Final Payment" },
  { key: "shipping", label: "Shipping" },
  { key: "delivered", label: "Delivered" },
];

function PortalStageBar({ stage }: { stage: string }) {
  const currentIndex = STAGES.findIndex((s) => s.key === stage);

  return (
    <div className="bg-white border-b border-ocean-200 py-4">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-0 overflow-x-auto">
          {STAGES.map((s, i) => {
            const isCompleted = i < currentIndex;
            const isCurrent = i === currentIndex;
            return (
              <div key={s.key} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                          ? "bg-primary-500 text-white ring-4 ring-primary-500/20"
                          : "bg-ocean-100 text-ocean-400"
                    }`}
                  >
                    {isCompleted ? "✓" : i + 1}
                  </div>
                  <span
                    className={`text-[10px] mt-1 whitespace-nowrap ${
                      isCurrent ? "text-primary-600 font-semibold" : isCompleted ? "text-green-600" : "text-ocean-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STAGES.length - 1 && (
                  <div
                    className={`w-4 sm:w-8 h-0.5 mx-0.5 ${
                      i < currentIndex ? "bg-green-500" : "bg-ocean-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
