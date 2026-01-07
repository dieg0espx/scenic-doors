"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import { useQuoteModal } from "@/context/QuoteModalContext";
import { Check, Home, Ruler, Settings, Sparkles } from "lucide-react";

const doorTypes = [
  {
    title: "Steel Doors",
    description:
      "Durable and low-maintenance steel garage doors available in a variety of styles, colors, and insulation options.",
    features: ["Wind-resistant", "Energy efficient", "Low maintenance"],
  },
  {
    title: "Wood Doors",
    description:
      "Beautiful natural wood doors that add warmth and character to your home. Available in custom designs and finishes.",
    features: ["Custom designs", "Natural beauty", "Premium craftsmanship"],
  },
  {
    title: "Aluminum & Glass",
    description:
      "Modern aluminum frame doors with glass panels for a contemporary look. Perfect for modern architecture.",
    features: ["Modern aesthetic", "Natural light", "Rust-resistant"],
  },
  {
    title: "Carriage House",
    description:
      "Classic carriage house style doors that combine traditional aesthetics with modern functionality.",
    features: ["Timeless design", "Customizable", "Premium hardware"],
  },
];

const installationFeatures = [
  "Free in-home consultations",
  "Professional measuring and fitting",
  "Removal of old door included",
  "Premium hardware and tracks",
  "Opener installation available",
  "Full system testing and adjustment",
  "Manufacturer warranty support",
  "Post-installation support",
];

const installationProcess = [
  {
    step: "1",
    title: "Consultation",
    description:
      "We visit your home, take measurements, discuss your needs and preferences, and help you select the perfect door.",
  },
  {
    step: "2",
    title: "Selection",
    description:
      "Choose from our wide range of door styles, materials, colors, and features. We provide detailed quotes with no hidden costs.",
  },
  {
    step: "3",
    title: "Installation",
    description:
      "Our certified technicians install your new door with precision, including tracks, hardware, and weatherstripping.",
  },
  {
    step: "4",
    title: "Final Check",
    description:
      "We test the entire system, make adjustments for smooth operation, and walk you through proper maintenance.",
  },
];

const brands = [
  { name: "Clopay", tagline: "America's Favorite Garage Doors" },
  { name: "Amarr", tagline: "Exceptional Quality" },
  { name: "Wayne Dalton", tagline: "Innovation Leaders" },
  { name: "CHI Overhead", tagline: "Built to Last" },
];

export default function GarageDoorInstallationPage() {
  const { openQuoteModal } = useQuoteModal();

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-ocean-900 relative overflow-hidden">
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1558036117-15d82a90b9b1?q=80&w=2070&auto=format&fit=crop')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ocean-900 via-ocean-900/95 to-ocean-900/80" />
          </div>
          <div className="section-container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <Link
                href="/services"
                className="text-primary-300 text-sm mb-4 inline-block hover:text-primary-200 transition-colors"
              >
                ← Back to Services
              </Link>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                Garage Door Installation
              </h1>
              <p className="text-white/70 text-lg mb-8">
                Upgrade your home with a beautiful new garage door. We offer
                professional installation of premium doors from top
                manufacturers, with styles to match any home architecture.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={openQuoteModal}
                  className="bg-primary-500 text-white px-8 py-4 font-medium tracking-wide hover:bg-primary-400 transition-colors"
                >
                  Get Free Quote
                </button>
                <a
                  href="tel:+1234567890"
                  className="border border-white/30 text-white px-8 py-4 font-medium tracking-wide hover:bg-white/10 transition-colors"
                >
                  Call Now
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Bar */}
        <section className="py-16 bg-primary-600">
          <div className="section-container">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: Ruler,
                  title: "Custom Fit",
                  description: "Precisely measured",
                },
                {
                  icon: Settings,
                  title: "Pro Install",
                  description: "Certified technicians",
                },
                {
                  icon: Home,
                  title: "Curb Appeal",
                  description: "Transform your home",
                },
                {
                  icon: Sparkles,
                  title: "Warranty",
                  description: "Full coverage",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <item.icon className="w-8 h-8 text-white mx-auto mb-3" />
                  <p className="font-heading text-xl text-white mb-1">
                    {item.title}
                  </p>
                  <p className="text-primary-200 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Door Types Section */}
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
                Door Styles
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-4">
                Find Your Perfect Door
              </h2>
              <p className="text-ocean-600 max-w-2xl mx-auto">
                We install a wide variety of garage door styles to complement
                any home. From traditional to contemporary, we have options for
                every taste and budget.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {doorTypes.map((door, index) => (
                <motion.div
                  key={door.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-sand-50 p-8 border-l-4 border-primary-500"
                >
                  <h3 className="font-heading text-2xl text-ocean-900 mb-3">
                    {door.title}
                  </h3>
                  <p className="text-ocean-600 mb-4">{door.description}</p>
                  <ul className="flex flex-wrap gap-2">
                    {door.features.map((feature) => (
                      <li
                        key={feature}
                        className="bg-primary-100 text-primary-700 text-sm px-3 py-1"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-sand-100">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-primary-500 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                  What&apos;s Included
                </span>
                <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-6">
                  Complete Installation Service
                </h2>
                <p className="text-ocean-600 mb-8">
                  Our installation service covers everything from consultation
                  to final testing. We handle the entire process so you can
                  enjoy your new garage door without any hassle.
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {installationFeatures.map((feature) => (
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
                    src="https://images.unsplash.com/photo-1558036117-15d82a90b9b1?q=80&w=2070&auto=format&fit=crop"
                    alt="New garage door installation"
                    className="w-full aspect-video object-cover"
                  />
                </div>
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                    alt="Modern home with garage"
                    className="w-full aspect-square object-cover"
                  />
                </div>
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1523413363574-c30aa1c2a516?q=80&w=2070&auto=format&fit=crop"
                    alt="Garage door detail"
                    className="w-full aspect-square object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Brands Section */}
        <section className="py-16 bg-white">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="font-heading text-2xl text-ocean-900">
                We Install Top Brands
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-4 gap-8">
              {brands.map((brand, index) => (
                <motion.div
                  key={brand.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className="font-heading text-2xl text-ocean-900 mb-1">
                    {brand.name}
                  </p>
                  <p className="text-ocean-500 text-sm">{brand.tagline}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Installation Process Section */}
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
                Our Process
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-white">
                Simple Installation Process
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {installationProcess.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-primary-500 text-white font-heading text-xl flex items-center justify-center mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-heading text-xl text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-primary-200">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
