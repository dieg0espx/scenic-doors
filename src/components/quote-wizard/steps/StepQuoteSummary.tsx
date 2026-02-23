"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Copy,
  Trash2,
  Plus,
  Truck,
  Check,
  X,
  Loader2,
  Shield,
  Wrench,
  Eye,
  Sparkles,
  ClipboardCheck,
  Trash,
  GraduationCap,
  Package,
} from "lucide-react";
import type { ConfiguredItem, WizardState, WizardAction } from "@/lib/quote-wizard/types";
import { calculateQuoteTotals, DELIVERY_COSTS, INSTALLATION_COST, PRODUCT_CONFIGS } from "@/lib/quote-wizard/pricing";
import { getLayoutImageUrl } from "@/lib/quote-wizard/layout-images";
import { createQuote, sendQuoteToClient, assignQuote, notifyNewQuote, sendEstimateConfirmation } from "@/lib/actions/quotes";
import { updateLead } from "@/lib/actions/leads";
import { getNextSalesRep } from "@/lib/actions/admin-users";
import { scheduleFollowUps } from "@/lib/actions/follow-ups";

interface StepQuoteSummaryProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

/* ── Constants ────────────────────────────────────────── */

const REGULAR_DELIVERY_ITEMS = [
  { included: false, text: "Customer unloads truck" },
  { included: false, text: "Customer disposes materials" },
  { included: false, text: "No stair transport" },
  { included: false, text: "No unpacking service" },
];

const WHITE_GLOVE_ITEMS = [
  { included: true, text: "Delivery to install area" },
  { included: true, text: "Materials removed" },
  { included: true, text: "Stair transport (2 stories)" },
  { included: true, text: "Unpack & inspect" },
];

const INSTALLATION_FEATURES = [
  {
    icon: Shield,
    title: "Site Preparation and Protection",
    desc: "Secure and properly prepare the work area, ensuring adjacent surfaces, finishes, and property are fully protected throughout the installation process.",
  },
  {
    icon: Wrench,
    title: "Professional Weatherproofing & Installation by Certified Technicians",
    desc: "All installation and weatherproofing work is performed by trained technicians in accordance with industry standards for safety, precision, and quality workmanship.",
  },
  {
    icon: Eye,
    title: "Final Adjustments and Operation Testing",
    desc: "Upon completion, all components will be adjusted and tested to confirm proper alignment, smooth function, and optimal operating performance.",
  },
  {
    icon: Trash,
    title: "Cleanup and Debris Removal",
    desc: "All installation-related debris will be removed and the work area will be left broom-clean upon completion.",
  },
  {
    icon: GraduationCap,
    title: "Operation Demonstration and Care Instructions",
    desc: "Customer will receive a walkthrough on product operation, maintenance guidelines, and recommended care procedures to ensure long-term performance.",
  },
  {
    icon: ClipboardCheck,
    title: "1-Year Installation Warranty",
    desc: "Workmanship is warrantied for one (1) year from the installation date, covering defects arising from labor or installation methods.",
  },
];

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

