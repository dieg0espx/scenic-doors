"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Introduction() {
  return (
    <section className="py-16 md:py-20 bg-white relative overflow-hidden">
      <div className="section-container">
        <div className="max-w-4xl mx-auto text-center">
          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 leading-tight mb-6">
              A door is more than a passage—
              <span className="text-primary-500"> it's a statement.</span>
            </h2>
            <p className="text-ocean-700 leading-relaxed text-lg max-w-2xl mx-auto">
              Since 1998, we've partnered with Southern California's most
              discerning homeowners, architects, and builders to install door
              systems that don't just function beautifully—they inspire.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-8 mt-12 pt-10 border-t border-sand-300 max-w-xl mx-auto"
          >
            <Stat number="25+" label="Years of Excellence" />
            <Stat number="1000+" label="Projects Completed" />
            <Stat number="100%" label="Client Satisfaction" />
          </motion.div>

          {/* Link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <Link
              href="/about"
              className="inline-flex items-center gap-3 text-ocean-900 font-medium group"
            >
              <span className="relative">
                Discover Our Story
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <p className="font-heading text-3xl md:text-4xl text-ocean-900">{number}</p>
      <p className="text-ocean-500 text-sm mt-1">{label}</p>
    </div>
  );
}
