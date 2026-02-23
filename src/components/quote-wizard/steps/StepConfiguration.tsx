"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, RefreshCw } from "lucide-react";
import type { ConfiguredItem, WizardAction } from "@/lib/quote-wizard/types";
import {
  GLASS_MODIFIERS,
  POCKET_UPCHARGE,
  PRODUCT_CONFIGS,
  getAvailablePanelCounts,
  getPanelLayouts,
  calculateItemTotal,
} from "@/lib/quote-wizard/pricing";
import { validateConfiguration, type ValidationErrors } from "@/lib/quote-wizard/validation";
import { PRODUCTS } from "@/lib/quote-wizard/product-data";
import SlidingDoorAnimation from "@/components/SlidingDoorAnimation";
import BifoldDoorAnimation from "@/components/BifoldDoorAnimation";
import SlideStackDoorAnimation from "@/components/SlideStackDoorAnimation";
// PivotDoorAnimation not used here — pivot doors don't have panel count config

interface StepConfigurationProps {
  item: ConfiguredItem;
  dispatch: React.Dispatch<WizardAction>;
}

/* ── Color swatches ───────────────────────────────────── */

const COLOR_SWATCHES: Record<string, string> = {
  "Black": "bg-gray-900",
  "White": "bg-white border border-gray-300",
  "Bronze (paint)": "bg-amber-800",
  "Anodized Aluminum": "bg-gradient-to-br from-gray-300 to-gray-400",
};

const HARDWARE_SWATCHES: Record<string, string> = {
  "Black": "bg-gray-900",
  "White": "bg-white border border-gray-300",
  "Silver": "bg-gradient-to-br from-gray-300 to-gray-400",
  "Bronze": "bg-amber-800",
};

const EXTERIOR_COLORS = ["Black", "White", "Bronze (paint)", "Anodized Aluminum"];
const INTERIOR_COLORS = ["Black", "White", "Bronze (paint)", "Anodized Aluminum"];

/* ── Glass data ───────────────────────────────────────── */

const DETAILED_GLASS = [
  {
    name: "Low\u2013E3 Glass",
    key: "Low-E3 Glass",
    badge: "Standard Option",
    description: "Low\u2013emissivity coating for energy efficiency",
    features: ["Improved energy efficiency", "UV protection", "Reduced fading"],
    glassLabel: "Dual-Pane Tempered",
    price: "Included",
    priceColor: "text-green-600",
    priceBg: "bg-green-50 border-green-200",
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/v1771423728/Low-E3_Glass_vws62a.webp",
  },
  {
    name: "Clear Glass",
    key: "Clear Glass",
    badge: null,
    description: "Standard clear insulated glass",
    features: ["Maximum light transmission", "Standard option", "Clear view"],
    glassLabel: "Dual-Pane Tempered",
    price: "\u2013$50 per panel",
    priceColor: "text-ocean-600",
    priceBg: "bg-ocean-50 border-ocean-200",
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/v1771423727/Clear-Glass_cnv1i8.webp",
  },
  {
    name: "Laminated Glass",
    key: "Laminated Glass",
    badge: null,
    description: "Safety glass with enhanced security",
    features: ["Enhanced security", "Sound reduction", "Safety protection"],
    glassLabel: "Impact Glass",
    price: "+$75 per panel",
    priceColor: "text-amber-700",
    priceBg: "bg-amber-50 border-amber-200",
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/v1771423727/Laminated_Glass_uyji9x.webp",
  },
];

const SIMPLE_GLASS = [
  { name: "Low-E3 Glass", key: "Low-E3 Glass", price: "Included", priceColor: "text-green-600", priceBg: "bg-green-50 border-green-200", image: "https://res.cloudinary.com/dku1gnuat/image/upload/v1771423728/Low-E3_Glass_vws62a.webp" },
  { name: "Clear Glass", key: "Clear Glass", price: "\u2013$50 per panel", priceColor: "text-ocean-600", priceBg: "bg-ocean-50 border-ocean-200", image: "https://res.cloudinary.com/dku1gnuat/image/upload/v1771423727/Clear-Glass_cnv1i8.webp" },
  { name: "Laminated Glass", key: "Laminated Glass", price: "+$75 per panel", priceColor: "text-amber-700", priceBg: "bg-amber-50 border-amber-200", image: "https://res.cloudinary.com/dku1gnuat/image/upload/v1771423727/Laminated_Glass_uyji9x.webp" },
];

