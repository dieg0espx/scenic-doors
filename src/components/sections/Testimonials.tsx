"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Scenic Doors transformed our entire home. The folding glass wall they installed opened our living room to the backyard in a way we never imagined possible. Their team was professional, meticulous, and a pleasure to work with.",
    author: "Michael & Sarah T.",
    location: "Newport Beach",
    project: "Folding Glass Wall",
  },
  {
    quote:
      "As an architect, I'm extremely particular about contractors. Scenic Doors has become my go-to for every high-end residential project. Their installation quality is impeccable.",
    author: "David R., AIA",
    location: "Los Angeles",
    project: "Multiple Projects",
  },
  {
    quote:
      "The pivot door Scenic installed is now the centerpiece of our home's entry. Every guest comments on it. Worth every penny for the craftsmanship and the 'wow' factor.",
    author: "Jennifer L.",
    location: "La Jolla",
    project: "Pivot Entry Door",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-primary-800 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full">
        <div className="absolute inset-0 bg-gradient-to-l from-primary-900/30 to-transparent" />
      </div>

      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-[1px] bg-primary-400" />
            <Quote className="w-6 h-6 text-primary-300" />
            <div className="w-12 h-[1px] bg-primary-400" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            Trusted by Southern California's
            <span className="block text-primary-300">Most Discerning Homeowners</span>
          </h2>
          <p className="text-primary-200">
            Don't just take our word for it. Here's what our clients have to say.
          </p>
        </motion.div>

        {/* Testimonials */}
        <div className="space-y-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`flex ${index % 2 === 1 ? "md:justify-end" : ""}`}
            >
              <div className={`bg-primary-900/50 backdrop-blur-sm p-8 md:p-10 max-w-2xl relative ${index % 2 === 1 ? "md:mr-12" : "md:ml-12"}`}>
                {/* Quote mark */}
                <span className="absolute -top-4 -left-2 font-heading text-7xl text-primary-400/30">
                  "
                </span>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary-300 text-primary-300" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-white/90 leading-relaxed mb-6 text-lg">
                  {testimonial.quote}
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{testimonial.author}</p>
                    <p className="text-primary-200 text-sm">{testimonial.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary-300 text-sm">{testimonial.project}</p>
                  </div>
                </div>

                {/* Accent line */}
                <div className="absolute bottom-0 left-0 w-24 h-1 bg-primary-400" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
