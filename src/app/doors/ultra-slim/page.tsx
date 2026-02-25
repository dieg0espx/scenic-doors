"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import ProductTabs from "@/components/ProductTabs";
import { ArrowRight, Shield, Thermometer, Droplets, Wind } from "lucide-react";

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

const detailedSpecifications = [
  { label: "Product Name", value: "Scenic Ultra-Slim Slider Door" },
  { label: "Open Style", value: "XO, OX, OXO, OXXO, XX, XXX, XXXX" },
  { label: "Thermal Insulation", value: "U ≤ 0.387 BTU/hr·ft²·°F" },
  { label: "Acoustic Performance", value: "≤ 45 dB" },
  { label: "Air Tightness", value: "≤ 0.4 m³/(m²·h)" },
  { label: "Wind Load Resistance", value: "≥ 2.8 KPa" },
  { label: "Water Penetration", value: "≥ 450 Pa" },
  { label: "Window Standard", value: "NFRC, CSA, CE" },
  { label: "Glass Standard", value: "IGCC / SGCC / CE" },
  { label: "Warranty", value: "15 Years" },
  { label: "Application", value: "Residential, Commercial" },
  { label: "Performance", value: "Thermal Broken" },
  { label: "Main Market", value: "USA, Canada, Europe" },
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

const certifications = [
  {
    title: "Standards & Certifications",
    items: ["NFRC Certified", "CSA Certified", "CE Marked", "IGCC / SGCC Glass Standards"],
  },
  {
    title: "Applications",
    items: ["Residential Homes", "Commercial Properties", "Coastal Residences", "Luxury Developments"],
  },
  {
    title: "Markets Served",
    items: ["USA", "Canada", "Europe"],
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
            <div className="absolute inset-0 bg-ocean-900/80" />
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

        {/* Product Tabs */}
        <ProductTabs
          overviewLabel="Expand Your Horizon"
          overviewTitle="Wall-to-Wall Glass"
          overviewDescription="With ultra-narrow frames and expansive glass panels, the UltraSlim Multi-Slider door system opens your home to panoramic views and endless natural light. Transform your living space with clean aesthetics and effortless functionality."
          overviewDescriptionExtra="Designed for coastal living and luxury residences, these doors eliminate visual and physical barriers to create a bright, open atmosphere that feels expansive and refined."
          features={features}
          featuredImages={{
            main: gallery[1],
            mainAlt: "Ultra slim slider bedroom with ocean view",
            secondary: gallery[2],
            secondaryAlt: "Corner looking out to garden",
            tertiary: gallery[3],
            tertiaryAlt: "Beach home with narrow frame slider",
          }}
          specifications={specifications}
          detailedSpecifications={detailedSpecifications}
          engineeringFeatures={engineeringFeatures}
          certifications={certifications}
          gallery={gallery}
          galleryAltPrefix="Ultra Slim Multi-Slide Door"
          glazingOptions={glazingOptions}
          frameColorOptions={{
            title: "Frame Colors",
            description: "Standard colors include Black, White, Dark Brown, and Gray. Custom RAL colors available for perfect matching.",
            note: "All frames powder-coated for UV resistance and long-lasting performance.",
          }}
          screenOptions={{
            title: "Screen Options",
            description: "Fiberglass mesh, retractable screens, and stainless steel options available. All screens color-matched to your frame.",
            note: "Fixed, in-swing, or rolling configurations to suit your needs.",
          }}
        />

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
