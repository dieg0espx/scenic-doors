"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Loader2, Eye, ChevronUp } from "lucide-react";
import { PRODUCTS } from "@/lib/quote-wizard/product-data";
import { BASE_PRICES } from "@/lib/quote-wizard/pricing";
import type { WizardState, WizardAction } from "@/lib/quote-wizard/types";
import { createQuote, notifyNewQuote, sendEstimateConfirmation } from "@/lib/actions/quotes";
import { updateLead } from "@/lib/actions/leads";
import { scheduleFollowUps } from "@/lib/actions/follow-ups";
import SlidingDoorAnimation from "@/components/SlidingDoorAnimation";
import BifoldDoorAnimation from "@/components/BifoldDoorAnimation";
import SlideStackDoorAnimation from "@/components/SlideStackDoorAnimation";

interface StepPriceExplorerProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

/* ── Per-product panel info & approximate pricing ───── */

interface PanelPricing {
  panels: number;
  approxPrice: number;
}

interface ProductPanelInfo {
  panelOptions: PanelPricing[];
  note?: string;
}

// Approximate pricing per panel count — gives visitors a feel for cost at different sizes.
// These are estimates based on typical configurations.
const PANEL_INFO: Record<string, ProductPanelInfo> = {
  "multi-slide-pocket": {
    panelOptions: [
      { panels: 2, approxPrice: 8500 },
      { panels: 3, approxPrice: 10200 },
      { panels: 4, approxPrice: 12800 },
      { panels: 5, approxPrice: 15500 },
      { panels: 6, approxPrice: 18000 },
    ],
  },
  "ultra-slim": {
    panelOptions: [
      { panels: 2, approxPrice: 12000 },
      { panels: 3, approxPrice: 14500 },
      { panels: 4, approxPrice: 17500 },
      { panels: 5, approxPrice: 21000 },
      { panels: 6, approxPrice: 24000 },
    ],
  },
  "bi-fold": {
    panelOptions: [
      { panels: 2, approxPrice: 7500 },
      { panels: 3, approxPrice: 9000 },
      { panels: 4, approxPrice: 11000 },
      { panels: 5, approxPrice: 13500 },
      { panels: 6, approxPrice: 15500 },
    ],
  },
  "slide-stack": {
    panelOptions: [
      { panels: 2, approxPrice: 9000 },
      { panels: 3, approxPrice: 10800 },
      { panels: 4, approxPrice: 13000 },
      { panels: 5, approxPrice: 15800 },
      { panels: 6, approxPrice: 18500 },
    ],
  },
  "awning-window": {
    panelOptions: [
      { panels: 1, approxPrice: 6000 },
    ],
    note: "Single-panel window system",
  },
};

/* ── Compact animation map ──────────────────────────── */

function getCompactAnimation(slug: string): React.ReactNode | null {
  switch (slug) {
    case "multi-slide-pocket":
    case "ultra-slim":
      return <SlidingDoorAnimation compact />;
    case "bi-fold":
      return <BifoldDoorAnimation compact />;
    case "slide-stack":
      return <SlideStackDoorAnimation compact />;
    default:
      return null;
  }
}


