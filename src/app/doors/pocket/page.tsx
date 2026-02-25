"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import ProductTabs from "@/components/ProductTabs";
import { ArrowRight, Shield, Thermometer, Droplets, Eye } from "lucide-react";

const features = [
  "Panels slide completely into wall pockets",
  "Ultra-thin sightlines for unobstructed views",
  "Multi-point locking security systems",
  "Dual, triple, and quad glazing options",
  "Customizable frame colors and finishes",
  "Multiple screen options available",
];

const specifications = [
  { label: "Thermal Insulation", value: "U ≤ 0.387", unit: "BTU/hr·ft²·°F" },
  { label: "Acoustic Performance", value: "≤ 45", unit: "dB" },
  { label: "Wind Load Resistance", value: "≥ 2.8", unit: "KPa" },
  { label: "Water Penetration", value: "≥ 450", unit: "Pa" },
];

const detailedSpecifications = [
  { label: "Product Name", value: "Scenic Pocket Door System" },
  { label: "Open Style", value: "1-4 Panels, Concealed Pocket System" },
  { label: "Thermal Insulation", value: "U ≤ 0.387 BTU/hr·ft²·°F" },
  { label: "Acoustic Performance", value: "≤ 45 dB" },
  { label: "Air Tightness", value: "≤ 0.4 m³/(m²·h)" },
  { label: "Wind Load Resistance", value: "≥ 2.8 KPa" },
  { label: "Water Penetration", value: "≥ 450 Pa" },
  { label: "Window Standard", value: "NFRC, CSA, CE" },
  { label: "Glass Standard", value: "IGCC / SGCC / CE" },
  { label: "Warranty", value: "10 Years" },
  { label: "Application", value: "Residential, Commercial" },
  { label: "Performance", value: "Thermal Broken" },
  { label: "Main Market", value: "USA, Canada, Europe" },
];

const engineeringFeatures = [
  {
    icon: Eye,
    title: "Invisible Design",
    description: "Panels disappear completely into walls, creating dramatic uninterrupted openings.",
  },
  {
    icon: Shield,
    title: "Advanced Aluminum Profiles",
    description: "Precision-engineered materials for maximum strength and longevity near the ocean.",
  },
  {
    icon: Thermometer,
    title: "Thermal Insulation",
    description: "Fiberglass thermal breaks for exceptional energy performance year-round.",
  },
  {
    icon: Droplets,
    title: "Moisture-Blocking Seals",
    description: "Coextruded wire seals create a water-resistant barrier against marine air.",
  },
];

const gallery = [
  "/images/products/pocket/header.avif",
  "/images/products/pocket/door-open.jpg",
  "/images/products/pocket/corner.jpg",
  "/images/products/pocket/door-open-2.jpg",
  "/images/products/pocket/luxury-home.jpg",
  "/images/products/shared/profile-colors.avif",
  "/images/products/shared/rain-on-glass.avif",
  "/images/products/shared/secure-at-home.avif",
  "/images/products/shared/profile-design-review.avif",
];

const benefits = [
  {
    title: "Seamless Indoor-Outdoor Living",
    description: "Panels slide completely out of view, creating a clean, modern look that transforms kitchens and living spaces into breezy retreats.",
  },
  {
    title: "Maximize Usable Space",
    description: "Unlike traditional sliding doors, pocket doors don't take up wall space when open. Every inch of your opening is usable.",
  },
  {
    title: "Dramatic Uninterrupted Openings",
    description: "Create the ultimate connection between indoor and outdoor spaces with no visible panels when fully open.",
  },
];

export default function PocketDoorsPage() {
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
                Pocket Patio Doors
              </h1>
              <p className="text-white/80 text-lg mb-8">
                The ultimate choice for seamless indoor-outdoor living. Panels glide completely
                into the wall and out of sight, maximizing usable space with minimalist aesthetics.
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
          overviewLabel="Invisible Design"
          overviewTitle="Expand Your Living Space with Disappearing Boundaries"
          overviewDescription="Pocket Patio Doors are the ultimate solution for those seeking truly seamless indoor-outdoor transitions. Panels completely disappear into wall pockets, creating unobstructed openings that transform your living experience."
          overviewDescriptionExtra="Constructed with premium aluminum, our doors are engineered to resist salty air and coastal elements, ensuring longevity without compromising on style."
          features={features}
          featuredImages={{
            main: gallery[1],
            mainAlt: "Pocket door open",
            secondary: gallery[2],
            secondaryAlt: "Corner pocket door",
            tertiary: gallery[3],
            tertiaryAlt: "Pocket door luxury home",
          }}
          specifications={specifications}
          detailedSpecifications={detailedSpecifications}
          engineeringFeatures={engineeringFeatures}
          gallery={gallery}
          galleryAltPrefix="Pocket Patio Door"
          configurations={benefits}
          configurationsTitle="Benefits"
          frameColorOptions={{
            title: "Frame Colors",
            description: "Standard: Black, White, Dark Brown, Gray",
            note: "Custom RAL colors available. All frames powder-coated for UV resistance.",
          }}
          screenOptions={{
            title: "Screen Options",
            description: "Fiberglass mesh, retractable, and stainless steel options.",
            note: "All screens color-matched to your frame finish.",
          }}
          customOptions={[
            {
              title: "Glazing Options",
              description: "Dual, Triple, and Quad-glazed configurations available.",
              note: "Decorative patterns, frosted, and tinted glass options.",
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
