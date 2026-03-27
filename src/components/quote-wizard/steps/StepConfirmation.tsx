"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Home, RotateCcw, FileText, PhoneCall, Wrench, CalendarDays, Clock } from "lucide-react";
import type { ContactInfo, WizardAction } from "@/lib/quote-wizard/types";
import AppointmentScheduler from "@/components/AppointmentScheduler";

interface StepConfirmationProps {
  contact: ContactInfo;
  dispatch: React.Dispatch<WizardAction>;
  intentLevel?: string;
  quoteId?: string | null;
  leadId?: string | null;
}

const NEXT_STEPS_FULL = [
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

const NEXT_STEPS_BROWSE = [
  {
    icon: PhoneCall,
    title: "We'll Reach Out",
    description: "A specialist will contact you to discuss pricing for the products you selected.",
  },
  {
    icon: FileText,
    title: "Get a Detailed Quote",
    description: "We'll prepare a personalized estimate based on your interests.",
  },
];

const NEXT_STEPS_MEDIUM = [
  {
    icon: FileText,
    title: "Review Your Estimate",
    description: "We'll send you a tailored estimate based on your preferences.",
  },
  {
    icon: PhoneCall,
    title: "Consultation Call",
    description: "A specialist will reach out to refine the details with you.",
  },
  {
    icon: Wrench,
    title: "Installation Scheduling",
    description: "Once finalized, we'll coordinate your installation timeline.",
  },
];

function getContent(intentLevel?: string) {
  switch (intentLevel) {
    case "browse":
      return {
        heading: "Interest Submitted!",
        subheading: "We'll reach out to discuss pricing for the products you selected.",
        steps: NEXT_STEPS_BROWSE,
      };
    case "medium":
      return {
        heading: "Estimate Request Submitted!",
        subheading: "We'll prepare a tailored estimate based on your preferences.",
        steps: NEXT_STEPS_MEDIUM,
      };
    default:
      return {
        heading: "Quote Submitted!",
        subheading: "Your quote has been saved.",
        steps: NEXT_STEPS_FULL,
      };
  }
}

type ConfirmationView = "choice" | "scheduler" | "done";

export default function StepConfirmation({ contact, dispatch, intentLevel, quoteId, leadId }: StepConfirmationProps) {
  const content = getContent(intentLevel);
  const [view, setView] = useState<ConfirmationView>("choice");

  return (
    <div className="max-w-2xl mx-auto text-center px-1 sm:px-0">
      {/* Animated Checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="mb-5 sm:mb-6"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-ocean-900 mb-3">
          {content.heading}
        </h2>
        <p className="text-ocean-500 mb-2">
          Thank you, {contact.firstName}! {content.subheading}
        </p>
        <p className="text-ocean-400 text-sm mb-6 sm:mb-10">
          A copy will be sent to <span className="font-medium text-ocean-600">{contact.email}</span>
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {view === "choice" && (
          <motion.div
            key="choice"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.5 }}
          >
            {/* Scheduling choice */}
            <div className="bg-white rounded-xl border border-ocean-200 p-6 sm:p-8 mb-8 text-left">
              <h3 className="font-heading font-bold text-ocean-900 text-lg mb-2 text-center">
                Would you like to schedule a consultation?
              </h3>
              <p className="text-sm text-ocean-400 text-center mb-6">
                Meet with a specialist to discuss your project in detail.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setView("scheduler")}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-ocean-200 hover:border-primary-400 hover:bg-primary-50/50 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-ocean-900 text-sm">Schedule a Meeting</p>
                    <p className="text-xs text-ocean-400 mt-1">Pick a date & time that works for you</p>
                  </div>
                </button>

                <button
                  onClick={() => setView("done")}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-ocean-200 hover:border-ocean-300 hover:bg-ocean-50 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-ocean-100 text-ocean-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-ocean-900 text-sm">Wait for a Sales Rep</p>
                    <p className="text-xs text-ocean-400 mt-1">We&apos;ll reach out to you shortly</p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {view === "scheduler" && (
          <motion.div
            key="scheduler"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-left"
          >
            <div className="bg-white rounded-xl border border-ocean-200 p-4 sm:p-6 mb-8">
              <h3 className="font-heading font-bold text-ocean-900 text-lg mb-4 text-center">
                Pick a Date & Time
              </h3>
              <AppointmentScheduler
                quoteId={quoteId}
                leadId={leadId}
                clientName={`${contact.firstName} ${contact.lastName}`}
                clientEmail={contact.email}
                clientPhone={contact.phone}
                bookedBy="client"
                onBooked={() => {
                  // Stay on booked state inside the scheduler
                }}
                onCancel={() => setView("choice")}
              />
            </div>
          </motion.div>
        )}

        {view === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* What happens next */}
            <div className="bg-white rounded-xl border border-ocean-200 p-6 sm:p-8 mb-8 text-left">
              <h3 className="font-heading font-bold text-ocean-900 text-lg mb-6 text-center">
                What happens next?
              </h3>
              <div className="space-y-6">
                {content.steps.map((step, i) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                        <step.icon className="w-5 h-5" />
                      </div>
                      {i < content.steps.length - 1 && (
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons - always visible */}
      {(view === "done" || view === "choice") && (
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
      )}
    </div>
  );
}
