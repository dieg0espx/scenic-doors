"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Shield, Clock, Award, BadgeCheck, ArrowRight, Loader2, ChevronDown } from "lucide-react";
import type { ContactInfo, WizardAction } from "@/lib/quote-wizard/types";
import { validateContactInfo, type ValidationErrors } from "@/lib/quote-wizard/validation";
import { createLead } from "@/lib/actions/leads";

interface StepContactInfoProps {
  contact: ContactInfo;
  dispatch: React.Dispatch<WizardAction>;
  isSubmitting: boolean;
}

const TIMELINE_OPTIONS = [
  { value: "asap", label: "ASAP (0–30 days)" },
  { value: "1-3months", label: "1–3 months" },
  { value: "3-6months", label: "3–6 months" },
  { value: "6months+", label: "6+ months / Planning" },
  { value: "researching", label: "Just researching" },
];

const CUSTOMER_TYPE_OPTIONS = [
  { value: "homeowner", label: "Homeowner" },
  { value: "contractor", label: "Contractor/Builder" },
  { value: "architect", label: "Architect/Designer" },
  { value: "dealer", label: "Dealer/Reseller" },
  { value: "other", label: "Other" },
];

const SOURCE_OPTIONS = [
  { value: "google", label: "Google/Search" },
  { value: "referral", label: "Referral" },
  { value: "social", label: "Social Media" },
  { value: "event", label: "Event/Showroom" },
  { value: "other", label: "Other" },
];

/* ── Custom Dropdown ──────────────────────────────────── */
function Dropdown({
  value,
  onChange,
  options,
  placeholder,
  hasError,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  hasError?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, close]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg bg-white text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 cursor-pointer ${
          hasError ? "border-red-400" : open ? "border-primary-500 ring-2 ring-primary-500/30" : "border-ocean-200 hover:border-ocean-300"
        }`}
      >
        <span className={selected ? "text-ocean-900" : "text-ocean-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-ocean-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-lg border border-ocean-200 bg-white shadow-lg shadow-ocean-900/10 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="max-h-60 overflow-y-auto py-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); close(); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                  value === opt.value
                    ? "bg-primary-500 text-white"
                    : "text-ocean-800 hover:bg-primary-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StepContactInfo({ contact, dispatch, isSubmitting }: StepContactInfoProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  function handleChange(field: keyof ContactInfo, value: string) {
    dispatch({ type: "SET_CONTACT", payload: { [field]: value } });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateContactInfo(contact);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    dispatch({ type: "SET_SUBMITTING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const lead = await createLead({
        name: `${contact.firstName} ${contact.lastName}`,
        email: contact.email,
        phone: contact.phone,
        zip: contact.zip,
        customer_type: contact.customerType,
        timeline: contact.timeline,
        source: contact.source,
        referral_code: contact.referralCode || undefined,
      });
      dispatch({ type: "SET_LEAD_ID", payload: lead.id });
      dispatch({ type: "SET_STEP", payload: 2 });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err instanceof Error ? err.message : "Failed to save contact info" });
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 border rounded-lg bg-white text-ocean-900 placeholder-ocean-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 ${
      errors[field] ? "border-red-400" : "border-ocean-200"
    }`;


  return (
    <div className="max-w-3xl mx-auto px-1 sm:px-0">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <Image
          src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif"
          alt="Scenic Doors"
          width={200}
          height={56}
          className="h-12 w-auto mx-auto mb-4"
        />
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ocean-900 mb-2">
          Premium Window & Door Solutions
        </h1>
        <p className="text-ocean-500 mb-6">
          Get your instant quote estimate in minutes
        </p>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          {[
            { icon: Award, label: "Custom Design" },
            { icon: Clock, label: "24hr Quote" },
            { icon: Shield, label: "15 Year Warranty" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-50 rounded-full text-xs sm:text-sm text-primary-700 font-medium"
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ocean-700 mb-1.5">
              First Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={contact.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="John"
              className={inputClass("firstName")}
            />
            {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ocean-700 mb-1.5">
              Last Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={contact.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="Doe"
              className={inputClass("lastName")}
            />
            {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ocean-700 mb-1.5">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@example.com"
              className={inputClass("email")}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ocean-700 mb-1.5">
              Phone <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              value={contact.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="(555) 123-4567"
              className={inputClass("phone")}
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ocean-700 mb-1.5">
              ZIP Code <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={contact.zip}
              onChange={(e) => handleChange("zip", e.target.value)}
              placeholder="90210"
              maxLength={5}
              className={inputClass("zip")}
            />
            {errors.zip && <p className="mt-1 text-xs text-red-500">{errors.zip}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ocean-700 mb-1.5">
              Referral Code
            </label>
            <input
              type="text"
              value={contact.referralCode}
              onChange={(e) => handleChange("referralCode", e.target.value)}
              placeholder="Optional"
              className={inputClass("referralCode")}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ocean-700 mb-1.5">
            Project Timeline <span className="text-red-400">*</span>
          </label>
          <Dropdown
            value={contact.timeline}
            onChange={(v) => handleChange("timeline", v)}
            options={TIMELINE_OPTIONS}
            placeholder="Select timeline..."
            hasError={!!errors.timeline}
          />
          {errors.timeline && <p className="mt-1 text-xs text-red-500">{errors.timeline}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ocean-700 mb-1.5">
              What best describes you? <span className="text-red-400">*</span>
            </label>
            <Dropdown
              value={contact.customerType}
              onChange={(v) => handleChange("customerType", v)}
              options={CUSTOMER_TYPE_OPTIONS}
              placeholder="Select one..."
              hasError={!!errors.customerType}
            />
            {errors.customerType && <p className="mt-1 text-xs text-red-500">{errors.customerType}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ocean-700 mb-1.5">
              How did you hear about us? <span className="text-red-400">*</span>
            </label>
            <Dropdown
              value={contact.source}
              onChange={(v) => handleChange("source", v)}
              options={SOURCE_OPTIONS}
              placeholder="Select an option..."
              hasError={!!errors.source}
            />
            {errors.source && <p className="mt-1 text-xs text-red-500">{errors.source}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 sm:py-4 px-6 rounded-lg transition-colors text-base sm:text-lg cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <span className="sm:hidden">Continue</span>
              <span className="hidden sm:inline">Continue to Product Selection</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-3 sm:gap-6 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-ocean-100">
        {[
          { icon: Shield, label: "Secure & Private" },
          { icon: BadgeCheck, label: "No Pressure Sales" },
          { icon: Award, label: "947 Projects Completed" },
          { icon: Clock, label: "Licensed & Insured" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-ocean-400">
            <Icon className="w-3.5 h-3.5 shrink-0" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
