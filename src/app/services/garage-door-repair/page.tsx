"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import { useQuoteModal } from "@/context/QuoteModalContext";
import { Check, Wrench, Clock, Shield, AlertTriangle } from "lucide-react";

const commonIssues = [
  {
    title: "Broken Springs",
    description:
      "Torsion and extension spring failures are among the most common garage door problems. We carry springs for all door types.",
  },
  {
    title: "Off-Track Doors",
    description:
      "Doors can come off their tracks due to impact, worn rollers, or misaligned tracks. We realign and repair quickly.",
  },
  {
    title: "Damaged Panels",
    description:
      "Weather, accidents, or age can damage panels. We repair or replace individual panels to restore your door's appearance.",
  },
  {
    title: "Cable Problems",
    description:
      "Frayed, broken, or loose cables can cause dangerous operation. Our technicians safely replace and adjust cables.",
  },
  {
    title: "Noisy Operation",
    description:
      "Grinding, squeaking, or rattling noises often indicate worn parts. We diagnose and fix the source of the noise.",
  },
  {
    title: "Opener Malfunctions",
    description:
      "Remote issues, motor problems, or sensor failures. We repair all major opener brands and models.",
  },
];

const repairFeatures = [
  "Same-day service available",
  "All major brands serviced",
  "Fully stocked service vehicles",
  "Transparent upfront pricing",
  "Licensed and insured technicians",
  "90-day repair warranty",
];

const repairProcess = [
  {
    step: "1",
    title: "Diagnosis",
    description:
      "Our technician performs a thorough inspection to identify all issues and provide an accurate assessment.",
  },
  {
    step: "2",
    title: "Quote",
    description:
      "You receive a detailed, upfront quote before any work begins. No hidden fees or surprise charges.",
  },
  {
    step: "3",
    title: "Repair",
    description:
      "Using quality parts and professional tools, we complete the repair efficiently and correctly.",
  },
  {
    step: "4",
    title: "Testing",
    description:
      "We test the entire system to ensure safe, smooth operation and make any final adjustments needed.",
  },
];

export default function GarageDoorRepairPage() {
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
                backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop')`,
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
                Garage Door Repair
              </h1>
              <p className="text-white/70 text-lg mb-8">
                Fast, reliable garage door repair services for all makes and
                models. Our experienced technicians diagnose and fix problems
                quickly, getting your door back to smooth, safe operation.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={openQuoteModal}
                  className="bg-primary-500 text-white px-8 py-4 font-medium tracking-wide hover:bg-primary-400 transition-colors"
                >
                  Schedule Repair
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

        {/* Why Choose Us Section */}
        <section className="py-16 bg-primary-600">
          <div className="section-container">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: Clock,
                  title: "Fast Response",
                  description: "Same-day service available",
                },
                {
                  icon: Wrench,
                  title: "Expert Techs",
                  description: "Trained and certified",
                },
                {
                  icon: Shield,
                  title: "Guaranteed",
                  description: "90-day repair warranty",
                },
                {
                  icon: AlertTriangle,
                  title: "Emergency",
                  description: "24/7 service available",
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
                  Professional Service
                </span>
                <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-6">
                  Reliable Repairs You Can Trust
                </h2>
                <p className="text-ocean-600 mb-8">
                  When your garage door breaks down, you need a repair service
                  that responds quickly and fixes the problem right the first
                  time. Our technicians arrive with fully stocked vehicles,
                  ready to handle most repairs on the spot.
                </p>
                <ul className="space-y-4">
                  {repairFeatures.map((feature) => (
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
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop"
                    alt="Garage door repair service"
                    className="w-full aspect-video object-cover"
                  />
                </div>
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop"
                    alt="Technician working"
                    className="w-full aspect-square object-cover"
                  />
                </div>
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop"
                    alt="Garage door hardware"
                    className="w-full aspect-square object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Common Issues Section */}
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
                We Fix It All
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-ocean-900">
                Common Garage Door Problems
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {commonIssues.map((issue, index) => (
                <motion.div
                  key={issue.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 shadow-sm"
                >
                  <h3 className="font-heading text-xl text-ocean-900 mb-3">
                    {issue.title}
                  </h3>
                  <p className="text-ocean-600">{issue.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Repair Process Section */}
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
                How It Works
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {repairProcess.map((step, index) => (
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
