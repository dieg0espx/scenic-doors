"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Copy,
  Trash2,
  Plus,
  Truck,
  Loader2,
  Wrench,
  Package,
  Check,
  X,
  Tag,
} from "lucide-react";
import type { ConfiguredItem, WizardState, WizardAction } from "@/lib/quote-wizard/types";
import { calculateQuoteTotals, DELIVERY_REGULAR, DELIVERY_WHITE_GLOVE, calculateSquareFeet, PRODUCT_CONFIGS, calculateItemBreakdown, GLASS_MODIFIERS } from "@/lib/quote-wizard/pricing";
import { getLayoutImageUrl } from "@/lib/quote-wizard/layout-images";
import DoorTypeAnimation from "@/components/DoorTypeAnimation";
import { createQuote, sendQuoteToClient, assignQuote, notifyNewQuote, sendEstimateConfirmation } from "@/lib/actions/quotes";
import { updateLead } from "@/lib/actions/leads";
import { getUserByReferralCode } from "@/lib/actions/admin-users";
import { scheduleFollowUps } from "@/lib/actions/follow-ups";

interface StepQuoteSummaryProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

/* ── Constants ────────────────────────────────────────── */


/* ── Helpers ──────────────────────────────────────────── */

function getItemLabel(index: number): string {
  return `Item ${String.fromCharCode(65 + index)}`;
}

function getConfigCode(item: ConfiguredItem): string {
  if (!item.panelCount || !item.panelLayout) return "";
  const layout = item.panelLayout;

  // "Split 2L-2R" → "2L_2R"
  if (layout.startsWith("Split ")) {
    return `${item.panelCount}p_${layout.slice(6).replace("-", "_")}`;
  }
  // "All Left (4L)" → "4L", "All Right (3R)" → "3R"
  const parenMatch = layout.match(/\(([^)]+)\)/);
  if (parenMatch) {
    return `${item.panelCount}p_${parenMatch[1]}`;
  }
  // Slide-stack: "1L + 1R" → "1L_1R", "2L" → "2L"
  if (/^\d+[LR]/.test(layout)) {
    return `${item.panelCount}p_${layout.replace(/ \+ /g, "_")}`;
  }
  // "Both Fixed" → "FF"
  if (layout === "Both Fixed") {
    return `${item.panelCount}p_FF`;
  }
  // Sliding: "Operating + Fixed" → "O+F"
  const short = layout
    .replace(/Operating/g, "O")
    .replace(/Fixed/g, "F")
    .replace(/ \+ /g, "+")
    .replace(/ \(L\)/, "(L)")
    .replace(/ \(R\)/, "(R)");
  return `${item.panelCount}p_${short}`;
}

function getSystemDisplayName(item: ConfiguredItem): string {
  const slug = item.doorTypeSlug;
  if (slug === "bi-fold") return "Bi-Fold";
  if (slug === "slide-stack") return "Slide & Stack";
  if (slug === "awning-window") return "Awning Window";
  if (slug === "multi-slide-pocket" || slug === "ultra-slim") {
    return item.systemType === "pocket" ? "Pocket" : "Multi-Slide";
  }
  return item.doorType;
}

/* ── Panel Diagram ────────────────────────────────────── */

function PanelDiagram({ item }: { item: ConfiguredItem }) {
  if (!item.panelCount || !item.panelLayout) return null;
  const imgUrl = getLayoutImageUrl(item.doorTypeSlug, item.panelCount, item.panelLayout);
  if (!imgUrl) return null;
  return (
    <div className="flex items-center justify-center py-4 sm:py-6">
      <img
        src={imgUrl}
        alt={item.panelLayout}
        className="h-28 sm:h-40 w-auto object-contain"
      />
    </div>
  );
}

/* ── Item Card ────────────────────────────────────────── */

