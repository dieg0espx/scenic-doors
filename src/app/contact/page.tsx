"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: ["818-427-6690", "Mon-Fri: 8am-6pm"],
    action: "tel:818-427-6690",
  },
  {
    icon: Mail,
    title: "Email",
    details: ["info@scenicdoors.com", "We respond within 24 hours"],
    action: "mailto:info@scenicdoors.com",
  },
  {
    icon: MapPin,
    title: "Showroom",
    details: ["123 Design District", "Newport Beach, CA 92660"],
    action: "https://maps.google.com",
  },
  {
    icon: Clock,
    title: "Hours",
    details: ["Mon-Fri: 8am-6pm", "Sat: 9am-4pm | Sun: Closed"],
    action: null,
  },
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-primary-900">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="text-primary-300 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                Contact Us
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                Let's Start a
                <span className="block text-primary-300">Conversation</span>
              </h1>
              <p className="text-white/70 text-lg">
                Have questions about our products or services? Ready to schedule
                a consultation? We're here to help bring your vision to life.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 bg-primary-600">
          <div className="section-container">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {item.action ? (
                    <a
                      href={item.action}
                      className="block bg-primary-700 p-6 hover:bg-primary-500 transition-colors h-full"
                    >
                      <item.icon className="w-8 h-8 text-primary-200 mb-4" />
                      <h3 className="font-heading text-xl text-white mb-2">
                        {item.title}
                      </h3>
                      {item.details.map((detail, i) => (
                        <p key={i} className="text-primary-100 text-sm">
                          {detail}
                        </p>
                      ))}
                    </a>
                  ) : (
                    <div className="bg-primary-700 p-6 h-full">
                      <item.icon className="w-8 h-8 text-primary-200 mb-4" />
                      <h3 className="font-heading text-xl text-white mb-2">
                        {item.title}
                      </h3>
                      {item.details.map((detail, i) => (
                        <p key={i} className="text-primary-100 text-sm">
                          {detail}
                        </p>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="py-24 bg-white">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-heading text-3xl text-ocean-900 mb-8">
                  Send Us a Message
                </h2>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-ocean-700 text-sm mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-ocean-200 focus:border-primary-500 focus:outline-none transition-colors"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-ocean-700 text-sm mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-ocean-200 focus:border-primary-500 focus:outline-none transition-colors"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-ocean-700 text-sm mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-ocean-200 focus:border-primary-500 focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-ocean-700 text-sm mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-ocean-200 focus:border-primary-500 focus:outline-none transition-colors"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-ocean-700 text-sm mb-2">
                      Subject *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-ocean-200 focus:border-primary-500 focus:outline-none transition-colors bg-white"
                    >
                      <option value="">Select a topic</option>
                      <option value="quote">Request a Quote</option>
                      <option value="consultation">
                        Schedule a Consultation
                      </option>
                      <option value="products">Product Information</option>
                      <option value="support">Service & Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-ocean-700 text-sm mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-ocean-200 focus:border-primary-500 focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-primary-600 text-white px-8 py-4 font-medium tracking-wide hover:bg-primary-500 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </motion.div>

              {/* Map / Image */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-heading text-3xl text-ocean-900 mb-8">
                  Visit Our Showroom
                </h2>
                <div className="aspect-square bg-ocean-100 mb-6 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
                    alt="Scenic Doors Showroom"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-primary-800 p-6">
                  <h3 className="font-heading text-xl text-white mb-2">
                    Newport Beach Showroom
                  </h3>
                  <p className="text-primary-200 mb-4">
                    123 Design District, Newport Beach, CA 92660
                  </p>
                  <p className="text-primary-200 text-sm">
                    Experience our door collections in person. Our design
                    consultants are available to guide you through our products
                    and help you find the perfect solution for your home.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
