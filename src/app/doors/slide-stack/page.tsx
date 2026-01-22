"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import { Check, ArrowRight } from "lucide-react";

const features = [
  "Panels stack neatly to one or both sides",
  "Create wide, unobstructed openings",
  "Smooth ball-bearing roller systems",
  "Weather-tight seals for energy efficiency",
  "Available in aluminum, wood, or clad options",
  "Custom sizes up to 12' tall",
];

const gallery = [
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?q=80&w=2070&auto=format&fit=crop",
];

export default function SlideStackDoorsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-primary-800 relative overflow-hidden">
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ocean-900 via-ocean-900/90 to-ocean-900/50" />
          </div>
          <div className="section-container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <Link
                href="/doors"
                className="text-primary-300 text-sm mb-4 inline-block hover:text-primary-200 transition-colors"
              >
                ← Back to Collections
              </Link>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                Slide & Stack Systems
              </h1>
              <p className="text-white/70 text-lg mb-8">
                Ultimate flexibility for open living. Our slide & stack systems
                allow multiple panels to glide smoothly and stack compactly,
                maximizing your opening and views.
              </p>
              <Link
                href="https://app.scenicdoors.co/quote/start" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 font-medium tracking-wide hover:bg-primary-400 transition-colors"
              >
                Request a Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-primary-500 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                  Features
                </span>
                <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-6">
                  Stack More, See More
                </h2>
                <p className="text-ocean-600 mb-8">
                  Slide & stack doors offer exceptional versatility for large
                  openings. Multiple panels glide along precision tracks and
                  stack neatly at one or both ends, creating expansive openings
                  that blur the line between indoor and outdoor spaces.
                </p>
                <ul className="space-y-4">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
                      <span className="text-ocean-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="col-span-2">
                  <img
                    src={gallery[0]}
                    alt="Slide and stack door system"
                    className="w-full aspect-video object-cover"
                  />
                </div>
                <div>
                  <img
                    src={gallery[1]}
                    alt="Slide and stack door system"
                    className="w-full aspect-square object-cover"
                  />
                </div>
                <div>
                  <img
                    src={gallery[2]}
                    alt="Slide and stack door system"
                    className="w-full aspect-square object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stacking Options */}
        <section className="py-24 bg-primary-800">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-primary-300 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                Stacking Options
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-white">
                Configure Your Opening
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Single-Side Stack",
                  description:
                    "All panels slide and stack to one side of the opening. Ideal for corners or when one side needs to remain clear.",
                  features: [
                    "Maximizes one-sided clearance",
                    "Great for corner installations",
                    "Simpler track configuration",
                  ],
                },
                {
                  title: "Split Stack",
                  description:
                    "Panels divide and stack to both sides of the opening. Creates a grand, centered entrance with balanced aesthetics.",
                  features: [
                    "Symmetrical appearance",
                    "Balanced weight distribution",
                    "Perfect for wide openings",
                  ],
                },
                {
                  title: "90° Corner Stack",
                  description:
                    "Panels meet and stack at a corner, opening two walls simultaneously. Ultimate indoor-outdoor connection.",
                  features: [
                    "Opens two walls at once",
                    "Dramatic corner views",
                    "Maximum ventilation",
                  ],
                },
              ].map((type, index) => (
                <motion.div
                  key={type.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-primary-900/50 p-8"
                >
                  <h3 className="font-heading text-2xl text-white mb-3">
                    {type.title}
                  </h3>
                  <p className="text-primary-200 mb-6">{type.description}</p>
                  <ul className="space-y-2">
                    {type.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary-300" />
                        <span className="text-white/80 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Size Options */}
        <section className="py-24 bg-white">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-heading text-3xl md:text-4xl text-ocean-900">
                Specifications
              </h2>
              <p className="text-ocean-600 mt-4 max-w-2xl mx-auto">
                Our slide & stack systems are engineered for large-scale
                applications without compromising performance.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { value: "12'", label: "Max Panel Height" },
                { value: "50'", label: "Max Opening Width" },
                { value: "8", label: "Max Panel Count" },
                { value: "4'", label: "Max Panel Width" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-primary-800 p-8"
                >
                  <p className="font-heading text-5xl text-primary-300 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-white">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
