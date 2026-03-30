"use client";

import { useState } from "react";
import { Check, Loader2, RotateCcw } from "lucide-react";
import { upsertPricingRate, resetPricingRate } from "@/lib/actions/pricing-rates";

const DOOR_OPTIONS = [
  { slug: "multi-slide-pocket", label: "Multi-Slide & Pocket", defaultRate: 105 },
  { slug: "ultra-slim", label: "Ultra Slim Multi-Slide", defaultRate: 130 },
  { slug: "bi-fold", label: "Bi-Fold Doors", defaultRate: 110 },
  { slug: "slide-stack", label: "Slide-&-Stack", defaultRate: 121.785714 },
];

interface Props {
  currentRates: Record<string, number>;
}

export default function PricingRatesEditor({ currentRates }: Props) {
  const [rates, setRates] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const door of DOOR_OPTIONS) {
      initial[door.slug] = String(currentRates[door.slug] ?? door.defaultRate);
    }
    return initial;
  });
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [resettingSlug, setResettingSlug] = useState<string | null>(null);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);

  async function handleSave(slug: string) {
    const val = parseFloat(rates[slug]);
    if (isNaN(val) || val <= 0) {
      alert("Please enter a valid rate.");
      return;
    }
    setSavingSlug(slug);
    try {
      await upsertPricingRate(slug, Math.round(val * 100) / 100);
      setSavedSlug(slug);
      setTimeout(() => setSavedSlug(null), 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSavingSlug(null);
    }
  }

  async function handleReset(slug: string) {
    const door = DOOR_OPTIONS.find((d) => d.slug === slug);
    if (!door) return;
    setResettingSlug(slug);
    try {
      await resetPricingRate(slug);
      setRates((prev) => ({ ...prev, [slug]: String(door.defaultRate) }));
      setSavedSlug(slug);
      setTimeout(() => setSavedSlug(null), 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reset");
    } finally {
      setResettingSlug(null);
    }
  }

  function isModified(slug: string) {
    const door = DOOR_OPTIONS.find((d) => d.slug === slug);
    if (!door) return false;
    return parseFloat(rates[slug]) !== door.defaultRate;
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
      <div className="px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
        <h3 className="text-base font-semibold text-white">Price Per Square Foot</h3>
        <p className="text-white/30 text-xs mt-1">Set the rate per sq ft for each door type. Changes apply to all new quotes.</p>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {DOOR_OPTIONS.map((door) => {
          const isSaving = savingSlug === door.slug;
          const isResetting = resettingSlug === door.slug;
          const justSaved = savedSlug === door.slug;
          const modified = isModified(door.slug);
          const hasChanged = parseFloat(rates[door.slug]) !== (currentRates[door.slug] ?? door.defaultRate);

          return (
            <div key={door.slug} className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{door.label}</p>
                <p className="text-xs text-white/25 mt-0.5">
                  Default: ${door.defaultRate}/sq ft
                  {modified && <span className="text-amber-400/60 ml-2">(customized)</span>}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={rates[door.slug]}
                    onChange={(e) => setRates((prev) => ({ ...prev, [door.slug]: e.target.value }))}
                    className="w-32 bg-white/[0.04] border border-white/[0.08] rounded-lg pl-7 pr-3 py-2 text-sm text-white text-right focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/40"
                  />
                  <span className="absolute right-[-45px] top-1/2 -translate-y-1/2 text-white/20 text-xs whitespace-nowrap">/sq ft</span>
                </div>
                <div className="flex items-center gap-1 ml-10">
                  <button
                    onClick={() => handleSave(door.slug)}
                    disabled={isSaving || !hasChanged}
                    className={`p-2 rounded-lg transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                      justSaved
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white/60 hover:bg-white/[0.08]"
                    }`}
                    title="Save"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : justSaved ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                  {modified && (
                    <button
                      onClick={() => handleReset(door.slug)}
                      disabled={isResetting}
                      className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/30 hover:text-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer disabled:opacity-50"
                      title="Reset to default"
                    >
                      {isResetting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RotateCcw className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
