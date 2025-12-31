"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Award, ClipboardCheck, Sparkles, ArrowRight } from "lucide-react";
import { useQuoteModal } from "@/context/QuoteModalContext";

const highlights = [
  {
    icon: ClipboardCheck,
    title: "Free Site Evaluation",
    description:
      "We visit your home to take precise measurements and assess your space before any work begins.",
  },
  {
    icon: Award,
    title: "Certified Craftsmen",
    description:
      "Our skilled team is factory-trained and insured, treating every project with expert care.",
  },
  {
    icon: Sparkles,
    title: "Flawless Results",
    description:
      "From preparation to cleanup, we ensure your new door operates perfectly and looks stunning.",
  },
];

export default function Installation() {
  const { openQuoteModal } = useQuoteModal();

  return (
    <section className="py-16 md:py-24 bg-sand-100 relative overflow-hidden">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary-500 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
              Expert Installation
            </span>
            <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-6">
              We Handle Every Detail So You Don't Have To
            </h2>
            <p className="text-ocean-700 leading-relaxed mb-8">
              A beautiful door deserves a flawless installation. Our team brings
              precision, professionalism, and decades of hands-on experience to
              every project—ensuring your investment looks and performs exactly
              as it should.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <button
                onClick={openQuoteModal}
                className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 font-medium transition-colors"
              >
                Get a Free Quote
              </button>
              <Link
                href="/about#installation"
                className="inline-flex items-center gap-3 text-ocean-900 font-medium group py-3"
              >
                <span className="relative">
                  See How It Works
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Right - Highlight cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 flex items-start gap-5 shadow-sm"
              >
                <div className="w-12 h-12 bg-primary-600 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-heading text-lg text-ocean-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-ocean-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
