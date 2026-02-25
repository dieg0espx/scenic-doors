import type { Metadata } from "next";
import QuoteWizard from "@/components/quote-wizard/QuoteWizard";

export const metadata: Metadata = {
  title: "Get a Quote | Scenic Doors",
  description:
    "Configure your premium doors and windows and get an instant quote estimate. Choose from multi-slide, bi-fold, pocket doors, and more.",
};

export default function QuotePage() {
  return <QuoteWizard />;
}
