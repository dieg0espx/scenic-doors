"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ArrowRight, X, Eye } from "lucide-react";
import { PRODUCTS } from "@/lib/quote-wizard/product-data";
import type { WizardAction } from "@/lib/quote-wizard/types";
import SlidingDoorAnimation from "@/components/SlidingDoorAnimation";
import BifoldDoorAnimation from "@/components/BifoldDoorAnimation";
import SlideStackDoorAnimation from "@/components/SlideStackDoorAnimation";
import PivotDoorAnimation from "@/components/PivotDoorAnimation";

const ANIMATION_MAP: Record<string, React.ReactNode> = {
  "multi-slide-pocket": <SlidingDoorAnimation compact />,
  "ultra-slim": <SlidingDoorAnimation compact />,
  "bi-fold": <BifoldDoorAnimation compact />,
  "slide-stack": <SlideStackDoorAnimation compact />,
};

const ANIMATION_MAP_FULL: Record<string, React.ReactNode> = {
  "multi-slide-pocket": <SlidingDoorAnimation />,
  "ultra-slim": <SlidingDoorAnimation />,
  "bi-fold": <BifoldDoorAnimation />,
  "slide-stack": <SlideStackDoorAnimation />,
};

interface StepProductSelectionProps {
  dispatch: React.Dispatch<WizardAction>;
}

export default function StepProductSelection({ dispatch }: StepProductSelectionProps) {
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);

  function handleSelect(slug: string, name: string, basePrice: number) {
    dispatch({
      type: "SELECT_PRODUCT",
      payload: { doorType: name, doorTypeSlug: slug, basePrice },
    });
    dispatch({ type: "SET_STEP", payload: 3 });
  }

  return (
    <div className="max-w-5xl mx-auto px-1 sm:px-0">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-ocean-900 mb-2">
          Choose Your Door Style
        </h2>
        <p className="text-sm sm:text-base text-ocean-500">
          Tap a door to select it, or preview the animation to see how it works
        </p>
      </div>

      {/* Animation preview modal */}
      {previewSlug && ANIMATION_MAP_FULL[previewSlug] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-auto">
            <button
              onClick={() => setPreviewSlug(null)}
              className="absolute top-3 right-3 z-10 bg-ocean-100 hover:bg-ocean-200 rounded-full p-1.5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-ocean-700" />
            </button>
            <div className="p-4 sm:p-6">
              <h3 className="font-heading font-bold text-ocean-900 text-lg mb-4">
                {PRODUCTS.find((p) => p.slug === previewSlug)?.name} — Interactive Preview
              </h3>
              {ANIMATION_MAP_FULL[previewSlug]}
            </div>
            <div className="px-4 pb-4 sm:px-6 sm:pb-6">
              <button
                onClick={() => {
                  const product = PRODUCTS.find((p) => p.slug === previewSlug);
                  if (product) {
                    handleSelect(product.slug, product.name, product.basePrice);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all text-base cursor-pointer shadow-lg shadow-primary-600/25"
              >
                Select This Door
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile: horizontal scroll cards. Desktop: grid */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-1 px-1 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-5 sm:overflow-visible sm:pb-0 scrollbar-hide">
        {PRODUCTS.map((product) => {
          const hasAnimation = !!ANIMATION_MAP[product.slug];
          return (
            <div
              key={product.slug}
              className="flex flex-col bg-white rounded-xl border border-ocean-200 overflow-hidden hover:border-primary-400 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-200 snap-center shrink-0 w-[280px] sm:w-auto"
            >
              {/* Image area */}
              <div className="relative h-40 sm:h-48">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs sm:text-sm font-semibold text-ocean-900">
                  From ${product.basePrice.toLocaleString()}
                </div>
              </div>

              {/* Info */}
              <div className="p-4 sm:p-5 flex-1">
                <h3 className="font-heading font-bold text-ocean-900 text-base sm:text-lg mb-2 sm:mb-3">
                  {product.name}
                </h3>
                <ul className="space-y-1.5 sm:space-y-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs sm:text-sm text-ocean-600">
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-500 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action buttons */}
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 space-y-2">
                {hasAnimation && (
                  <button
                    onClick={() => setPreviewSlug(product.slug)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-ocean-200 text-ocean-600 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50/50 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    See How It Works
                  </button>
                )}
                <button
                  onClick={() => handleSelect(product.slug, product.name, product.basePrice)}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-bold py-2.5 sm:py-3 px-4 rounded-xl transition-all text-sm sm:text-base cursor-pointer shadow-md shadow-primary-600/20 hover:shadow-lg hover:shadow-primary-500/25 active:scale-[0.98]"
                >
                  Select This Door
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
