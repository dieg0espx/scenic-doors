"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const featuredProject = {
  title: "Malibu Estate",
  video: "https://res.cloudinary.com/dku1gnuat/video/upload/v1774891082/HERO_1_lv39mo.mp4",
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
    <div className={`relative ${aspectRatio} overflow-hidden group cursor-pointer rounded-lg`}>
      {/* Video Background */}
      <video
        src={project.video}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/90 via-ocean-900/20 to-transparent" />

      {/* Styled Text Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16">
        <div className="backdrop-blur-sm bg-white/10 inline-block px-6 py-3 rounded-lg border border-white/20">
          <h3 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-bold tracking-tight">
            {project.title}
          </h3>
        </div>
      </div>

      {/* Arrow */}
      <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white border border-white/20 flex items-center justify-center transition-all duration-300">
        <ArrowUpRight className="w-6 h-6 text-white group-hover:text-ocean-900 transition-colors" />
      </div>
    </div>
  );
}

