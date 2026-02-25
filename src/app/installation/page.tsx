"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Shield,
  Clock,
  Award,
  Wrench,
  Home,
  Calendar,
  ThumbsUp
} from "lucide-react";

const installationProcess = [
  {
    step: "01",
    title: "Initial Consultation",
    description: "We visit your property to assess the installation site, take precise measurements, and discuss your specific requirements and timeline.",
    icon: Calendar,
  },
  {
    step: "02",
    title: "Custom Manufacturing",
    description: "Your doors are custom-built to exact specifications in our facility, with rigorous quality control at every stage of production.",
    icon: Wrench,
  },
  {
    step: "03",
    title: "Professional Installation",
    description: "Our certified installation team arrives on schedule with all necessary equipment to expertly install your doors with minimal disruption.",
    icon: Users,
  },
  {
    step: "04",
    title: "Final Inspection & Training",
    description: "We conduct a thorough inspection, test all operations, and train you on proper use and maintenance of your new doors.",
    icon: ThumbsUp,
  },
];

const whyChooseUs = [
  {
    icon: Users,
    title: "Expert Installation Team",
    description: "Our certified installers have years of experience installing premium door systems in coastal and luxury properties.",
  },
  {
    icon: Shield,
    title: "Fully Insured & Licensed",
    description: "All our installation work is fully insured and performed by licensed professionals who meet the highest industry standards.",
  },
  {
    icon: Clock,
    title: "On-Time, Every Time",
    description: "We respect your schedule. Our team arrives on time and completes installations within the agreed timeline.",
  },
  {
    icon: Award,
    title: "Quality Guaranteed",
    description: "Every installation is backed by our warranty and quality guarantee. We don't leave until you're 100% satisfied.",
  },
];

const services = [
  "Complete door system installation",
  "Structural modifications and framing",
  "Electrical work for integrated systems",
  "Weather sealing and waterproofing",
  "Hardware installation and adjustment",
  "Post-installation cleanup",
  "Operation training and maintenance guidance",
  "Warranty registration and documentation",
];

export default function InstallationPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-primary-800 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-ocean-900 via-primary-800 to-ocean-800" />
          </div>
          <div className="section-container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-500/20 mb-6"
              >
                <Home className="w-10 h-10 text-primary-300" />
              </motion.div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                Professional Installation Services
              </h1>
              <p className="text-white/80 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
                At Scenic Doors, we don't just manufacture premium door systems—we install them.
                Our expert installation team ensures your investment is installed perfectly,
                operates flawlessly, and lasts for decades.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="https://app.scenicdoors.co/quote/start"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 font-medium tracking-wide hover:bg-primary-400 transition-colors"
                >
                  Schedule Consultation
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:818-427-6690"
                  className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 font-medium tracking-wide hover:bg-white/10 transition-colors"
                >
                  Call 818-427-6690
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Choose Our Installation */}
        <section className="py-24 bg-white">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-primary-500 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                Why Choose Us
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-4">
                The Scenic Doors Difference
              </h2>
              <p className="text-ocean-600 max-w-2xl mx-auto">
                We handle every aspect of your door installation with precision,
                professionalism, and attention to detail.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChooseUs.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-50 p-8 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
                    <item.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="font-heading text-xl text-ocean-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-ocean-600 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Installation Process */}
        <section className="py-24 bg-gray-50">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-primary-500 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                Our Process
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-4">
                From Consultation to Completion
              </h2>
              <p className="text-ocean-600 max-w-2xl mx-auto">
                A seamless, stress-free installation experience designed around your schedule and needs.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {installationProcess.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative bg-white p-8 shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-6">
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center mb-4">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-heading text-4xl text-primary-200 font-bold">
                        {item.step}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-heading text-2xl text-ocean-900 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-ocean-600">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Included */}
        <section className="py-24 bg-primary-800">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-primary-300 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                  Complete Service
                </span>
                <h2 className="font-heading text-3xl md:text-4xl text-white mb-6">
                  Everything You Need, All Included
                </h2>
                <p className="text-white/80 mb-8">
                  Our comprehensive installation service covers every aspect of your door system
                  installation. From initial site preparation to final adjustments, we handle it all
                  so you don't have to coordinate multiple contractors.
                </p>
                <p className="text-white/70">
                  Every installation includes our quality guarantee and detailed documentation.
                  We're not satisfied until your doors operate perfectly and you're completely happy
                  with the result.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-lg"
              >
                <h3 className="font-heading text-2xl text-white mb-6">
                  Installation Services Include:
                </h3>
                <ul className="space-y-4">
                  {services.map((service, index) => (
                    <motion.li
                      key={service}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-6 h-6 text-primary-300 mt-0.5 shrink-0" />
                      <span className="text-white/90">{service}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white">
          <div className="section-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-ocean-600 mb-8 max-w-2xl mx-auto">
                Schedule a consultation with our installation team to discuss your project.
                We'll provide a detailed timeline and answer all your questions.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="https://app.scenicdoors.co/quote/start"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 font-medium tracking-wide hover:bg-primary-400 transition-colors"
                >
                  Get Installation Quote
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:818-427-6690"
                  className="inline-flex items-center gap-2 border border-ocean-300 text-ocean-700 px-8 py-4 font-medium tracking-wide hover:bg-ocean-50 transition-colors"
                >
                  Speak to Our Team
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
