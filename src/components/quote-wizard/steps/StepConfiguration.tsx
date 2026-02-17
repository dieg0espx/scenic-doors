"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, Shield, Volume2 } from "lucide-react";
import type { ConfiguredItem, WizardAction } from "@/lib/quote-wizard/types";
import { GLASS_MODIFIERS, estimatePanelCount, calculateItemTotal } from "@/lib/quote-wizard/pricing";
import { validateConfiguration, type ValidationErrors } from "@/lib/quote-wizard/validation";

interface StepConfigurationProps {
  item: ConfiguredItem;
  dispatch: React.Dispatch<WizardAction>;
}

const COLORS = ["Black", "White", "Bronze", "Anodized Aluminum", "Two-Tone"];
const HARDWARE_FINISHES = ["Black", "White", "Bronze"];

const GLASS_OPTIONS = [
  {
    name: "Low-E3 Glass",
    badge: "Included",
    badgeColor: "bg-green-100 text-green-700",
    description: "Energy-efficient dual-pane tempered glass with Low-E3 coating for superior thermal performance.",
    icon: Sparkles,
  },
  {
    name: "Clear Glass",
    badge: "-$50 per panel",
    badgeColor: "bg-ocean-100 text-ocean-600",
    description: "Standard dual-pane tempered clear glass. Great clarity and light transmission.",
    icon: Sparkles,
  },
  {
    name: "Laminated Glass",
    badge: "+$75 per panel",
    badgeColor: "bg-amber-100 text-amber-700",
    description: "Safety laminated glass with acoustic dampening. Ideal for noise reduction and security.",
    icons: [Shield, Volume2],
    icon: Shield,
  },
];

