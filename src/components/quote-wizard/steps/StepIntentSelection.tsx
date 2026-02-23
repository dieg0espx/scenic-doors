"use client";

import { motion } from "framer-motion";
import { DollarSign, Lightbulb, Target, ChevronRight } from "lucide-react";
import type { WizardAction } from "@/lib/quote-wizard/types";

interface StepIntentSelectionProps {
  dispatch: React.Dispatch<WizardAction>;
}

const TIERS = [
  {
    key: "browse" as const,
    icon: DollarSign,
    title: "Just browsing prices",
    description: "See estimated pricing for our products. Quick and easy — no commitment.",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    activeBorder: "border-sky-400",
    activeShadow: "shadow-sky-100",
  },
  {
    key: "medium" as const,
    icon: Lightbulb,
    title: "I have a general idea",
    description: "Tell us your preferences and we'll prepare a tailored estimate.",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    activeBorder: "border-amber-400",
    activeShadow: "shadow-amber-100",
  },
  {
    key: "full" as const,
    icon: Target,
    title: "I know exactly what I want",
    description: "Configure exact dimensions, finishes, and options for a precise quote.",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    activeBorder: "border-emerald-400",
    activeShadow: "shadow-emerald-100",
  },
];

export default function StepIntentSelection({ dispatch }: StepIntentSelectionProps) {
  function handleSelect(tier: "browse" | "medium" | "full") {
    dispatch({ type: "SET_INTENT", payload: tier });
    dispatch({ type: "SET_STEP", payload: 3 });
  }

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-0">
      <div className="text-center mb-5 sm:mb-10">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-ocean-900 mb-1.5 sm:mb-2">
          How can we help you today?
        </h2>
        <p className="text-sm sm:text-base text-ocean-500">
          Choose the option that best describes where you are in your project.
        </p>
      </div>

      <div className="grid gap-3 sm:gap-5">
        {TIERS.map((tier, i) => {
          const Icon = tier.icon;
          return (
            <motion.button
              key={tier.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              onClick={() => handleSelect(tier.key)}
              className={`group w-full text-left p-4 sm:p-7 rounded-xl sm:rounded-2xl border-2 border-ocean-200 bg-white transition-all duration-200 cursor-pointer hover:border-ocean-300 active:scale-[0.98] hover:shadow-lg sm:hover:shadow-ocean-100`}
            >
              <div className="flex items-center gap-3 sm:gap-5">
                <div className={`shrink-0 w-11 h-11 sm:w-14 sm:h-14 rounded-xl ${tier.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 sm:w-7 sm:h-7 ${tier.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-ocean-900 text-[15px] sm:text-lg leading-tight mb-0.5 sm:mb-1">
                    {tier.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-ocean-500 leading-relaxed">
                    {tier.description}
                  </p>
                </div>
                <div className="shrink-0 flex items-center self-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-ocean-100 group-hover:bg-primary-100 group-active:bg-primary-200 flex items-center justify-center transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-ocean-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="text-center mt-5 sm:mt-8 pb-4 sm:pb-0">
        <button
          onClick={() => dispatch({ type: "SET_STEP", payload: 1 })}
          className="text-xs sm:text-sm text-ocean-400 hover:text-ocean-600 transition-colors cursor-pointer"
        >
          &larr; Back to Contact Info
        </button>
      </div>
    </div>
  );
}
