"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import ProductTabs from "@/components/ProductTabs";
import SlidingDoorAnimation from "@/components/SlidingDoorAnimation";
import { ArrowRight, Shield, Thermometer, Droplets, Wind } from "lucide-react";

const features = [
  "Multiple panels slide smoothly along durable tracks",
  "Stack in-line or into wall pocket configurations",
  "Slim aluminum frames with thermal breaks",
  "Multi-point locking systems for security",
  "Configurations: XO, OX, OXO, OXXO, XX, XXX, XXXX",
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
    description: "Precision-engineered, reinforced materials for maximum strength and longevity near the ocean.",
  },
  {
    icon: Thermometer,
    title: "Thermal Insulation",
    description: "Reinforced fiberglass thermal breaks for exceptional energy performance year-round.",
  },
  {
    icon: Wind,
    title: "Pressure-Extruded Frames",
    description: "Built for structural integrity and reliability under heavy use or high wind exposure.",
  },
  {
    icon: Droplets,
    title: "EPDM Weather Stripping",
    description: "Upgraded foam weather stripping for superior air and water tightness.",
  },
];

const gallery = [
  "/images/products/multi-slide/header.avif",
  "/images/products/multi-slide/partially-open.avif",
  "/images/products/multi-slide/opening-door.avif",
  "/images/products/multi-slide/ocean-view.jpg",
  "/images/products/multi-slide/partially-open-2.avif",
  "/images/products/shared/rain-on-glass.avif",
  "/images/products/shared/profile-colors.avif",
  "/images/products/shared/secure-at-home.avif",
  "/images/products/shared/profile-design-review.avif",
];

const configurations = [
  {
    title: "Open Right to Left",
    description: "All panels slide smoothly to the left side, stacking neatly for maximum clearance on the right.",
    features: ["Clear right-side opening", "Panels stack on left", "Ideal for left-wall space"],
  },
  {
    title: "Open Left to Right",
    description: "All panels slide smoothly to the right side, stacking neatly for maximum clearance on the left.",
    features: ["Clear left-side opening", "Panels stack on right", "Ideal for right-wall space"],
  },
  {
    title: "Open Middle (Stack Right & Stack Left)",
    description: "Panels split from the center and stack to both sides. Creates a grand, centered entrance with balanced aesthetics.",
    features: ["Symmetrical center opening", "Balanced panel distribution", "Perfect for wide openings"],
  },
];

const glassOptions = [
  "Frosted glass for privacy",
  "Low-E coated for energy efficiency",
  "Tinted glass for solar control",
  "Fire-rated glass for safety",
  "Bullet-resistant options",
  "Acoustic glass for sound reduction",
];

export default function MultiSlideDoorsPage() {
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
                Multi-Slide Patio Doors
              </h1>
              <p className="text-white/80 text-lg mb-8">
                Engineered for wide openings and uninterrupted panoramas. Multiple panels slide
                smoothly along durable tracks and stack in-line or into a wall pocket—effortlessly
                expanding your living space.
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
          overviewLabel="Features"
          overviewTitle="Effortless Transitions to the Outdoors"
          overviewDescription="Multi-Slide Patio Doors offer a sleek, space-enhancing solution for modern homes and luxury properties. Designed for expansive openings and panoramic views, they're ideal for coastal residences and contemporary architecture."
          overviewDescriptionExtra="Constructed with premium aluminum, our doors are engineered to resist salty air and coastal elements, ensuring longevity without compromising on style."
          features={features}
          featuredImages={{
            main: gallery[1],
            mainAlt: "Multi-slide door partially open",
            secondary: gallery[2],
            secondaryAlt: "Opening a multi-slide door",
            tertiary: gallery[3],
            tertiaryAlt: "Multi-slide view of ocean",
          }}
          specifications={specifications}
          engineeringFeatures={engineeringFeatures}
          gallery={gallery}
          galleryAltPrefix="Multi-Slide Patio Door"
          configurations={configurations}
          configurationsTitle="Configurations"
          configurationsSubtitle="Choose from multiple configurations to match your opening size and design preferences. X = sliding panel, O = fixed panel."
          glassOptions={glassOptions}
          previewComponent={<SlidingDoorAnimation />}
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
