"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import Testimonials from "@/components/sections/Testimonials";
import ImageCarousel from "@/components/ImageCarousel";
import { CheckCircle, Lightbulb, Wrench, Sparkles } from "lucide-react";

// Carousel featured images
const carouselImages = [
  {
    id: 1,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_2000/scenic_doors_HDR_1_pcxtx1"
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_2000/scenic_doors_HDR_2_r3o9y7"
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_2000/scenic_doors_HDR_10_dkakay"
  },
  {
    id: 4,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_2000/scenic_doors_HDR_19_m133fq"
  },
  {
    id: 5,
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_2000/DJI_20240325132923_0276_D_qf99nm"
  },
];

export default function GalleryPage() {

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-primary-900 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://res.cloudinary.com/dku1gnuat/image/upload/f_auto,q_auto,w_2000/scenic_doors_HDR_1_pcxtx1"
              alt="Project Malibu"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-900/80 to-primary-900/60" />
          </div>

          {/* Content */}
          <div className="section-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                Project Malibu
              </h1>
              <p className="text-white/90 text-lg md:text-xl">
                A stunning oceanfront estate featuring custom folding glass walls that seamlessly blend indoor and outdoor living spaces.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Project Description */}
        <section className="py-16 md:py-20 bg-primary-50">
          <div className="section-container">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Left Column - Description */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-6">
                  Transforming Coastal Living
                </h2>
                <div className="space-y-4 text-ocean-700">
                  <p>
                    This stunning Malibu oceanfront estate showcases the pinnacle of indoor-outdoor living with our custom-installed folding glass wall system. The project features floor-to-ceiling glass panels that completely retract to create an unobstructed connection between the interior living spaces and the breathtaking Pacific Ocean views.
                  </p>
                  <p>
                    Our team expertly installed premium folding glass doors that span over 40 feet, incorporating precision engineering and meticulous craftsmanship to ensure seamless operation and weather-tight performance in the challenging coastal environment.
                  </p>
                  <p>
                    The installation process required careful coordination with architects and contractors to integrate the glass wall system with the home's structural design while maintaining the aesthetic vision of open, flowing spaces that capture natural light and ocean breezes.
                  </p>
                </div>
              </motion.div>

              {/* Right Column - Project Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-white p-8 shadow-sm">
                  <h3 className="font-heading text-2xl text-ocean-900 mb-6">
                    Project Details
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <dt className="text-sm font-medium text-ocean-500 uppercase tracking-wide mb-1">
                        Location
                      </dt>
                      <dd className="text-lg text-ocean-900">Malibu, California</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-ocean-500 uppercase tracking-wide mb-1">
                        System Type
                      </dt>
                      <dd className="text-lg text-ocean-900">Folding Glass Wall System</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-ocean-500 uppercase tracking-wide mb-1">
                        Features
                      </dt>
                      <dd className="text-ocean-900">
                        <ul className="space-y-2 mt-2">
                          <li className="flex items-start">
                            <span className="text-primary-500 mr-2">•</span>
                            <span>40+ feet of unobstructed glass panels</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary-500 mr-2">•</span>
                            <span>Weather-resistant coastal engineering</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary-500 mr-2">•</span>
                            <span>Seamless indoor-outdoor integration</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary-500 mr-2">•</span>
                            <span>Premium hardware and finishes</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary-500 mr-2">•</span>
                            <span>Custom-engineered structural support</span>
                          </li>
                        </ul>
                      </dd>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* The Vision & Story */}
        <section className="py-16 md:py-20 bg-white">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-primary-500" />
                <span className="text-sm font-medium text-primary-600 uppercase tracking-wider">The Story</span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-6">
                A Vision Brought to Life
              </h2>
              <p className="text-ocean-600 max-w-3xl mx-auto text-lg">
                Every exceptional project begins with a dream. This Malibu estate's transformation showcases how vision, expertise, and craftsmanship converge to create something extraordinary.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-primary-50 p-8"
              >
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-2xl text-ocean-900 mb-4">The Challenge</h3>
                <p className="text-ocean-700 leading-relaxed">
                  The homeowners desired an expansive opening to capture breathtaking Pacific views while maintaining structural integrity and weather resistance in a harsh coastal environment. They needed a solution that could withstand salt air, strong winds, and daily operation without compromise.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-primary-50 p-8"
              >
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-2xl text-ocean-900 mb-4">Our Solution</h3>
                <p className="text-ocean-700 leading-relaxed">
                  We designed and installed a custom folding glass wall system spanning over 40 feet, featuring premium marine-grade hardware, reinforced structural supports, and weather-sealed panels. Every component was engineered specifically for coastal durability and effortless daily operation.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-primary-50 p-8"
              >
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading text-2xl text-ocean-900 mb-4">The Result</h3>
                <p className="text-ocean-700 leading-relaxed">
                  A stunning transformation that seamlessly blends 5,000 square feet of interior space with the outdoor patio and pool area. The system operates flawlessly, opening in under a minute to create an uninterrupted indoor-outdoor living experience that has become the home's defining feature.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Image Carousel */}
        <section className="py-16 md:py-20 bg-ocean-50">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-4">
                Featured Highlights
              </h2>
              <p className="text-ocean-600 max-w-2xl mx-auto">
                Experience the transformation through our curated selection of key moments and details.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ImageCarousel images={carouselImages} autoplay={true} autoplayDelay={5000} />
            </motion.div>
          </div>
        </section>

        {/* The Process */}
        <section className="py-16 md:py-20 bg-primary-900 text-white">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-heading text-3xl md:text-4xl mb-6">
                Behind the Scenes
              </h2>
              <p className="text-white/70 max-w-3xl mx-auto text-lg">
                Excellence is in the details. Here's how we brought this vision to life through meticulous planning and expert execution.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="font-heading text-xl mb-3">Design & Engineering</h3>
                <p className="text-white/70 text-sm">
                  Collaborated with architects to create custom structural plans, ensuring seamless integration with the home's design while meeting coastal building codes.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="font-heading text-xl mb-3">Material Selection</h3>
                <p className="text-white/70 text-sm">
                  Sourced premium marine-grade components and impact-resistant glass specifically engineered to withstand harsh coastal conditions.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="font-heading text-xl mb-3">Precision Installation</h3>
                <p className="text-white/70 text-sm">
                  Our expert team executed a meticulous 3-week installation, ensuring perfect alignment, weather sealing, and smooth operation.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-heading text-xl mb-3">Quality Assurance</h3>
                <p className="text-white/70 text-sm">
                  Comprehensive testing and final adjustments to guarantee flawless operation, complete weather resistance, and client satisfaction.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Client Testimonials */}
        <Testimonials />

        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
