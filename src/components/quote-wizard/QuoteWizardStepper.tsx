"use client";

import { Check } from "lucide-react";

const STEPS = ["Contact", "Product", "Configure", "Summary", "Done"];

interface QuoteWizardStepperProps {
  currentStep: number;
}

export default function QuoteWizardStepper({ currentStep }: QuoteWizardStepperProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-2xl mx-auto mb-6 sm:mb-10 px-2">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const isCompleted = currentStep > stepNum;
        const isActive = currentStep === stepNum;

        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-colors ${
                  isCompleted
                    ? "bg-primary-500 text-white"
                    : isActive
                      ? "bg-primary-500 text-white ring-4 ring-primary-500/20"
                      : "bg-ocean-200 text-ocean-500"
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : stepNum}
              </div>
              <span
                className={`hidden sm:block mt-1.5 text-xs font-medium ${
                  isActive ? "text-primary-600" : isCompleted ? "text-primary-500" : "text-ocean-400"
                }`}
              >
                {label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div
                className={`w-8 sm:w-14 h-0.5 mx-0.5 sm:mx-1 transition-colors ${
                  currentStep > stepNum ? "bg-primary-500" : "bg-ocean-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