export default function StepQuoteSummary({ state, dispatch }: StepQuoteSummaryProps) {
  const { items, services, contact, leadId, isSubmitting } = state;
  const totals = calculateQuoteTotals(items, services);

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
            unit_price: item.basePrice,
            total: item.basePrice,
          }))
        : items.map((item) => ({
            id: item.id,
            name: item.doorType,
            description: `${item.width}" x ${item.height}" | ${item.exteriorFinish}${item.exteriorFinish === "Two-tone" && item.interiorFinish ? ` / ${item.interiorFinish} interior` : ""} | ${item.glassType} | ${item.hardwareFinish}${item.roomName ? ` | ${item.roomName}` : ""}`,
            quantity: 1,
            unit_price: item.itemTotal,
            total: item.itemTotal,
          }));

      const mediumNotes = isMedium
        ? [
            state.generalPreferences.approximateSize && `Approximate size: ${state.generalPreferences.approximateSize}`,
            state.generalPreferences.colorPreference && `Color preference: ${state.generalPreferences.colorPreference}`,
            state.generalPreferences.glassPreference && `Glass preference: ${state.generalPreferences.glassPreference}`,
            state.generalPreferences.projectNotes && `Notes: ${state.generalPreferences.projectNotes}`,
          ].filter(Boolean).join("\n")
        : undefined;

      const quote = await createQuote({
        client_name: `${contact.firstName} ${contact.lastName}`,
        client_email: contact.email,
        door_type: firstItem.doorType,
        material: "Aluminum",
        color: isMedium ? (state.generalPreferences.colorPreference || "TBD") : firstItem.exteriorFinish,
        glass_type: isMedium ? (state.generalPreferences.glassPreference || "TBD") : firstItem.glassType,
        size: isMedium ? (state.generalPreferences.approximateSize || "TBD") : `${firstItem.width}" x ${firstItem.height}"`,
        cost: isMedium ? firstItem.basePrice : totals.grandTotal,
        customer_type: contact.customerType,
        customer_phone: contact.phone,
        customer_zip: contact.zip,
        lead_status: "new",
        lead_id: leadId || undefined,
        items: JSON.stringify(quoteItems),
        subtotal: isMedium ? firstItem.basePrice : totals.subtotal,
        installation_cost: isMedium ? 0 : totals.installationCost,
        delivery_cost: isMedium ? 0 : totals.deliveryCost,
        tax: isMedium ? 0 : totals.tax,
        grand_total: isMedium ? firstItem.basePrice : totals.grandTotal,
        delivery_type: isMedium ? "pickup" : (services.deliveryType === "none" ? "pickup" : "delivery"),
        intent_level: state.intentLevel || "full",
        notes: mediumNotes,
      });

      if (leadId) {
        await updateLead(leadId, { has_quote: true });
      }

      // Auto-assign to next sales rep (round-robin)
      try {
        const rep = await getNextSalesRep();
        if (rep) {
          await assignQuote(quote.id, rep.id);
        }
      } catch {
        // Don't block the flow if assignment fails
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

  function toggleDelivery(value: "regular" | "white-glove") {
    dispatch({
      type: "SET_SERVICES",
      payload: { deliveryType: services.deliveryType === value ? "none" : value },
    });
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
              <span className="text-xs sm:text-sm text-ocean-500">Estimated Starting Price</span>
              <span className="text-sm sm:text-base font-bold text-primary-600">~${items[0]?.basePrice.toLocaleString()}</span>
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
                  <span className="font-medium text-ocean-700">Delivery</span> &mdash; Regular (${DELIVERY_COSTS.regular.toLocaleString()}) or White Glove (${DELIVERY_COSTS["white-glove"].toLocaleString()})
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-ocean-400 shrink-0" />
                <span className="text-xs sm:text-sm text-ocean-600">
                  <span className="font-medium text-ocean-700">Professional Installation</span> &mdash; ${INSTALLATION_COST.toLocaleString()}
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
              <p className="text-sm font-semibold text-ocean-700 mb-3">Delivery Options</p>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Regular Delivery */}
                <button
                  onClick={() => toggleDelivery("regular")}
                  className={`text-left p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer ${
                    services.deliveryType === "regular"
                      ? "border-primary-500 bg-primary-50/60 shadow-sm"
                      : "border-ocean-200 hover:border-ocean-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-ocean-900">Regular Delivery</h4>
                      <p className="text-xs text-ocean-500 mt-0.5">Curbside delivery only.</p>
                    </div>
                    <span className="text-sm sm:text-base font-bold text-primary-600 shrink-0">
                      ${DELIVERY_COSTS.regular.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-1.5 mt-3">
                    {REGULAR_DELIVERY_ITEMS.map((item) => (
                      <div key={item.text} className="flex items-center gap-2 text-xs sm:text-sm text-ocean-500">
                        <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400 shrink-0" />
                        {item.text}
                      </div>
                    ))}
                  </div>
                </button>

                {/* White Glove */}
                <button
                  onClick={() => toggleDelivery("white-glove")}
                  className={`text-left p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer ${
                    services.deliveryType === "white-glove"
                      ? "border-primary-500 bg-primary-50/60 shadow-sm"
                      : "border-ocean-200 hover:border-ocean-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-ocean-900">White Glove</h4>
                      <p className="text-xs text-ocean-500 mt-0.5">Full-service delivery.</p>
                    </div>
                    <span className="text-sm sm:text-base font-bold text-primary-600 shrink-0">
                      ${DELIVERY_COSTS["white-glove"].toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-1.5 mt-3">
                    {WHITE_GLOVE_ITEMS.map((item) => (
                      <div key={item.text} className="flex items-center gap-2 text-xs sm:text-sm text-ocean-700">
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500 shrink-0" />
                        {item.text}
                      </div>
                    ))}
                  </div>
                </button>
              </div>
            </div>

            {/* Installation */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-ocean-700">Installation Service</p>
              </div>
              <div className={`rounded-xl sm:rounded-2xl border-2 transition-all overflow-hidden ${
                services.includeInstallation
                  ? "border-primary-500 bg-white"
                  : "border-ocean-200 bg-white"
              }`}>
                {/* Toggle header */}
                <button
                  onClick={() =>
                    dispatch({
                      type: "SET_SERVICES",
                      payload: { includeInstallation: !services.includeInstallation },
                    })
                  }
                  className="w-full p-4 sm:p-5 text-left cursor-pointer hover:bg-ocean-50/30 transition-colors"
                >
                  <div className="flex items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0">
                      <Wrench className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 sm:mt-0 ${services.includeInstallation ? "text-primary-500" : "text-ocean-400"}`} />
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm sm:text-base text-ocean-900 leading-tight">
                          Professional Weatherproofing & Installation
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs sm:text-sm font-bold text-primary-600">${INSTALLATION_COST.toLocaleString()}</span>
                          {services.includeInstallation && (
                            <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-green-600">
                              <Check className="w-3 h-3" /> Included
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <div
                        className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${
                          services.includeInstallation ? "bg-primary-500" : "bg-ocean-200"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                            services.includeInstallation ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded installation details */}
                {services.includeInstallation && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-ocean-100">
                    <p className="text-xs sm:text-sm text-ocean-500 mt-3 mb-4">
                      Complete professional installation with weatherproofing, sealing, and quality inspection.
                    </p>
                    <div className="space-y-4">
                      {INSTALLATION_FEATURES.map((feature) => {
                        const Icon = feature.icon;
                        return (
                          <div key={feature.title} className="flex gap-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0 mt-0.5">
                              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-500" />
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-semibold text-ocean-800">{feature.title}</p>
                              <p className="text-[11px] sm:text-xs text-ocean-500 leading-relaxed mt-0.5">{feature.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
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
              {totals.installationCost > 0 && (
                <div className="flex justify-between text-ocean-600">
                  <span>Installation</span>
                  <span className="font-medium">${totals.installationCost.toLocaleString()}</span>
                </div>
              )}
              {totals.deliveryCost > 0 && (
                <div className="flex justify-between text-ocean-600">
                  <span>Delivery</span>
                  <span className="font-medium">${totals.deliveryCost.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-ocean-600">
                <span>Estimated Tax (8%)</span>
                <span className="font-medium">${totals.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-ocean-200 text-base sm:text-lg font-bold text-ocean-900">
                <span>Grand Total</span>
                <span className="text-primary-600">
                  ${totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
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
