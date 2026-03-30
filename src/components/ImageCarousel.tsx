"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface ImageCarouselProps {
  images: {
    id: number;
    image: string;
    caption?: string;
  }[];
  autoplay?: boolean;
  autoplayDelay?: number;
}

export default function ImageCarousel({
  images,
  autoplay = true,
  autoplayDelay = 4000
}: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Auto-slide functionality
  useEffect(() => {
    if (!autoplay || isPaused || !emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [autoplay, isPaused, emblaApi, autoplayDelay]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-ocean-900/80 hover:bg-ocean-900 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 z-10"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-ocean-900/80 hover:bg-ocean-900 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 z-10"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Carousel Content */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((item) => (
            <div
              key={item.id}
              className="flex-[0_0_100%] min-w-0"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-ocean-100">
                <img
                  src={item.image}
                  alt={item.caption || `Gallery image ${item.id}`}
                  className="w-full h-full object-cover"
                />
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ocean-900/90 to-transparent p-6">
                    <p className="text-white text-lg">{item.caption}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`transition-all duration-300 rounded-full ${
              index === selectedIndex
                ? "w-8 h-2 bg-primary-500"
                : "w-2 h-2 bg-ocean-300 hover:bg-ocean-400"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
