"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const doors = [
  {
    number: "01",
    title: "Multi-Slide Systems",
    shortTitle: "Multi-Slide",
    description:
      "Effortless operation meets expansive design. Multi-slide systems offer unparalleled flexibility for large openings while maintaining clean architectural lines.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop",
    href: "/doors/multi-slide",
  },
  {
    number: "02",
    title: "Bifold / Folding Doors",
    shortTitle: "Bifold/Folding",
    description:
      "Transform entire walls into seamless indoor-outdoor transitions. Our folding systems stack effortlessly, maximizing your opening and your view.",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
    href: "/doors/folding",
  },
  {
    number: "03",
    title: "Slide & Stack Systems",
    shortTitle: "Slide & Stack",
    description:
      "The ultimate in flexibility. Slide panels stack to one or both sides, creating massive openings that blur the line between indoors and out.",
    image:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2070&auto=format&fit=crop",
    href: "/doors/slide-stack",
  },
  {
    number: "04",
    title: "Pivot Entry Doors",
    shortTitle: "Pivot",
    description:
      "Make a statement from the moment guests arrive. Our pivot doors combine engineering precision with bold architectural presence.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    href: "/doors/pivot",
  },
];

export default function DoorCollections() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-400/10 via-transparent to-primary-500/10" />
      
      {/* Section Header */}
      <div className="section-container mb-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <span className="text-primary-100 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
              Our Collections
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white drop-shadow-lg">
              Four Ways to<br />
              <span className="text-primary-50">Transform Your Space</span>
            </h2>
          </div>
          <Link
            href="/doors"
            className="text-white/60 hover:text-white transition-colors inline-flex items-center gap-2 group text-sm"
          >
            View All Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Door Cards - Horizontal Scroll on Mobile, Grid on Desktop */}
      <div className="section-container relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {doors.map((door, index) => (
            <motion.div
              key={door.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <Link href={door.href} className="block group">
                {/* Number */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-primary-400 font-heading text-5xl">{door.number}</span>
                  <div className="flex-1 h-[1px] bg-primary-700 group-hover:bg-primary-400 transition-colors" />
                </div>

                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden mb-4">
                  <img
                    src={door.image}
                    alt={door.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/20 transition-colors duration-500" />
                  {/* Arrow */}
                  <div className="absolute bottom-4 right-4 w-12 h-12 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight className="w-5 h-5 text-ocean-900" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-heading text-2xl text-white mb-3">
                  {door.title}
                </h3>
                <p className="text-primary-200 text-sm leading-relaxed">
                  {door.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-400/50 to-transparent" />
    </section>
  );
}
