"use client";

import { motion } from "framer-motion";

const brands = [
  { name: "LaCantina", subtitle: "Certified Installer" },
  { name: "Western Window", subtitle: "Authorized Dealer" },
  { name: "Fleetwood", subtitle: "Premium Partner" },
];

export default function TrustBar() {
  return (
    <section className="bg-primary-600 py-10 md:py-12">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left - Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-white/80 text-sm tracking-wide"
          >
            Factory-certified installers for premium brands
          </motion.p>

          {/* Right - Brand logos (text for now) */}
          <div className="flex items-center gap-6 md:gap-8">
            {brands.map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="font-heading text-lg md:text-xl text-white">{brand.name}</p>
                <p className="text-xs text-white/70">{brand.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
