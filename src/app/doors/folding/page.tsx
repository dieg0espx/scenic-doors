"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import ProductTabs from "@/components/ProductTabs";
import BifoldDoorAnimation from "@/components/BifoldDoorAnimation";
import { ArrowRight, Shield, Thermometer, Droplets, Wind } from "lucide-react";

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

        {/* Product Tabs */}
        <ProductTabs
          overviewLabel="Open Wide, Live Larger"
          overviewTitle="Expand Your Kitchen, Expand Your Life"
          overviewDescription="Our Bi-fold Door systems feature slim frames, effortless operation, and clean lines that fold completely out of the way. Perfect for kitchen expansions, living room openings, patio access, and entertainment areas."
          overviewDescriptionExtra="Constructed with premium aluminum, our doors are engineered to resist salty air and harsh coastal elements, ensuring longevity without compromising on style."
          features={features}
          featuredImages={{
            main: gallery[1],
            mainAlt: "Open bi-fold door system",
            secondary: gallery[2],
            secondaryAlt: "Bi-fold door corner installation",
            tertiary: gallery[3],
            tertiaryAlt: "LA home with accordion doors",
          }}
          specifications={specifications}
          engineeringFeatures={engineeringFeatures}
          gallery={gallery}
          galleryAltPrefix="Bi-Fold Door"
          configurations={configurations}
          configurationsTitle="Configurations"
          configurationsSubtitle="Choose the configuration that best suits your space and lifestyle needs."
          frameColorOptions={{
            title: "Frame Colors",
            description: "Standard colors: Black, White, Dark Brown, Gray. Custom RAL colors available.",
            note: "All frames powder-coated for UV resistance and long-lasting performance.",
          }}
          customOptions={[
            {
              title: "Glazing Options",
              description: "Dual, Triple, and Quad-glazed configurations available. Decorative patterns and frosted finishes for privacy.",
              note: "All glass meets IGCC / SGCC / CE standards.",
            },
          ]}
          previewComponent={<BifoldDoorAnimation />}
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
