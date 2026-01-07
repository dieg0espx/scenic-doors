"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import { useQuoteModal } from "@/context/QuoteModalContext";
import {
  Check,
  Smartphone,
  Zap,
  Volume2,
  Shield,
  Wifi,
  Battery,
} from "lucide-react";

const openerTypes = [
  {
    title: "Belt Drive Openers",
    description:
      "Ultra-quiet operation using a steel-reinforced belt. Perfect for attached garages where noise matters.",
    features: ["Whisper-quiet", "Low vibration", "Smooth operation"],
    icon: Volume2,
  },
  {
    title: "Chain Drive Openers",
    description:
      "Reliable and affordable option using a metal chain. Great for detached garages and heavy doors.",
    features: ["Budget-friendly", "Durable", "High lifting power"],
    icon: Zap,
  },
  {
    title: "Wall-Mount Openers",
    description:
      "Space-saving design mounted on the wall beside the door. Frees up ceiling space for storage.",
    features: ["Space-saving", "Modern design", "Easy access"],
    icon: Battery,
  },
  {
    title: "Smart Openers",
    description:
      "WiFi-enabled openers with smartphone control. Monitor and operate your door from anywhere.",
    features: ["App control", "Remote monitoring", "Smart home ready"],
    icon: Wifi,
  },
];

const openerFeatures = [
  "All major brands serviced and installed",
  "Smart home integration setup",
  "Battery backup installation",
  "Safety sensor alignment",
  "Remote and keypad programming",
  "Quiet operation upgrades",
];

const repairServices = [
  {
    title: "Motor Repair",
    description:
      "Diagnose and repair motor issues including humming, grinding, or complete failure.",
  },
  {
    title: "Remote Issues",
    description:
      "Fix remote control problems, reprogram remotes, and replace worn-out transmitters.",
  },
  {
    title: "Sensor Alignment",
    description:
      "Realign safety sensors that prevent proper door closure and fix wiring issues.",
  },
  {
    title: "Circuit Board Repair",
    description:
      "Diagnose and replace faulty circuit boards and electrical components.",
  },
  {
    title: "Gear Replacement",
    description:
      "Replace worn or stripped gears that cause grinding noises or opener failure.",
  },
  {
    title: "Chain/Belt Adjustment",
    description:
      "Adjust tension, replace worn chains or belts, and lubricate moving parts.",
  },
];

const brands = [
  { name: "LiftMaster", type: "Premium Smart Openers" },
  { name: "Chamberlain", type: "Residential Experts" },
  { name: "Genie", type: "Innovative Solutions" },
  { name: "Craftsman", type: "Trusted Reliability" },
];

export default function OpenerServicesPage() {
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
                backgroundImage: `url('https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop')`,
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
                Garage Door Opener Services
              </h1>
              <p className="text-white/70 text-lg mb-8">
                Expert repair and installation of garage door openers. From
                troubleshooting existing openers to installing the latest smart
                technology, we keep your garage door operating smoothly and
                conveniently.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={openQuoteModal}
                  className="bg-primary-500 text-white px-8 py-4 font-medium tracking-wide hover:bg-primary-400 transition-colors"
                >
                  Schedule Service
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
                  icon: Smartphone,
                  title: "Smart Ready",
                  description: "WiFi-enabled options",
                },
                {
                  icon: Volume2,
                  title: "Ultra Quiet",
                  description: "Belt drive options",
                },
                {
                  icon: Shield,
                  title: "Safe & Secure",
                  description: "Rolling code tech",
                },
                {
                  icon: Zap,
                  title: "Fast Service",
                  description: "Same-day available",
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

        {/* Opener Types Section */}
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
                Opener Installation
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-4">
                Choose Your Opener Type
              </h2>
              <p className="text-ocean-600 max-w-2xl mx-auto">
                We install all types of garage door openers to match your needs,
                budget, and lifestyle. Our experts help you choose the right
                opener for your garage.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {openerTypes.map((opener, index) => (
                <motion.div
                  key={opener.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-sand-50 p-8 border-l-4 border-primary-500"
                >
                  <opener.icon className="w-10 h-10 text-primary-500 mb-4" />
                  <h3 className="font-heading text-2xl text-ocean-900 mb-3">
                    {opener.title}
                  </h3>
                  <p className="text-ocean-600 mb-4">{opener.description}</p>
                  <ul className="flex flex-wrap gap-2">
                    {opener.features.map((feature) => (
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

        {/* Repair Services Section */}
        <section className="py-24 bg-sand-100">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-primary-500 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                Opener Repair
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-ocean-900">
                Common Opener Repairs
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {repairServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 shadow-sm"
                >
                  <h3 className="font-heading text-xl text-ocean-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-ocean-600">{service.description}</p>
                </motion.div>
              ))}
            </div>
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
                  Full Service
                </span>
                <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-6">
                  Complete Opener Solutions
                </h2>
                <p className="text-ocean-600 mb-8">
                  Whether you need a simple repair or a complete opener upgrade,
                  our technicians have the expertise to handle it all. We work
                  with all major brands and can integrate your opener with your
                  smart home system.
                </p>
                <ul className="space-y-4">
                  {openerFeatures.map((feature) => (
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
                    src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop"
                    alt="Garage door opener"
                    className="w-full aspect-video object-cover"
                  />
                </div>
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=2070&auto=format&fit=crop"
                    alt="Smart home control"
                    className="w-full aspect-square object-cover"
                  />
                </div>
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070&auto=format&fit=crop"
                    alt="Remote control"
                    className="w-full aspect-square object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Brands Section */}
        <section className="py-24 bg-primary-800">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="font-heading text-3xl md:text-4xl text-white">
                Trusted Opener Brands
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
                  <p className="font-heading text-2xl text-white mb-1">
                    {brand.name}
                  </p>
                  <p className="text-primary-200 text-sm">{brand.type}</p>
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
