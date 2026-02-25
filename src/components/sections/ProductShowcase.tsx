"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const products = [
  {
    id: 1,
    title: "Multi-Slide Systems",
    description:
      "Each glass wall system is engineered to operate in the most extreme conditions while delivering energy-efficiency, superior security and interior comfort.",
    images: [
      {
        src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop",
        caption: "Seamless Operation",
      },
      {
        src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
        caption: "Energy Efficient",
      },
      {
        src: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2070&auto=format&fit=crop",
        caption: "Weather Resistant",
      },
    ],
    href: "/doors/multi-slide",
  },
  {
    id: 2,
    title: "Bifold / Folding Doors",
    description:
      "Transform entire walls into seamless indoor-outdoor transitions. Our folding systems stack effortlessly, maximizing your opening and your view.",
    images: [
      {
        src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
        caption: "Maximum Opening",
      },
      {
        src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
        caption: "Indoor-Outdoor",
      },
      {
        src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop",
        caption: "Premium Design",
      },
    ],
    href: "/doors/folding",
  },
  {
    id: 3,
    title: "Slide & Stack Systems",
    description:
      "The ultimate in flexibility. Slide panels stack to one or both sides, creating massive openings that blur the line between indoors and out.",
    images: [
      {
        src: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2070&auto=format&fit=crop",
        caption: "Flexible Design",
      },
      {
        src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
        caption: "Stacking System",
      },
      {
        src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
        caption: "Open Living",
      },
    ],
    href: "/doors/slide-stack",
  },
  {
    id: 4,
    title: "Pivot Entry Doors",
    description:
      "Make a statement from the moment guests arrive. Our pivot doors combine engineering precision with bold architectural presence.",
    images: [
      {
        src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
        caption: "Architectural",
      },
      {
        src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop",
        caption: "Precision",
      },
      {
        src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
        caption: "Statement Entry",
      },
    ],
    href: "/doors/pivot",
  },
];

export default function ProductShowcase() {
  return (
    <section className="w-full bg-white">
      {products.map((product, index) => (
        <div key={product.id} className="w-full">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-16 md:py-20">
              {/* Left Column - Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-2 lg:order-1"
              >
                <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-ocean-900 mb-6">
                  {product.title}
                </h2>
                <p className="text-ocean-600 leading-relaxed text-lg mb-8">
                  {product.description}
                </p>
                <Link
                  href={product.href}
                  className="inline-flex items-center gap-2 text-primary-500 font-medium group text-lg"
                >
                  <span>Explore {product.title}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {/* Right Column - Images */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="order-1 lg:order-2"
              >
                <div className="grid grid-cols-3 gap-4">
                  {product.images.map((img, imgIndex) => (
                    <div key={imgIndex} className="space-y-3">
                      <div className="aspect-[4/5] overflow-hidden rounded-lg">
                        <img
                          src={img.src}
                          alt={img.caption}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <p className="text-primary-500 text-sm font-medium text-center">
                        {img.caption}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Divider between products */}
          {index < products.length - 1 && (
            <div className="w-full border-t border-sand-200" />
          )}
        </div>
      ))}
    </section>
  );
}
