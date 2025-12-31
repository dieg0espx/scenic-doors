"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Phone, Layers, SlidersHorizontal, DoorOpen } from "lucide-react";

const doorTypes = [
  { id: "folding", name: "Folding Glass Walls", icon: Layers },
  { id: "multi-slide", name: "Multi-Slide Systems", icon: SlidersHorizontal },
  { id: "pivot", name: "Pivot Entry Doors", icon: DoorOpen },
];

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  const [selectedDoors, setSelectedDoors] = useState<string[]>([]);

  const toggleDoorType = (doorId: string) => {
    setSelectedDoors((prev) =>
      prev.includes(doorId)
        ? prev.filter((id) => id !== doorId)
        : [...prev, doorId]
    );
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-ocean-900/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white z-50 overflow-auto max-h-[calc(100vh-2rem)] md:max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-primary-800 p-6 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="font-heading text-2xl text-white">
                Get Your Free Quote
              </h2>
              <p className="text-primary-200 text-sm mt-1">
                No obligation, no pressure.
              </p>
            </div>

            {/* Form */}
            <form className="p-6 space-y-5">
              {/* Name & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-ocean-700 text-sm mb-2">
                    Name <span className="text-primary-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-ocean-200 focus:border-primary-500 focus:outline-none transition-colors text-sm"
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
                    className="w-full px-4 py-3 border border-ocean-200 focus:border-primary-500 focus:outline-none transition-colors text-sm"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-ocean-700 text-sm mb-2">
                  Email <span className="text-primary-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-ocean-200 focus:border-primary-500 focus:outline-none transition-colors text-sm"
                  placeholder="you@example.com"
                />
              </div>

              {/* Door Types */}
              <div>
                <label className="block text-ocean-700 text-sm mb-3">
                  Interested in <span className="text-ocean-400">(optional)</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {doorTypes.map((door) => (
                    <button
                      key={door.id}
                      type="button"
                      onClick={() => toggleDoorType(door.id)}
                      className={`p-3 border-2 text-center transition-all ${
                        selectedDoors.includes(door.id)
                          ? "border-primary-500 bg-primary-50"
                          : "border-ocean-200 hover:border-primary-300"
                      }`}
                    >
                      <door.icon
                        className={`w-5 h-5 mx-auto mb-1 ${
                          selectedDoors.includes(door.id)
                            ? "text-primary-600"
                            : "text-ocean-400"
                        }`}
                      />
                      <span
                        className={`text-[10px] font-medium leading-tight block ${
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
                  Project details <span className="text-ocean-400">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  className="w-full px-4 py-3 border border-ocean-200 focus:border-primary-500 focus:outline-none transition-colors resize-none text-sm"
                  placeholder="Brief description..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-primary-600 text-white px-6 py-4 font-medium hover:bg-primary-700 transition-colors"
              >
                Request Free Quote
              </button>

              {/* Phone alternative */}
              <p className="text-center text-ocean-500 text-sm">
                Or call us at{" "}
                <a
                  href="tel:818-427-6690"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  818-427-6690
                </a>
              </p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
