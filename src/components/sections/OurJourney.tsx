"use client";

import { motion } from "framer-motion";
import { Lightbulb, Award, TrendingUp } from "lucide-react";

const milestones = [
  {
    icon: Lightbulb,
    year: "1998",
    title: "Started as Installers",
    description:
      "We began as a small team of skilled installers, working with various door manufacturers across Southern California. We saw firsthand what worked—and what didn't.",
  },
  {
    icon: TrendingUp,
    year: "Early 2000s",
    title: "Recognized the Problem",
    description:
      "After installing thousands of doors, we noticed recurring issues: poor fit, subpar materials, and lackluster customer service. We knew there had to be a better way.",
  },
  {
    icon: Award,
    year: "Today",
    title: "Created Better Solutions",
    description:
      "We partnered exclusively with premium manufacturers and developed our own rigorous installation standards. Now, we deliver products and service that exceed expectations.",
  },
];

export default function OurJourney() {
  return (
    <section className="py-16 md:py-20 bg-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <span className="text-primary-500 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
            Our Journey
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-ocean-900 mb-6">
            From Installers to Innovators
          </h2>
          <p className="text-ocean-600 leading-relaxed">
            Our story began with a simple observation: too many homeowners were
            settling for doors that didn't meet their expectations. We set out
            to change that.
          </p>
        </motion.div>

        {/* Story Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {/* Timeline connector */}
                {index < milestones.length - 1 && (
                  <div className="absolute left-8 top-20 bottom-0 w-[2px] bg-primary-200" />
                )}

                <div className="flex gap-6 items-start">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                      <milestone.icon className="w-8 h-8 text-primary-600" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <h3 className="font-heading text-2xl text-ocean-900 mb-3">
                      {milestone.title}
                    </h3>
                    <p className="text-ocean-600 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
