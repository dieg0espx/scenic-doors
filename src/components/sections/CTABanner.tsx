"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="py-16 md:py-20 bg-primary-600 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary-500/50 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary-700/50 rounded-full blur-3xl" />

      <div className="section-container relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-4"
          >
            Ready to Transform
            <span className="block">Your Space?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-primary-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          >
            Schedule a complimentary consultation with our design specialists.
            Let's bring your vision to life.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="https://app.scenicdoors.co/quote/start"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white text-primary-700 px-8 py-4 font-medium tracking-wide inline-flex items-center gap-2 hover:bg-primary-900 hover:text-white transition-colors duration-300"
            >
              Get Instant Quote
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="tel:818-427-6690"
              className="group border-2 border-white/40 text-white px-8 py-4 font-medium tracking-wide inline-flex items-center gap-2 hover:bg-white hover:text-primary-700 transition-colors duration-300"
            >
              <Phone className="w-4 h-4" />
              818-427-6690
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
