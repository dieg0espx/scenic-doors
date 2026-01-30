"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import { Award, Users, Clock, Shield } from "lucide-react";

const stats = [
  { number: "25+", label: "Years Experience", icon: Clock },
  { number: "1000+", label: "Projects Completed", icon: Award },
  { number: "6", label: "Counties Served", icon: Users },
  { number: "100%", label: "Certified Installers", icon: Shield },
];

const timeline = [
  {
    year: "1999",
    title: "The Beginning",
    description:
      "Scenic Doors was founded in Los Angeles by a team of passionate craftsmen with a vision to bring premium European door designs to Southern California homes.",
  },
  {
    year: "2004",
    title: "Expanding Our Reach",
    description:
      "After establishing a strong reputation in LA, we expanded our services to cover all of Los Angeles County, bringing our expertise to thousands of homeowners.",
  },
  {
    year: "2008",
    title: "Weathering the Storm",
    description:
      "During the economic downturn, we doubled down on quality and customer service, earning loyal customers who appreciated our commitment to excellence.",
  },
  {
    year: "2012",
    title: "Innovation & Growth",
    description:
      "We introduced our signature slide-stack door systems, becoming one of the first installers in California to offer this revolutionary open-concept living solution.",
  },
  {
    year: "2016",
    title: "Regional Expansion",
    description:
      "Scenic Doors expanded to serve Orange County, Ventura, and San Bernardino, growing our team of certified installers to meet increasing demand.",
  },
  {
    year: "2020",
    title: "Digital Transformation",
    description:
      "We embraced technology with virtual consultations and 3D visualization tools, making it easier than ever for customers to envision their perfect entrance.",
  },
  {
    year: "2024",
    title: "Leading the Industry",
    description:
      "Today, Scenic Doors is the premier door installation company in Southern California, with over 1,000 completed projects and a reputation for unmatched quality.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-40 pb-40 md:pt-48 md:pb-48 bg-primary-900 relative overflow-hidden">
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
              <span className="text-primary-300 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                About Us
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                Crafting Entrances,
                <span className="block text-primary-300">Building Trust</span>
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
        <section className="py-16 bg-primary-600">
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
                  <stat.icon className="w-8 h-8 text-primary-200 mx-auto mb-3" />
                  <p className="font-heading text-3xl md:text-4xl text-white mb-1">
                    {stat.number}
                  </p>
                  <p className="text-primary-100 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <WhyChooseUs />

        <CTABanner />

        {/* Our Journey Timeline */}
        <section className="py-20 md:py-28 bg-white">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-primary-600 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                Our Journey
              </span>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-neutral-900 mb-4">
                25 Years of Excellence
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                From humble beginnings to becoming Southern California's most trusted
                door installation company, here's our story.
              </p>
            </motion.div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary-200 transform md:-translate-x-1/2" />

              {/* Timeline Items */}
              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative flex flex-col md:flex-row items-start ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Content */}
                    <div
                      className={`ml-12 md:ml-0 md:w-1/2 ${
                        index % 2 === 0
                          ? "md:pr-12 md:text-right"
                          : "md:pl-12 md:text-left"
                      }`}
                    >
                      <div
                        className={`bg-neutral-50 p-6 rounded-xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow ${
                          index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"
                        } max-w-md`}
                      >
                        <span className="text-primary-600 font-heading text-2xl font-bold">
                          {item.year}
                        </span>
                        <h3 className="font-heading text-xl text-neutral-900 mt-2 mb-3">
                          {item.title}
                        </h3>
                        <p className="text-neutral-600 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Circle Marker */}
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary-600 rounded-full transform -translate-x-1/2 mt-6 md:mt-8 border-4 border-white shadow-md" />

                    {/* Empty space for alternating layout on desktop */}
                    <div className="hidden md:block md:w-1/2" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