export default function StepConfiguration({ item, dispatch }: StepConfigurationProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  function updateItem(updates: Partial<ConfiguredItem>) {
    dispatch({ type: "UPDATE_CURRENT_ITEM", payload: updates });
    // Clear errors for updated fields
    const errorKeys = Object.keys(updates);
    if (errorKeys.some((k) => errors[k])) {
      setErrors((prev) => {
        const next = { ...prev };
        errorKeys.forEach((k) => delete next[k]);
        return next;
      });
    }
  }

  function handleSave() {
    // Calculate panel count and total before validation
    const panelCount = estimatePanelCount(item.width, item.doorTypeSlug);
    const glassMod = GLASS_MODIFIERS[item.glassType] ?? 0;
    const updatedItem: ConfiguredItem = {
      ...item,
      panelCount,
      glassPriceModifier: glassMod,
      itemTotal: calculateItemTotal({ ...item, panelCount, glassPriceModifier: glassMod }),
    };

    const validationErrors = validateConfiguration(updatedItem);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Update with calculated fields then save
    dispatch({
      type: "UPDATE_CURRENT_ITEM",
      payload: {
        panelCount,
        glassPriceModifier: glassMod,
        itemTotal: calculateItemTotal({ ...item, panelCount, glassPriceModifier: glassMod }),
      },
    });
    dispatch({ type: "SAVE_CURRENT_ITEM" });
    dispatch({ type: "SET_STEP", payload: 4 });
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-ocean-900 mb-2">
          Configure Your {item.doorType}
        </h2>
        <p className="text-ocean-500">Customize your door specifications below</p>
      </div>

      <div className="space-y-8">
        {/* Section 1: Size & Configuration */}
        <section className="bg-white rounded-xl border border-ocean-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
              1
            </span>
            <h3 className="font-heading font-bold text-ocean-900 text-lg">Size & Configuration</h3>
          </div>

          <div className="flex items-center justify-between mb-4 p-3 bg-ocean-50 rounded-lg">
            <span className="text-sm font-medium text-ocean-700">
              Selected: <span className="text-primary-600">{item.doorType}</span>
            </span>
            <button
              onClick={() => dispatch({ type: "SET_STEP", payload: 2 })}
              className="text-sm text-primary-600 hover:text-primary-500 font-medium flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              Change Product Type
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ocean-700 mb-1.5">
                Width (inches) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={item.width || ""}
                onChange={(e) => updateItem({ width: Number(e.target.value) })}
                placeholder="e.g. 120"
                max={240}
                className={`w-full px-4 py-3 border rounded-lg bg-white text-ocean-900 placeholder-ocean-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors ${
                  errors.width ? "border-red-400" : "border-ocean-200"
                }`}
              />
              {errors.width && <p className="mt-1 text-xs text-red-500">{errors.width}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-700 mb-1.5">
                Height (inches) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={item.height || ""}
                onChange={(e) => updateItem({ height: Number(e.target.value) })}
                placeholder="e.g. 96"
                max={140}
                className={`w-full px-4 py-3 border rounded-lg bg-white text-ocean-900 placeholder-ocean-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors ${
                  errors.height ? "border-red-400" : "border-ocean-200"
                }`}
              />
              {errors.height && <p className="mt-1 text-xs text-red-500">{errors.height}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-ocean-700 mb-1.5">
              Room Name <span className="text-ocean-400">(optional)</span>
            </label>
            <input
              type="text"
              value={item.roomName}
              onChange={(e) => updateItem({ roomName: e.target.value })}
              placeholder="e.g. Living Room, Master Bedroom"
              className="w-full px-4 py-3 border border-ocean-200 rounded-lg bg-white text-ocean-900 placeholder-ocean-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
            />
          </div>
        </section>

        {/* Section 2: Color Selection */}
        <section className="bg-white rounded-xl border border-ocean-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
              2
            </span>
            <h3 className="font-heading font-bold text-ocean-900 text-lg">Color Selection</h3>
          </div>
          {errors.exteriorFinish && <p className="mb-3 text-xs text-red-500">{errors.exteriorFinish}</p>}
          <div className="flex flex-wrap gap-3">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => updateItem({ exteriorFinish: color })}
                className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                  item.exteriorFinish === color
                    ? "bg-primary-500 text-white border-primary-500"
                    : "bg-white text-ocean-700 border-ocean-200 hover:border-primary-300"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </section>

        {/* Section 3: Glass Options */}
        <section className="bg-white rounded-xl border border-ocean-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
              3
            </span>
            <h3 className="font-heading font-bold text-ocean-900 text-lg">Glass Options</h3>
          </div>
          {errors.glassType && <p className="mb-3 text-xs text-red-500">{errors.glassType}</p>}
          <div className="grid sm:grid-cols-3 gap-4">
            {GLASS_OPTIONS.map((glass) => {
              const isSelected = item.glassType === glass.name;
              const Icon = glass.icon;
              return (
                <button
                  key={glass.name}
                  onClick={() => updateItem({ glassType: glass.name })}
                  className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary-500 bg-primary-50 ring-2 ring-primary-500/20"
                      : "border-ocean-200 hover:border-primary-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${isSelected ? "text-primary-500" : "text-ocean-400"}`} />
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${glass.badgeColor}`}>
                      {glass.badge}
                    </span>
                  </div>
                  <h4 className="font-semibold text-ocean-900 text-sm mb-1">{glass.name}</h4>
                  <p className="text-xs text-ocean-500 leading-relaxed">{glass.description}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 4: Hardware Finish */}
        <section className="bg-white rounded-xl border border-ocean-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
              4
            </span>
            <h3 className="font-heading font-bold text-ocean-900 text-lg">Hardware Finish</h3>
          </div>
          {errors.hardwareFinish && <p className="mb-3 text-xs text-red-500">{errors.hardwareFinish}</p>}
          <div className="flex flex-wrap gap-3">
            {HARDWARE_FINISHES.map((finish) => (
              <button
                key={finish}
                onClick={() => updateItem({ hardwareFinish: finish })}
                className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                  item.hardwareFinish === finish
                    ? "bg-primary-500 text-white border-primary-500"
                    : "bg-white text-ocean-700 border-ocean-200 hover:border-primary-300"
                }`}
              >
                {finish}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => dispatch({ type: "SET_STEP", payload: 2 })}
          className="px-6 py-3 rounded-lg border border-ocean-200 text-ocean-600 font-medium hover:bg-ocean-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 inline mr-1" />
          Back
        </button>
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-lg cursor-pointer"
        >
          Save Configuration
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
