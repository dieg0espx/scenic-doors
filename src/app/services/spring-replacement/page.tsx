"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import { useQuoteModal } from "@/context/QuoteModalContext";
import {
  Check,
  AlertTriangle,
  Clock,
  Shield,
  Wrench,
  CircleAlert,
} from "lucide-react";

const springTypes = [
  {
    title: "Torsion Springs",
    description:
      "Mounted above the door opening, torsion springs use torque to lift the door. They offer smoother operation, longer lifespan, and better balance than extension springs.",
    features: [
      "10,000+ cycle lifespan",
      "Smoother operation",
      "Better door balance",
    ],
  },
  {
    title: "Extension Springs",
    description:
      "Located on both sides of the door track, extension springs stretch to provide lifting force. Common in residential applications with lighter doors.",
    features: [
      "Cost-effective option",
      "Easy to replace",
      "Suitable for light doors",
    ],
  },
  {
    title: "High-Cycle Springs",
    description:
      "Commercial-grade springs designed for frequent use. Ideal for busy households or commercial applications where the door is opened many times daily.",
    features: [
      "25,000+ cycle rating",
      "Commercial grade",
      "Extended warranty",
    ],
  },
];

const warningSignsData = [
  {
    icon: CircleAlert,
    title: "Door Won't Open",
    description:
      "The door feels extremely heavy or won't open at all, even with the opener.",
  },
  {
    icon: AlertTriangle,
    title: "Loud Bang",
    description:
      "You heard a loud bang from the garage - this is often the sound of a spring breaking.",
  },
  {
    icon: CircleAlert,
    title: "Gap in Spring",
    description:
      "You can see a visible gap in the torsion spring above your door.",
  },
  {
    icon: AlertTriangle,
    title: "Crooked Door",
    description:
      "The door hangs crooked or one side is higher than the other when closing.",
  },
  {
    icon: CircleAlert,
    title: "Jerky Movement",
    description:
      "The door moves unevenly, jerks, or struggles during operation.",
  },
  {
    icon: AlertTriangle,
    title: "Cables Loose",
    description:
      "The lift cables appear loose or are hanging off the drums.",
  },
];

const serviceFeatures = [
  "Same-day spring replacement",
  "Premium quality springs",
  "Matching springs replaced together",
  "Full system safety inspection",
  "Cable inspection and adjustment",
  "Door balance testing",
  "Lubrication of all moving parts",
  "Written warranty on parts and labor",
];

const safetyInfo = [
  {
    title: "High Tension Danger",
    description:
      "Garage door springs are under extreme tension - enough force to cause serious injury or death. Never attempt DIY spring replacement.",
  },
  {
    title: "Professional Tools Required",
    description:
      "Spring replacement requires specialized tools including winding bars, vise grips, and precise measuring equipment.",
  },
  {
    title: "Proper Training Essential",
    description:
      "Our technicians undergo extensive training on spring systems, safety protocols, and proper installation techniques.",
  },
];

export default function SpringReplacementPage() {
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
                backgroundImage: `url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop')`,
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
                Spring Replacement
              </h1>
              <p className="text-white/70 text-lg mb-8">
                Professional garage door spring replacement services. Broken
                springs are dangerous - our trained technicians safely replace
                them with high-quality springs designed for your specific door.
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
                  Emergency Service
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
                  icon: Clock,
                  title: "Same Day",
                  description: "Fast response time",
                },
                {
                  icon: Shield,
                  title: "Safe Service",
                  description: "Trained technicians",
                },
                {
                  icon: Wrench,
                  title: "Quality Parts",
                  description: "Premium springs",
                },
                {
                  icon: Check,
                  title: "Guaranteed",
                  description: "Parts & labor warranty",
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

        {/* Warning Signs Section */}
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
                Warning Signs
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-4">
                Signs Your Spring Needs Replacement
              </h2>
              <p className="text-ocean-600 max-w-2xl mx-auto">
                Recognizing the signs of a failing or broken spring can help you
                address the problem before it becomes a safety hazard.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {warningSignsData.map((sign, index) => (
                <motion.div
                  key={sign.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-sand-50 p-6 border-l-4 border-red-500"
                >
                  <sign.icon className="w-8 h-8 text-red-500 mb-3" />
                  <h3 className="font-heading text-xl text-ocean-900 mb-2">
                    {sign.title}
                  </h3>
                  <p className="text-ocean-600">{sign.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Spring Types Section */}
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
                Spring Types
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-ocean-900">
                Types of Garage Door Springs
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {springTypes.map((spring, index) => (
                <motion.div
                  key={spring.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 shadow-sm"
                >
                  <h3 className="font-heading text-2xl text-ocean-900 mb-3">
                    {spring.title}
                  </h3>
                  <p className="text-ocean-600 mb-4">{spring.description}</p>
                  <ul className="space-y-2">
                    {spring.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary-500 shrink-0" />
                        <span className="text-ocean-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Features Section */}
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
                  Our Service
                </span>
                <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-6">
                  Complete Spring Replacement Service
                </h2>
                <p className="text-ocean-600 mb-8">
                  Our spring replacement service goes beyond just swapping out
                  the broken spring. We perform a complete system inspection and
                  ensure your door operates safely and smoothly.
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {serviceFeatures.map((feature) => (
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
                    src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop"
                    alt="Garage door spring system"
                    className="w-full aspect-video object-cover"
                  />
                </div>
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop"
                    alt="Professional technician"
                    className="w-full aspect-square object-cover"
                  />
                </div>
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1590479773265-7464e5d48118?q=80&w=2070&auto=format&fit=crop"
                    alt="Quality tools and parts"
                    className="w-full aspect-square object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Safety Section */}
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
                Safety First
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-white mb-4">
                Why Professional Service Matters
              </h2>
              <p className="text-primary-200 max-w-2xl mx-auto">
                Garage door springs are one of the most dangerous components to
                work with. Here&apos;s why you should always call a professional.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {safetyInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-primary-900/50 p-8 border-t-2 border-primary-400"
                >
                  <AlertTriangle className="w-8 h-8 text-primary-400 mb-4" />
                  <h3 className="font-heading text-xl text-white mb-3">
                    {info.title}
                  </h3>
                  <p className="text-primary-200">{info.description}</p>
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
