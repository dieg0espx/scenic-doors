"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import { useQuoteModal } from "@/context/QuoteModalContext";
import {
  Check,
  Phone,
  Clock,
  Shield,
  Truck,
  AlertTriangle,
  Zap,
  Wrench,
  Lock,
  CloudLightning,
  CircleOff,
  Cable,
} from "lucide-react";

const emergencyServices = [
  {
    title: "Broken Springs",
    description:
      "Trapped inside or outside? We carry springs for all door types for immediate replacement.",
    icon: Zap,
  },
  {
    title: "Door Off Track",
    description:
      "Safety hazard? We safely realign and secure your door quickly.",
    icon: CircleOff,
  },
  {
    title: "Opener Failure",
    description:
      "Can't get out? We repair or replace openers to get you moving.",
    icon: Wrench,
  },
  {
    title: "Broken Cables",
    description:
      "Dangerous situation? We replace cables safely and restore operation.",
    icon: Cable,
  },
  {
    title: "Weather Damage",
    description:
      "Storm damage? We provide immediate temporary and permanent solutions.",
    icon: CloudLightning,
  },
  {
    title: "Security Issues",
    description:
      "Door won't lock? We restore security to protect your home.",
    icon: Lock,
  },
];

export default function EmergencyServicePage() {
  const { openQuoteModal } = useQuoteModal();

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-ocean-900 relative overflow-hidden">
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/50 via-ocean-900 to-ocean-900" />
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
                className="text-primary-300 text-sm mb-6 inline-block hover:text-primary-200 transition-colors"
              >
                ← Back to Services
              </Link>

              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                Emergency Garage Door Service
              </h1>

              <p className="text-white/70 text-lg mb-8 max-w-2xl">
                Garage door stuck? Spring broken? We respond fast, 24 hours a
                day, 7 days a week. Our technicians arrive with fully stocked
                trucks to fix most problems on the spot.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <a
                  href="tel:818-427-6690"
                  className="bg-primary-500 text-white px-8 py-4 font-medium tracking-wide hover:bg-primary-400 transition-all flex items-center justify-center gap-3"
                >
                  <Phone className="w-5 h-5" />
                  Call Now: 818-427-6690
                </a>
                <button
                  onClick={openQuoteModal}
                  className="border border-white/30 text-white px-8 py-4 font-medium tracking-wide hover:bg-white/10 transition-all"
                >
                  Request Callback
                </button>
              </div>

              {/* Trust Points */}
              <div className="flex flex-wrap gap-x-8 gap-y-3 text-white/60 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary-400" />
                  <span>24/7 Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary-400" />
                  <span>Fast Response</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary-400" />
                  <span>Licensed & Insured</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-6 bg-primary-600">
          <div className="section-container">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-white">
              {[
                { icon: Shield, text: "Licensed & Insured" },
                { icon: Clock, text: "Average 15 Min Response" },
                { icon: Check, text: "Satisfaction Guaranteed" },
                { icon: Truck, text: "Fully Stocked Trucks" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2">
                  <item.icon className="w-5 h-5 text-primary-200" />
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency Services Grid */}
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
                We Handle It All
              </span>
              <h2 className="font-heading text-4xl md:text-5xl text-ocean-900 mb-4">
                Common Emergencies
              </h2>
              <p className="text-ocean-600 max-w-2xl mx-auto text-lg">
                No matter what garage door emergency you&apos;re facing, our
                team has seen it and fixed it.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emergencyServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-sand-50 p-8 hover:bg-primary-50 transition-colors border-b-4 border-transparent hover:border-primary-500"
                >
                  <div className="w-14 h-14 bg-primary-100 text-primary-600 flex items-center justify-center mb-5 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading text-xl text-ocean-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-ocean-600">{service.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Mid-page CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <p className="text-ocean-600 mb-4">
                Experiencing one of these issues?
              </p>
              <a
                href="tel:818-427-6690"
                className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 font-medium hover:bg-primary-400 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call 818-427-6690 Now
              </a>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
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
                Fast Response
              </span>
              <h2 className="font-heading text-4xl md:text-5xl text-ocean-900">
                How We Help
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "You Call",
                  description:
                    "Call our 24/7 emergency line. A real person answers - no phone trees.",
                  icon: Phone,
                },
                {
                  step: "02",
                  title: "We Dispatch",
                  description:
                    "The nearest technician with a fully-stocked truck is dispatched.",
                  icon: Truck,
                },
                {
                  step: "03",
                  title: "Quick Arrival",
                  description:
                    "Our tech arrives fast, diagnoses the problem, and gives you an upfront quote.",
                  icon: Clock,
                },
                {
                  step: "04",
                  title: "Problem Solved",
                  description:
                    "Most repairs completed on the spot. Your door works, your home is secure.",
                  icon: Check,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary-500 text-white flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <span className="text-primary-500 font-medium text-sm mb-2 block">
                    Step {item.step}
                  </span>
                  <h3 className="font-heading text-xl text-ocean-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-ocean-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Tips + CTA */}
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
                  Stay Safe
                </span>
                <h2 className="font-heading text-4xl md:text-5xl text-ocean-900 mb-6">
                  While You Wait
                </h2>
                <p className="text-ocean-600 text-lg mb-8">
                  Your safety is the priority. Follow these guidelines while
                  waiting for our technician to arrive.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      title: "Don't Force the Door",
                      description:
                        "Never try to force a stuck door. This can cause injury or further damage.",
                    },
                    {
                      title: "Disconnect the Opener",
                      description:
                        "If safe, pull the emergency release cord to disconnect the opener.",
                    },
                    {
                      title: "Keep the Area Clear",
                      description:
                        "Keep children and pets away. A damaged door can move unexpectedly.",
                    },
                  ].map((tip, index) => (
                    <motion.div
                      key={tip.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="w-10 h-10 bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg text-ocean-900 mb-1">
                          {tip.title}
                        </h3>
                        <p className="text-ocean-600">{tip.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Emergency CTA Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-primary-800 p-10 md:p-12 text-center relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary-600/30 rounded-full blur-[60px]" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-500/20 rounded-full blur-[40px]" />

                  <div className="relative">
                    <div className="flex items-center justify-center gap-2 text-red-400 mb-6">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      <span className="text-sm font-medium uppercase tracking-wide">
                        24/7 Emergency Line
                      </span>
                    </div>
                    <h3 className="font-heading text-3xl md:text-4xl text-white mb-4">
                      Need Help Now?
                    </h3>
                    <p className="text-primary-200 mb-8 text-lg">
                      Our emergency team is standing by around the clock. Fast
                      response, guaranteed.
                    </p>
                    <a
                      href="tel:818-427-6690"
                      className="inline-flex items-center justify-center gap-3 bg-white text-primary-800 px-10 py-5 font-semibold text-lg hover:bg-primary-50 transition-colors w-full md:w-auto"
                    >
                      <Phone className="w-6 h-6" />
                      818-427-6690
                    </a>
                    <p className="text-primary-300 text-sm mt-4">
                      Average response time: 15 minutes
                    </p>
                  </div>
                </div>
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
