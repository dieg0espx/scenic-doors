"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-ocean-900">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc%2F68802acea296d5bb4690542e_scenic_homepage_hero2_1080-transcode.mp4"
            type="video/mp4"
          />
        </video>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-ocean-900/50" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 xl:px-20">
        <div className="max-w-2xl">
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-4"
          >
            <span className="block font-heading text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-[0.9] tracking-tight">
              Scenic Doors & Windows
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-2xl md:text-3xl lg:text-4xl text-primary-400 font-medium italic mb-6"
          >
            "Bringing the Outdoors In"
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-white/80 max-w-lg mb-10 leading-relaxed"
          >
            Engineered for coastal beauty, energy efficiency, and effortless indoor-outdoor living.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="https://app.scenicdoors.co/quote/start"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-primary-500 text-white px-8 py-4 font-medium tracking-wide overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Your Instant Quote Now!
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-primary-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>
            <a
              href="tel:818-427-6690"
              className="group border-2 border-white/30 text-white px-8 py-4 font-medium tracking-wide hover:bg-white hover:text-ocean-900 transition-all duration-300"
            >
              Call Now! 818-427-6690
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom Accent Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600" />
    </section>
  );
}
