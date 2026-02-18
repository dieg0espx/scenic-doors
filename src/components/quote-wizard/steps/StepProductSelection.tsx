"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { PRODUCTS } from "@/lib/quote-wizard/product-data";
import type { WizardAction } from "@/lib/quote-wizard/types";

interface StepProductSelectionProps {
  dispatch: React.Dispatch<WizardAction>;
}

export default function StepProductSelection({ dispatch }: StepProductSelectionProps) {
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
          Select the system that matches your vision
        </p>
      </div>

      {/* Mobile: horizontal scroll cards. Desktop: grid */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-1 px-1 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-5 sm:overflow-visible sm:pb-0 scrollbar-hide">
        {PRODUCTS.map((product) => (
          <button
            key={product.slug}
            onClick={() => handleSelect(product.slug, product.name, product.basePrice)}
            className="group text-left bg-white rounded-xl border border-ocean-200 overflow-hidden hover:border-primary-400 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-200 cursor-pointer snap-center shrink-0 w-[280px] sm:w-auto"
          >
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
            <div className="p-4 sm:p-5">
              <h3 className="font-heading font-bold text-ocean-900 text-base sm:text-lg mb-2 sm:mb-3 group-hover:text-primary-600 transition-colors">
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
          </button>
        ))}
      </div>
    </div>
  );
}
