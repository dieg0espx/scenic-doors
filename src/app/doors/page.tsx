"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    number: "01",
    title: "Ultra Slim Multi-Slide",
    description:
      "Our premier minimalist sliding door system with ultra-thin sightlines. Engineered to maximize your views with ultra-narrow frames and expansive glass panels.",
    image: "/images/products/ultra-slim/evening-at-beach.avif",
    href: "/doors/ultra-slim",
  },
  {
    number: "02",
    title: "Multi-Slide Patio Doors",
    description:
      "Effortless operation meets expansive design. Multiple panels slide smoothly along durable tracks and stack in-line or into a wall pocket for wide openings.",
    image: "/images/products/multi-slide/header.avif",
    href: "/doors/multi-slide",
  },
  {
    number: "03",
    title: "Bi-Fold Doors",
    description:
      "Transform your living space with panels that fold and stack neatly, creating maximum opening width. Perfect for kitchen expansions and indoor-outdoor living.",
    image: "/images/products/folding/steel-home.avif",
    href: "/doors/folding",
  },
  {
    number: "04",
    title: "Slide & Stack Patio Doors",
    description:
      "Designed for maximum versatility with panels that glide and stack neatly out of the way. Features 90° corner options without mullion for dramatic views.",
    image: "/images/products/slide-stack/left-right-open.avif",
    href: "/doors/slide-stack",
  },
  {
    number: "05",
    title: "Pocket Patio Doors",
    description:
      "The ultimate choice for seamless indoor-outdoor living. Panels glide completely into the wall and out of sight, maximizing usable space with minimalist aesthetics.",
    image: "/images/products/pocket/header.avif",
    href: "/doors/pocket",
  },
  {
    number: "06",
    title: "Horizontal Fold-Up Windows",
    description:
      "Open up kitchens, bars, and living spaces with a single effortless push. Top panels tilt outward as a protective awning while the bottom sash becomes a counter ledge.",
    image: "/images/products/fold-up-windows/header.jpg",
    href: "/doors/fold-up-windows",
  },
];

export default function DoorsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-primary-900">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="text-primary-300 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                Our Collections
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                Door & Window Collections
              </h1>
              <p className="text-white/70 text-lg">
                Discover our curated selection of premium door and window systems, each
                engineered for coastal living and designed to transform your space
                with seamless indoor-outdoor transitions.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Collections */}
        <section className="py-24 bg-white">
          <div className="section-container">
            <div className="space-y-24">
              {collections.map((collection, index) => (
                <motion.div
                  key={collection.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <Link href={collection.href} className="block group">
                      <div className="relative overflow-hidden">
                        <img
                          src={collection.image}
                          alt={collection.title}
                          className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-ocean-900/0 group-hover:bg-ocean-900/20 transition-colors duration-300" />
                      </div>
                    </Link>
                  </div>

                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <span className="font-heading text-6xl text-primary-300">
                      {collection.number}
                    </span>
                    <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mt-4 mb-4">
                      {collection.title}
                    </h2>
                    <p className="text-ocean-600 mb-8 leading-relaxed">
                      {collection.description}
                    </p>
                    <Link
                      href={collection.href}
                      className="inline-flex items-center gap-2 text-ocean-900 font-medium hover:text-primary-600 transition-colors group"
                    >
                      Explore Collection
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
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
