"use client";

import { motion } from "framer-motion";
import { FileText, DraftingCompass, Package } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Quote",
    description:
      "Start with a complimentary consultation. We'll assess your space, discuss your vision, and provide a detailed quote tailored to your project.",
    icon: FileText,
  },
  {
    number: "02",
    title: "CAD Drawing",
    description:
      "Our team creates precise CAD drawings to ensure perfect fit and alignment. Review every detail before production begins.",
    icon: DraftingCompass,
  },
  {
    number: "03",
    title: "Door Delivery",
    description:
      "Factory-certified installation by our expert craftsmen. We handle everything from delivery to final inspection.",
    icon: Package,
  },
];

export default function Process() {
  return (
    <section className="py-16 md:py-20 bg-primary-50">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary-500 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
            Our Process
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-ocean-900">
            Simple, Transparent, Professional
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector line - hidden on last item */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-[2px] bg-primary-300/50 -z-10" style={{ width: 'calc(100% - 3rem)' }} />
              )}

              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                {/* Number */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-primary-400 font-heading text-4xl">{step.number}</span>
                  <div className="flex-1 h-[1px] bg-primary-200" />
                </div>

                {/* Icon */}
                <div className="mb-4">
                  <step.icon className="w-10 h-10 text-primary-500" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3 className="font-heading text-xl text-ocean-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-ocean-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
