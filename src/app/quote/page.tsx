"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check, Phone, Layers, SlidersHorizontal, DoorOpen } from "lucide-react";

const benefits = [
  "Free in-home consultation",
  "Expert design recommendations",
  "Detailed written estimate",
  "No obligation to purchase",
];

const doorTypes = [
  { id: "folding", name: "Folding Glass Walls", icon: Layers },
  { id: "multi-slide", name: "Multi-Slide Systems", icon: SlidersHorizontal },
  { id: "pivot", name: "Pivot Entry Doors", icon: DoorOpen },
];

export default function QuotePage() {
  const [selectedDoors, setSelectedDoors] = useState<string[]>([]);

  const toggleDoorType = (doorId: string) => {
    setSelectedDoors((prev) =>
      prev.includes(doorId)
        ? prev.filter((id) => id !== doorId)
        : [...prev, doorId]
    );
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
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
                Get a no-obligation estimate for your project.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 bg-sand-100">
          <div className="section-container">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Form */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="lg:col-span-2 bg-white p-6 md:p-8 shadow-sm"
                >
                  <form className="space-y-6">
                    {/* Name & Contact */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-ocean-700 text-sm mb-2">
                          Name <span className="text-primary-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-ocean-200 focus:border-primary-500 focus:outline-none transition-colors"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-ocean-700 text-sm mb-2">
                          Phone <span className="text-primary-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          className="w-full px-4 py-3 border border-ocean-200 focus:border-primary-500 focus:outline-none transition-colors"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-ocean-700 text-sm mb-2">
                        Email <span className="text-primary-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 border border-ocean-200 focus:border-primary-500 focus:outline-none transition-colors"
                        placeholder="you@example.com"
                      />
                    </div>

                    {/* Door Types */}
                    <div>
                      <label className="block text-ocean-700 text-sm mb-3">
                        What are you interested in?
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {doorTypes.map((door) => (
                          <button
                            key={door.id}
                            type="button"
                            onClick={() => toggleDoorType(door.id)}
                            className={`p-4 border-2 text-center transition-all ${
                              selectedDoors.includes(door.id)
                                ? "border-primary-500 bg-primary-50"
                                : "border-ocean-200 hover:border-primary-300"
                            }`}
                          >
                            <door.icon
                              className={`w-6 h-6 mx-auto mb-2 ${
                                selectedDoors.includes(door.id)
                                  ? "text-primary-600"
                                  : "text-ocean-400"
                              }`}
                            />
                            <span
                              className={`text-xs font-medium ${
                                selectedDoors.includes(door.id)
                                  ? "text-primary-700"
                                  : "text-ocean-600"
                              }`}
                            >
                              {door.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-ocean-700 text-sm mb-2">
                        Tell us about your project{" "}
                        <span className="text-ocean-400">(optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-4 py-3 border border-ocean-200 focus:border-primary-500 focus:outline-none transition-colors resize-none"
                        placeholder="Brief description of what you're looking for..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary-600 text-white px-8 py-4 font-medium hover:bg-primary-700 transition-colors"
                    >
                      Get My Free Quote
                    </button>
                  </form>
                </motion.div>

                {/* Sidebar */}
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
                        Prefer to call?
                      </p>
                      <a
                        href="tel:818-427-6690"
                        className="flex items-center gap-2 text-white hover:text-primary-300 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        818-427-6690
                      </a>
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
