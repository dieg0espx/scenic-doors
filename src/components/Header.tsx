"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { useQuoteModal } from "@/context/QuoteModalContext";

const doorTypes = [
  {
    name: "Folding Glass Walls",
    href: "/doors/folding",
  },
  {
    name: "Multi-Slide Systems",
    href: "/doors/multi-slide",
  },
  {
    name: "Pivot Entry Doors",
    href: "/doors/pivot",
  },
];

const serviceTypes = [
  {
    name: "Garage Door Repair",
    href: "/services/garage-door-repair",
  },
  {
    name: "Garage Door Installation",
    href: "/services/garage-door-installation",
  },
  {
    name: "Opener Services",
    href: "/services/opener-services",
  },
  {
    name: "Spring Replacement",
    href: "/services/spring-replacement",
  },
  {
    name: "Emergency Service",
    href: "/services/emergency-service",
  },
];

const desktopDoorTypes = doorTypes.map((d) => ({
  ...d,
  description:
    d.name === "Folding Glass Walls"
      ? "Transform walls into seamless transitions"
      : d.name === "Multi-Slide Systems"
        ? "Effortless operation, expansive design"
        : "Bold architectural presence",
}));

const desktopServiceTypes = serviceTypes.map((s) => ({
  ...s,
  description:
    s.name === "Garage Door Repair"
      ? "Fast, reliable repair for all issues"
      : s.name === "Garage Door Installation"
        ? "Professional new door installation"
        : s.name === "Opener Services"
          ? "Repair and install door openers"
          : s.name === "Spring Replacement"
            ? "Safe, professional spring service"
            : "24/7 emergency garage door help",
}));

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const { openQuoteModal } = useQuoteModal();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileAccordion(null);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white backdrop-blur-md shadow-lg py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="section-container">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative z-10">
              <Image
                src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif"
                alt="Scenic Doors & Windows"
                width={180}
                height={50}
                className="h-10 md:h-12 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Our Doors Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("doors")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={`flex items-center gap-1 font-medium transition-colors duration-300 ${
                    isScrolled
                      ? "text-ocean-800 hover:text-primary-500"
                      : "text-white/90 hover:text-primary-300"
                  }`}
                >
                  Our Doors
                  <ChevronDown className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {activeDropdown === "doors" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl overflow-hidden"
                    >
                      {desktopDoorTypes.map((door) => (
                        <Link
                          key={door.name}
                          href={door.href}
                          className="block px-5 py-4 hover:bg-sand-100 transition-colors"
                        >
                          <span className="block font-medium text-ocean-800">
                            {door.name}
                          </span>
                          <span className="block text-sm text-ocean-500">
                            {door.description}
                          </span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("services")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={`flex items-center gap-1 font-medium transition-colors duration-300 ${
                    isScrolled
                      ? "text-ocean-800 hover:text-primary-500"
                      : "text-white/90 hover:text-primary-300"
                  }`}
                >
                  Services
                  <ChevronDown className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {activeDropdown === "services" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl overflow-hidden"
                    >
                      {desktopServiceTypes.map((service) => (
                        <Link
                          key={service.name}
                          href={service.href}
                          className="block px-5 py-4 hover:bg-sand-100 transition-colors"
                        >
                          <span className="block font-medium text-ocean-800">
                            {service.name}
                          </span>
                          <span className="block text-sm text-ocean-500">
                            {service.description}
                          </span>
                        </Link>
                      ))}
                      <Link
                        href="/services"
                        className="block px-5 py-3 bg-sand-50 text-primary-600 font-medium hover:bg-sand-100 transition-colors border-t border-sand-200"
                      >
                        View All Services →
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavLink href="/gallery" isScrolled={isScrolled}>
                Gallery
              </NavLink>
              <NavLink href="/about" isScrolled={isScrolled}>
                About
              </NavLink>
              <NavLink href="/blog" isScrolled={isScrolled}>
                Blog
              </NavLink>
              <NavLink href="/contact" isScrolled={isScrolled}>
                Contact
              </NavLink>
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="tel:818-427-6690"
                className={`flex items-center gap-2 font-medium transition-colors ${
                  isScrolled
                    ? "text-ocean-800 hover:text-primary-500"
                    : "text-white/90 hover:text-primary-300"
                }`}
              >
                <Phone className="w-4 h-4" />
                818-427-6690
              </a>
              <button
                onClick={openQuoteModal}
                className="btn-primary rounded-sm text-sm px-6 py-3"
              >
                Get a Quote
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden relative z-[60] p-2 ${
                isMobileMenuOpen
                  ? "text-white"
                  : isScrolled
                    ? "text-ocean-800"
                    : "text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu - Full Screen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[55] lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-ocean-900/95 backdrop-blur-sm"
              onClick={closeMobileMenu}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-ocean-900 shadow-2xl overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={closeMobileMenu}
                className="absolute top-6 right-6 p-2 text-white hover:text-primary-300 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="pt-20 pb-8 px-6">
                {/* Phone CTA */}
                <a
                  href="tel:818-427-6690"
                  className="flex items-center justify-center gap-3 bg-primary-500 text-white py-4 px-6 mb-8 font-medium"
                  onClick={closeMobileMenu}
                >
                  <Phone className="w-5 h-5" />
                  Call: 818-427-6690
                </a>

                {/* Navigation Links */}
                <nav className="space-y-2">
                  {/* Our Doors Accordion */}
                  <div className="border-b border-ocean-800">
                    <button
                      className="flex items-center justify-between w-full py-4 text-white font-medium"
                      onClick={() =>
                        setMobileAccordion(
                          mobileAccordion === "doors" ? null : "doors"
                        )
                      }
                    >
                      <span>Our Doors</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          mobileAccordion === "doors" ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {mobileAccordion === "doors" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pb-4 pl-4 space-y-1">
                            {doorTypes.map((door) => (
                              <Link
                                key={door.name}
                                href={door.href}
                                className="block py-2 text-ocean-300 hover:text-white transition-colors"
                                onClick={closeMobileMenu}
                              >
                                {door.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Services Accordion */}
                  <div className="border-b border-ocean-800">
                    <button
                      className="flex items-center justify-between w-full py-4 text-white font-medium"
                      onClick={() =>
                        setMobileAccordion(
                          mobileAccordion === "services" ? null : "services"
                        )
                      }
                    >
                      <span>Services</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          mobileAccordion === "services" ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {mobileAccordion === "services" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pb-4 pl-4 space-y-1">
                            {serviceTypes.map((service) => (
                              <Link
                                key={service.name}
                                href={service.href}
                                className="block py-2 text-ocean-300 hover:text-white transition-colors"
                                onClick={closeMobileMenu}
                              >
                                {service.name}
                              </Link>
                            ))}
                            <Link
                              href="/services"
                              className="block py-2 text-primary-400 hover:text-primary-300 transition-colors font-medium"
                              onClick={closeMobileMenu}
                            >
                              View All Services →
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Simple Links */}
                  <Link
                    href="/gallery"
                    className="block py-4 text-white font-medium border-b border-ocean-800"
                    onClick={closeMobileMenu}
                  >
                    Gallery
                  </Link>
                  <Link
                    href="/about"
                    className="block py-4 text-white font-medium border-b border-ocean-800"
                    onClick={closeMobileMenu}
                  >
                    About
                  </Link>
                  <Link
                    href="/blog"
                    className="block py-4 text-white font-medium border-b border-ocean-800"
                    onClick={closeMobileMenu}
                  >
                    Blog
                  </Link>
                  <Link
                    href="/contact"
                    className="block py-4 text-white font-medium border-b border-ocean-800"
                    onClick={closeMobileMenu}
                  >
                    Contact
                  </Link>
                </nav>

                {/* Quote Button */}
                <button
                  className="w-full mt-8 bg-white text-ocean-900 py-4 px-6 font-medium hover:bg-ocean-100 transition-colors"
                  onClick={() => {
                    closeMobileMenu();
                    openQuoteModal();
                  }}
                >
                  Get a Free Quote
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({
  href,
  children,
  isScrolled,
}: {
  href: string;
  children: React.ReactNode;
  isScrolled: boolean;
}) {
  return (
    <Link
      href={href}
      className={`font-medium transition-colors duration-300 ${
        isScrolled
          ? "text-ocean-800 hover:text-primary-500"
          : "text-white/90 hover:text-primary-300"
      }`}
    >
      {children}
    </Link>
  );
}
