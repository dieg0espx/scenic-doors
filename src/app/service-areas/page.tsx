"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import { MapPin, ArrowRight } from "lucide-react";

const counties = [
  {
    name: "Los Angeles County",
    cities: [
      "Los Angeles",
      "Beverly Hills",
      "Santa Monica",
      "Malibu",
      "Pasadena",
      "Long Beach",
      "Manhattan Beach",
      "Palos Verdes",
    ],
  },
  {
    name: "Orange County",
    cities: [
      "Newport Beach",
      "Laguna Beach",
      "Irvine",
      "Huntington Beach",
      "Dana Point",
      "San Clemente",
      "Anaheim Hills",
      "Yorba Linda",
    ],
  },
  {
    name: "San Diego County",
    cities: [
      "La Jolla",
      "Del Mar",
      "Coronado",
      "Rancho Santa Fe",
      "Carlsbad",
      "Encinitas",
      "San Diego",
      "Point Loma",
    ],
  },
  {
    name: "Ventura County",
    cities: [
      "Malibu",
      "Thousand Oaks",
      "Westlake Village",
      "Camarillo",
      "Ventura",
      "Oxnard",
      "Ojai",
      "Moorpark",
    ],
  },
  {
    name: "Santa Barbara County",
    cities: [
      "Santa Barbara",
      "Montecito",
      "Hope Ranch",
      "Carpinteria",
      "Goleta",
      "Santa Ynez",
      "Solvang",
      "Los Olivos",
    ],
  },
  {
    name: "Riverside County",
    cities: [
      "Palm Springs",
      "Rancho Mirage",
      "Palm Desert",
      "Indian Wells",
      "La Quinta",
      "Riverside",
      "Temecula",
      "Corona",
    ],
  },
];

export default function ServiceAreasPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-ocean-900">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="text-wood-400 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                Where We Work
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                Service Areas
              </h1>
              <p className="text-white/70 text-lg">
                Scenic Doors proudly serves homeowners, architects, and builders
                throughout Southern California. With over 25 years of
                experience, we've installed premium door systems in the region's
                most prestigious communities.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-12 bg-wood-700">
          <div className="section-container">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <p className="font-heading text-4xl text-white mb-1">6</p>
                <p className="text-wood-300 text-sm">Counties Served</p>
              </div>
              <div>
                <p className="font-heading text-4xl text-white mb-1">50+</p>
                <p className="text-wood-300 text-sm">Cities Covered</p>
              </div>
              <div>
                <p className="font-heading text-4xl text-white mb-1">1000+</p>
                <p className="text-wood-300 text-sm">Installations</p>
              </div>
            </div>
          </div>
        </section>

        {/* Counties Grid */}
        <section className="py-24 bg-cream">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-4">
                Counties We Serve
              </h2>
              <p className="text-ocean-600 max-w-2xl mx-auto">
                From the beaches of San Diego to the hills of Santa Barbara, our
                expert installers bring premium door solutions to your doorstep.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {counties.map((county, index) => (
                <motion.div
                  key={county.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-6 h-6 text-wood-500" />
                    <h3 className="font-heading text-xl text-ocean-900">
                      {county.name}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {county.cities.map((city) => (
                      <span
                        key={city}
                        className="text-sm text-ocean-600 bg-ocean-50 px-3 py-1"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Not in Our Area? */}
        <section className="py-24 bg-ocean-900">
          <div className="section-container">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-heading text-3xl md:text-4xl text-white mb-6">
                  Don't See Your City?
                </h2>
                <p className="text-ocean-400 mb-8">
                  We frequently work on projects throughout Southern California
                  and beyond. If you don't see your location listed, please
                  reach out—we may still be able to help with your project.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-wood-500 text-white px-8 py-4 font-medium tracking-wide hover:bg-wood-400 transition-colors"
                >
                  Contact Us
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