/* ── Layout diagram images ────────────────────────────── */

import { getLayoutImageUrl } from "@/lib/quote-wizard/layout-images";

/* ── Component ────────────────────────────────────────── */

export default function StepConfiguration({ item, dispatch }: StepConfigurationProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const config = PRODUCT_CONFIGS[item.doorTypeSlug];
  const product = PRODUCTS.find((p) => p.slug === item.doorTypeSlug);

  if (!config) return null;

  function updateItem(updates: Partial<ConfiguredItem>) {
    dispatch({ type: "UPDATE_CURRENT_ITEM", payload: updates });
    const keys = Object.keys(updates);
    if (keys.some((k) => errors[k])) {
      setErrors((prev) => {
        const next = { ...prev };
        keys.forEach((k) => delete next[k]);
        return next;
      });
    }
  }

  function handleWidthChange(w: number) {
    updateItem({ width: w, panelCount: 0, panelLayout: "" });
  }

  function handlePanelCountChange(count: number) {
    updateItem({ panelCount: count, panelLayout: "" });
  }

  function handleSave() {
    const panels = config.hasPanelCount ? item.panelCount : 1;
    const glassMod = GLASS_MODIFIERS[item.glassType] ?? 0;
    const updatedItem: ConfiguredItem = {
      ...item,
      panelCount: panels,
      glassPriceModifier: glassMod,
      itemTotal: calculateItemTotal({ ...item, panelCount: panels, glassPriceModifier: glassMod }),
    };
    const validationErrors = validateConfiguration(updatedItem);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    dispatch({
      type: "UPDATE_CURRENT_ITEM",
      payload: { panelCount: panels, glassPriceModifier: glassMod, itemTotal: updatedItem.itemTotal },
    });
    dispatch({ type: "SAVE_CURRENT_ITEM" });
    dispatch({ type: "SET_STEP", payload: 4 });
  }

  const availablePanelCounts = config.hasPanelCount
    ? getAvailablePanelCounts(item.width, config.usableOpeningOffset, config.panelMinWidth, config.panelMaxWidth)
    : [];
  const availableLayouts = item.panelCount > 0 ? getPanelLayouts(item.panelCount, item.doorTypeSlug) : [];

  const [twoToneEnabled, setTwoToneEnabled] = useState(!!item.interiorFinish);
  const colorDone = !!item.exteriorFinish && (!twoToneEnabled || !!item.interiorFinish);

  const sectionDone = [
    item.width > 0 && item.height > 0 && (!config.hasPanelCount || !!item.panelLayout),
    colorDone,
    !!item.glassType,
    !!item.hardwareFinish,
  ];
  const sectionValues = [
    sectionDone[0] ? `${item.width}" \u00d7 ${item.height}"` : null,
    twoToneEnabled && item.interiorFinish ? `Two-tone` : item.exteriorFinish || null,
    item.glassType || null,
    item.hardwareFinish || null,
  ];
  const sectionTitles = ["Size &\nConfiguration", "Color\nSelection", "Glass\nOptions", "Hardware\nFinish"];

  const inputClass = (field: string) =>
    `w-full px-4 py-3 border rounded-xl bg-white text-ocean-900 placeholder-ocean-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 ${
      errors[field] ? "border-red-400" : "border-ocean-200 hover:border-ocean-300"
    }`;

  return (
    <div className="max-w-4xl mx-auto px-1 sm:px-0">

      {/* ═══════════════════════════════════════════════════ */}
      {/*  Product Banner                                    */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-5 sm:mb-8 bg-gradient-to-r from-ocean-900 to-ocean-800">
        {product && (
          <div className="absolute inset-0 opacity-20">
            <Image src={product.image} alt="" fill className="object-cover" />
          </div>
        )}
        <div className="relative flex items-center gap-3 sm:gap-5 p-4 sm:p-6">
          {product && (
            <div className="relative w-16 h-16 sm:w-28 sm:h-28 rounded-lg sm:rounded-xl overflow-hidden shrink-0 bg-white/10 backdrop-blur-sm border border-white/20">
              <Image src={product.image} alt={config.displayName} fill className="object-contain p-0.5 sm:p-1" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-primary-300 text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-0.5 sm:mb-1">Configuring: Item A</p>
            <h2 className="font-heading font-bold text-white text-base sm:text-2xl leading-tight mb-1 sm:mb-2">
              {config.displayName}
            </h2>
            <button
              onClick={() => dispatch({ type: "SET_STEP", payload: 2 })}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-white/70 hover:text-white font-medium transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Change Product
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  Section Stepper                                   */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="relative flex items-start justify-between mb-6 sm:mb-10 px-0 sm:px-2">
        {/* Connecting line */}
        <div className="absolute top-3 sm:top-4 left-[calc(12.5%+10px)] sm:left-[calc(12.5%+16px)] right-[calc(12.5%+10px)] sm:right-[calc(12.5%+16px)] h-0.5 bg-ocean-200" />
        <div
          className="absolute top-3 sm:top-4 left-[calc(12.5%+10px)] sm:left-[calc(12.5%+16px)] h-0.5 bg-primary-500 transition-all duration-500"
          style={{ width: `${(sectionDone.filter(Boolean).length / 4) * 100}%`, maxWidth: "calc(75% - 24px)" }}
        />
        {sectionTitles.map((title, i) => (
          <div key={i} className="relative flex flex-col items-center w-1/4">
            <div className={`relative z-10 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-300 ${
              sectionDone[i]
                ? "bg-primary-500 text-white shadow-md shadow-primary-500/30"
                : "bg-white text-ocean-400 border-2 border-ocean-200"
            }`}>
              {sectionDone[i] ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : i + 1}
            </div>
            <p className="text-[10px] sm:text-[11px] font-medium text-ocean-600 text-center mt-1 sm:mt-2 whitespace-pre-line leading-tight">
              {title}
            </p>
            {sectionValues[i] && (
              <p className="text-[9px] sm:text-[10px] text-primary-600 font-semibold mt-0.5 text-center truncate max-w-[70px] sm:max-w-[90px]">
                {sectionValues[i]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-4 sm:space-y-6">

        {/* ═══════════════════════════════════════════════ */}
        {/*  1. Size & Configuration                       */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="bg-white rounded-xl sm:rounded-2xl border border-ocean-100 shadow-sm shadow-ocean-900/5 overflow-hidden">
          <div className="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-ocean-50 to-transparent border-b border-ocean-100">
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary-500 text-white flex items-center justify-center text-[10px] sm:text-xs font-bold">1</span>
            <h3 className="font-heading font-bold text-ocean-900 text-sm sm:text-base">Size & Configuration</h3>
          </div>
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">

            {/* System Type */}
            {config.hasSystemType && (
              <div>
                <label className="block text-sm font-semibold text-ocean-800 mb-2.5">
                  System Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => updateItem({ systemType: "slider" })}
                    className={`relative p-3 sm:p-4 rounded-xl border-2 text-left transition-all cursor-pointer group ${
                      item.systemType === "slider"
                        ? "border-primary-500 bg-primary-50/60 shadow-sm shadow-primary-500/10"
                        : "border-ocean-200 hover:border-ocean-300 hover:shadow-sm"
                    }`}
                  >
                    {item.systemType === "slider" && (
                      <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <p className="font-semibold text-sm text-ocean-900 pr-6">Sliders and Multi-Slide Systems</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateItem({ systemType: "pocket" })}
                    className={`relative p-3 sm:p-4 rounded-xl border-2 text-left transition-all cursor-pointer group ${
                      item.systemType === "pocket"
                        ? "border-primary-500 bg-primary-50/60 shadow-sm shadow-primary-500/10"
                        : "border-ocean-200 hover:border-ocean-300 hover:shadow-sm"
                    }`}
                  >
                    {item.systemType === "pocket" && (
                      <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <p className="font-semibold text-sm text-ocean-900 pr-6">Pocket Door System</p>
                    <p className="text-xs text-ocean-500 mt-1">
                      (Upcharge: ${POCKET_UPCHARGE.toLocaleString()}) Do not include pocket area in width; our system will calculate it.
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Width & Height */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-ocean-800 mb-1.5">
                  Width (inches) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={item.width || ""}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  placeholder="Enter width"
                  max={config.maxWidth}
                  className={inputClass("width")}
                />
                <p className="mt-1.5 text-xs text-ocean-400">Max width: {config.maxWidth}&quot;</p>
                {errors.width && <p className="mt-1 text-xs text-red-500">{errors.width}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-ocean-800 mb-1.5">
                  Height (inches) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={item.height || ""}
                  onChange={(e) => updateItem({ height: Number(e.target.value) })}
                  placeholder="Enter height"
                  max={config.maxHeight}
                  className={inputClass("height")}
                />
                <p className="mt-1.5 text-xs text-ocean-400">Max height: {config.maxHeight}&quot;</p>
                {errors.height && <p className="mt-1 text-xs text-red-500">{errors.height}</p>}
              </div>
            </div>

            {/* Panel Count */}
            {config.hasPanelCount && (
              <div>
                <label className="block text-sm font-semibold text-ocean-800 mb-1">Panel Count</label>
                <p className="text-xs text-ocean-400 mb-3">
                  Usable opening = width &minus; {config.usableOpeningOffset}&quot;. Per-panel must be {config.panelMinWidth}&quot;&ndash;{config.panelMaxWidth}&quot;.
                </p>
                {availablePanelCounts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
                    {availablePanelCounts.map((opt) => {
                      const isSelected = item.panelCount === opt.count;
                      return (
                        <button
                          key={opt.count}
                          type="button"
                          onClick={() => handlePanelCountChange(opt.count)}
                          className={`relative p-3 sm:p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                            isSelected
                              ? "border-primary-500 bg-primary-50/60 shadow-sm shadow-primary-500/10"
                              : "border-ocean-200 hover:border-ocean-300 bg-white hover:shadow-sm"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <p className={`font-bold text-sm ${isSelected ? "text-primary-700" : "text-ocean-900"}`}>
                            {opt.count} Panels
                          </p>
                          <p className="text-xs text-ocean-500 mt-0.5">
                            &asymp; {opt.perPanelWidth}&quot; each
                          </p>
                          {item.doorTypeSlug !== "bi-fold" && item.doorTypeSlug !== "slide-stack" && (
                            <p className="text-[10px] text-ocean-400 mt-0.5">
                              {opt.symmetry}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-4 py-3 rounded-xl bg-ocean-50 border border-ocean-100">
                    <p className="text-sm text-ocean-400">Enter width to see available panel counts.</p>
                  </div>
                )}
                {errors.panelCount && <p className="mt-1.5 text-xs text-red-500">{errors.panelCount}</p>}
              </div>
            )}

            {/* Panel Layout */}
            {config.hasPanelCount && (
              <div>
                <label className="block text-sm font-semibold text-ocean-800 mb-1">Panel Layout</label>
                <p className="text-xs text-ocean-400 mb-3">As viewed from outside the building.</p>
                {availableLayouts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    {availableLayouts.map((layout) => {
                      const isSelected = item.panelLayout === layout;
                      const imgUrl = getLayoutImageUrl(item.doorTypeSlug, item.panelCount, layout);
                      return (
                        <button
                          key={layout}
                          type="button"
                          onClick={() => updateItem({ panelLayout: layout })}
                          className={`relative rounded-xl border-2 text-left transition-all cursor-pointer overflow-hidden ${
                            isSelected
                              ? "border-primary-500 bg-primary-50/60 shadow-sm shadow-primary-500/10"
                              : "border-ocean-200 hover:border-ocean-300 bg-white hover:shadow-sm"
                          }`}
                        >
                          {imgUrl && (
                            <div className="w-full h-20 sm:h-24 bg-ocean-50/50 flex items-center justify-center px-3 pt-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={imgUrl} alt={layout} className="h-full w-auto object-contain" />
                            </div>
                          )}
                          <div className="p-2.5 sm:p-3">
                            <span className={`text-xs sm:text-sm font-medium leading-tight ${isSelected ? "text-primary-700" : "text-ocean-700"}`}>
                              {layout}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-4 py-3 rounded-xl bg-ocean-50 border border-ocean-100">
                    <p className="text-sm text-ocean-400">Select a panel count to see layouts.</p>
                  </div>
                )}
                {errors.panelLayout && <p className="mt-1.5 text-xs text-red-500">{errors.panelLayout}</p>}
              </div>
            )}

            {/* Live Door Animation Preview */}
            {(item.doorTypeSlug === "bi-fold" || item.doorTypeSlug === "slide-stack" || item.doorTypeSlug === "multi-slide-pocket" || item.doorTypeSlug === "ultra-slim") && (
              <div>
                <label className="block text-sm font-semibold text-ocean-800 mb-1">Live Preview</label>
                <p className="text-xs text-ocean-400 mb-3">See how your door configuration looks and operates.</p>
                <div className="rounded-xl border border-ocean-200 overflow-hidden bg-white">
                  {item.doorTypeSlug === "bi-fold" && (
                    <BifoldDoorAnimation
                      panelCountOverride={item.panelCount > 0 ? item.panelCount : undefined}
                      foldDirectionOverride={
                        item.panelLayout?.includes('Split') ? 'center'
                        : item.panelLayout?.includes('Right') ? 'right'
                        : item.panelLayout?.includes('Left') ? 'left'
                        : undefined
                      }
                      compact
                    />
                  )}
                  {item.doorTypeSlug === "slide-stack" && (
                    <SlideStackDoorAnimation
                      panelCountOverride={item.panelCount > 0 ? item.panelCount : undefined}
                      stackSideOverride={
                        item.panelLayout === '1L + 1R' ? 'split'
                        : item.panelLayout?.includes('Right') ? 'right'
                        : item.panelLayout?.includes('Left') || item.panelLayout?.endsWith('L') ? 'left'
                        : undefined
                      }
                      compact
                    />
                  )}
                  {(item.doorTypeSlug === "multi-slide-pocket" || item.doorTypeSlug === "ultra-slim") && (
                    <SlidingDoorAnimation
                      panelCountOverride={item.panelCount > 0 ? item.panelCount : undefined}
                      panelLayoutOverride={item.panelLayout || undefined}
                      compact
                    />
                  )}
                </div>
              </div>
            )}

            {/* Room Name (awning only) */}
            {config.hasRoomName && (
              <div>
                <label className="block text-sm font-semibold text-ocean-800 mb-1.5">
                  Room Name <span className="text-ocean-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={item.roomName}
                  onChange={(e) => updateItem({ roomName: e.target.value })}
                  placeholder="e.g., Living Room"
                  className="w-full px-4 py-3 border border-ocean-200 hover:border-ocean-300 rounded-xl bg-white text-ocean-900 placeholder-ocean-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                />
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/*  2. Color Selection                            */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="bg-white rounded-xl sm:rounded-2xl border border-ocean-100 shadow-sm shadow-ocean-900/5 overflow-hidden">
          <div className="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-ocean-50 to-transparent border-b border-ocean-100">
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary-500 text-white flex items-center justify-center text-[10px] sm:text-xs font-bold">2</span>
            <h3 className="font-heading font-bold text-ocean-900 text-sm sm:text-base">Color Selection</h3>
          </div>
          <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
            {/* Exterior Finish */}
            <div>
              <label className="block text-sm font-semibold text-ocean-800 mb-2.5 sm:mb-3">Exterior Finish</label>
              {errors.exteriorFinish && <p className="mb-2.5 sm:mb-3 text-xs text-red-500">{errors.exteriorFinish}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {EXTERIOR_COLORS.map((color) => {
                  const isSelected = item.exteriorFinish === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateItem({ exteriorFinish: color })}
                      className={`relative flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary-500 bg-primary-50/60 shadow-sm shadow-primary-500/10"
                          : "border-ocean-200 hover:border-ocean-300 bg-white hover:shadow-sm"
                      }`}
                    >
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 shadow-inner ${COLOR_SWATCHES[color] || "bg-gray-300"}`} />
                      <span className={`text-sm font-medium leading-tight ${isSelected ? "text-primary-700" : "text-ocean-700"}`}>
                        {color}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Two-tone toggle */}
            <div>
              <button
                type="button"
                onClick={() => {
                  if (twoToneEnabled) {
                    setTwoToneEnabled(false);
                    updateItem({ interiorFinish: "" });
                  } else {
                    setTwoToneEnabled(true);
                  }
                }}
                className={`w-full flex items-center justify-between p-3 sm:p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  twoToneEnabled
                    ? "border-primary-500 bg-primary-50/60 shadow-sm shadow-primary-500/10"
                    : "border-ocean-200 hover:border-ocean-300 bg-white hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 shadow-inner bg-gradient-to-r from-gray-900 via-gray-900 to-white border border-gray-300" />
                  <span className={`text-sm font-medium ${twoToneEnabled ? "text-primary-700" : "text-ocean-700"}`}>
                    Two-tone (different interior color)
                  </span>
                </div>
                <div
                  className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 shrink-0 ${
                    twoToneEnabled ? "bg-primary-500" : "bg-ocean-200"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      twoToneEnabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
              </button>
            </div>

            {/* Interior Finish (shown when two-tone) */}
            {twoToneEnabled && (
              <div>
                <label className="block text-sm font-semibold text-ocean-800 mb-2.5 sm:mb-3">Interior Finish</label>
                {errors.interiorFinish && <p className="mb-2.5 sm:mb-3 text-xs text-red-500">{errors.interiorFinish}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {INTERIOR_COLORS.map((color) => {
                    const isSelected = item.interiorFinish === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => updateItem({ interiorFinish: color })}
                        className={`relative flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary-500 bg-primary-50/60 shadow-sm shadow-primary-500/10"
                            : "border-ocean-200 hover:border-ocean-300 bg-white hover:shadow-sm"
                        }`}
                      >
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 shadow-inner ${COLOR_SWATCHES[color] || "bg-gray-300"}`} />
                        <span className={`text-sm font-medium leading-tight ${isSelected ? "text-primary-700" : "text-ocean-700"}`}>
                          {color}
                        </span>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/*  3. Glass Options                              */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="bg-white rounded-xl sm:rounded-2xl border border-ocean-100 shadow-sm shadow-ocean-900/5 overflow-hidden">
          <div className="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-ocean-50 to-transparent border-b border-ocean-100">
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary-500 text-white flex items-center justify-center text-[10px] sm:text-xs font-bold">3</span>
            <h3 className="font-heading font-bold text-ocean-900 text-sm sm:text-base">Glass Options</h3>
          </div>
          <div className="p-4 sm:p-6">
            <label className="block text-sm font-semibold text-ocean-800 mb-2.5 sm:mb-3">Glass Type</label>
            {errors.glassType && <p className="mb-2.5 sm:mb-3 text-xs text-red-500">{errors.glassType}</p>}

            {config.detailedGlass ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {DETAILED_GLASS.map((glass) => {
                  const isSelected = item.glassType === glass.key;
                  return (
                    <button
                      key={glass.key}
                      type="button"
                      onClick={() => updateItem({ glassType: glass.key })}
                      className={`relative text-left rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer flex flex-col overflow-hidden ${
                        isSelected
                          ? "border-primary-500 bg-primary-50/40 shadow-md shadow-primary-500/10"
                          : "border-ocean-200 hover:border-ocean-300 bg-white hover:shadow-md hover:shadow-ocean-900/5"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 z-10 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="relative h-28 sm:h-32 w-full bg-ocean-50">
                        <Image
                          src={glass.image}
                          alt={glass.name}
                          fill
                          className="object-contain"
                        />
                        {glass.badge && (
                          <span className="absolute top-2 left-2 text-[10px] font-bold text-white bg-primary-500 px-2 py-0.5 rounded-full">
                            {glass.badge}
                          </span>
                        )}
                      </div>
                      <div className="p-3.5 sm:p-4 flex flex-col flex-1">
                        <h4 className="font-bold text-ocean-900 text-sm mb-0.5">{glass.name}</h4>
                        <p className="text-xs text-ocean-500 mb-2.5 sm:mb-3 leading-relaxed">{glass.description}</p>
                        <ul className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4 flex-1">
                          {glass.features.map((f) => (
                            <li key={f} className="flex items-start gap-1.5 text-xs text-ocean-600">
                              <Check className="w-3 h-3 text-primary-500 mt-0.5 shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <div className="pt-2.5 sm:pt-3 border-t border-ocean-100 mt-auto">
                          <p className="text-[10px] text-ocean-400 font-medium uppercase tracking-wider mb-1">{glass.glassLabel}</p>
                          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg border ${glass.priceBg} ${glass.priceColor}`}>
                            {glass.price}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2.5 sm:space-y-3">
                {SIMPLE_GLASS.map((glass) => {
                  const isSelected = item.glassType === glass.key;
                  return (
                    <button
                      key={glass.key}
                      type="button"
                      onClick={() => updateItem({ glassType: glass.key })}
                      className={`relative w-full flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-xl border-2 text-sm text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary-500 bg-primary-50/40 shadow-sm shadow-primary-500/10"
                          : "border-ocean-200 hover:border-ocean-300 bg-white hover:shadow-sm"
                      }`}
                    >
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 bg-ocean-50">
                        <Image src={glass.image} alt={glass.name} fill className="object-contain" />
                      </div>
                      <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <span className={`font-semibold ${isSelected ? "text-primary-700" : "text-ocean-800"}`}>
                            {glass.name}
                          </span>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border shrink-0 ${glass.priceBg} ${glass.priceColor}`}>
                          {glass.price}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/*  4. Hardware Finish                            */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="bg-white rounded-xl sm:rounded-2xl border border-ocean-100 shadow-sm shadow-ocean-900/5 overflow-hidden">
          <div className="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-ocean-50 to-transparent border-b border-ocean-100">
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary-500 text-white flex items-center justify-center text-[10px] sm:text-xs font-bold">4</span>
            <h3 className="font-heading font-bold text-ocean-900 text-sm sm:text-base">Hardware Finish</h3>
          </div>
          <div className="p-4 sm:p-6">
            {errors.hardwareFinish && <p className="mb-2.5 sm:mb-3 text-xs text-red-500">{errors.hardwareFinish}</p>}
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {config.hardwareOptions.map((finish) => {
                const isSelected = item.hardwareFinish === finish;
                return (
                  <button
                    key={finish}
                    type="button"
                    onClick={() => updateItem({ hardwareFinish: finish })}
                    className={`relative flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary-500 bg-primary-50/60 shadow-sm shadow-primary-500/10"
                        : "border-ocean-200 hover:border-ocean-300 bg-white hover:shadow-sm"
                    }`}
                  >
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full shrink-0 shadow-inner ${HARDWARE_SWATCHES[finish] || "bg-gray-300"}`} />
                    <span className={`text-sm font-semibold ${isSelected ? "text-primary-700" : "text-ocean-700"}`}>
                      {finish}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center ml-1">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* ── Incomplete warning ── */}
      {!sectionDone.every(Boolean) && (
        <div className="mt-4 sm:mt-6 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs sm:text-sm font-medium text-center">
          Some selections still not made
        </div>
      )}

      {/* ── Actions ── */}
      <div className="mt-5 sm:mt-6 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pb-4 sm:pb-0">
        <button
          onClick={() => dispatch({ type: "SET_STEP", payload: 2 })}
          className="group px-5 py-3.5 sm:py-3.5 rounded-xl border border-ocean-200 text-ocean-600 font-medium hover:bg-ocean-50 hover:border-ocean-300 transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-2"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 sm:py-3.5 px-6 rounded-xl transition-all text-base sm:text-lg cursor-pointer shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-500/30 active:scale-[0.99]"
        >
          Save Configuration
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
