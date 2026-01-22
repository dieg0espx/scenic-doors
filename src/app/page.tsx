"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import Introduction from "@/components/sections/Introduction";
import DoorCollections from "@/components/sections/DoorCollections";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import Process from "@/components/sections/Process";
import OurJourney from "@/components/sections/OurJourney";
import Testimonials from "@/components/sections/Testimonials";
import ServiceAreas from "@/components/sections/ServiceAreas";
import CTABanner from "@/components/sections/CTABanner";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero - Dark ocean with split image */}
        <Hero />

        {/* Trust Bar - Light sand, brand logos */}
        <TrustBar />

        {/* Introduction - Cream, large quote + image */}
        <Introduction />

        {/* Our Story Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="section-container">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-6 text-right"
              >
                <span className="text-primary-500 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                  Our Story
                </span>
                <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-6">
                  A Legacy of Excellence
                </h2>
                <div className="space-y-4 text-ocean-700">
                  <p>
                    Scenic Doors was founded in 1998 with a simple mission: to
                    bring world-class door solutions to Southern California
                    homes. What started as a small family operation has grown
                    into the region's most respected name in premium door
                    installations.
                  </p>
                  <p>
                    Our founder's vision was clear—every home deserves an
                    entrance that makes a statement. That vision has guided us
                    through over two decades of growth, innovation, and
                    countless satisfied clients.
                  </p>
                  <p>
                    Today, we're proud to be factory-certified installers for
                    the industry's leading brands, including LaCantina, Western
                    Window Systems, and Fleetwood. Our team of skilled craftsmen
                    brings decades of combined experience to every project.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative lg:col-span-6 flex justify-end"
              >
                <div className="aspect-[4/3] overflow-hidden w-full max-w-full mx-auto lg:mx-0">
                  <img
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop"
                    alt="Premium door installation"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 -left-3 bg-primary-600 text-white p-4 max-w-[200px]">
                  <p className="font-heading text-xl mb-1">25+ Years</p>
                  <p className="text-primary-100 text-xs">
                    of transforming Southern California homes
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Door Collections - Dark ocean, numbered cards */}
        <DoorCollections />

        {/* Featured Projects - Cream, bento grid */}
        <FeaturedProjects />

        {/* Process Section */}
        <Process />

        {/* Our Journey Section */}
        <OurJourney />

        {/* Testimonials - Dark ocean, staggered cards */}
        <Testimonials />

        {/* Service Areas - Cream, map + locations */}
        <ServiceAreas />

        {/* CTA Banner - Wood accent color */}
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
