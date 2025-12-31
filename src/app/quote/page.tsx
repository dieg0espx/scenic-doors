"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Check,
  Phone,
  ChevronRight,
  ChevronLeft,
  User,
  Home,
  ClipboardList,
  Layers,
  SlidersHorizontal,
  DoorOpen,
} from "lucide-react";

const benefits = [
  "Free in-home consultation",
  "Expert design recommendations",
  "Detailed written estimate",
  "No obligation to purchase",
  "Flexible financing options",
];

const doorTypes = [
  {
    id: "folding",
    name: "Folding Glass Walls",
    description: "Seamless indoor-outdoor transitions",
    icon: Layers,
  },
  {
    id: "multi-slide",
    name: "Multi-Slide Systems",
    description: "Expansive openings, effortless operation",
    icon: SlidersHorizontal,
  },
  {
    id: "pivot",
    name: "Pivot Entry Doors",
    description: "Bold architectural statements",
    icon: DoorOpen,
  },
];

const projectTypes = [
  { id: "new-construction", name: "New Construction" },
  { id: "renovation", name: "Renovation / Remodel" },
  { id: "replacement", name: "Door Replacement" },
  { id: "addition", name: "Home Addition" },
];

const timelines = [
  { id: "asap", name: "As soon as possible" },
  { id: "1-3months", name: "1-3 months" },
  { id: "3-6months", name: "3-6 months" },
  { id: "6months+", name: "6+ months" },
  { id: "planning", name: "Just planning" },
];

const budgets = [
  { id: "10-25k", name: "$10,000 - $25,000" },
  { id: "25-50k", name: "$25,000 - $50,000" },
  { id: "50-100k", name: "$50,000 - $100,000" },
  { id: "100k+", name: "$100,000+" },
  { id: "unsure", name: "Not sure yet" },
];

const steps = [
  { id: 1, name: "Contact", icon: User },
  { id: 2, name: "Product", icon: Home },
  { id: 3, name: "Details", icon: ClipboardList },
];

