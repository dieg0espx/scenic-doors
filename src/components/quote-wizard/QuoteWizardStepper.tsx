"use client";

import { Check } from "lucide-react";

interface QuoteWizardStepperProps {
  currentStep: number;
  steps: string[];
}

export default function QuoteWizardStepper({ currentStep, steps }: QuoteWizardStepperProps) {
  const totalSteps = steps.length;
  const currentLabel = steps[currentStep - 1] || "";
  const progressPercent = totalSteps > 1 ? ((currentStep - 1) / (totalSteps - 1)) * 100 : 0;

  // On mobile with 5+ steps, use compact progress bar to avoid overflow
  const useCompactMobile = totalSteps > 4;

  return (
    <>
      {/* Compact mobile stepper — shown on small screens when many steps */}
      {useCompactMobile && (
        <div className="sm:hidden mb-6 px-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-primary-600">
              {currentLabel}
            </span>
            <span className="text-xs text-ocean-400 font-medium">
              {currentStep} of {totalSteps}
            </span>
          </div>
          <div className="h-1.5 bg-ocean-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Full circle stepper — always on desktop, on mobile only for ≤4 steps */}
      <div className={`flex items-center justify-center gap-0 w-full max-w-2xl mx-auto mb-6 sm:mb-10 px-2 ${useCompactMobile ? "hidden sm:flex" : ""}`}>
        {steps.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = currentStep > stepNum;
          const isActive = currentStep === stepNum;

          return (
            <div key={`${label}-${i}`} className="flex items-center">
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

              {i < steps.length - 1 && (
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
    </>
  );
}
