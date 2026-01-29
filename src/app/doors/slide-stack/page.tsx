"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import { Check, ArrowRight, Shield, Thermometer, Droplets, Wind } from "lucide-react";

const features = [
  "Panels glide and stack neatly to one or both sides",
  "Create wide, unobstructed openings",
  "Multi-point locking systems for security",
  "Reinforced fiberglass thermal breaks",
  "90° corner sash option without mullion",
  "10-year warranty",
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
    description: "Precision-engineered materials for maximum strength and longevity near the ocean.",
  },
  {
    icon: Thermometer,
    title: "Thermal Insulation",
    description: "Reinforced fiberglass thermal breaks for exceptional energy performance.",
  },
  {
    icon: Wind,
    title: "Pressure-Extruded Frames",
    description: "Built for structural integrity under heavy use or high wind exposure.",
  },
  {
    icon: Droplets,
    title: "EPDM Weather Stripping",
    description: "Premium weather stripping for superior air and water tightness.",
  },
];

const gallery = [
  "/images/products/slide-stack/left-right-open.avif",
  "/images/products/slide-stack/outside-vented.avif",
  "/images/products/slide-stack/door-at-dusk.avif",
  "/images/products/slide-stack/sunset-door.avif",
  "/images/products/slide-stack/beach-home.jpg",
  "/images/products/shared/rain-on-glass.avif",
  "/images/products/shared/profile-colors.avif",
  "/images/products/shared/secure-at-home.avif",
  "/images/products/shared/profile-design-review.avif",
];

const stackingOptions = [
  {
    title: "Single-Side Stack",
    description: "All panels slide and stack to one side. Ideal for corners or when one side needs to remain clear.",
    features: ["Maximizes one-sided clearance", "Great for corner installations", "Simpler track configuration"],
  },
  {
    title: "Split Stack",
    description: "Panels divide and stack to both sides. Creates a grand, centered entrance with balanced aesthetics.",
    features: ["Symmetrical appearance", "Balanced weight distribution", "Perfect for wide openings"],
  },
  {
    title: "90° Corner Stack",
    description: "Panels meet and stack at a corner, opening two walls simultaneously. Ultimate indoor-outdoor connection.",
    features: ["Opens two walls at once", "Dramatic corner views", "Maximum ventilation"],
  },
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
                Slide & Stack Patio Doors
              </h1>
              <p className="text-white/80 text-lg mb-8">
                Designed for maximum versatility and wide openings, allowing panels to glide
                and stack neatly out of the way. Embrace the coastal lifestyle with seamless
                indoor-outdoor transitions.
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
                  Embrace the Coastal Lifestyle
                </span>
                <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-6">
                  Effortless Transition, Uninterrupted Views
                </h2>
                <p className="text-ocean-600 mb-6">
                  Slide & Stack doors offer exceptional versatility for large openings.
                  Multiple panels glide along precision tracks and stack neatly, creating
                  expansive openings that blur the line between indoor and outdoor spaces.
                </p>
                <p className="text-ocean-600 mb-8">
                  Constructed with premium aluminum, our doors are engineered to resist
                  salty air and coastal elements, ensuring longevity without compromising style.
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
                    alt="Slide and stack doors vented"
                    className="w-full aspect-video object-cover"
                  />
                </div>
                <div>
                  <img
                    src={gallery[2]}
                    alt="Sunset slide and fold door"
                    className="w-full aspect-square object-cover"
                  />
                </div>
                <div>
                  <img
                    src={gallery[3]}
                    alt="Beach home slide and fold door"
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
              <h2 className="font-heading text-3xl md:text-4xl text-white mb-4">
                Configure Your Opening
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {stackingOptions.map((type, index) => (
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
                    alt={`Slide & Stack Patio Door ${index + 1}`}
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

            <div className="grid md:grid-cols-4 gap-8 text-center">
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
