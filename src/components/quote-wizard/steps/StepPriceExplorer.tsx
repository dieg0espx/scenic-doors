"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Check, Loader2, Eye, ChevronUp } from "lucide-react";
import { PRODUCTS } from "@/lib/quote-wizard/product-data";
import { RATES_PER_SQFT, PRODUCT_CONFIGS, calculateSquareFeet } from "@/lib/quote-wizard/pricing";
import type { WizardState, WizardAction } from "@/lib/quote-wizard/types";
import { createQuote, notifyNewQuote, sendEstimateConfirmation, assignQuote } from "@/lib/actions/quotes";
import { updateLead } from "@/lib/actions/leads";
import { getUserByReferralCode } from "@/lib/actions/admin-users";
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

// Typical per-panel widths and heights used for approximate pricing.
// These match what a customer would commonly configure in the full calculator.
const TYPICAL_DIMS: Record<string, { panelWidth: number; height: number }> = {
  "multi-slide-pocket": { panelWidth: 40, height: 96 },
  "ultra-slim":         { panelWidth: 36, height: 108 },
  "bi-fold":            { panelWidth: 32, height: 84 },
  "slide-stack":        { panelWidth: 34, height: 96 },
  "awning-window":      { panelWidth: 48, height: 36 },
};

// Dynamically compute approximate prices using the same formula as the full calculator.
function buildPanelInfo(ratesOverride?: Record<string, number>): Record<string, ProductPanelInfo> {
  const rates = ratesOverride ?? RATES_PER_SQFT;
  const info: Record<string, ProductPanelInfo> = {};
  for (const slug of Object.keys(TYPICAL_DIMS)) {
    const dims = TYPICAL_DIMS[slug];
    const rate = rates[slug] ?? RATES_PER_SQFT[slug] ?? 0;
    const offset = PRODUCT_CONFIGS[slug]?.usableOpeningOffset ?? 0;

    if (slug === "awning-window") {
      const sqft = calculateSquareFeet(dims.panelWidth, dims.height);
      info[slug] = {
        panelOptions: [{ panels: 1, approxPrice: Math.round(sqft * rate / 100) * 100 }],
        note: "Single-panel window system",
      };
      continue;
    }

    const panelOptions: PanelPricing[] = [];
    for (let n = 2; n <= 6; n++) {
      const totalWidth = n * dims.panelWidth + offset;
      const sqft = calculateSquareFeet(totalWidth, dims.height);
      panelOptions.push({ panels: n, approxPrice: Math.round(sqft * rate / 100) * 100 });
    }
    info[slug] = { panelOptions };
  }
  return info;
}

/* ── Compact animation map ──────────────────────────── */

function getCompactAnimation(slug: string): React.ReactNode | null {
  switch (slug) {
    case "multi-slide-pocket":
    case "ultra-slim":
      return <SlidingDoorAnimation compact />;
    case "bi-fold":
      return <BifoldDoorAnimation />;
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
  const [dynamicRates, setDynamicRates] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    fetch("/api/pricing-rates")
      .then((r) => r.json())
      .then((data) => { if (data && typeof data === "object") setDynamicRates(data); })
      .catch(() => {});
  }, []);

  const PANEL_INFO = buildPanelInfo(dynamicRates ?? undefined);

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
      const getRate = (p: { slug: string; ratePerSqFt: number }) => dynamicRates?.[p.slug] ?? p.ratePerSqFt;
      const totalCost = interestedProducts.reduce((sum, p) => sum + getRate(p), 0);

      const quoteItems = interestedProducts.map((p) => ({
        id: p.slug,
        name: p.name,
        description: `Price inquiry — ${p.features.join(", ")}`,
        quantity: 1,
        unit_price: getRate(p),
        total: getRate(p),
      }));

      // Check if referral code maps to a specific user
      let referralUser: { id: string } | null = null;
      if (contact.referralCode) {
        try {
          referralUser = await getUserByReferralCode(contact.referralCode);
        } catch {
          // Don't block the flow
        }
      }

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
        ...(referralUser ? { assigned_to: referralUser.id, shared_with: [referralUser.id] } : {}),
      });

      if (leadId) {
        await updateLead(leadId, { has_quote: true });
      }

      // Assign to referral user only (no auto round-robin)
      if (referralUser) {
        try {
          await assignQuote(quote.id, referralUser.id);
        } catch {
          // Don't block the flow if assignment fails
        }
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
              onClick={() => toggleInterest(product.slug)}
              className={`bg-white rounded-xl sm:rounded-2xl border-2 overflow-hidden transition-all duration-200 cursor-pointer ${
                selected
                  ? "border-primary-500 shadow-md shadow-primary-500/10"
                  : "border-ocean-200 hover:border-ocean-300"
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
                  <ul className="space-y-0.5 sm:space-y-1 mb-1.5 sm:mb-2">
                    {product.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-1.5 text-[11px] sm:text-xs text-ocean-500">
                        <Check className="w-3 h-3 text-primary-500 mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Price preview — always visible */}
                  {info && (
                    <div className="mb-2 sm:mb-3">
                      {info.panelOptions.length > 1 ? (
                        <p className="text-[11px] sm:text-xs text-ocean-500">
                          <span className="font-semibold text-ocean-700">
                            From ${(info.panelOptions[0].approxPrice / 1000).toFixed(1)}k
                          </span>
                          <span className="mx-1 text-ocean-300">&mdash;</span>
                          <span className="font-semibold text-ocean-700">
                            ${(info.panelOptions[info.panelOptions.length - 1].approxPrice / 1000).toFixed(1)}k
                          </span>
                          <span className="text-ocean-400 ml-1">
                            ({info.panelOptions[0].panels}&ndash;{info.panelOptions[info.panelOptions.length - 1].panels} panels)
                          </span>
                        </p>
                      ) : (
                        <p className="text-[11px] sm:text-xs">
                          <span className="font-semibold text-ocean-700">
                            ~${(info.panelOptions[0]?.approxPrice || 0).toLocaleString()}
                          </span>
                          {info.note && <span className="text-ocean-400 ml-1">&middot; {info.note}</span>}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Action row */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleInterest(product.slug); }}
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
                        onClick={(e) => { e.stopPropagation(); setExpandedSlug(isExpanded ? null : product.slug); }}
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

              {/* Expanded detail section — pricing table + animation */}
              {isExpanded && (
                <div className="border-t border-ocean-100" onClick={(e) => e.stopPropagation()}>
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
                        ~${(info.panelOptions[0]?.approxPrice || 0).toLocaleString()}
                      </p>
                      <p className="text-[10px] sm:text-xs text-ocean-400 mt-0.5">
                        {info.note}
                      </p>
                    </div>
                  ) : null}

                  {/* Animation */}
                  {hasAnimation && (
                    <div className="border-t border-ocean-100">
                      {getCompactAnimation(product.slug)}
                    </div>
                  )}
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
