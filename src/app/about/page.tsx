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
      </main>
      <Footer />
    </>
  );
}
