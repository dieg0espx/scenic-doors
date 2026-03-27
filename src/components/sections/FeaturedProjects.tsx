"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const featuredProject = {
  title: "Malibu Estate",
  type: "Folding Glass Wall",
  image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_2000/scenic_doors_HDR_2_enszw2",
};

const galleryImages = [
  {
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_15_ddqcxd",
  },
  {
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_32_jy0fuc",
  },
  {
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_2000/scenic_doors_HDR_26_u8o85i",
  },
];

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
            Project Malibu
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {/* Large item - Featured Project */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="col-span-2 row-span-2"
          >
            <FeaturedProjectCard project={featuredProject} aspectRatio="aspect-square" />
          </motion.div>

          {/* Small items - Gallery Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <GalleryCard image={galleryImages[0].image} aspectRatio="aspect-square" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GalleryCard image={galleryImages[1].image} aspectRatio="aspect-square" />
          </motion.div>

          {/* Medium item - Gallery Link */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="col-span-2"
          >
            <GalleryCard image={galleryImages[2].image} aspectRatio="aspect-[2/1]" />
          </motion.div>
        </div>
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
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="inline-block bg-primary-500 text-white text-xs font-medium px-3 py-1 mb-2">
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

function GalleryCard({
  image,
  aspectRatio,
}: {
  image: string;
  aspectRatio: string;
}) {
  return (
    <Link href="/gallery" className={`relative ${aspectRatio} overflow-hidden group cursor-pointer block`}>
      <img
        src={image}
        alt="View Gallery"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-ocean-900/40 group-hover:bg-ocean-900/60 transition-colors" />

      {/* Hover Content */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-white font-medium text-sm md:text-base">View Gallery</span>
      </div>

      {/* Arrow */}
      <div className="absolute top-4 right-4 w-10 h-10 bg-white/0 group-hover:bg-white flex items-center justify-center transition-colors duration-300">
        <ArrowUpRight className="w-5 h-5 text-white group-hover:text-ocean-900 transition-colors" />
      </div>
    </Link>
  );
}
