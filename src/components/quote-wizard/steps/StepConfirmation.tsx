"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Home, RotateCcw, FileText, PhoneCall, Wrench } from "lucide-react";
import type { ContactInfo, WizardAction } from "@/lib/quote-wizard/types";

interface StepConfirmationProps {
  contact: ContactInfo;
  dispatch: React.Dispatch<WizardAction>;
}

const NEXT_STEPS = [
  {
    icon: FileText,
    title: "Review Your Quote",
    description: "We'll email your detailed quote to review at your convenience.",
  },
  {
    icon: PhoneCall,
    title: "Consultation Call",
    description: "A specialist will reach out to discuss your project details.",
  },
  {
    icon: Wrench,
    title: "Installation Scheduling",
    description: "Once approved, we'll coordinate your installation timeline.",
  },
];

export default function StepConfirmation({ contact, dispatch }: StepConfirmationProps) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Animated Checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="mb-6"
      >
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-ocean-900 mb-3">
          Quote Submitted!
        </h2>
        <p className="text-ocean-500 mb-2">
          Thank you, {contact.firstName}! Your quote has been saved.
        </p>
        <p className="text-ocean-400 text-sm mb-10">
          A copy will be sent to <span className="font-medium text-ocean-600">{contact.email}</span>
        </p>
      </motion.div>

      {/* What happens next */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl border border-ocean-200 p-6 sm:p-8 mb-8 text-left"
      >
        <h3 className="font-heading font-bold text-ocean-900 text-lg mb-6 text-center">
          What happens next?
        </h3>
        <div className="space-y-6">
          {NEXT_STEPS.map((step, i) => (
            <div key={step.title} className="flex gap-4">
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                  <step.icon className="w-5 h-5" />
                </div>
                {i < NEXT_STEPS.length - 1 && (
                  <div className="w-px h-6 bg-ocean-200 mx-auto mt-2" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-ocean-900 text-sm">
                  Step {i + 1}: {step.title}
                </h4>
                <p className="text-sm text-ocean-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-lg transition-colors"
        >
          <Home className="w-4 h-4" />
          Return to Homepage
        </a>
        <button
          onClick={() => dispatch({ type: "RESET" })}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-ocean-200 text-ocean-600 font-medium rounded-lg hover:bg-ocean-50 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Request Another Quote
        </button>
      </motion.div>
    </div>
  );
}
