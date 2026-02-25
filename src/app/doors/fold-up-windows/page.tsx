"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import ProductTabs from "@/components/ProductTabs";
import { ArrowRight, Shield, Thermometer, Droplets, Wind } from "lucide-react";

const features = [
  "Two-panel lift-open design with gas-assist hardware",
  "Thermal-break aluminum frames with argon-filled glass",
  "German-engineered multi-point locking system",
  "Top panels tilt outward as protective awning",
  "Bottom sash functions as counter ledge",
  "15-year warranty",
];

const specifications = [
  { label: "Thermal Performance", value: "U ≤ 0.387", unit: "BTU/hr·ft²·°F" },
  { label: "Sound Reduction", value: "≤ 45", unit: "dB" },
  { label: "Wind Resistance", value: "≥ 2.8", unit: "KPa" },
  { label: "Water Penetration", value: "≥ 450", unit: "Pa" },
];

const engineeringFeatures = [
  {
    icon: Shield,
    title: "Advanced Aluminum Profiles",
    description: "Precision-engineered materials for maximum strength and coastal durability.",
  },
  {
    icon: Thermometer,
    title: "Thermal Insulation",
    description: "Thermal breaks deliver exceptional energy performance in every season.",
  },
  {
    icon: Wind,
    title: "Pressure-Extruded Frames",
    description: "Built for structural integrity and reliability under heavy use.",
  },
  {
    icon: Droplets,
    title: "Moisture-Blocking Seals",
    description: "Robust seals keep marine air and moisture out.",
  },
];

const gallery = [
  "/images/products/fold-up-windows/header.jpg",
  "/images/products/fold-up-windows/exterior.jpg",
  "/images/products/fold-up-windows/dual-windows.jpg",
  "/images/products/fold-up-windows/wall-of-windows.jpg",
  "/images/products/shared/rain-on-glass.avif",
  "/images/products/shared/profile-colors.avif",
  "/images/products/shared/secure-at-home.avif",
  "/images/products/shared/profile-design-review.avif",
];

const useCases = [
  {
    title: "Kitchen Pass-Through",
    description: "Transform your kitchen into an al fresco gathering spot. The bottom sash becomes a ready-made counter for serving food and drinks.",
  },
  {
    title: "Home Bar",
    description: "Create the perfect indoor-outdoor bar experience. Panels open to provide service access while the awning protects guests.",
  },
  {
    title: "Living Spaces",
    description: "Flood your space with natural light and garden views. Stack neatly to transform any wall into a sleek pass-through.",
  },
];

export default function FoldUpWindowsPage() {
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
                Horizontal Fold-Up Windows
              </h1>
              <p className="text-white/80 text-lg mb-8">
                Open up kitchens, bars, and living spaces with a single effortless push—inviting
                natural light, fresh air, and panoramic views. Engineered with thermal-break frames
                and insulated glass for year-round energy efficiency.
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
          overviewLabel="A Unique View"
          overviewTitle="Fresh Air & Casual Entertaining"
          overviewDescription="Push-Up Fold-Up Windows stack neatly to transform any wall into a sleek pass-through, inviting natural light, fresh air, and that perfect California breeze. The bottom sash becomes a ready-made counter ledge while the top panels tilt out as a protective awning."
          overviewDescriptionExtra="Engineered for lasting beauty and performance, our thermal-break aluminum frames and argon-filled insulated glass lock in year-round comfort. German-made multi-point hardware secures each panel tightly when closed."
          features={features}
          featuredImages={{
            main: gallery[2],
            mainAlt: "Dual fold-up windows in kitchen",
            secondary: gallery[1],
            secondaryAlt: "Lift-up window exterior",
            tertiary: gallery[3],
            tertiaryAlt: "Wall of lift-up windows",
          }}
          specifications={specifications}
          engineeringFeatures={engineeringFeatures}
          gallery={gallery}
          galleryAltPrefix="Fold-Up Window"
          configurations={useCases}
          configurationsTitle="Applications"
          frameColorOptions={{
            title: "Frame Colors",
            description: "Black, White, Dark Brown, Gray, plus RAL custom palette.",
            note: "Powder-coat finishes resist sun, salt, and spray.",
          }}
          screenOptions={{
            title: "Screen Options",
            description: "Fiberglass, retractable, and stainless steel screens.",
            note: "Color-matched aluminum alloy frames.",
          }}
          customOptions={[
            {
              title: "Glazing Options",
              description: "Dual, Triple, and Quad-glazed configurations.",
              note: "Clear, tinted, frosted, and decorative patterns.",
            },
          ]}
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
                Premium quality windows crafted to perfection. Get your personalized quote
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
