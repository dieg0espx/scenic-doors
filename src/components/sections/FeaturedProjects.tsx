"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

const featuredProject = {
  title: "Malibu Estate",
  images: [
    "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_1_pcxtx1",
    "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_2_r3o9y7",
    "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_10_dkakay",
    "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_19_m133fq",
    "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/DJI_20240325132923_0276_D_qf99nm",
  ],
};

export default function FeaturedProjects() {
  return (
    <section className="py-16 md:py-20 bg-ocean-900">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white">
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
          <FeaturedProjectCard project={featuredProject} />
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedProjectCard({
  project,
}: {
  project: typeof featuredProject;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  // Auto-scroll functionality
  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <Link href="/gallery" className="block group cursor-pointer">
      <div className="relative overflow-hidden">
        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {project.images.map((image, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] md:flex-[0_0_calc(100%/3)] min-w-0 px-2 group/item"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow - Simplified */}
        <div className="absolute top-4 right-4 w-12 h-12 bg-primary-500/90 backdrop-blur-sm group-hover:bg-primary-400 flex items-center justify-center transition-all duration-300 z-20">
          <ArrowUpRight className="w-6 h-6 text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
      </div>

      {/* Badge Below Carousel */}
      <div className="mt-6 flex items-center gap-3">
        <div className="bg-primary-500 px-6 py-3 border-2 border-primary-400 inline-block">
          <h3 className="font-heading text-xl md:text-2xl lg:text-3xl text-white font-bold tracking-tight">
            {project.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-primary-400 group-hover:text-primary-300 transition-colors">
          <span className="text-sm font-medium">View Gallery</span>
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
