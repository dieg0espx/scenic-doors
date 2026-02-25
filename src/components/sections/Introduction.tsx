"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Introduction() {
  return (
    <section className="py-12 md:py-16 bg-white relative overflow-hidden">
      <div className="section-container">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="aspect-[4/3] overflow-hidden w-full max-w-3xl mx-auto lg:mx-0">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
                alt="Luxury home with panoramic doors"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Offset accent */}
            <div className="absolute -bottom-3 -right-3 w-full h-full border-2 border-primary-400 -z-10" />
          </motion.div>

          {/* Right - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-between"
          >
            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-ocean-900 leading-tight">
                <span className="text-primary-500">"</span>A door is more than a passage—
                <span className="text-primary-500 block">it's a statement.</span>
              </h2>
            </motion.div>

            {/* Text blocks */}
            <div className="space-y-4 text-ocean-700 leading-relaxed mb-6">
              <p className="text-base">
                It's the seamless connection between your interior sanctuary and
                the world beyond. Since 1998, we've partnered with Southern
                California's most discerning homeowners, architects, and builders.
              </p>
              <p>
                We install door systems that don't just function beautifully—they
                inspire. We're not just installers. We're craftsmen, consultants,
                and perfectionists who won't rest until every panel glides
                flawlessly and every sight line is unobstructed.
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-sand-300 mb-6">
              <Stat number="25+" label="Years of Excellence" />
              <Stat number="1000+" label="Projects Completed" />
              <Stat number="100%" label="Client Satisfaction" />
            </div>

            {/* Link */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-3 text-ocean-900 font-medium group"
              >
                <span className="relative">
                  Discover Our Story
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <p className="font-heading text-4xl md:text-5xl lg:text-6xl text-ocean-900">{number}</p>
      <p className="text-ocean-500 text-sm mt-1">{label}</p>
    </div>
  );
}
