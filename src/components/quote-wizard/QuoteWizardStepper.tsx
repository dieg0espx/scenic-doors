"use client";

import { Check } from "lucide-react";

const STEPS = ["Contact", "Product", "Configure", "Summary", "Done"];

interface QuoteWizardStepperProps {
  currentStep: number;
}

export default function QuoteWizardStepper({ currentStep }: QuoteWizardStepperProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-2xl mx-auto mb-10">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const isCompleted = currentStep > stepNum;
        const isActive = currentStep === stepNum;

        return (
          <div key={label} className="flex items-center">
            {/* Step circle + label */}
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  isCompleted
                    ? "bg-primary-500 text-white"
                    : isActive
                      ? "bg-primary-500 text-white ring-4 ring-primary-500/20"
                      : "bg-ocean-200 text-ocean-500"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              <span
                className={`hidden sm:block mt-1.5 text-xs font-medium ${
                  isActive ? "text-primary-600" : isCompleted ? "text-primary-500" : "text-ocean-400"
                }`}
              >
                {label}
              </span>
            </div>

            {/* Connecting line (not after last step) */}
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 sm:w-14 h-0.5 mx-1 transition-colors ${
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
