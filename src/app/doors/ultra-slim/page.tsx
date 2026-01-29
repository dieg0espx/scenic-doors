"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import { Check, ArrowRight, Shield, Thermometer, Droplets, Wind } from "lucide-react";

const features = [
  "Ultra-narrow frames with expansive glass panels",
  "Advanced aluminum profiles with thermal insulation",
  "Multi-sliding configurations (1-6+ panels)",
  "Multi-point locking systems for security",
  "Smooth, effortless operation",
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
    description: "Crafted from precision-engineered, reinforced materials for maximum strength and longevity near the ocean.",
  },
  {
    icon: Thermometer,
    title: "Thermal Insulation",
    description: "Reinforced fiberglass thermal breaks deliver high load capacity and exceptional energy performance.",
  },
  {
    icon: Wind,
    title: "Pressure-Extruded Frames",
    description: "Built for structural integrity and enduring reliability, even under heavy use or high wind exposure.",
  },
  {
    icon: Droplets,
    title: "Moisture-Blocking Technology",
    description: "Coextruded wire seals create a tight, water-resistant barrier to keep marine air and moisture out.",
  },
];

const gallery = [
  "/images/products/ultra-slim/evening-at-beach.avif",
  "/images/products/ultra-slim/bedroom-ocean-view.avif",
  "/images/products/ultra-slim/corner-garden.avif",
  "/images/products/ultra-slim/beach-home.jpg",
  "/images/products/shared/rain-on-glass.avif",
  "/images/products/shared/profile-colors.avif",
  "/images/products/shared/secure-at-home.avif",
  "/images/products/shared/profile-design-review.avif",
  "/images/products/ultra-slim/mountain-home.avif",
];

const glazingOptions = [
  {
    title: "Dual-Glazed",
    description: "Two panes with insulating air or gas-filled space. Great for energy efficiency, UV protection, and basic sound reduction.",
  },
  {
    title: "Triple-Glazed",
    description: "Three panes with two insulating chambers for superior thermal performance. Ideal for colder climates or noisy environments.",
  },
  {
    title: "Quad-Glazed",
    description: "Four panes with three insulating layers for maximum energy efficiency and sound control. Perfect for extreme climates or luxury builds.",
  },
];

export default function UltraSlimSliderPage() {
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
                Ultra Slim Multi-Sliding Door System
              </h1>
              <p className="text-white/80 text-lg mb-8">
                Our premier minimalist sliding door system, engineered to maximize your views
                with ultra-thin sightlines. Step into a space where boundaries disappear.
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

        {/* Expand Your Horizon Section */}
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
                  Expand Your Horizon
                </span>
                <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-6">
                  Wall-to-Wall Glass
                </h2>
                <p className="text-ocean-600 mb-6">
                  With ultra-narrow frames and expansive glass panels, the UltraSlim Multi-Slider
                  door system opens your home to panoramic views and endless natural light.
                  Transform your living space with clean aesthetics and effortless functionality.
                </p>
                <p className="text-ocean-600 mb-8">
                  Designed for coastal living and luxury residences, these doors eliminate visual
                  and physical barriers to create a bright, open atmosphere that feels expansive
                  and refined.
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
                    alt="Ultra slim slider bedroom with ocean view"
                    className="w-full aspect-video object-cover"
                  />
                </div>
                <div>
                  <img
                    src={gallery[2]}
                    alt="Corner looking out to garden"
                    className="w-full aspect-square object-cover"
                  />
                </div>
                <div>
                  <img
                    src={gallery[3]}
                    alt="Beach home with narrow frame slider"
                    className="w-full aspect-square object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Engineering Features */}
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
                Engineering Excellence
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-white mb-4">
                Built for Coastal Strength
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                At Scenic Doors, performance is as important as beauty. Every system is crafted
                to withstand coastal conditions while delivering effortless elegance.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {engineeringFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-primary-900/50 p-8 text-center"
                >
                  <feature.icon className="w-12 h-12 text-primary-300 mx-auto mb-4" />
                  <h3 className="font-heading text-xl text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-primary-200 text-sm">
                    {feature.description}
                  </p>
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
              <span className="text-primary-500 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                Performance
              </span>
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

            <div className="bg-gray-50 p-8 md:p-12">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-heading text-lg text-ocean-900 mb-4">Standards & Certifications</h4>
                  <ul className="space-y-2 text-ocean-600">
                    <li>NFRC Certified</li>
                    <li>CSA Certified</li>
                    <li>CE Marked</li>
                    <li>IGCC / SGCC Glass Standards</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-lg text-ocean-900 mb-4">Applications</h4>
                  <ul className="space-y-2 text-ocean-600">
                    <li>Residential Homes</li>
                    <li>Commercial Properties</li>
                    <li>Coastal Residences</li>
                    <li>Luxury Developments</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-lg text-ocean-900 mb-4">Markets Served</h4>
                  <ul className="space-y-2 text-ocean-600">
                    <li>USA</li>
                    <li>Canada</li>
                    <li>Europe</li>
                  </ul>
                </div>
              </div>
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
                    alt={`Ultra Slim Multi-Slide Door ${index + 1}`}
                    className="w-full h-full object-cover aspect-[4/3]"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Glazing Options */}
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
                Glass Options
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-4">
                Dual, Triple & Quad Glazing
              </h2>
              <p className="text-ocean-600 max-w-2xl mx-auto">
                Advanced insulated glass units (IGUs) for the perfect balance of thermal comfort,
                energy efficiency, and sound reduction.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {glazingOptions.map((option, index) => (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 shadow-sm"
                >
                  <h3 className="font-heading text-2xl text-ocean-900 mb-4">
                    {option.title}
                  </h3>
                  <p className="text-ocean-600">{option.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 grid md:grid-cols-2 gap-8"
            >
              <div className="bg-white p-8 shadow-sm">
                <h4 className="font-heading text-xl text-ocean-900 mb-4">Frame Colors</h4>
                <p className="text-ocean-600 mb-4">
                  Standard colors include Black, White, Dark Brown, and Gray.
                  Custom RAL colors available for perfect matching.
                </p>
                <p className="text-ocean-500 text-sm">
                  All frames powder-coated for UV resistance and long-lasting performance.
                </p>
              </div>
              <div className="bg-white p-8 shadow-sm">
                <h4 className="font-heading text-xl text-ocean-900 mb-4">Screen Options</h4>
                <p className="text-ocean-600 mb-4">
                  Fiberglass mesh, retractable screens, and stainless steel options available.
                  All screens color-matched to your frame.
                </p>
                <p className="text-ocean-500 text-sm">
                  Fixed, in-swing, or rolling configurations to suit your needs.
                </p>
              </div>
            </motion.div>
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
                Get your personalized quote and bring your vision to life.
                Premium quality doors crafted to perfection.
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
