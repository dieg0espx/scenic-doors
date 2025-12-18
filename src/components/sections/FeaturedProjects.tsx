"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Malibu Estate",
    type: "Folding Glass Wall",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
    size: "large",
  },
  {
    title: "Beverly Hills",
    type: "Multi-Slide System",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
    size: "small",
  },
  {
    title: "Laguna Beach",
    type: "Pivot Entry Door",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    size: "small",
  },
  {
    title: "Newport Coast",
    type: "Indoor-Outdoor Living",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
    size: "medium",
  },
];

export default function FeaturedProjects() {
  return (
    <section className="py-24 md:py-32 bg-cream">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <span className="text-wood-600 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
              Our Portfolio
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-ocean-900">
              Featured Projects
            </h2>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-ocean-700 font-medium hover:text-wood-600 transition-colors group"
          >
            View All Projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* Large item */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="col-span-2 row-span-2"
          >
            <ProjectCard project={projects[0]} aspectRatio="aspect-square" />
          </motion.div>

          {/* Small items */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ProjectCard project={projects[1]} aspectRatio="aspect-square" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ProjectCard project={projects[2]} aspectRatio="aspect-square" />
          </motion.div>

          {/* Medium items */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="col-span-2"
          >
            <ProjectCard project={projects[3]} aspectRatio="aspect-[2/1]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  aspectRatio,
}: {
  project: (typeof projects)[0];
  aspectRatio: string;
}) {
  return (
    <div className={`relative ${aspectRatio} overflow-hidden group cursor-pointer`}>
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {/* Dark overlay - always visible for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-ocean-900 via-ocean-900/50 to-ocean-900/20" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <span className="inline-block bg-wood-500 text-white text-xs font-medium px-3 py-1 mb-3">
          {project.type}
        </span>
        <h3 className="font-heading text-xl md:text-2xl text-white drop-shadow-lg">{project.title}</h3>
      </div>

      {/* Arrow */}
      <div className="absolute top-4 right-4 w-10 h-10 bg-white/0 group-hover:bg-white flex items-center justify-center transition-colors duration-300">
        <ArrowUpRight className="w-5 h-5 text-white group-hover:text-ocean-900 transition-colors" />
      </div>
    </div>
  );
}
