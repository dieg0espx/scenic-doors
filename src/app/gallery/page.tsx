"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import { X } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Malibu Oceanfront Estate",
    category: "folding",
    type: "Folding Glass Wall",
    location: "Malibu, CA",
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_2000/scenic_doors_HDR_1_c1inxz",
    size: "large",
  },
  {
    id: 2,
    title: "Beverly Hills Modern",
    category: "multi-slide",
    type: "Multi-Slide System",
    location: "Beverly Hills, CA",
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_22_h0jqzq",
    size: "small",
  },
  {
    id: 3,
    title: "Laguna Beach Villa",
    category: "pivot",
    type: "Pivot Entry Door",
    location: "Laguna Beach, CA",
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_15_ddqcxd",
    size: "small",
  },
  {
    id: 4,
    title: "Newport Coast Residence",
    category: "folding",
    type: "Folding Glass Wall",
    location: "Newport Coast, CA",
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_2000/scenic_doors_HDR_4_ohg10o",
    size: "medium",
  },
  {
    id: 5,
    title: "San Diego Coastal Home",
    category: "multi-slide",
    type: "Multi-Slide System",
    location: "La Jolla, CA",
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_12_yozv9h",
    size: "small",
  },
  {
    id: 6,
    title: "Palos Verdes Estate",
    category: "pivot",
    type: "Pivot Entry Door",
    location: "Palos Verdes, CA",
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_20_jqwyls",
    size: "small",
  },
  {
    id: 7,
    title: "Santa Barbara Retreat",
    category: "folding",
    type: "Folding Glass Wall",
    location: "Santa Barbara, CA",
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_2000/scenic_doors_HDR_33_bpvi7t",
    size: "large",
  },
  {
    id: 8,
    title: "Coronado Island Home",
    category: "multi-slide",
    type: "Multi-Slide System",
    location: "Coronado, CA",
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_2000/scenic_doors_HDR_26_u8o85i",
    size: "medium",
  },
];

const categories = [
  { id: "all", label: "All Projects" },
  { id: "folding", label: "Folding Glass Walls" },
  { id: "multi-slide", label: "Multi-Slide Systems" },
  { id: "pivot", label: "Pivot Entry Doors" },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filteredProjects = activeCategory === "all"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

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
                Our Portfolio
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                Project Gallery
              </h1>
              <p className="text-white/70 text-lg">
                Explore our collection of completed installations across
                Southern California. Each project represents our commitment to
                excellence and attention to detail.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter */}
        <section className="py-8 bg-white border-b border-ocean-200">
          <div className="section-container">
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-2 font-medium text-sm transition-colors ${
                    activeCategory === category.id
                      ? "bg-primary-600 text-white"
                      : "bg-primary-50 text-ocean-700 hover:bg-primary-100"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16 bg-white">
          <div className="section-container">
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className={`cursor-pointer group ${
                      project.size === "large"
                        ? "col-span-2 row-span-2"
                        : project.size === "medium"
                        ? "col-span-2"
                        : ""
                    }`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-ocean-900/0 group-hover:bg-ocean-900/60 transition-colors duration-300 flex items-end p-6">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-primary-300 text-xs font-medium tracking-wide uppercase">
                            {project.type}
                          </span>
                          <h3 className="font-heading text-xl text-white">
                            {project.title}
                          </h3>
                          <p className="text-white/70 text-sm">
                            {project.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        <CTABanner />
      </main>
      <Footer />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ocean-900/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <button
              className="absolute top-6 right-6 text-white hover:text-primary-400 transition-colors"
              onClick={() => setSelectedProject(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <div className="mt-6 text-center">
                <span className="text-primary-300 text-sm font-medium tracking-wide uppercase">
                  {selectedProject.type}
                </span>
                <h3 className="font-heading text-2xl text-white mt-1">
                  {selectedProject.title}
                </h3>
                <p className="text-white/70">{selectedProject.location}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
