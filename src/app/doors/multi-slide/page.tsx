"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import { Check, ArrowRight } from "lucide-react";

const features = [
  "Expansive glass panels up to 12' tall",
  "Whisper-quiet sliding operation",
  "Pocket or stacking configurations",
  "Superior thermal performance",
  "Slim sightlines for maximum views",
  "ADA-compliant threshold options",
];

const gallery = [
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
];

export default function MultiSlideDoorsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-ocean-900 relative overflow-hidden">
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop')`,
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
                className="text-wood-400 text-sm mb-4 inline-block hover:text-wood-300 transition-colors"
              >
                ← Back to Collections
              </Link>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                Multi-Slide Systems
              </h1>
              <p className="text-white/70 text-lg mb-8">
                Effortless operation meets expansive design. Our multi-slide
                systems offer unparalleled flexibility for large openings while
                maintaining clean architectural lines.
              </p>
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 bg-wood-500 text-white px-8 py-4 font-medium tracking-wide hover:bg-wood-400 transition-colors"
              >
                Request a Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-cream">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-wood-600 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                  Features
                </span>
                <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-6">
                  Smooth, Silent, Stunning
                </h2>
                <p className="text-ocean-600 mb-8">
                  Multi-slide doors offer the largest clear openings while
                  maintaining ease of use. With panels that glide effortlessly
                  on precision tracks, these systems are perfect for connecting
                  indoor and outdoor living spaces.
                </p>
                <ul className="space-y-4">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-wood-500 mt-0.5 shrink-0" />
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
                    alt="Multi-slide door system"
                    className="w-full aspect-video object-cover"
                  />
                </div>
                <div>
                  <img
                    src={gallery[1]}
                    alt="Multi-slide door system"
                    className="w-full aspect-square object-cover"
                  />
                </div>
                <div>
                  <img
                    src={gallery[2]}
                    alt="Multi-slide door system"
                    className="w-full aspect-square object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Operation Types */}
        <section className="py-24 bg-ocean-900">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-wood-400 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                Operation Types
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-white">
                Choose Your Configuration
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Pocket Slide",
                  description:
                    "Panels disappear into a wall pocket, creating a completely unobstructed opening. Perfect for creating seamless transitions.",
                  features: [
                    "Maximum clear opening",
                    "Clean, hidden panels",
                    "No visible stacking",
                  ],
                },
                {
                  title: "Stacking Slide",
                  description:
                    "Panels slide and stack against each other at one or both ends. Ideal when pocket construction isn't feasible.",
                  features: [
                    "Flexible installation",
                    "No wall modification needed",
                    "Quick panel access",
                  ],
                },
              ].map((type, index) => (
                <motion.div
                  key={type.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-ocean-800/50 p-8"
                >
                  <h3 className="font-heading text-2xl text-white mb-3">
                    {type.title}
                  </h3>
                  <p className="text-ocean-400 mb-6">{type.description}</p>
                  <ul className="space-y-2">
                    {type.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-wood-400" />
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
        <section className="py-24 bg-cream">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-heading text-3xl md:text-4xl text-ocean-900">
                Size Matters
              </h2>
              <p className="text-ocean-600 mt-4 max-w-2xl mx-auto">
                Our multi-slide systems accommodate some of the largest panel
                sizes in the industry.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { value: "12'", label: "Max Panel Height" },
                { value: "60'", label: "Max Opening Width" },
                { value: "5'", label: "Max Panel Width" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-ocean-900 p-8"
                >
                  <p className="font-heading text-5xl text-wood-400 mb-2">
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
