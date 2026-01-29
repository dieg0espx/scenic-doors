"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import { Check, ArrowRight, Shield, Thermometer, Droplets, Eye } from "lucide-react";

const features = [
  "Panels slide completely into wall pockets",
  "Ultra-thin sightlines for unobstructed views",
  "Multi-point locking security systems",
  "Dual, triple, and quad glazing options",
  "Customizable frame colors and finishes",
  "Multiple screen options available",
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
                  Invisible Design
                </span>
                <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-6">
                  Expand Your Living Space with Disappearing Boundaries
                </h2>
                <p className="text-ocean-600 mb-6">
                  Pocket Patio Doors are the ultimate solution for those seeking truly seamless
                  indoor-outdoor transitions. Panels completely disappear into wall pockets,
                  creating unobstructed openings that transform your living experience.
                </p>
                <p className="text-ocean-600 mb-8">
                  Constructed with premium aluminum, our doors are engineered to resist salty air
                  and coastal elements, ensuring longevity without compromising on style.
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
                    alt="Pocket door open"
                    className="w-full aspect-video object-cover"
                  />
                </div>
                <div>
                  <img
                    src={gallery[2]}
                    alt="Corner pocket door"
                    className="w-full aspect-square object-cover"
                  />
                </div>
                <div>
                  <img
                    src={gallery[3]}
                    alt="Pocket door luxury home"
                    className="w-full aspect-square object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Benefits */}
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
                Benefits
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-white mb-4">
                Unmatched Connection
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-primary-900/50 p-8"
                >
                  <h3 className="font-heading text-xl text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-primary-200">
                    {benefit.description}
                  </p>
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
                    alt={`Pocket Patio Door ${index + 1}`}
                    className="w-full h-full object-cover aspect-[4/3]"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Options Section */}
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
                Customization Options
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 shadow-sm">
                <h4 className="font-heading text-xl text-ocean-900 mb-4">Frame Colors</h4>
                <p className="text-ocean-600 mb-4">
                  Standard: Black, White, Dark Brown, Gray
                </p>
                <p className="text-ocean-500 text-sm">
                  Custom RAL colors available. All frames powder-coated for UV resistance.
                </p>
              </div>
              <div className="bg-white p-8 shadow-sm">
                <h4 className="font-heading text-xl text-ocean-900 mb-4">Glazing Options</h4>
                <p className="text-ocean-600 mb-4">
                  Dual, Triple, and Quad-glazed configurations available.
                </p>
                <p className="text-ocean-500 text-sm">
                  Decorative patterns, frosted, and tinted glass options.
                </p>
              </div>
              <div className="bg-white p-8 shadow-sm">
                <h4 className="font-heading text-xl text-ocean-900 mb-4">Screen Options</h4>
                <p className="text-ocean-600 mb-4">
                  Fiberglass mesh, retractable, and stainless steel options.
                </p>
                <p className="text-ocean-500 text-sm">
                  All screens color-matched to your frame finish.
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
