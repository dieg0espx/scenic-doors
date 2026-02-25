"use client";

import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

const testimonials = [
  {
    quote:
      "Scenic Doors transformed our entire home. The folding glass wall they installed opened our living room to the backyard in a way we never imagined possible. Their team was professional, meticulous, and a pleasure to work with.",
    author: "Michael & Sarah T.",
    location: "Newport Beach",
    project: "Folding Glass Wall",
  },
  {
    quote:
      "As an architect, I'm extremely particular about contractors. Scenic Doors has become my go-to for every high-end residential project. Their installation quality is impeccable.",
    author: "David R., AIA",
    location: "Los Angeles",
    project: "Multiple Projects",
  },
  {
    quote:
      "The pivot door Scenic installed is now the centerpiece of our home's entry. Every guest comments on it. Worth every penny for the craftsmanship and the 'wow' factor.",
    author: "Jennifer L.",
    location: "La Jolla",
    project: "Pivot Entry Door",
  },
  {
    quote:
      "We needed a multi-slide door system for our beachfront property, and Scenic Doors delivered beyond our expectations. The installation was seamless, and the doors operate flawlessly even in the salty air.",
    author: "Robert & Maria C.",
    location: "Malibu",
    project: "Multi-Slide System",
  },
  {
    quote:
      "The attention to detail and customer service from Scenic Doors is unmatched. They walked us through every step and made sure we were completely satisfied before considering the job done.",
    author: "Patricia W.",
    location: "Beverly Hills",
    project: "Custom Entry Doors",
  },
  {
    quote:
      "Our new folding doors have completely transformed how we use our outdoor space. We can now seamlessly blend indoor and outdoor living. The quality is outstanding, and the team was professional throughout.",
    author: "James & Lisa M.",
    location: "Santa Monica",
    project: "Folding Glass Doors",
  },
  {
    quote:
      "Scenic Doors worked within our timeline and budget while delivering premium results. The pivot door they installed is a true work of art and has become the focal point of our home's design.",
    author: "Thomas K.",
    location: "Manhattan Beach",
    project: "Pivot Entry Door",
  },
  {
    quote:
      "After seeing Scenic Doors' work at a friend's home, we knew they were the right choice. They didn't disappoint. Our multi-slide system is beautiful and functional, exactly what we envisioned.",
    author: "Amanda & Chris D.",
    location: "Laguna Beach",
    project: "Multi-Slide System",
  },
  {
    quote:
      "The team at Scenic Doors treated our home like their own. They were respectful, clean, and incredibly skilled. Our new doors have exceeded all our expectations in both form and function.",
    author: "Steven H.",
    location: "Pasadena",
    project: "Folding Glass Wall",
  },
  {
    quote:
      "We've worked with many contractors over the years, but Scenic Doors stands out for their professionalism and craftsmanship. The doors they installed are stunning and operate perfectly.",
    author: "Rachel & Mark B.",
    location: "San Diego",
    project: "Custom Door System",
  },
  {
    quote:
      "Scenic Doors made the entire process stress-free. From initial consultation to final installation, they communicated clearly and delivered exceptional results. Highly recommend!",
    author: "Kevin S.",
    location: "Irvine",
    project: "Pivot Entry Door",
  },
  {
    quote:
      "The folding doors Scenic installed have completely changed our living space. We now have an unobstructed view of our garden and can open up the entire wall when entertaining. Absolutely love it!",
    author: "Nicole & Daniel F.",
    location: "Corona del Mar",
    project: "Folding Glass Doors",
  },
];

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    loop: true,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 1 },
      "(min-width: 1024px)": { slidesToScroll: 1 },
    },
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
    if (isPaused || !emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, emblaApi]);

  return (
    <section className="py-16 md:py-20 bg-primary-800 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full">
        <div className="absolute inset-0 bg-primary-900/20" />
      </div>

      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-[1px] bg-primary-400" />
            <Quote className="w-6 h-6 text-primary-300" />
            <div className="w-12 h-[1px] bg-primary-400" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white mb-3">
            Trusted by Southern California's
            <span className="block text-primary-300">Most Discerning Homeowners</span>
          </h2>
          <p className="text-primary-200">
            Don't just take our word for it. Here's what our clients have to say.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 bg-primary-900/80 hover:bg-primary-900 text-white p-2 md:p-3 rounded-full transition-all duration-200 hover:scale-110 z-10"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 bg-primary-900/80 hover:bg-primary-900 text-white p-2 md:p-3 rounded-full transition-all duration-200 hover:scale-110 z-10"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Carousel Content */}
          <div className="overflow-hidden px-8 md:px-12" ref={emblaRef}>
            <div className="flex gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={`${testimonial.author}-${index}`}
                  className="flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(25%-18px)] min-w-0"
                >
                  <div className="bg-primary-900/50 backdrop-blur-sm p-6 relative h-full flex flex-col">
                    {/* Quote mark */}
                    <span className="absolute -top-2 -left-2 font-heading text-6xl text-primary-400/30">
                      "
                    </span>

                    {/* Stars */}
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-primary-300 text-primary-300" />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-white/90 leading-relaxed mb-4 text-sm flex-grow">
                      {testimonial.quote}
                    </blockquote>

                    {/* Author */}
                    <div className="mt-auto">
                      <p className="text-white font-medium text-sm">{testimonial.author}</p>
                      <p className="text-primary-200 text-xs">{testimonial.location}</p>
                      <p className="text-primary-300 text-xs mt-1">{testimonial.project}</p>
                    </div>

                    {/* Accent line */}
                    <div className="absolute bottom-0 left-0 w-16 h-1 bg-primary-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === selectedIndex
                    ? "w-8 h-2 bg-primary-300"
                    : "w-2 h-2 bg-primary-400/50 hover:bg-primary-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
