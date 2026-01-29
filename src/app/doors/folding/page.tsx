"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import { Check, ArrowRight, Shield, Thermometer, Droplets, Wind } from "lucide-react";

const features = [
  "Slim frames with expansive glass panels",
  "Energy-efficient glazing options",
  "Panels fold and stack neatly",
  "Multi-point locking systems",
  "Thermal break technology",
  "15-year warranty",
];

const specifications = [
  { label: "Thermal Insulation", value: "U ≤ 0.387", unit: "BTU/hr·ft²·°F" },
  { label: "Acoustic Performance", value: "≤ 45", unit: "dB" },
  { label: "Wind Load Resistance", value: "≥ 2.8", unit: "KPa" },
  { label: "Water Penetration", value: "≥ 450", unit: "Pa" },
];

const engineeringFeatures = [
  {
    icon: Shield,
    title: "Advanced Aluminum Profiles",
    description: "Precision-engineered, reinforced materials for maximum strength and longevity near the ocean.",
  },
  {
    icon: Thermometer,
    title: "Thermal Breaks",
    description: "Exceptional energy performance keeping interiors comfortable in every season.",
  },
  {
    icon: Wind,
    title: "Pressure-Extruded Frames",
    description: "Built for structural integrity and reliability under heavy use or high wind exposure.",
  },
  {
    icon: Droplets,
    title: "Moisture-Blocking Seals",
    description: "Robust seals create a tight, water-resistant barrier to keep marine air and moisture out.",
  },
];

const gallery = [
  "/images/products/folding/steel-home.avif",
  "/images/products/folding/open-door.avif",
  "/images/products/folding/corner.avif",
  "/images/products/folding/la-home.avif",
  "/images/products/shared/rain-on-glass.avif",
  "/images/products/shared/profile-colors.avif",
  "/images/products/shared/secure-at-home.avif",
  "/images/products/shared/profile-design-review.avif",
];

const configurations = [
  {
    title: "Bi-Fold",
    description: "Panels fold to one or both sides, creating a wide-open space perfect for entertaining and indoor-outdoor flow.",
    features: ["Maximum opening width", "Panels fold compactly", "Great for patios"],
  },
  {
    title: "Stacking",
    description: "Panels stack neatly to one side, maximizing your clear opening and unobstructed views.",
    features: ["Clean stacked look", "Flexible positioning", "Easy access"],
  },
  {
    title: "Corner Meet",
    description: "Panels meet at a 90° corner, creating a dramatic architectural statement with no center post.",
    features: ["No corner mullion", "Opens two walls", "Ultimate views"],
  },
];

export default function BiFoldDoorsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-primary-800 relative overflow-hidden">
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40"
              style={{
                backgroundImage: `url('${gallery[0]}')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ocean-900 via-ocean-900/95 to-ocean-900/70" />
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
                Bi-Fold Doors
              </h1>
              <p className="text-white/80 text-lg mb-8">
                Transform your living space with our Bi-fold Door system—a seamless blend
                of expansive views, modern performance, and space-saving design. Panels fold
                and stack neatly, creating maximum opening width.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="https://app.scenicdoors.co/quote/start"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 font-medium tracking-wide hover:bg-primary-400 transition-colors"
                >
                  Get Instant Quote
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:818-427-6690"
                  className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 font-medium tracking-wide hover:bg-white/10 transition-colors"
                >
                  Call 818-427-6690
                </a>
              </div>
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
                  Open Wide, Live Larger
                </span>
                <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-6">
                  Expand Your Kitchen, Expand Your Life
                </h2>
                <p className="text-ocean-600 mb-6">
                  Our Bi-fold Door systems feature slim frames, effortless operation, and clean lines
                  that fold completely out of the way. Perfect for kitchen expansions, living room
                  openings, patio access, and entertainment areas.
                </p>
                <p className="text-ocean-600 mb-8">
                  Constructed with premium aluminum, our doors are engineered to resist salty air
                  and harsh coastal elements, ensuring longevity without compromising on style.
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
                    src={gallery[1]}
                    alt="Open bi-fold door system"
                    className="w-full aspect-video object-cover"
                  />
                </div>
                <div>
                  <img
                    src={gallery[2]}
                    alt="Bi-fold door corner installation"
                    className="w-full aspect-square object-cover"
                  />
                </div>
                <div>
                  <img
                    src={gallery[3]}
                    alt="LA home with accordion doors"
                    className="w-full aspect-square object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Configurations */}
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
                Configurations
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-white mb-4">
                Flexible Design Options
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Choose the configuration that best suits your space and lifestyle needs.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {configurations.map((config, index) => (
                <motion.div
                  key={config.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-primary-900/50 p-8"
                >
                  <h3 className="font-heading text-2xl text-white mb-3">
                    {config.title}
                  </h3>
                  <p className="text-primary-200 mb-6">{config.description}</p>
                  <ul className="space-y-2">
                    {config.features.map((feature) => (
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

        {/* Engineering Features */}
        <section className="py-24 bg-white">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-primary-500 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                Engineering Excellence
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-ocean-900">
                Built for Coastal Strength
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {engineeringFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-8 bg-gray-50"
                >
                  <feature.icon className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                  <h3 className="font-heading text-xl text-ocean-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-ocean-600 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-24 bg-gray-50">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-primary-500 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                Gallery
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-ocean-900">
                See It In Action
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={index === 0 ? "col-span-2 md:col-span-2 row-span-2" : ""}
                >
                  <img
                    src={image}
                    alt={`Bi-Fold Door ${index + 1}`}
                    className="w-full h-full object-cover aspect-[4/3]"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Specifications */}
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
                Technical Specifications
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8 text-center mb-16">
              {specifications.map((spec, index) => (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-primary-800 p-8"
                >
                  <p className="font-heading text-4xl text-primary-300 mb-1">
                    {spec.value}
                  </p>
                  <p className="text-white/60 text-sm mb-2">{spec.unit}</p>
                  <p className="text-white font-medium">{spec.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Glass & Frame Options */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 shadow-sm">
                <h4 className="font-heading text-xl text-ocean-900 mb-4">Frame Colors</h4>
                <p className="text-ocean-600 mb-4">
                  Standard colors: Black, White, Dark Brown, Gray. Custom RAL colors available.
                </p>
                <p className="text-ocean-500 text-sm">
                  All frames powder-coated for UV resistance and long-lasting performance.
                </p>
              </div>
              <div className="bg-white p-8 shadow-sm">
                <h4 className="font-heading text-xl text-ocean-900 mb-4">Glazing Options</h4>
                <p className="text-ocean-600 mb-4">
                  Dual, Triple, and Quad-glazed configurations available. Decorative patterns
                  and frosted finishes for privacy.
                </p>
                <p className="text-ocean-500 text-sm">
                  All glass meets IGCC / SGCC / CE standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary-800">
          <div className="section-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-3xl md:text-4xl text-white mb-4">
                We Custom Build. We Install. You Enjoy.
              </h2>
              <p className="text-white/70 mb-8 max-w-2xl mx-auto">
                Premium quality doors crafted to perfection. Get your personalized quote
                and bring your vision to life.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="https://app.scenicdoors.co/quote/start"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 font-medium tracking-wide hover:bg-primary-400 transition-colors"
                >
                  Get Quote in 60 Seconds
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:818-427-6690"
                  className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 font-medium tracking-wide hover:bg-white/10 transition-colors"
                >
                  Speak to a Specialist
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
