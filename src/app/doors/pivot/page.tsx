"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import { Check, ArrowRight } from "lucide-react";

const features = [
  "Dramatic architectural statement",
  "Smooth, balanced pivot mechanism",
  "Custom sizes up to 5' wide x 12' tall",
  "Premium wood and metal options",
  "Advanced security hardware",
  "Weather-tight sealing system",
];

const materials = [
  {
    name: "Solid Wood",
    description:
      "Natural warmth and character. Available in walnut, oak, mahogany, and custom species.",
  },
  {
    name: "Steel & Glass",
    description:
      "Modern industrial aesthetic. Thermally broken steel frames with insulated glass.",
  },
  {
    name: "Bronze & Copper",
    description:
      "Timeless elegance. Hand-finished metals that develop a beautiful patina over time.",
  },
];

const gallery = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2032&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2070&auto=format&fit=crop",
];

export default function PivotDoorsPage() {
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
                backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2032&auto=format&fit=crop')`,
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
                Pivot Entry Doors
              </h1>
              <p className="text-white/70 text-lg mb-8">
                Make a statement from the moment guests arrive. Our pivot doors
                combine engineering precision with bold architectural presence,
                creating an unforgettable first impression.
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
                  Engineering Meets Artistry
                </h2>
                <p className="text-ocean-600 mb-8">
                  Pivot doors rotate on a central or offset axis, allowing for
                  larger, heavier doors that swing with effortless grace. The
                  pivot mechanism distributes weight evenly, ensuring smooth
                  operation for decades.
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
                    alt="Pivot entry door"
                    className="w-full aspect-video object-cover"
                  />
                </div>
                <div>
                  <img
                    src={gallery[1]}
                    alt="Pivot entry door"
                    className="w-full aspect-square object-cover"
                  />
                </div>
                <div>
                  <img
                    src={gallery[2]}
                    alt="Pivot entry door"
                    className="w-full aspect-square object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Materials Section */}
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
                Materials
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-white">
                Premium Material Options
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {materials.map((material, index) => (
                <motion.div
                  key={material.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-ocean-800/50 p-8 border-t-2 border-wood-500"
                >
                  <h3 className="font-heading text-xl text-white mb-3">
                    {material.name}
                  </h3>
                  <p className="text-ocean-400">{material.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Custom Design */}
        <section className="py-24 bg-cream">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
                  alt="Custom pivot door design"
                  className="w-full aspect-[4/5] object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-wood-600 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                  Custom Design
                </span>
                <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-6">
                  Your Vision, Realized
                </h2>
                <p className="text-ocean-600 mb-6">
                  Every pivot door we install is custom-designed to complement
                  your home's architecture. From contemporary minimalism to
                  rustic warmth, we work with you to create an entrance that
                  reflects your personal style.
                </p>
                <p className="text-ocean-600 mb-8">
                  Our design process includes detailed consultations, 3D
                  renderings, and material samples to ensure your complete
                  satisfaction before production begins.
                </p>
                <Link
                  href="/quote"
                  className="inline-flex items-center gap-2 bg-ocean-900 text-white px-8 py-4 font-medium tracking-wide hover:bg-ocean-800 transition-colors"
                >
                  Start Your Design
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
