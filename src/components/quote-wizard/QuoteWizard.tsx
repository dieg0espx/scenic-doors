"use client";

import { useReducer } from "react";
import { AnimatePresence, motion } from "framer-motion";
import QuoteWizardStepper from "./QuoteWizardStepper";
import StepContactInfo from "./steps/StepContactInfo";
import StepProductSelection from "./steps/StepProductSelection";
import StepConfiguration from "./steps/StepConfiguration";
import StepQuoteSummary from "./steps/StepQuoteSummary";
import StepConfirmation from "./steps/StepConfirmation";
import type { WizardState, WizardAction, ConfiguredItem } from "@/lib/quote-wizard/types";
import { initialState, createEmptyItem } from "@/lib/quote-wizard/types";

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_CONTACT":
      return { ...state, contact: { ...state.contact, ...action.payload } };

    case "SET_STEP":
      return { ...state, currentStep: action.payload, error: null };

    case "SET_LEAD_ID":
      return { ...state, leadId: action.payload };

    case "SELECT_PRODUCT": {
      const { doorType, doorTypeSlug, basePrice } = action.payload;
      // If editing an existing item, update it; otherwise create a new draft
      if (state.currentItemIndex !== null && state.items[state.currentItemIndex]) {
        const updated = [...state.items];
        updated[state.currentItemIndex] = {
          ...updated[state.currentItemIndex],
          doorType,
          doorTypeSlug,
          basePrice,
        };
        return { ...state, items: updated };
      }
      // New item - create a draft in state that StepConfiguration will work with
      const newItem: ConfiguredItem = {
        ...createEmptyItem(),
        doorType,
        doorTypeSlug,
        basePrice,
      };
      return {
        ...state,
        items: [...state.items, newItem],
        currentItemIndex: state.items.length,
      };
    }

    case "UPDATE_CURRENT_ITEM": {
      if (state.currentItemIndex === null) return state;
      const updated = [...state.items];
      updated[state.currentItemIndex] = {
        ...updated[state.currentItemIndex],
        ...action.payload,
      };
      return { ...state, items: updated };
    }

    case "SAVE_CURRENT_ITEM":
      // Item is already in items array - just clear currentItemIndex
      return { ...state, currentItemIndex: null };

    case "EDIT_ITEM":
      return { ...state, currentItemIndex: action.payload };

    case "DUPLICATE_ITEM": {
      const source = state.items[action.payload];
      if (!source) return state;
      const dup: ConfiguredItem = { ...source, id: crypto.randomUUID() };
      return { ...state, items: [...state.items, dup] };
    }

    case "REMOVE_ITEM": {
      const filtered = state.items.filter((_, i) => i !== action.payload);
      if (filtered.length === 0) {
        return { ...state, items: [], currentItemIndex: null, currentStep: 2 };
      }
      return { ...state, items: filtered, currentItemIndex: null };
    }

    case "ADD_ANOTHER_ITEM":
      return { ...state, currentItemIndex: null };

    case "SET_SERVICES":
      return { ...state, services: { ...state.services, ...action.payload } };

    case "SET_QUOTE_ID":
      return { ...state, quoteId: action.payload };

    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "RESET":
      return { ...initialState };

    default:
      return state;
  }
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

export default function QuoteWizard() {
  const [state, dispatch] = useReducer(wizardReducer, initialState);
  const { currentStep } = state;

  // Track direction for animation
  const direction = 1; // forward by default

  function renderStep() {
    switch (currentStep) {
      case 1:
        return (
          <StepContactInfo
            contact={state.contact}
            dispatch={dispatch}
            isSubmitting={state.isSubmitting}
          />
        );
      case 2:
        return <StepProductSelection dispatch={dispatch} />;
      case 3: {
        const item =
          state.currentItemIndex !== null
            ? state.items[state.currentItemIndex]
            : null;
        if (!item) return <StepProductSelection dispatch={dispatch} />;
        return <StepConfiguration item={item} dispatch={dispatch} />;
      }
      case 4:
        return <StepQuoteSummary state={state} dispatch={dispatch} />;
      case 5:
        return <StepConfirmation contact={state.contact} dispatch={dispatch} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-ocean-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-12">
        <QuoteWizardStepper currentStep={currentStep} />

        {state.error && currentStep !== 4 && (
          <div className="max-w-3xl mx-auto mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {state.error}
          </div>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
