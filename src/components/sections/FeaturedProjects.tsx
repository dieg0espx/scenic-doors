"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const featuredProject = {
  title: "Malibu Estate",
  type: "Folding Glass Wall",
  image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_2000/scenic_doors_HDR_2_enszw2",
};

export default function FeaturedProjects() {
  return (
    <section className="py-16 md:py-20 bg-primary-50">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-ocean-900">
            Scenic Doors Projects
          </h2>
        </motion.div>

        {/* Single Featured Project */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <FeaturedProjectCard project={featuredProject} aspectRatio="aspect-[16/9]" />
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedProjectCard({
  project,
  aspectRatio,
}: {
  project: typeof featuredProject;
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
      <div className="absolute inset-0 bg-ocean-900/60" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white drop-shadow-lg">{project.title}</h3>
      </div>

      {/* Arrow */}
      <div className="absolute top-4 right-4 w-10 h-10 bg-white/0 group-hover:bg-white flex items-center justify-center transition-colors duration-300">
        <ArrowUpRight className="w-5 h-5 text-white group-hover:text-ocean-900 transition-colors" />
      </div>
    </div>
  );
}