export default function StepPriceExplorer({ state, dispatch }: StepPriceExplorerProps) {
  const { browseInterests, contact, leadId, isSubmitting } = state;
  const [note, setNote] = useState("");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  function toggleInterest(slug: string) {
    const updated = browseInterests.includes(slug)
      ? browseInterests.filter((s) => s !== slug)
      : [...browseInterests, slug];
    dispatch({ type: "SET_BROWSE_INTERESTS", payload: updated });
  }

  async function handleSubmit() {
    dispatch({ type: "SET_SUBMITTING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const interestedProducts = PRODUCTS.filter((p) => browseInterests.includes(p.slug));
      const totalCost = interestedProducts.reduce((sum, p) => sum + (BASE_PRICES[p.slug] || p.basePrice), 0);

      const quoteItems = interestedProducts.map((p) => ({
        id: p.slug,
        name: p.name,
        description: `Price inquiry — ${p.features.join(", ")}`,
        quantity: 1,
        unit_price: BASE_PRICES[p.slug] || p.basePrice,
        total: BASE_PRICES[p.slug] || p.basePrice,
      }));

      const quote = await createQuote({
        client_name: `${contact.firstName} ${contact.lastName}`,
        client_email: contact.email,
        door_type: interestedProducts.map((p) => p.name).join(", "),
        material: "Aluminum",
        color: "TBD",
        glass_type: "TBD",
        size: "TBD",
        cost: totalCost,
        customer_type: contact.customerType,
        customer_phone: contact.phone,
        customer_zip: contact.zip,
        lead_status: "new",
        lead_id: leadId || undefined,
        items: JSON.stringify(quoteItems),
        subtotal: totalCost,
        grand_total: totalCost,
        notes: note.trim() || undefined,
        intent_level: "browse",
      });

      if (leadId) {
        await updateLead(leadId, { has_quote: true });
      }

      // Send confirmation email to client (no portal link)
      try {
        await sendEstimateConfirmation(quote.id);
      } catch {
        // Don't block the flow
      }

      try {
        await notifyNewQuote(quote.id, window.location.origin);
      } catch {
        // Don't block the flow
      }

      try {
        await scheduleFollowUps(leadId || null, quote.id);
      } catch {
        // Don't block the flow
      }

      dispatch({ type: "SET_QUOTE_ID", payload: quote.id });
      dispatch({ type: "SET_STEP", payload: 4 });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err instanceof Error ? err.message : "Failed to submit interest",
      });
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  }

  const selectedCount = browseInterests.length;

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-0">
      <div className="text-center mb-5 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-ocean-900 mb-1.5 sm:mb-2">
          Explore Our Products & Pricing
        </h2>
        <p className="text-sm sm:text-base text-ocean-500">
          Select the products you&apos;re interested in. We&apos;ll follow up with more details.
        </p>
        {/* Mobile selection count pill */}
        {selectedCount > 0 && (
          <div className="sm:hidden mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
              <Check className="w-3 h-3" />
              {selectedCount} selected
            </span>
          </div>
        )}
      </div>

      {/* Product cards — collapsed by default, expand to show animation + pricing */}
      <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-8">
        {PRODUCTS.map((product) => {
          const selected = browseInterests.includes(product.slug);
          const hasAnimation = !!getCompactAnimation(product.slug);
          const isExpanded = expandedSlug === product.slug;
          const info = PANEL_INFO[product.slug];

          return (
            <div
              key={product.slug}
              className={`bg-white rounded-xl sm:rounded-2xl border-2 overflow-hidden transition-all duration-200 ${
                selected
                  ? "border-primary-500 shadow-md shadow-primary-500/10"
                  : "border-ocean-200"
              }`}
            >
              {/* Collapsed card — image, name, features, actions */}
              <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
                {/* Product image thumbnail */}
                <div className="relative shrink-0 w-20 h-20 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-ocean-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-1"
                  />
                  {selected && (
                    <div className="absolute top-1 right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary-500 flex items-center justify-center shadow-sm">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                    </div>
                  )}
                </div>

                {/* Info + actions */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-ocean-900 text-sm sm:text-base mb-1 sm:mb-1.5 truncate">
                    {product.name}
                  </h3>
                  <ul className="space-y-0.5 sm:space-y-1 mb-2 sm:mb-3">
                    {product.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-1.5 text-[11px] sm:text-xs text-ocean-500">
                        <Check className="w-3 h-3 text-primary-500 mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Action row */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleInterest(product.slug)}
                      className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all cursor-pointer active:scale-[0.97] ${
                        selected
                          ? "bg-primary-500 text-white hover:bg-primary-600"
                          : "bg-ocean-100 text-ocean-600 hover:bg-ocean-200"
                      }`}
                    >
                      {selected ? "Selected" : "I\u2019m interested"}
                    </button>
                    {(hasAnimation || (info && info.panelOptions.length > 1)) && (
                      <button
                        onClick={() => setExpandedSlug(isExpanded ? null : product.slug)}
                        className="flex items-center gap-1 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold text-ocean-500 hover:text-ocean-700 hover:bg-ocean-50 transition-all cursor-pointer"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span className="hidden sm:inline">Hide details</span>
                            <span className="sm:hidden">Less</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span className="hidden sm:inline">View details & pricing</span>
                            <span className="sm:hidden">Details</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded detail section — animation + panel pricing */}
              {isExpanded && (
                <div className="border-t border-ocean-100">
                  {/* Animation */}
                  {hasAnimation && (
                    <div className="border-b border-ocean-100">
                      {getCompactAnimation(product.slug)}
                    </div>
                  )}

                  {/* Panel pricing table */}
                  {info && info.panelOptions.length > 1 ? (
                    <div className="p-3.5 sm:p-5">
                      <p className="text-[10px] sm:text-xs font-semibold text-ocean-500 uppercase tracking-wider mb-2">
                        Approximate pricing by panel count
                      </p>
                      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                        {info.panelOptions.map((opt) => (
                          <div
                            key={opt.panels}
                            className="text-center p-1.5 sm:p-2.5 rounded-lg bg-ocean-50/80"
                          >
                            <p className="text-[10px] sm:text-xs text-ocean-400 mb-0.5">
                              {opt.panels} panel{opt.panels !== 1 ? "s" : ""}
                            </p>
                            <p className="text-xs sm:text-sm font-bold text-ocean-800">
                              ${(opt.approxPrice / 1000).toFixed(1)}k
                            </p>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-ocean-400 mt-1.5 sm:mt-2">
                        * Estimates vary by size, finish, and glass options
                      </p>
                    </div>
                  ) : info?.note ? (
                    <div className="p-3.5 sm:p-5">
                      <p className="text-[10px] sm:text-xs font-semibold text-ocean-500 uppercase tracking-wider mb-1">
                        Pricing
                      </p>
                      <p className="text-sm sm:text-base font-bold text-ocean-800">
                        ~${(info.panelOptions[0]?.approxPrice || product.basePrice).toLocaleString()}
                      </p>
                      <p className="text-[10px] sm:text-xs text-ocean-400 mt-0.5">
                        {info.note}
                      </p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Optional note */}
      <div className="max-w-2xl mx-auto mb-5 sm:mb-8">
        <label className="block text-sm font-medium text-ocean-700 mb-1.5 sm:mb-2">
          Anything else you&apos;d like us to know? <span className="text-ocean-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Tell us about your project, timeline, or any questions..."
          rows={3}
          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-ocean-200 bg-white text-ocean-900 text-sm placeholder:text-ocean-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 resize-none transition-colors"
        />
      </div>

      {/* Error */}
      {state.error && (
        <div className="max-w-2xl mx-auto mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm">
          {state.error}
        </div>
      )}

      {/* Submit */}
      <div className="max-w-2xl mx-auto pb-6 sm:pb-0">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || selectedCount === 0}
          className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 sm:py-4 px-6 rounded-xl transition-all text-sm sm:text-lg cursor-pointer shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-500/30 active:scale-[0.99]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span className="sm:hidden">
                Submit Interest{selectedCount > 0 && ` (${selectedCount})`}
              </span>
              <span className="hidden sm:inline">
                Submit Interest ({selectedCount} product{selectedCount !== 1 ? "s" : ""} selected)
              </span>
            </>
          )}
        </button>

        <div className="text-center mt-4">
          <button
            onClick={() => dispatch({ type: "SET_STEP", payload: 2 })}
            className="text-xs sm:text-sm text-ocean-400 hover:text-ocean-600 transition-colors cursor-pointer"
          >
            &larr; Back
          </button>
        </div>
      </div>
    </div>
  );
}
