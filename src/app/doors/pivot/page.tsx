"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import ProductTabs from "@/components/ProductTabs";
import PivotDoorAnimation from "@/components/PivotDoorAnimation";
import { ArrowRight } from "lucide-react";

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
    title: "Solid Wood",
    description: "Natural warmth and character. Available in walnut, oak, mahogany, and custom species.",
  },
  {
    title: "Steel & Glass",
    description: "Modern industrial aesthetic. Thermally broken steel frames with insulated glass.",
  },
  {
    title: "Bronze & Copper",
    description: "Timeless elegance. Hand-finished metals that develop a beautiful patina over time.",
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
        <section className="pt-32 pb-20 bg-primary-800 relative overflow-hidden">
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
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
                Pivot Entry Doors
              </h1>
              <p className="text-white/70 text-lg mb-8">
                Make a statement from the moment guests arrive. Our pivot doors
                combine engineering precision with bold architectural presence,
                creating an unforgettable first impression.
              </p>
              <Link
                href="https://app.scenicdoors.co/quote/start"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 font-medium tracking-wide hover:bg-primary-400 transition-colors"
              >
                Request a Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Product Tabs */}
        <ProductTabs
          overviewLabel="Features"
          overviewTitle="Engineering Meets Artistry"
          overviewDescription="Pivot doors rotate on a central or offset axis, allowing for larger, heavier doors that swing with effortless grace. The pivot mechanism distributes weight evenly, ensuring smooth operation for decades."
          features={features}
          featuredImages={{
            main: gallery[0],
            mainAlt: "Pivot entry door",
            secondary: gallery[1],
            secondaryAlt: "Pivot entry door",
            tertiary: gallery[2],
            tertiaryAlt: "Pivot entry door",
          }}
          gallery={gallery}
          galleryAltPrefix="Pivot Entry Door"
          configurations={materials}
          configurationsTitle="Materials"
          configurationsSubtitle="Choose from premium material options to match your architectural vision."
          previewComponent={<PivotDoorAnimation />}
        />

        {/* Custom Design */}
        <section className="py-24 bg-white">
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
                <span className="text-primary-500 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
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
                  href="https://app.scenicdoors.co/quote/start"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary-800 text-white px-8 py-4 font-medium tracking-wide hover:bg-primary-700 transition-colors"
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