function ItemCard({
  item,
  index,
  dispatch,
}: {
  item: ConfiguredItem;
  index: number;
  dispatch: React.Dispatch<WizardAction>;
}) {
  const [expanded, setExpanded] = useState(false);
  const label = getItemLabel(index);
  const configCode = getConfigCode(item);
  const systemName = getSystemDisplayName(item);
  const config = PRODUCT_CONFIGS[item.doorTypeSlug];

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-ocean-200 overflow-hidden shadow-sm">
      {/* Collapsed header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 sm:p-5 text-left cursor-pointer hover:bg-ocean-50/50 transition-colors"
      >
        <div className="flex items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="shrink-0 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-primary-50 text-primary-700 text-[10px] sm:text-xs font-bold">
              {label}
            </span>
            <h4 className="font-semibold text-ocean-900 text-sm sm:text-base truncate">
              {item.doorType}{item.roomName ? ` - ${item.roomName}` : ""}
            </h4>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-ocean-400 shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-ocean-400 shrink-0" />
          )}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 sm:gap-x-6 sm:gap-y-2">
          <div>
            <p className="text-[10px] sm:text-xs text-ocean-400 mb-0.5">Dimensions</p>
            <p className="text-xs sm:text-sm font-semibold text-ocean-800">{item.width}&quot; W &times; {item.height}&quot; H</p>
          </div>
          {item.panelCount > 1 && (
            <div>
              <p className="text-[10px] sm:text-xs text-ocean-400 mb-0.5">Per Panel</p>
              <p className="text-xs sm:text-sm font-semibold text-ocean-800">{Math.round(((item.width - (PRODUCT_CONFIGS[item.doorTypeSlug]?.usableOpeningOffset ?? 0)) / item.panelCount) * 10) / 10}&quot; W</p>
            </div>
          )}
          {configCode && (
            <div className="hidden sm:block">
              <p className="text-[10px] sm:text-xs text-ocean-400 mb-0.5">Configuration</p>
              <p className="text-xs sm:text-sm font-semibold text-ocean-800 font-mono">{configCode}</p>
            </div>
          )}
          <div>
            <p className="text-[10px] sm:text-xs text-ocean-400 mb-0.5">Colors</p>
            <p className="text-xs sm:text-sm font-semibold text-ocean-800">{item.exteriorFinish}</p>
          </div>
          <div className="ml-auto">
            <p className="text-[10px] sm:text-xs text-ocean-400 mb-0.5">Price</p>
            <p className="text-xs sm:text-sm font-bold text-primary-600">${item.itemTotal.toLocaleString()}</p>
          </div>
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-ocean-100">
          {/* Selected Configuration */}
          <div className="p-4 sm:p-6 text-center border-b border-ocean-100">
            <h3 className="font-heading font-bold text-ocean-900 text-lg sm:text-2xl mb-1">{item.doorType}</h3>
            <p className="font-semibold text-ocean-700 text-sm sm:text-base mb-1">Selected Configuration</p>
            <p className="text-[10px] sm:text-xs font-semibold text-red-500 uppercase tracking-wider">
              Caution: as viewed from outside the building
            </p>

            {/* Door Animation */}
            <div className="my-3 sm:my-4 rounded-xl border border-ocean-200 overflow-hidden">
              <DoorTypeAnimation
                doorType={item.doorTypeSlug}
                compact
                panelCount={item.panelCount}
                panelLayout={item.panelLayout}
              />
            </div>

            {/* Panel Diagram */}
            <div className="my-2 sm:my-4">
              <PanelDiagram item={item} />
            </div>

          </div>

          {/* System Type + Actions */}
          <div className="p-4 sm:p-6 border-b border-ocean-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3">
              <h4 className="font-bold text-ocean-900 text-sm sm:text-base">System Type: {systemName}</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => dispatch({ type: "DUPLICATE_ITEM", payload: index })}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-ocean-700 bg-white border border-ocean-200 rounded-lg hover:bg-ocean-50 transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Duplicate
                </button>
                <button
                  onClick={() => dispatch({ type: "REMOVE_ITEM", payload: index })}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Remove
                </button>
              </div>
            </div>
            {item.roomName && (
              <p className="text-xs sm:text-sm text-ocean-500">Room: {item.roomName}</p>
            )}
          </div>

          {/* Configuration Details */}
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-ocean-900 text-sm sm:text-base">Configuration Details</h4>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    dispatch({ type: "EDIT_ITEM", payload: index });
                    dispatch({ type: "SET_STEP", payload: 4 });
                  }}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
                >
                  <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Edit
                </button>
                <div className="text-right">
                  <p className="text-[10px] sm:text-xs text-ocean-400 font-semibold uppercase">Quantity</p>
                  <p className="text-sm sm:text-base font-bold text-ocean-900">1</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {/* System & Configuration */}
              <div className="bg-ocean-50/60 rounded-xl p-3 sm:p-4">
                <p className="text-xs font-semibold text-ocean-500 uppercase tracking-wider mb-2">System & Configuration</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-ocean-500">System Type</span>
                    <span className="font-medium text-ocean-800">{systemName}</span>
                  </div>
                  {configCode && (
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-ocean-500">Configuration</span>
                      <span className="font-medium text-ocean-800 font-mono">{configCode}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Colors */}
              <div className="bg-ocean-50/60 rounded-xl p-3 sm:p-4">
                <p className="text-xs font-semibold text-ocean-500 uppercase tracking-wider mb-2">Colors</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-ocean-500">Exterior</span>
                    <span className="font-medium text-ocean-800">{item.exteriorFinish}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-ocean-500">Interior</span>
                    <span className="font-medium text-ocean-800">
                      {item.interiorFinish ? item.interiorFinish : "Same as exterior"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dimensions */}
              <div className="bg-ocean-50/60 rounded-xl p-3 sm:p-4">
                <p className="text-xs font-semibold text-ocean-500 uppercase tracking-wider mb-2">Dimensions</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-ocean-500">Door Size</span>
                    <span className="font-medium text-ocean-800">{item.width}&quot; W x {item.height}&quot; H</span>
                  </div>
                  {item.panelCount > 1 && (
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-ocean-500">Per-Panel Width</span>
                      <span className="font-medium text-ocean-800">{Math.round(((item.width - (PRODUCT_CONFIGS[item.doorTypeSlug]?.usableOpeningOffset ?? 0)) / item.panelCount) * 10) / 10}&quot;</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-ocean-500">Area (sq ft)</span>
                    <span className="font-medium text-ocean-800">{calculateSquareFeet(item.width, item.height).toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-ocean-500">Rough Opening</span>
                    <span className="font-medium text-ocean-800">{item.width + 1}&quot; W x {item.height + 1}&quot; H</span>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="bg-ocean-50/60 rounded-xl p-3 sm:p-4">
                <p className="text-xs font-semibold text-ocean-500 uppercase tracking-wider mb-2">Options</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-ocean-500">Glass Type</span>
                    <span className="font-medium text-ocean-800">{item.glassType}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-ocean-500">Hardware</span>
                    <span className="font-medium text-ocean-800">{item.hardwareFinish}</span>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              {(() => {
                const bd = calculateItemBreakdown(item);
                return bd.ratePerSqFt > 0 ? (
                  <div className="sm:col-span-2 bg-ocean-50/60 rounded-xl p-3 sm:p-4">
                    <p className="text-xs font-semibold text-ocean-500 uppercase tracking-wider mb-2">Pricing Breakdown</p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-ocean-500">Base Price ({bd.squareFeet.toFixed(1)} sq ft &times; ${bd.ratePerSqFt}/sq ft)</span>
                        <span className="font-medium text-ocean-800">${bd.baseProductPrice.toLocaleString()}</span>
                      </div>
                      {bd.totalGlassModifier !== 0 && (
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-ocean-500">
                            Glass Modifier ({item.glassType}{bd.panelCount > 1 ? ` × ${bd.panelCount} panels` : ""})
                          </span>
                          <span className={`font-medium ${bd.totalGlassModifier < 0 ? "text-green-700" : "text-ocean-800"}`}>
                            {bd.totalGlassModifier < 0 ? "−" : "+"}${Math.abs(bd.totalGlassModifier).toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-xs sm:text-sm pt-1.5 border-t border-ocean-200">
                        <span className="font-semibold text-ocean-700">Product Price</span>
                        <span className="font-bold text-primary-600">${bd.productPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>

            {/* Door Cost */}
            <div className="mt-4 pt-4 border-t border-ocean-200 flex justify-between items-center">
              <span className="text-sm sm:text-base font-semibold text-ocean-700">Door Cost:</span>
              <span className="text-base sm:text-lg font-bold text-primary-600">${item.itemTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Component ───────────────────────────────────── */

interface ActivePromo {
  id: string;
  name: string;
  percentage: number;
  door_types: string[] | null;
}

export default function StepQuoteSummary({ state, dispatch }: StepQuoteSummaryProps) {
  const { items, services, contact, leadId, isSubmitting } = state;
  const totals = calculateQuoteTotals(items, services);

  // Fetch active global discounts
  const [promos, setPromos] = useState<ActivePromo[]>([]);
  useEffect(() => {
    fetch("/api/active-discounts")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setPromos(data); })
      .catch(() => {});
  }, []);

  // Find the best matching discount for the items in this quote
  const doorSlugs = [...new Set(items.map((i) => i.doorTypeSlug))];
  const matchingPromo = promos.find((p) =>
    p.door_types === null || doorSlugs.some((slug) => p.door_types!.includes(slug))
  ) || null;

  const promoDiscountPercent = matchingPromo ? matchingPromo.percentage : 0;
  const promoDiscountAmount = Math.round(totals.subtotal * (promoDiscountPercent / 100) * 100) / 100;
  const adjustedGrandTotal = Math.round((totals.grandTotal - promoDiscountAmount) * 100) / 100;

  async function handleSubmit() {
    dispatch({ type: "SET_SUBMITTING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const firstItem = items[0];
      const isMedium = state.intentLevel === "medium";

      const quoteItems = isMedium
        ? items.map((item) => ({
            id: item.id,
            name: item.doorType,
            description: [
              state.generalPreferences.approximateSize && `Size: ${state.generalPreferences.approximateSize}`,
              state.generalPreferences.colorPreference && `Color: ${state.generalPreferences.colorPreference}`,
              state.generalPreferences.glassPreference && `Glass: ${state.generalPreferences.glassPreference}`,
            ].filter(Boolean).join(" | "),
            quantity: 1,
            unit_price: item.ratePerSqFt,
            total: item.ratePerSqFt,
          }))
        : items.map((item) => ({
            id: item.id,
            name: item.doorType,
            doorTypeSlug: item.doorTypeSlug,
            description: `${item.width}" x ${item.height}" | ${item.exteriorFinish}${item.exteriorFinish === "Two-tone" && item.interiorFinish ? ` / ${item.interiorFinish} interior` : ""} | ${item.glassType} | ${item.hardwareFinish}${item.roomName ? ` | ${item.roomName}` : ""}`,
            quantity: 1,
            unit_price: item.itemTotal,
            total: item.itemTotal,
            width: item.width,
            height: item.height,
            panelCount: item.panelCount,
            panelLayout: item.panelLayout,
            systemType: item.systemType,
            exteriorFinish: item.exteriorFinish,
            interiorFinish: item.interiorFinish,
            glassType: item.glassType,
            hardwareFinish: item.hardwareFinish,
            ratePerSqFt: item.ratePerSqFt,
            squareFeet: item.squareFeet,
            glassPriceModifier: item.glassPriceModifier,
            baseProductPrice: Math.round(calculateSquareFeet(item.width, item.height) * item.ratePerSqFt * 100) / 100,
          }));

      const mediumNotes = isMedium
        ? [
            state.generalPreferences.approximateSize && `Approximate size: ${state.generalPreferences.approximateSize}`,
            state.generalPreferences.colorPreference && `Color preference: ${state.generalPreferences.colorPreference}`,
            state.generalPreferences.glassPreference && `Glass preference: ${state.generalPreferences.glassPreference}`,
            state.generalPreferences.projectNotes && `Notes: ${state.generalPreferences.projectNotes}`,
          ].filter(Boolean).join("\n")
        : undefined;

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
        door_type: firstItem.doorType,
        material: "Aluminum",
        color: isMedium ? (state.generalPreferences.colorPreference || "TBD") : firstItem.exteriorFinish,
        glass_type: isMedium ? (state.generalPreferences.glassPreference || "TBD") : firstItem.glassType,
        size: isMedium ? (state.generalPreferences.approximateSize || "TBD") : `${firstItem.width}" x ${firstItem.height}"`,
        cost: isMedium ? firstItem.ratePerSqFt : adjustedGrandTotal,
        customer_type: contact.customerType,
        customer_phone: contact.phone,
        customer_zip: contact.zip,
        lead_status: "new",
        lead_id: leadId || undefined,
        items: JSON.stringify(quoteItems),
        subtotal: isMedium ? firstItem.ratePerSqFt : totals.subtotal,
        installation_cost: isMedium ? 0 : totals.installationCost,
        delivery_cost: isMedium ? 0 : totals.deliveryCost,
        tax: isMedium ? 0 : totals.tax,
        grand_total: isMedium ? firstItem.ratePerSqFt : adjustedGrandTotal,
        ...(promoDiscountPercent > 0 && !isMedium ? {
          discount_percent: promoDiscountPercent,
          discount_amount: promoDiscountAmount,
          discount_name: matchingPromo?.name,
        } : {}),
        delivery_type: services.deliveryType === "white_glove" ? "white_glove" : "delivery",
        intent_level: state.intentLevel || "full",
        notes: mediumNotes,
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

      // Send email to client — medium gets confirmation, full gets portal link
      try {
        if (isMedium) {
          await sendEstimateConfirmation(quote.id);
        } else {
          await sendQuoteToClient(quote.id, window.location.origin);
        }
      } catch {
        // Don't block the flow if email fails
      }

      // Notify admin/sales reps
      try {
        await notifyNewQuote(quote.id, window.location.origin);
      } catch {
        // Don't block the flow if notification fails
      }

      // Schedule follow-up emails (3 follow-ups at 4-day intervals)
      try {
        await scheduleFollowUps(leadId || null, quote.id);
      } catch {
        // Don't block the flow if scheduling fails
      }

      dispatch({ type: "SET_QUOTE_ID", payload: quote.id });
      dispatch({ type: "SET_STEP", payload: 6 });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err instanceof Error ? err.message : "Failed to create quote",
      });
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  }

  const isMedium = state.intentLevel === "medium";

  return (
    <div className={`mx-auto px-1 sm:px-0 ${isMedium ? "max-w-2xl" : "max-w-4xl"}`}>
      {/* Header */}
      <div className="text-center mb-5 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-ocean-900 mb-1.5 sm:mb-2">
          {isMedium ? "Review Your Estimate Request" : "Your Quote Summary"}
        </h2>
        <p className="text-sm sm:text-base text-ocean-500">
          {isMedium
            ? "Confirm your selections and we\u2019ll prepare a tailored estimate."
            : "Review your selections below. You can go back to make changes."}
        </p>
      </div>

      {/* ── Medium Tier: compact summary ── */}
      {isMedium ? (
        <>
          {/* Selection card */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-ocean-200 p-4 sm:p-6 shadow-sm mb-4 sm:mb-5">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="font-heading font-bold text-ocean-900 text-sm sm:text-base">
                {items[0]?.doorType}
              </h3>
              <button
                onClick={() => dispatch({ type: "SET_STEP", payload: 4 })}
                className="flex items-center gap-1 text-xs sm:text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
              >
                <Pencil className="w-3 h-3" /> Edit
              </button>
            </div>

            {/* Preferences as compact rows */}
            <div className="space-y-2 text-xs sm:text-sm">
              {state.generalPreferences.approximateSize && (
                <div className="flex justify-between">
                  <span className="text-ocean-500">Approximate Size</span>
                  <span className="font-medium text-ocean-800 capitalize">{state.generalPreferences.approximateSize.replace("-", " ")}</span>
                </div>
              )}
              {state.generalPreferences.colorPreference && (
                <div className="flex justify-between">
                  <span className="text-ocean-500">Color Preference</span>
                  <span className="font-medium text-ocean-800 capitalize">{state.generalPreferences.colorPreference.replace("-", " ")}</span>
                </div>
              )}
              {state.generalPreferences.glassPreference && (
                <div className="flex justify-between">
                  <span className="text-ocean-500">Glass Type</span>
                  <span className="font-medium text-ocean-800 capitalize">{state.generalPreferences.glassPreference.replace("-", " ")}</span>
                </div>
              )}
            </div>

            {state.generalPreferences.projectNotes && (
              <div className="mt-3 pt-3 border-t border-ocean-100">
                <p className="text-[10px] sm:text-xs font-semibold text-ocean-400 uppercase tracking-wider mb-1">Project Notes</p>
                <p className="text-xs sm:text-sm text-ocean-600 leading-relaxed">{state.generalPreferences.projectNotes}</p>
              </div>
            )}

            {/* Estimated price */}
            <div className="mt-3 pt-3 border-t border-ocean-100 flex justify-between items-center">
              <span className="text-xs sm:text-sm text-ocean-500">Rate</span>
              <span className="text-sm sm:text-base font-bold text-primary-600">${items[0]?.ratePerSqFt}/sq ft</span>
            </div>
          </div>

          {/* Available services — informational only */}
          <div className="bg-ocean-50/60 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 mb-5 sm:mb-6">
            <p className="text-[10px] sm:text-xs font-semibold text-ocean-500 uppercase tracking-wider mb-2.5">
              Available Add-On Services
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-ocean-400 shrink-0" />
                <span className="text-xs sm:text-sm text-ocean-600">
                  <span className="font-medium text-ocean-700">Delivery</span> &mdash; from ${DELIVERY_REGULAR.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-ocean-400 shrink-0" />
                <span className="text-xs sm:text-sm text-ocean-600">
                  <span className="font-medium text-ocean-700">Professional Installation</span> &mdash; TBD
                </span>
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-ocean-400 mt-2">
              We&apos;ll discuss service options when we follow up with your estimate.
            </p>
          </div>
        </>
      ) : (
        /* ── Full Tier: detailed items ── */
        <>
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="font-heading font-bold text-ocean-900 text-base sm:text-lg">
                Quote Items ({items.length})
              </h3>
              <button
                onClick={() => {
                  dispatch({ type: "ADD_ANOTHER_ITEM" });
                  dispatch({ type: "SET_STEP", payload: 3 });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Add Another Item
              </button>
            </div>
            <p className="text-xs sm:text-sm text-ocean-400 mb-3 sm:mb-4">
              Select an item below to view its details, or add another item to your quote.
            </p>
            <div className="space-y-3 sm:space-y-4">
              {items.map((item, i) => (
                <ItemCard key={item.id} item={item} index={i} dispatch={dispatch} />
              ))}
            </div>
          </div>

          {/* ── Services (full tier only) ── */}
          <div className="mb-6 sm:mb-8">
            <h3 className="font-heading font-bold text-ocean-900 text-base sm:text-lg mb-4 sm:mb-5">Services</h3>

            {/* Delivery Options */}
            <div className="mb-5 sm:mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-ocean-700">Delivery Options</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Regular Delivery */}
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_SERVICES", payload: { deliveryType: "regular" } })}
                  className={`text-left p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer ${
                    services.deliveryType !== "white_glove"
                      ? "border-primary-500 bg-primary-50/60"
                      : "border-ocean-200 bg-white hover:border-ocean-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm sm:text-base text-ocean-900">Regular Delivery</h4>
                    <span className={`text-sm sm:text-base font-bold ${services.deliveryType !== "white_glove" ? "text-primary-600" : "text-ocean-500"}`}>
                      ${DELIVERY_REGULAR.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-ocean-500 mb-2.5">Curbside delivery only.</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-ocean-400">
                      <X className="w-3 h-3 text-red-400 shrink-0" /> Customer unloads truck
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-ocean-400">
                      <X className="w-3 h-3 text-red-400 shrink-0" /> Customer disposes materials
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-ocean-400">
                      <X className="w-3 h-3 text-red-400 shrink-0" /> No stair transport
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-ocean-400">
                      <X className="w-3 h-3 text-red-400 shrink-0" /> No unpacking service
                    </div>
                  </div>
                </button>

                {/* White Glove */}
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_SERVICES", payload: { deliveryType: "white_glove" } })}
                  className={`text-left p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer ${
                    services.deliveryType === "white_glove"
                      ? "border-primary-500 bg-primary-50/60"
                      : "border-ocean-200 bg-white hover:border-ocean-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm sm:text-base text-ocean-900">White Glove</h4>
                    <span className={`text-sm sm:text-base font-bold ${services.deliveryType === "white_glove" ? "text-primary-600" : "text-ocean-500"}`}>
                      ${DELIVERY_WHITE_GLOVE.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-ocean-500 mb-2.5">Full-service delivery.</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-green-600">
                      <Check className="w-3 h-3 shrink-0" /> Delivery to install area
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-green-600">
                      <Check className="w-3 h-3 shrink-0" /> Materials removed
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-green-600">
                      <Check className="w-3 h-3 shrink-0" /> Stair transport (2 stories)
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-green-600">
                      <Check className="w-3 h-3 shrink-0" /> Unpack & inspect
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Installation */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-ocean-700">Installation Service</p>
              </div>
              <div className="rounded-xl sm:rounded-2xl border-2 border-ocean-200 bg-white p-4 sm:p-5">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <Wrench className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-ocean-400" />
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-ocean-900 leading-tight">
                      Professional Weatherproofing & Installation
                    </h4>
                    <span className="text-xs sm:text-sm font-bold text-amber-600">TBD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Total Quote Estimate (full tier only) ── */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-ocean-200 p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm">
            <h3 className="font-heading font-bold text-ocean-900 text-base sm:text-lg mb-4">Total Quote Estimate</h3>
            <div className="space-y-2 sm:space-y-2.5 text-sm">
              <div className="flex justify-between text-ocean-600">
                <span>All Items Subtotal</span>
                <span className="font-medium">${totals.subtotal.toLocaleString()}</span>
              </div>
              {matchingPromo && promoDiscountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    {matchingPromo.name} ({matchingPromo.percentage}% off)
                  </span>
                  <span className="font-medium">-${promoDiscountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between text-ocean-600">
                <span>Installation</span>
                <span className="font-medium text-amber-600">TBD</span>
              </div>
              <div className="flex justify-between text-ocean-600">
                <span>Delivery ({services.deliveryType === "white_glove" ? "White Glove" : "Regular"})</span>
                <span className="font-medium">${totals.deliveryCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-ocean-600">
                <span>Estimated Tax (8%)</span>
                <span className="font-medium">${totals.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-ocean-200 text-base sm:text-lg font-bold text-ocean-900">
                <span>Grand Total</span>
                <span className="text-primary-600">
                  ${adjustedGrandTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Error */}
      {state.error && (
        <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm">
          {state.error}
        </div>
      )}

      {/* ── Actions ── */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || items.length === 0}
        className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 sm:py-4 px-6 rounded-xl transition-all text-sm sm:text-lg cursor-pointer shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-500/30 active:scale-[0.99]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {isMedium ? "Submitting..." : "Submitting Quote..."}
          </>
        ) : (
          isMedium ? "Submit Estimate Request" : "Save & Email Quote"
        )}
      </button>

      <div className="text-center mt-3 sm:mt-4 pb-6 sm:pb-0">
        <button
          onClick={() => dispatch({ type: "SET_STEP", payload: isMedium ? 4 : 3 })}
          className="text-xs sm:text-sm text-ocean-400 hover:text-ocean-600 transition-colors cursor-pointer"
        >
          &larr; Back
        </button>
      </div>
    </div>
  );
}
