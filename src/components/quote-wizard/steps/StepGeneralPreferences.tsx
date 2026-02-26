"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import type { WizardState, WizardAction } from "@/lib/quote-wizard/types";

interface StepGeneralPreferencesProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

const SIZE_OPTIONS = [
  { value: "small", label: "Small", desc: "Under 8'" },
  { value: "medium", label: "Medium", desc: "8' – 12'" },
  { value: "large", label: "Large", desc: "12' – 16'" },
  { value: "extra-large", label: "Extra Large", desc: "16'+" },
  { value: "not-sure", label: "Not sure", desc: "Help me decide" },
];

const COLOR_OPTIONS = [
  { value: "light", label: "Light", desc: "White, Ivory", swatch: "bg-gradient-to-br from-white to-gray-100 border border-gray-200" },
  { value: "dark", label: "Dark", desc: "Black, Bronze", swatch: "bg-gradient-to-br from-gray-700 to-gray-900" },
  { value: "wood-tones", label: "Wood Tones", desc: "Natural look", swatch: "bg-gradient-to-br from-amber-600 to-amber-800" },
  { value: "not-sure", label: "Not sure", desc: "Help me decide", swatch: "bg-gradient-to-br from-ocean-100 to-ocean-200 border border-ocean-300" },
];

const GLASS_OPTIONS = [
  { value: "standard", label: "Standard", desc: "Clear glass" },
  { value: "energy-efficient", label: "Energy Efficient", desc: "Low-E coating" },
  { value: "privacy", label: "Privacy / Tinted", desc: "Reduced visibility" },
  { value: "not-sure", label: "Not sure", desc: "Help me decide" },
];

export default function StepGeneralPreferences({ state, dispatch }: StepGeneralPreferencesProps) {
  const { generalPreferences } = state;

  function updatePref(key: string, value: string) {
    dispatch({ type: "SET_GENERAL_PREFERENCES", payload: { [key]: value } });
  }

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-0">
      <div className="text-center mb-5 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-ocean-900 mb-1.5 sm:mb-2">
          Tell Us Your Preferences
        </h2>
        <p className="text-sm sm:text-base text-ocean-500 px-2 sm:px-0">
          Don&apos;t worry about being exact — we&apos;ll refine the details together.
        </p>
      </div>

      {/* Approximate Opening Size */}
      <div className="mb-5 sm:mb-8">
        <h3 className="font-heading font-bold text-ocean-900 text-sm sm:text-lg mb-2.5 sm:mb-3">
          Approximate Opening Size
        </h3>
        {/* 3-col grid on mobile so 5 items flow as 3+2, 5-col on desktop */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
          {SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updatePref("approximateSize", opt.value)}
              className={`p-2.5 sm:p-4 rounded-xl border-2 text-center transition-all cursor-pointer active:scale-[0.97] ${
                generalPreferences.approximateSize === opt.value
                  ? "border-primary-500 bg-primary-50/60 shadow-sm"
                  : "border-ocean-200 bg-white hover:border-ocean-300"
              }`}
            >
              <p className={`text-xs sm:text-sm font-semibold leading-tight ${
                generalPreferences.approximateSize === opt.value ? "text-primary-700" : "text-ocean-800"
              }`}>
                {opt.label}
              </p>
              <p className="text-[10px] sm:text-[11px] text-ocean-400 mt-0.5 leading-tight">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Color Preference */}
      <div className="mb-5 sm:mb-8">
        <h3 className="font-heading font-bold text-ocean-900 text-sm sm:text-lg mb-2.5 sm:mb-3">
          Color Preference
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-3">
          {COLOR_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updatePref("colorPreference", opt.value)}
              className={`p-2.5 sm:p-4 rounded-xl border-2 text-center transition-all cursor-pointer active:scale-[0.97] ${
                generalPreferences.colorPreference === opt.value
                  ? "border-primary-500 bg-primary-50/60 shadow-sm"
                  : "border-ocean-200 bg-white hover:border-ocean-300"
              }`}
            >
              <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg mx-auto mb-1.5 sm:mb-2 ${opt.swatch}`} />
              <p className={`text-xs sm:text-sm font-semibold leading-tight ${
                generalPreferences.colorPreference === opt.value ? "text-primary-700" : "text-ocean-800"
              }`}>
                {opt.label}
              </p>
              <p className="text-[10px] sm:text-[11px] text-ocean-400 mt-0.5 leading-tight hidden sm:block">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Glass Preference */}
      <div className="mb-5 sm:mb-8">
        <h3 className="font-heading font-bold text-ocean-900 text-sm sm:text-lg mb-2.5 sm:mb-3">
          Glass Preference
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {GLASS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updatePref("glassPreference", opt.value)}
              className={`p-2.5 sm:p-4 rounded-xl border-2 text-center transition-all cursor-pointer active:scale-[0.97] ${
                generalPreferences.glassPreference === opt.value
                  ? "border-primary-500 bg-primary-50/60 shadow-sm"
                  : "border-ocean-200 bg-white hover:border-ocean-300"
              }`}
            >
              <p className={`text-xs sm:text-sm font-semibold leading-tight ${
                generalPreferences.glassPreference === opt.value ? "text-primary-700" : "text-ocean-800"
              }`}>
                {opt.label}
              </p>
              <p className="text-[10px] sm:text-[11px] text-ocean-400 mt-0.5 leading-tight">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Project Notes */}
      <div className="mb-5 sm:mb-8">
        <h3 className="font-heading font-bold text-ocean-900 text-sm sm:text-lg mb-2.5 sm:mb-3">
          Project Notes <span className="text-ocean-400 font-normal text-xs sm:text-sm">(optional)</span>
        </h3>
        <textarea
          value={generalPreferences.projectNotes}
          onChange={(e) => updatePref("projectNotes", e.target.value)}
          placeholder="Tell us more about your project — room type, timeline, special requirements..."
          rows={3}
          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-ocean-200 bg-white text-ocean-900 text-sm placeholder:text-ocean-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 resize-none transition-colors"
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3 pb-6 sm:pb-0">
        <button
          onClick={() => dispatch({ type: "SET_STEP", payload: 3 })}
          className="flex items-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl border border-ocean-200 text-ocean-600 font-medium hover:bg-ocean-50 transition-colors cursor-pointer text-sm active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={() => dispatch({ type: "SET_STEP", payload: 5 })}
          className="flex items-center gap-1.5 sm:gap-2 bg-primary-600 hover:bg-primary-500 text-white font-bold py-2.5 px-4 sm:py-3 sm:px-6 rounded-xl transition-all text-sm cursor-pointer shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-500/30 active:scale-[0.98]"
        >
          <span className="sm:hidden">Continue</span>
          <span className="hidden sm:inline">Continue to Summary</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
