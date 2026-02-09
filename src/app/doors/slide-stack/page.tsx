"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import ProductTabs from "@/components/ProductTabs";
import SlideStackDoorAnimation from "@/components/SlideStackDoorAnimation";
import { ArrowRight, Shield, Thermometer, Droplets, Wind } from "lucide-react";

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

        {/* Product Tabs */}
        <ProductTabs
          overviewLabel="Embrace the Coastal Lifestyle"
          overviewTitle="Effortless Transition, Uninterrupted Views"
          overviewDescription="Slide & Stack doors offer exceptional versatility for large openings. Multiple panels glide along precision tracks and stack neatly, creating expansive openings that blur the line between indoor and outdoor spaces."
          overviewDescriptionExtra="Constructed with premium aluminum, our doors are engineered to resist salty air and coastal elements, ensuring longevity without compromising style."
          features={features}
          featuredImages={{
            main: gallery[1],
            mainAlt: "Slide and stack doors vented",
            secondary: gallery[2],
            secondaryAlt: "Sunset slide and fold door",
            tertiary: gallery[3],
            tertiaryAlt: "Beach home slide and fold door",
          }}
          specifications={specifications}
          engineeringFeatures={engineeringFeatures}
          gallery={gallery}
          galleryAltPrefix="Slide & Stack Patio Door"
          configurations={stackingOptions}
          configurationsTitle="Stacking Options"
          previewComponent={<SlideStackDoorAnimation />}
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
