"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin } from "lucide-react";

const areas = [
  { name: "Los Angeles", highlight: "Beverly Hills • Malibu • Santa Monica" },
  { name: "Orange County", highlight: "Newport Beach • Laguna • Irvine" },
  { name: "San Diego", highlight: "La Jolla • Del Mar • Rancho Santa Fe" },
  { name: "Riverside", highlight: "Palm Desert • Rancho Mirage" },
  { name: "Ventura", highlight: "Thousand Oaks • Westlake Village" },
  { name: "Santa Barbara", highlight: "Montecito • Carpinteria" },
];

export default function ServiceAreas() {
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary-500 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
              Service Areas
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-ocean-900 mb-6">
              Proudly Serving
              <span className="text-primary-500 block">Southern California</span>
            </h2>
            <p className="text-ocean-600 leading-relaxed mb-10 max-w-lg">
              From coastal estates in Malibu to hillside retreats in the Inland
              Empire, we bring premium door solutions to discerning clients
              throughout the region.
            </p>

            {/* Areas list */}
            <div className="grid grid-cols-2 gap-4">
              {areas.map((area, index) => (
                <motion.div
                  key={area.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="group"
                >
                  <div className="flex items-start gap-3 p-4 bg-primary-50 hover:bg-primary-100 transition-colors">
                    <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-ocean-900 group-hover:text-primary-600 transition-colors">
                        {area.name}
                      </p>
                      <p className="text-xs text-ocean-500 mt-0.5">{area.highlight}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Image with map styling */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main image */}
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=2070&auto=format&fit=crop"
                  alt="Southern California coastline"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay card */}
              <div className="absolute -bottom-8 -left-8 bg-primary-600 p-8 max-w-xs">
                <p className="text-white font-heading text-5xl mb-2">6</p>
                <p className="text-white font-medium">Counties Served</p>
                <p className="text-primary-100 text-sm mt-2">
                  Comprehensive coverage across Southern California
                </p>
              </div>

              {/* Decorative frame */}
              <div className="absolute -top-4 -right-4 w-full h-full border-2 border-primary-400/30 -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
