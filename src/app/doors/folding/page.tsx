"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import { Check, ArrowRight } from "lucide-react";

const features = [
  "Floor-to-ceiling glass panels",
  "Smooth, effortless operation",
  "Weather-resistant seals",
  "Multiple configuration options",
  "Premium hardware finishes",
  "Energy-efficient glass options",
];

const brands = [
  { name: "LaCantina", certification: "Certified Installer" },
  { name: "Western Window Systems", certification: "Authorized Dealer" },
  { name: "Fleetwood", certification: "Premium Partner" },
];

const gallery = [
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
];

export default function FoldingDoorsPage() {
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
                backgroundImage: `url('https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070&auto=format&fit=crop')`,
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
                Folding Glass Walls
              </h1>
              <p className="text-white/70 text-lg mb-8">
                Transform entire walls into seamless indoor-outdoor transitions.
                Our folding glass systems stack effortlessly, maximizing your
                opening and connecting your living space with the outdoors.
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
                  Engineered for Excellence
                </h2>
                <p className="text-ocean-600 mb-8">
                  Our folding glass walls are designed to deliver the ultimate
                  indoor-outdoor living experience. Each system is customized to
                  your space and lifestyle needs.
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
                    alt="Folding glass wall"
                    className="w-full aspect-video object-cover"
                  />
                </div>
                <div>
                  <img
                    src={gallery[1]}
                    alt="Folding glass wall"
                    className="w-full aspect-square object-cover"
                  />
                </div>
                <div>
                  <img
                    src={gallery[2]}
                    alt="Folding glass wall"
                    className="w-full aspect-square object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Brands Section */}
        <section className="py-16 bg-wood-700">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="font-heading text-2xl text-white">
                Factory-Certified for Premium Brands
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {brands.map((brand, index) => (
                <motion.div
                  key={brand.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className="font-heading text-2xl text-white mb-1">
                    {brand.name}
                  </p>
                  <p className="text-wood-300 text-sm">{brand.certification}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Configuration Options */}
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
                Configurations
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-white">
                Flexible Design Options
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Bi-Fold",
                  description:
                    "Panels fold to one or both sides, creating a wide-open space perfect for entertaining.",
                },
                {
                  title: "Stacking",
                  description:
                    "Panels stack neatly to one side, maximizing your clear opening and views.",
                },
                {
                  title: "Corner Meet",
                  description:
                    "Panels meet at a corner, creating a dramatic architectural statement.",
                },
              ].map((config, index) => (
                <motion.div
                  key={config.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-ocean-800/50 p-8 border-t-2 border-wood-500"
                >
                  <h3 className="font-heading text-xl text-white mb-3">
                    {config.title}
                  </h3>
                  <p className="text-ocean-400">{config.description}</p>
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
