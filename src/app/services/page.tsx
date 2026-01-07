"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import { useQuoteModal } from "@/context/QuoteModalContext";
import {
  Wrench,
  Home,
  Settings,
  Zap,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    title: "Garage Door Repair",
    description:
      "Fast, reliable repair services for all garage door issues. From broken springs to off-track doors, we fix it all.",
    href: "/services/garage-door-repair",
    icon: Wrench,
    features: ["Same-day service", "All brands", "90-day warranty"],
  },
  {
    title: "Garage Door Installation",
    description:
      "Professional installation of new garage doors. We carry top brands and styles to match any home.",
    href: "/services/garage-door-installation",
    icon: Home,
    features: ["Free consultation", "Premium brands", "Full warranty"],
  },
  {
    title: "Opener Services",
    description:
      "Repair and installation of garage door openers. From basic repairs to smart home integration.",
    href: "/services/opener-services",
    icon: Settings,
    features: ["Smart openers", "All brands", "WiFi integration"],
  },
  {
    title: "Spring Replacement",
    description:
      "Safe, professional spring replacement by trained technicians. We use high-quality springs for lasting performance.",
    href: "/services/spring-replacement",
    icon: Zap,
    features: ["Same-day service", "Premium springs", "Safety first"],
  },
  {
    title: "Emergency Service",
    description:
      "24/7 emergency garage door service. When your door breaks at the worst time, we're here to help.",
    href: "/services/emergency-service",
    icon: AlertTriangle,
    features: ["24/7 available", "Fast response", "All emergencies"],
    emergency: true,
  },
];

export default function ServicesPage() {
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
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                Our Services
              </h1>
              <p className="text-white/70 text-lg mb-8">
                Professional garage door services for residential and commercial
                properties. From repairs to new installations, our experienced
                technicians deliver quality workmanship you can trust.
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

        {/* Services Grid Section */}
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
                What We Offer
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-4">
                Complete Garage Door Solutions
              </h2>
              <p className="text-ocean-600 max-w-2xl mx-auto">
                Whether you need a quick repair or a complete garage door
                replacement, we have the expertise and equipment to get the job
                done right.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={service.href}
                    className={`block h-full p-8 border-l-4 transition-all hover:shadow-lg ${
                      service.emergency
                        ? "bg-red-50 border-red-500 hover:bg-red-100"
                        : "bg-sand-50 border-primary-500 hover:bg-sand-100"
                    }`}
                  >
                    <service.icon
                      className={`w-10 h-10 mb-4 ${
                        service.emergency ? "text-red-500" : "text-primary-500"
                      }`}
                    />
                    <h3 className="font-heading text-2xl text-ocean-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-ocean-600 mb-4">{service.description}</p>
                    <ul className="flex flex-wrap gap-2 mb-4">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className={`text-sm px-3 py-1 ${
                            service.emergency
                              ? "bg-red-100 text-red-700"
                              : "bg-primary-100 text-primary-700"
                          }`}
                        >
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        service.emergency ? "text-red-600" : "text-primary-600"
                      }`}
                    >
                      Learn More <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
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
                  Why Choose Us
                </span>
                <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-6">
                  Trusted Garage Door Professionals
                </h2>
                <p className="text-ocean-600 mb-8">
                  With years of experience serving our community, we&apos;ve
                  built a reputation for quality work, fair pricing, and
                  exceptional customer service. When you choose us, you&apos;re
                  choosing peace of mind.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { number: "1000+", label: "Repairs Completed" },
                    { number: "500+", label: "Doors Installed" },
                    { number: "24/7", label: "Emergency Service" },
                    { number: "100%", label: "Satisfaction Guarantee" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="font-heading text-3xl text-primary-500 mb-1">
                        {stat.number}
                      </p>
                      <p className="text-ocean-600 text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>
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
                    alt="Professional garage door service"
                    className="w-full aspect-video object-cover"
                  />
                </div>
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop"
                    alt="Technician at work"
                    className="w-full aspect-square object-cover"
                  />
                </div>
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1558036117-15d82a90b9b1?q=80&w=2070&auto=format&fit=crop"
                    alt="Quality garage door"
                    className="w-full aspect-square object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Service Areas Mention */}
        <section className="py-16 bg-primary-600">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="font-heading text-2xl md:text-3xl text-white mb-4">
                Serving Your Area
              </h2>
              <p className="text-primary-200 mb-6 max-w-2xl mx-auto">
                We provide garage door services throughout the region. Check our
                service areas to see if we cover your location.
              </p>
              <Link
                href="/service-areas"
                className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 font-medium hover:bg-primary-50 transition-colors"
              >
                View Service Areas <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
