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
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-ocean-900 mb-2">
          Choose Your Door Style
        </h2>
        <p className="text-ocean-500">
          Select from our premium product line to begin your configuration
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {PRODUCTS.map((product) => (
          <button
            key={product.slug}
            onClick={() => handleSelect(product.slug, product.name, product.basePrice)}
            className="group text-left bg-white rounded-xl border border-ocean-200 overflow-hidden hover:border-primary-400 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-200 cursor-pointer"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-ocean-900">
                From ${product.basePrice.toLocaleString()}
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-heading font-bold text-ocean-900 text-lg mb-3 group-hover:text-primary-600 transition-colors">
                {product.name}
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-ocean-600">
                    <Check className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
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
