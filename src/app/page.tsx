import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import Introduction from "@/components/sections/Introduction";
import DoorCollections from "@/components/sections/DoorCollections";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
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

        {/* Why Choose Us - Light sand, sticky header + cards */}
        <WhyChooseUs />

        {/* Featured Projects - Cream, bento grid */}
        <FeaturedProjects />

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
