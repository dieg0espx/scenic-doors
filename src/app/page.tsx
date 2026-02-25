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

        {/* Door Collections - Dark ocean, numbered cards */}
        <DoorCollections />

        {/* Featured Projects - Cream, bento grid */}
        <FeaturedProjects />

        {/* Process Section */}
        <Process />

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
