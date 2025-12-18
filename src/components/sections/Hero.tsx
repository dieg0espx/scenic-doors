"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-ocean-900">
      {/* Split Background - Image on Right */}
      <div className="absolute inset-0 grid lg:grid-cols-2">
        {/* Left - Solid with texture */}
        <div className="hidden lg:block relative bg-ocean-900">
          {/* Wood grain accent */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-wood-600/20 to-transparent" />
          <div className="absolute right-0 top-1/4 w-1 h-48 bg-wood-500" />
          <div className="absolute right-0 bottom-1/4 w-1 h-32 bg-wood-400" />
        </div>

        {/* Right - Image */}
        <div className="relative">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop')`,
            }}
          />
          {/* Diagonal overlay for blend */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-ocean-900 via-ocean-900/80 to-transparent lg:from-ocean-900 lg:via-ocean-900/60 lg:to-ocean-900/20"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 xl:px-20 py-24 pt-32">
        <div className="max-w-2xl">
          {/* Eyebrow with line */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-12 h-[2px] bg-wood-500" />
            <span className="text-wood-400 font-medium tracking-[0.2em] uppercase text-xs">
              Est. 1998 • Southern California
            </span>
          </motion.div>

          {/* Main Headline - Large & Bold */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <span className="block font-heading text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-[0.9] tracking-tight">
              Doors
            </span>
            <span className="block font-heading text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-tight mt-2">
              <span className="text-wood-400">That</span>{" "}
              <span className="text-white italic">Transform</span>
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg text-white/70 max-w-md mb-10 leading-relaxed"
          >
            Premium folding, sliding & pivot door systems.
            Crafted installations for architects and homeowners who refuse to compromise.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/doors"
              className="group relative bg-wood-500 text-white px-8 py-4 font-medium tracking-wide overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                View Collections
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-wood-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            <Link
              href="/quote"
              className="group border-2 border-white/30 text-white px-8 py-4 font-medium tracking-wide hover:bg-white hover:text-ocean-900 transition-all duration-300"
            >
              Free Consultation
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom Accent Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-wood-600 via-wood-400 to-wood-600" />
    </section>
  );
}
