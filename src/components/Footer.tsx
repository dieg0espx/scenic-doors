"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const doorLinks = [
  { name: "Folding Glass Walls", href: "/doors/folding" },
  { name: "Multi-Slide Systems", href: "/doors/multi-slide" },
  { name: "Pivot Entry Doors", href: "/doors/pivot" },
  { name: "Project Gallery", href: "/gallery" },
];

const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
  { name: "Free Quote", href: "/quote" },
];

const serviceAreas = [
  { name: "Los Angeles", href: "/service-areas/los-angeles" },
  { name: "Orange County", href: "/service-areas/orange-county" },
  { name: "San Diego", href: "/service-areas/san-diego" },
  { name: "Ventura", href: "/service-areas/ventura" },
];

export default function Footer() {
  return (
    <footer className="bg-ocean-900 relative overflow-hidden">
      {/* Top Accent */}
      <div className="h-1 bg-gradient-to-r from-transparent via-wood-500 to-transparent" />

      {/* Main Footer */}
      <div className="section-container">
        {/* Upper Section - CTA */}
        <div className="py-16 md:py-20 border-b border-ocean-800">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-heading text-3xl md:text-4xl text-white mb-4">
                Ready to transform<br />
                <span className="text-wood-400">your space?</span>
              </h3>
              <p className="text-ocean-400 max-w-md">
                Schedule a complimentary consultation with our design specialists.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <Link
                href="/quote"
                className="group bg-wood-500 text-white px-8 py-4 font-medium tracking-wide inline-flex items-center justify-center gap-2 hover:bg-wood-400 transition-colors"
              >
                Get Free Quote
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <a
                href="tel:8005551234"
                className="border-2 border-ocean-700 text-white px-8 py-4 font-medium tracking-wide inline-flex items-center justify-center gap-2 hover:border-ocean-500 transition-colors"
              >
                <Phone className="w-4 h-4" />
                (800) 555-1234
              </a>
            </div>
          </div>
        </div>

        {/* Middle Section - Links */}
        <div className="py-16 md:py-20 grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="font-heading text-2xl font-semibold tracking-wide text-white">
                SCENIC<span className="text-wood-400">.</span>
              </span>
            </Link>
            <p className="text-ocean-400 text-sm leading-relaxed mb-6 max-w-xs">
              Southern California's premier luxury door installer since 1998.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:info@scenicdoors.com"
                className="flex items-center gap-3 text-ocean-400 hover:text-wood-400 transition-colors text-sm"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                info@scenicdoors.com
              </a>
              <div className="flex items-center gap-3 text-ocean-400 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                Costa Mesa, CA
              </div>
            </div>
          </div>

          {/* Our Doors */}
          <div>
            <h4 className="text-white font-medium mb-6 text-sm tracking-wide uppercase">
              Our Doors
            </h4>
            <ul className="space-y-4">
              {doorLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-ocean-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-medium mb-6 text-sm tracking-wide uppercase">
              Company
            </h4>
            <ul className="space-y-4">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-ocean-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="text-white font-medium mb-6 text-sm tracking-wide uppercase">
              Service Areas
            </h4>
            <ul className="space-y-4">
              {serviceAreas.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-ocean-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-ocean-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-ocean-500 text-sm">
            &copy; 2025 Scenic Doors. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-sm">
            <Link href="/privacy" className="text-ocean-500 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-ocean-500 hover:text-white transition-colors">
              Terms
            </Link>
            <span className="text-ocean-600">CA Lic #123456</span>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-wood-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-ocean-700/20 rounded-full blur-3xl pointer-events-none" />
    </footer>
  );
}
