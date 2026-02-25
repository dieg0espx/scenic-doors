"use client";

import { motion } from "framer-motion";
import {
  Award,
  Target,
  HeartHandshake,
  Handshake,
  Clock,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Manufacturer Certified",
    description:
      "Factory-trained technicians ensure every installation meets exact specifications and warranty requirements.",
  },
  {
    icon: Target,
    title: "Precision Installation",
    description:
      "Meticulous attention to alignment, weatherproofing, and operation. Every detail must be perfect.",
  },
  {
    icon: HeartHandshake,
    title: "Comprehensive Service",
    description:
      "From initial consultation through post-installation support, we guide you through every step.",
  },
  {
    icon: Handshake,
    title: "Premium Partnerships",
    description:
      "Authorized dealers for LaCantina, Western Window Systems, Fleetwood, and more.",
  },
  {
    icon: Clock,
    title: "25+ Years Experience",
    description:
      "Thousands of successful installations have made us Southern California's most trusted experts.",
  },
  {
    icon: ShieldCheck,
    title: "Warranty Protection",
    description:
      "Our workmanship guarantee complements manufacturer warranties for complete peace of mind.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-20 bg-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="section-container relative">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left - Sticky header */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-4"
          >
            <div className="lg:sticky lg:top-32">
              <span className="text-primary-500 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                Why Choose Us
              </span>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-ocean-900 mb-4">
                The Scenic Doors
                <span className="text-primary-500 block">Difference</span>
              </h2>
              <p className="text-ocean-600 leading-relaxed">
                Experience the craftsmanship and dedication that has made us
                Southern California's most trusted door installation experts
                for over two decades.
              </p>
              {/* Decorative element */}
              <div className="mt-6 flex items-center gap-4">
                <div className="w-16 h-[2px] bg-primary-500" />
                <span className="text-ocean-400 text-sm">Est. 1998</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Features grid */}
          <div className="lg:col-span-8">
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 group hover:shadow-xl transition-shadow duration-500 relative overflow-hidden"
                >
                  {/* Hover accent */}
                  <div className="absolute top-0 left-0 w-1 h-0 bg-primary-500 group-hover:h-full transition-all duration-500" />

                  <feature.icon className="w-8 h-8 text-primary-500 mb-4" strokeWidth={1.5} />
                  <h3 className="font-heading text-xl text-ocean-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-ocean-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
