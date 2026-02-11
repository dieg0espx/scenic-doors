"use client";

import { FileText, ScrollText, CreditCard, CheckCircle2 } from "lucide-react";

const steps = [
  { label: "Quote", icon: FileText },
  { label: "Contract", icon: ScrollText },
  { label: "Payment", icon: CreditCard },
  { label: "Complete", icon: CheckCircle2 },
];

interface ProgressStepperProps {
  currentStep: 1 | 2 | 3 | 4;
}

export default function ProgressStepper({ currentStep }: ProgressStepperProps) {
  return (
    <div className="w-full max-w-xs mx-auto mb-6 sm:mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          const Icon = step.icon;

          return (
            <div key={step.label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-emerald-500/20 ring-2 ring-emerald-500/30"
                      : isActive
                        ? "bg-violet-500/20 ring-2 ring-violet-500/40"
                        : "bg-white/[0.04] ring-1 ring-white/[0.08]"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-violet-400" : "text-white/20"
                      }`}
                    />
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium mt-1.5 ${
                    isCompleted
                      ? "text-emerald-400/70"
                      : isActive
                        ? "text-violet-400"
                        : "text-white/15"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-1.5 -mt-4 ${
                    stepNum < currentStep
                      ? "bg-emerald-500/30"
                      : "bg-white/[0.06]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
