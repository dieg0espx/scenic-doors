"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Introduction() {
  return (
    <section className="py-24 md:py-32 bg-cream relative overflow-hidden">
      {/* Decorative vertical line */}
      <div className="absolute left-8 md:left-16 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-wood-300 to-transparent opacity-50" />

      <div className="section-container">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Left - Large Quote */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5"
          >
            <div className="sticky top-32">
              <span className="font-heading text-[120px] md:text-[180px] text-wood-200 leading-none block -ml-4">
                "
              </span>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-ocean-900 leading-tight -mt-16 md:-mt-24">
                A door is more than a passage—
                <span className="text-wood-600 block mt-2">it's a statement.</span>
              </h2>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 lg:pl-12"
          >
            {/* Image with offset */}
            <div className="relative mb-12">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
                  alt="Luxury home with panoramic doors"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Offset accent */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-wood-400 -z-10" />
            </div>

            {/* Text blocks */}
            <div className="space-y-6 text-ocean-700 leading-relaxed">
              <p className="text-lg">
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
            <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-sand-300">
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
              className="mt-10"
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-3 text-ocean-900 font-medium group"
              >
                <span className="relative">
                  Discover Our Story
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-wood-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
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
      <p className="font-heading text-3xl md:text-4xl text-ocean-900">{number}</p>
      <p className="text-ocean-500 text-sm mt-1">{label}</p>
    </div>
  );
}
