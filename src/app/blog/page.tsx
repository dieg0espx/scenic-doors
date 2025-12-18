"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "How Folding Glass Walls Transform Indoor-Outdoor Living",
    excerpt:
      "Discover how folding glass walls can seamlessly blend your indoor and outdoor spaces, creating a stunning open-concept living experience perfect for Southern California's climate.",
    image:
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070&auto=format&fit=crop",
    category: "Design Inspiration",
    date: "December 15, 2025",
    readTime: "5 min read",
    slug: "folding-glass-walls-indoor-outdoor-living",
  },
  {
    id: 2,
    title: "The Ultimate Guide to Choosing the Right Door System for Your Home",
    excerpt:
      "From folding doors to multi-slide systems and pivot entries, learn which door type best suits your architectural style, lifestyle needs, and budget.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
    category: "Buying Guide",
    date: "December 10, 2025",
    readTime: "8 min read",
    slug: "guide-choosing-right-door-system",
  },
  {
    id: 3,
    title: "Energy Efficiency: What to Look for in Modern Door Systems",
    excerpt:
      "Modern door systems offer impressive energy efficiency features. Learn about thermal breaks, low-E glass, and other technologies that can reduce your energy bills.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    category: "Technology",
    date: "December 5, 2025",
    readTime: "6 min read",
    slug: "energy-efficiency-modern-door-systems",
  },
  {
    id: 4,
    title: "Coastal Living: Best Door Solutions for Beach Homes",
    excerpt:
      "Living near the coast presents unique challenges. Explore door systems designed to withstand salt air, humidity, and provide stunning ocean views.",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
    category: "Coastal Living",
    date: "November 28, 2025",
    readTime: "7 min read",
    slug: "coastal-living-door-solutions-beach-homes",
  },
  {
    id: 5,
    title: "Pivot Doors: Making a Grand Entrance Statement",
    excerpt:
      "Pivot doors are becoming increasingly popular for homeowners looking to make a bold architectural statement. Learn about design options and installation considerations.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2032&auto=format&fit=crop",
    category: "Design Inspiration",
    date: "November 20, 2025",
    readTime: "5 min read",
    slug: "pivot-doors-grand-entrance-statement",
  },
  {
    id: 6,
    title: "Maintaining Your Glass Door Systems: A Seasonal Guide",
    excerpt:
      "Proper maintenance ensures your door systems operate smoothly for years. Follow our seasonal maintenance checklist to protect your investment.",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
    category: "Maintenance",
    date: "November 15, 2025",
    readTime: "4 min read",
    slug: "maintaining-glass-door-systems-seasonal-guide",
  },
];

const categories = [
  "All Posts",
  "Design Inspiration",
  "Buying Guide",
  "Technology",
  "Coastal Living",
  "Maintenance",
];

export default function BlogPage() {
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
                Our Blog
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                Insights & Inspiration
              </h1>
              <p className="text-white/70 text-lg">
                Expert advice, design inspiration, and industry insights to help
                you make informed decisions about your door systems.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 bg-white border-b border-ocean-200">
          <div className="section-container">
            <div className="flex flex-wrap gap-4">
              {categories.map((category, index) => (
                <button
                  key={category}
                  className={`px-6 py-2 font-medium text-sm transition-colors ${
                    index === 0
                      ? "bg-primary-600 text-white"
                      : "bg-primary-50 text-ocean-700 hover:bg-primary-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-16 bg-white">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link href={`/blog/${blogPosts[0].slug}`} className="group block">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={blogPosts[0].image}
                      alt={blogPosts[0].title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary-500 text-white text-xs font-medium px-3 py-1">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-primary-500 text-sm font-medium">
                      {blogPosts[0].category}
                    </span>
                    <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-ocean-900 mt-2 mb-4 group-hover:text-primary-600 transition-colors">
                      {blogPosts[0].title}
                    </h2>
                    <p className="text-ocean-600 mb-6 leading-relaxed">
                      {blogPosts[0].excerpt}
                    </p>
                    <div className="flex items-center gap-6 text-ocean-500 text-sm mb-6">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {blogPosts[0].date}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {blogPosts[0].readTime}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-2 text-primary-600 font-medium group-hover:gap-3 transition-all">
                      Read Article
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16 bg-primary-50">
          <div className="section-container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(1).map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <div className="bg-white overflow-hidden">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <span className="text-primary-500 text-sm font-medium">
                          {post.category}
                        </span>
                        <h3 className="font-heading text-xl text-ocean-900 mt-2 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-ocean-600 text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-ocean-500 text-xs">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {/* Load More */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mt-12"
            >
              <button className="bg-primary-600 text-white px-8 py-4 font-medium tracking-wide hover:bg-primary-500 transition-colors">
                Load More Articles
              </button>
            </motion.div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-24 bg-primary-800">
          <div className="section-container">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-heading text-3xl md:text-4xl text-white mb-4">
                  Stay Inspired
                </h2>
                <p className="text-primary-200 mb-8">
                  Subscribe to our newsletter for the latest design trends,
                  product updates, and exclusive insights delivered to your
                  inbox.
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-white/10 border border-primary-600 text-white placeholder:text-primary-300 focus:border-primary-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-white text-primary-700 px-6 py-3 font-medium hover:bg-primary-100 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="text-primary-300 text-xs mt-4">
                  No spam, unsubscribe anytime.
                </p>
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