export default function QuotePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    doorTypes: [] as string[],
    projectType: "",
    timeline: "",
    budget: "",
    message: "",
    source: "",
  });

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDoorType = (doorId: string) => {
    setFormData((prev) => ({
      ...prev,
      doorTypes: prev.doorTypes.includes(doorId)
        ? prev.doorTypes.filter((id) => id !== doorId)
        : [...prev.doorTypes, doorId],
    }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const isStep1Valid =
    formData.firstName && formData.email && formData.phone;
  const isStep2Valid = formData.doorTypes.length > 0;

  return (
    <>
      <Header />
      <main>
        {/* Hero Section - Compact */}
        <section className="pt-32 pb-12 bg-primary-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop')`,
              }}
            />
          </div>
          <div className="section-container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                Request Your <span className="text-primary-300">Free Quote</span>
              </h1>
              <p className="text-white/70">
                Take the first step toward transforming your space. We'll
                provide a detailed, no-obligation quote.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 bg-sand-100">
          <div className="section-container">
            <div className="max-w-4xl mx-auto">
              {/* Progress Steps */}
              <div className="flex items-center justify-center mb-12">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => {
                        if (step.id < currentStep) setCurrentStep(step.id);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                        currentStep === step.id
                          ? "bg-primary-600 text-white"
                          : currentStep > step.id
                          ? "bg-primary-200 text-primary-700 cursor-pointer hover:bg-primary-300"
                          : "bg-white text-ocean-400"
                      }`}
                    >
                      <step.icon className="w-4 h-4" />
                      <span className="text-sm font-medium hidden sm:inline">
                        {step.name}
                      </span>
                      <span className="text-sm font-medium sm:hidden">
                        {step.id}
                      </span>
                    </button>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 md:w-20 h-[2px] mx-2 ${
                          currentStep > step.id
                            ? "bg-primary-400"
                            : "bg-ocean-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Form Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="lg:col-span-2 bg-white p-6 md:p-10 shadow-sm"
                >
                  <AnimatePresence mode="wait">
                    {/* Step 1: Contact Info */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="font-heading text-2xl text-ocean-900 mb-2">
                          Let's Start with Your Info
                        </h2>
                        <p className="text-ocean-600 text-sm mb-8">
                          We'll use this to get in touch about your project.
                        </p>

                        <div className="space-y-5">
                          <div className="grid md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-ocean-700 text-sm mb-2">
                                First Name <span className="text-primary-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) =>
                                  updateFormData("firstName", e.target.value)
                                }
                                className="w-full px-4 py-3 border border-ocean-200 focus:border-primary-500 focus:outline-none transition-colors"
                                placeholder="John"
                              />
                            </div>
                            <div>
                              <label className="block text-ocean-700 text-sm mb-2">
                                Last Name
                              </label>
                              <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) =>
                                  updateFormData("lastName", e.target.value)
                                }
                                className="w-full px-4 py-3 border border-ocean-200 focus:border-primary-500 focus:outline-none transition-colors"
                                placeholder="Smith"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-ocean-700 text-sm mb-2">
                              Email <span className="text-primary-500">*</span>
                            </label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                updateFormData("email", e.target.value)
                              }
                              className="w-full px-4 py-3 border border-ocean-200 focus:border-primary-500 focus:outline-none transition-colors"
                              placeholder="john@example.com"
                            />
                          </div>

                          <div className="grid md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-ocean-700 text-sm mb-2">
                                Phone <span className="text-primary-500">*</span>
                              </label>
                              <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) =>
                                  updateFormData("phone", e.target.value)
                                }
                                className="w-full px-4 py-3 border border-ocean-200 focus:border-primary-500 focus:outline-none transition-colors"
                                placeholder="(555) 123-4567"
                              />
                            </div>
                            <div>
                              <label className="block text-ocean-700 text-sm mb-2">
                                City
                              </label>
                              <input
                                type="text"
                                value={formData.city}
                                onChange={(e) =>
                                  updateFormData("city", e.target.value)
                                }
                                className="w-full px-4 py-3 border border-ocean-200 focus:border-primary-500 focus:outline-none transition-colors"
                                placeholder="Los Angeles"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Product Interest */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="font-heading text-2xl text-ocean-900 mb-2">
                          What Are You Interested In?
                        </h2>
                        <p className="text-ocean-600 text-sm mb-8">
                          Select all door types you're considering.
                        </p>

                        <div className="space-y-4 mb-8">
                          {doorTypes.map((door) => (
                            <button
                              key={door.id}
                              type="button"
                              onClick={() => toggleDoorType(door.id)}
                              className={`w-full p-5 border-2 text-left transition-all flex items-center gap-4 ${
                                formData.doorTypes.includes(door.id)
                                  ? "border-primary-500 bg-primary-50"
                                  : "border-ocean-200 hover:border-primary-300"
                              }`}
                            >
                              <div
                                className={`w-12 h-12 flex items-center justify-center ${
                                  formData.doorTypes.includes(door.id)
                                    ? "bg-primary-600 text-white"
                                    : "bg-sand-100 text-ocean-500"
                                }`}
                              >
                                <door.icon className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-heading text-lg text-ocean-900">
                                  {door.name}
                                </h3>
                                <p className="text-ocean-500 text-sm">
                                  {door.description}
                                </p>
                              </div>
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  formData.doorTypes.includes(door.id)
                                    ? "border-primary-500 bg-primary-500"
                                    : "border-ocean-300"
                                }`}
                              >
                                {formData.doorTypes.includes(door.id) && (
                                  <Check className="w-4 h-4 text-white" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>

                        <div>
                          <label className="block text-ocean-700 text-sm mb-3">
                            Project Type
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {projectTypes.map((type) => (
                              <button
                                key={type.id}
                                type="button"
                                onClick={() =>
                                  updateFormData("projectType", type.id)
                                }
                                className={`p-3 border text-sm transition-all ${
                                  formData.projectType === type.id
                                    ? "border-primary-500 bg-primary-50 text-primary-700"
                                    : "border-ocean-200 hover:border-primary-300 text-ocean-700"
                                }`}
                              >
                                {type.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Additional Details */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="font-heading text-2xl text-ocean-900 mb-2">
                          A Few More Details
                        </h2>
                        <p className="text-ocean-600 text-sm mb-8">
                          Help us understand your timeline and budget (optional).
                        </p>

                        <div className="space-y-6">
                          <div>
                            <label className="block text-ocean-700 text-sm mb-3">
                              When are you looking to start?
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {timelines.map((t) => (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() =>
                                    updateFormData("timeline", t.id)
                                  }
                                  className={`px-4 py-2 border text-sm transition-all ${
                                    formData.timeline === t.id
                                      ? "border-primary-500 bg-primary-50 text-primary-700"
                                      : "border-ocean-200 hover:border-primary-300 text-ocean-700"
                                  }`}
                                >
                                  {t.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-ocean-700 text-sm mb-3">
                              Estimated budget range
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {budgets.map((b) => (
                                <button
                                  key={b.id}
                                  type="button"
                                  onClick={() => updateFormData("budget", b.id)}
                                  className={`px-4 py-2 border text-sm transition-all ${
                                    formData.budget === b.id
                                      ? "border-primary-500 bg-primary-50 text-primary-700"
                                      : "border-ocean-200 hover:border-primary-300 text-ocean-700"
                                  }`}
                                >
                                  {b.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-ocean-700 text-sm mb-2">
                              Anything else you'd like us to know?
                            </label>
                            <textarea
                              rows={4}
                              value={formData.message}
                              onChange={(e) =>
                                updateFormData("message", e.target.value)
                              }
                              className="w-full px-4 py-3 border border-ocean-200 focus:border-primary-500 focus:outline-none transition-colors resize-none"
                              placeholder="Tell us about your vision, specific requirements, or any questions..."
                            />
                          </div>

                          <div>
                            <label className="block text-ocean-700 text-sm mb-2">
                              How did you hear about us?
                            </label>
                            <select
                              value={formData.source}
                              onChange={(e) =>
                                updateFormData("source", e.target.value)
                              }
                              className="w-full px-4 py-3 border border-ocean-200 focus:border-primary-500 focus:outline-none transition-colors bg-white"
                            >
                              <option value="">Select option</option>
                              <option value="google">Google Search</option>
                              <option value="referral">Friend/Family Referral</option>
                              <option value="contractor">Contractor/Architect</option>
                              <option value="social">Social Media</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-10 pt-6 border-t border-ocean-100">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex items-center gap-2 text-ocean-600 hover:text-ocean-900 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </button>
                    ) : (
                      <div />
                    )}

                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={
                          (currentStep === 1 && !isStep1Valid) ||
                          (currentStep === 2 && !isStep2Valid)
                        }
                        className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="flex items-center gap-2 bg-primary-600 text-white px-8 py-3 font-medium hover:bg-primary-700 transition-colors"
                      >
                        Submit Request
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>

                {/* Benefits Sidebar */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="lg:col-span-1"
                >
                  <div className="bg-primary-800 p-6 sticky top-32">
                    <h3 className="font-heading text-xl text-white mb-5">
                      What's Included
                    </h3>
                    <ul className="space-y-3 mb-6">
                      {benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-primary-300 mt-0.5 shrink-0" />
                          <span className="text-white/80 text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-primary-700 pt-5">
                      <p className="text-primary-200 text-xs mb-3">
                        Prefer to talk?
                      </p>
                      <a
                        href="tel:818-427-6690"
                        className="flex items-center gap-2 text-white hover:text-primary-300 transition-colors text-sm"
                      >
                        <Phone className="w-4 h-4" />
                        818-427-6690
                      </a>
                    </div>
                  </div>

                  {/* Trust indicators */}
                  <div className="mt-6 p-5 bg-white">
                    <div className="flex items-center gap-3 text-ocean-600 text-sm">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 text-xs font-bold">
                          25+
                        </div>
                      </div>
                      <span>Years of trusted service</span>
                    </div>
                    <div className="flex items-center gap-3 text-ocean-600 text-sm mt-3">
                      <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 text-xs font-bold">
                        1K+
                      </div>
                      <span>Projects completed</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
