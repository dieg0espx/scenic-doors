"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check, Phone } from "lucide-react";

const benefits = [
  "Free in-home consultation",
  "Expert design recommendations",
  "Detailed written estimate",
  "No obligation to purchase",
  "Flexible financing options",
];

export default function QuotePage() {
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
                backgroundImage: `url('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop')`,
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
                Free Consultation
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                Request Your
                <span className="block text-wood-400">Free Quote</span>
              </h1>
              <p className="text-white/70 text-lg">
                Take the first step toward transforming your space. Our design
                experts will visit your home, discuss your vision, and provide a
                detailed, no-obligation quote.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-24 bg-cream">
          <div className="section-container">
            <div className="grid lg:grid-cols-3 gap-16">
              {/* Benefits Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-1"
              >
                <div className="bg-ocean-900 p-8 sticky top-32">
                  <h3 className="font-heading text-2xl text-white mb-6">
                    What's Included
                  </h3>
                  <ul className="space-y-4 mb-8">
                    {benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-wood-400 mt-0.5 shrink-0" />
                        <span className="text-white/80">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-ocean-700 pt-6">
                    <p className="text-ocean-400 text-sm mb-4">
                      Prefer to talk to someone?
                    </p>
                    <a
                      href="tel:8005551234"
                      className="flex items-center gap-2 text-white hover:text-wood-400 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      (800) 555-1234
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2"
              >
                <h2 className="font-heading text-3xl text-ocean-900 mb-8">
                  Tell Us About Your Project
                </h2>
                <form className="space-y-8">
                  {/* Contact Information */}
                  <div>
                    <h3 className="font-medium text-ocean-900 mb-4 pb-2 border-b border-ocean-200">
                      Contact Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-ocean-700 text-sm mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-ocean-200 focus:border-wood-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-ocean-700 text-sm mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-ocean-200 focus:border-wood-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-ocean-700 text-sm mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          className="w-full px-4 py-3 border border-ocean-200 focus:border-wood-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-ocean-700 text-sm mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          className="w-full px-4 py-3 border border-ocean-200 focus:border-wood-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Project Location */}
                  <div>
                    <h3 className="font-medium text-ocean-900 mb-4 pb-2 border-b border-ocean-200">
                      Project Location
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-ocean-700 text-sm mb-2">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-ocean-200 focus:border-wood-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-ocean-700 text-sm mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-ocean-200 focus:border-wood-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-ocean-700 text-sm mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-ocean-200 focus:border-wood-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <h3 className="font-medium text-ocean-900 mb-4 pb-2 border-b border-ocean-200">
                      Project Details
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-ocean-700 text-sm mb-2">
                          Product Interest *
                        </label>
                        <div className="grid md:grid-cols-3 gap-4">
                          {[
                            "Folding Glass Walls",
                            "Multi-Slide Systems",
                            "Pivot Entry Doors",
                          ].map((product) => (
                            <label
                              key={product}
                              className="flex items-center gap-3 p-4 border border-ocean-200 cursor-pointer hover:border-wood-500 transition-colors"
                            >
                              <input
                                type="checkbox"
                                className="w-5 h-5 accent-wood-500"
                              />
                              <span className="text-ocean-700 text-sm">
                                {product}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-ocean-700 text-sm mb-2">
                          Project Type *
                        </label>
                        <select
                          required
                          className="w-full px-4 py-3 border border-ocean-200 focus:border-wood-500 focus:outline-none transition-colors bg-white"
                        >
                          <option value="">Select project type</option>
                          <option value="new-construction">
                            New Construction
                          </option>
                          <option value="renovation">
                            Renovation/Remodel
                          </option>
                          <option value="replacement">Door Replacement</option>
                          <option value="addition">Home Addition</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-ocean-700 text-sm mb-2">
                          Estimated Budget
                        </label>
                        <select className="w-full px-4 py-3 border border-ocean-200 focus:border-wood-500 focus:outline-none transition-colors bg-white">
                          <option value="">Select budget range</option>
                          <option value="10-25k">$10,000 - $25,000</option>
                          <option value="25-50k">$25,000 - $50,000</option>
                          <option value="50-100k">$50,000 - $100,000</option>
                          <option value="100k+">$100,000+</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-ocean-700 text-sm mb-2">
                          Preferred Timeline
                        </label>
                        <select className="w-full px-4 py-3 border border-ocean-200 focus:border-wood-500 focus:outline-none transition-colors bg-white">
                          <option value="">Select timeline</option>
                          <option value="asap">As soon as possible</option>
                          <option value="1-3months">1-3 months</option>
                          <option value="3-6months">3-6 months</option>
                          <option value="6months+">6+ months</option>
                          <option value="planning">Just planning</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-ocean-700 text-sm mb-2">
                          Tell Us More About Your Project
                        </label>
                        <textarea
                          rows={5}
                          className="w-full px-4 py-3 border border-ocean-200 focus:border-wood-500 focus:outline-none transition-colors resize-none"
                          placeholder="Describe your vision, any specific requirements, or questions you have..."
                        />
                      </div>

                      <div>
                        <label className="block text-ocean-700 text-sm mb-2">
                          How Did You Hear About Us?
                        </label>
                        <select className="w-full px-4 py-3 border border-ocean-200 focus:border-wood-500 focus:outline-none transition-colors bg-white">
                          <option value="">Select option</option>
                          <option value="google">Google Search</option>
                          <option value="referral">
                            Friend/Family Referral
                          </option>
                          <option value="contractor">
                            Contractor/Architect
                          </option>
                          <option value="social">Social Media</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-wood-600 text-white px-8 py-4 font-medium tracking-wide hover:bg-wood-500 transition-colors"
                  >
                    Request Free Consultation
                  </button>

                  <p className="text-ocean-500 text-sm text-center">
                    By submitting this form, you agree to be contacted by Scenic
                    Doors regarding your project.
                  </p>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
