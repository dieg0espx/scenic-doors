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
    title: "Folding Glass Walls",
    description:
      "Transform entire walls into seamless indoor-outdoor transitions. Our folding systems stack effortlessly, maximizing your opening and your view.",
    image:
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070&auto=format&fit=crop",
    href: "/doors/folding",
  },
  {
    number: "02",
    title: "Multi-Slide Systems",
    description:
      "Effortless operation meets expansive design. Multi-slide systems offer unparalleled flexibility for large openings while maintaining clean architectural lines.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
    href: "/doors/multi-slide",
  },
  {
    number: "03",
    title: "Pivot Entry Doors",
    description:
      "Make a statement from the moment guests arrive. Our pivot doors combine engineering precision with bold architectural presence.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2032&auto=format&fit=crop",
    href: "/doors/pivot",
  },
];

export default function DoorsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-ocean-900">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="text-wood-400 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                Our Collections
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                Door Collections
              </h1>
              <p className="text-white/70 text-lg">
                Discover our curated selection of premium door systems, each
                designed to transform your living space and elevate your home's
                architecture.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Collections */}
        <section className="py-24 bg-cream">
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
                    <span className="font-heading text-6xl text-wood-300">
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
                      className="inline-flex items-center gap-2 text-ocean-900 font-medium hover:text-wood-600 transition-colors group"
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
