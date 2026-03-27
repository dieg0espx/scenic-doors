"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import { X } from "lucide-react";

const galleryImages = [
  // Row 1: Large feature
  {
    id: 1,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_2000/scenic_doors_HDR_1_pcxtx1",
    size: "large",
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_3_higrvu",
    size: "small",
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_4_upipl7",
    size: "small",
  },
  {
    id: 4,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_6_dbh3xb",
    size: "small",
  },
  {
    id: 5,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_7_ebmqus",
    size: "small",
  },
  // Row 2: Small grid
  {
    id: 6,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/DJI_20240325134628_0326_D_d9mapt",
    size: "small",
  },
  {
    id: 7,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/DJI_20240325134611_0323_D_wpqlp2",
    size: "small",
  },
  {
    id: 8,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_8_b9u1sr",
    size: "small",
  },
  {
    id: 9,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_9_qybilp",
    size: "small",
  },
  // Row 3: Large feature
  {
    id: 10,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_2000/scenic_doors_HDR_2_r3o9y7",
    size: "large",
  },
  {
    id: 11,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_11_bd7stx",
    size: "small",
  },
  {
    id: 12,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_12_tlwb7k",
    size: "small",
  },
  {
    id: 13,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_13_uywyn1",
    size: "small",
  },
  {
    id: 14,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_15_hrbuyc",
    size: "small",
  },
  // Row 4: Small grid
  {
    id: 15,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_16_ellxma",
    size: "small",
  },
  {
    id: 16,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_17_febovi",
    size: "small",
  },
  {
    id: 17,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_18_msdvq2",
    size: "small",
  },
  {
    id: 18,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_20_nkms0s",
    size: "small",
  },
  // Row 5: Large feature
  {
    id: 19,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_2000/scenic_doors_HDR_10_dkakay",
    size: "large",
  },
  {
    id: 20,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_21_elbih1",
    size: "small",
  },
  {
    id: 21,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_22_bhx4sh",
    size: "small",
  },
  {
    id: 22,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_23_twvpox",
    size: "small",
  },
  {
    id: 23,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_25_q5f4w3",
    size: "small",
  },
  // Row 6: Small grid
  {
    id: 24,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/DJI_20240325133255_0298_D_am66t5",
    size: "small",
  },
  {
    id: 25,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_26_oqcbdz",
    size: "small",
  },
  {
    id: 26,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_27_ziaoc1",
    size: "small",
  },
  {
    id: 27,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_28_pwcjld",
    size: "small",
  },
  // Row 7: Large feature
  {
    id: 28,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_2000/scenic_doors_HDR_19_m133fq",
    size: "large",
  },
  {
    id: 29,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_29_uo2anj",
    size: "small",
  },
  {
    id: 30,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_30_ugxlej",
    size: "small",
  },
  {
    id: 31,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_31_mg8adx",
    size: "small",
  },
  {
    id: 32,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_32_uze40g",
    size: "small",
  },
  // Row 8: Small grid
  {
    id: 33,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_33_zw0r7q",
    size: "small",
  },
  {
    id: 34,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_5_b0zmnt",
    size: "small",
  },
  {
    id: 35,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_14_nl2ypu",
    size: "small",
  },
  {
    id: 36,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_1200/scenic_doors_HDR_24_ugkxje",
    size: "small",
  },
  // Row 9: Final large feature
  {
    id: 37,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_2000/DJI_20240325132923_0276_D_qf99nm",
    size: "large",
  },
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

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
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                Project Malibu
              </h1>
              <p className="text-white/70 text-lg">
                A stunning oceanfront estate featuring custom folding glass walls that seamlessly blend indoor and outdoor living spaces.
              </p>
            </motion.div>
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
                {galleryImages.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className={`cursor-pointer group ${
                      item.size === "large"
                        ? "col-span-2 row-span-2"
                        : item.size === "medium"
                        ? "col-span-2"
                        : ""
                    }`}
                    onClick={() => setSelectedImage(item)}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt={`Malibu Project - Image ${item.id}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-ocean-900/0 group-hover:bg-ocean-900/40 transition-colors duration-300" />
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
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ocean-900/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white hover:text-primary-400 transition-colors"
              onClick={() => setSelectedImage(null)}
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
                src={selectedImage.image.replace('/w_1200/', '/w_2000/').replace('/w_2000/', '/w_2000/')}
                alt={`Malibu Oceanfront Estate - Image ${selectedImage.id}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <div className="mt-6 text-center">
                <span className="text-primary-300 text-sm font-medium tracking-wide uppercase">
                  Folding Glass Wall System
                </span>
                <h3 className="font-heading text-2xl text-white mt-1">
                  Malibu Oceanfront Estate
                </h3>
                <p className="text-white/70">Malibu, CA</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
