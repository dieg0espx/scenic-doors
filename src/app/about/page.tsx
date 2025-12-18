"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import { Award, Users, Clock, Shield } from "lucide-react";

const stats = [
  { number: "25+", label: "Years Experience", icon: Clock },
  { number: "1000+", label: "Projects Completed", icon: Award },
  { number: "6", label: "Counties Served", icon: Users },
  { number: "100%", label: "Certified Installers", icon: Shield },
];

const values = [
  {
    title: "Craftsmanship",
    description:
      "Every installation reflects our commitment to precision and quality. We treat each project as a testament to our craft.",
  },
  {
    title: "Integrity",
    description:
      "Transparent pricing, honest timelines, and clear communication. We build lasting relationships through trust.",
  },
  {
    title: "Innovation",
    description:
      "We stay at the forefront of door technology, bringing the latest solutions to Southern California homes.",
  },
  {
    title: "Excellence",
    description:
      "From consultation to completion, we maintain the highest standards in every aspect of our work.",
  },
];

const timeline = [
  {
    year: "1998",
    title: "Founded in Orange County",
    description:
      "Started as a small family business with a vision to bring premium door solutions to Southern California.",
  },
  {
    year: "2005",
    title: "LaCantina Partnership",
    description:
      "Became one of the first certified LaCantina installers in the region, establishing our expertise in folding door systems.",
  },
  {
    year: "2012",
    title: "Expanded Service Area",
    description:
      "Grew to serve all six Southern California counties, from San Diego to Santa Barbara.",
  },
  {
    year: "2018",
    title: "1000th Installation",
    description:
      "Celebrated our 1000th successful installation, a milestone that reflects our clients' trust.",
  },
  {
    year: "Today",
    title: "Industry Leaders",
    description:
      "Recognized as the premier door installation company in Southern California, setting the standard for quality and service.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-ocean-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop')`,
              }}
            />
          </div>
          <div className="section-container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="text-wood-400 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                About Us
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                Crafting Entrances,
                <span className="block text-wood-400">Building Trust</span>
              </h1>
              <p className="text-white/70 text-lg max-w-2xl">
                For over 25 years, Scenic Doors has been transforming Southern
                California homes with premium door installations. Our passion
                for craftsmanship and commitment to excellence has made us the
                region's most trusted name in architectural doors.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-wood-700">
          <div className="section-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="w-8 h-8 text-wood-300 mx-auto mb-3" />
                  <p className="font-heading text-3xl md:text-4xl text-white mb-1">
                    {stat.number}
                  </p>
                  <p className="text-wood-300 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 bg-cream">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-wood-600 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
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
                className="relative"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop"
                    alt="Premium door installation"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-wood-600 text-white p-6 max-w-xs">
                  <p className="font-heading text-2xl mb-2">25+ Years</p>
                  <p className="text-wood-200 text-sm">
                    of transforming Southern California homes
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-ocean-900">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-wood-400 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                Our Values
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-white">
                What Drives Us
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-ocean-800/50 p-8 border-t-2 border-wood-500"
                >
                  <h3 className="font-heading text-xl text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-ocean-400 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-24 bg-cream">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-wood-600 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                Our Journey
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-ocean-900">
                Milestones Along the Way
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-6 mb-8 last:mb-0"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-wood-600 text-white flex items-center justify-center font-heading text-lg">
                      {item.year}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-[2px] flex-1 bg-wood-300 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="font-heading text-xl text-ocean-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-ocean-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
