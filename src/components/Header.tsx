"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Phone } from "lucide-react";

const doorTypes = [
  {
    name: "Multi-Slide Systems",
    description: "Effortless operation, expansive design",
    href: "/doors/multi-slide",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
  },
  {
    name: "Bifold / Folding Doors",
    description: "Transform walls into seamless transitions",
    href: "/doors/folding",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
  },
  {
    name: "Slide & Stack Systems",
    description: "Ultimate flexibility for open living",
    href: "/doors/slide-stack",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop",
  },
  {
    name: "Pivot Entry Doors",
    description: "Bold architectural presence",
    href: "/doors/pivot",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop",
  },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHeaderWhite = isScrolled || activeDropdown === "doors";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-3 ${
        isHeaderWhite
          ? "bg-white backdrop-blur-md shadow-lg"
          : "bg-transparent"
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
                  isHeaderWhite
                    ? "text-ocean-800 hover:text-primary-500"
                    : "text-white/90 hover:text-primary-300"
                }`}
              >
                Our Doors
                <ChevronDown className="w-4 h-4" />
              </button>
              {/* Invisible bridge to prevent gap */}
              <div className="absolute left-0 right-0 h-4 top-full" />
              <AnimatePresence>
                {activeDropdown === "doors" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="fixed left-0 right-0 top-[65px] bg-white shadow-xl z-40 pt-[5px] pb-[10px]"
                  >
                    <div className="section-container py-10">
                      <div className="grid grid-cols-12 gap-8">
                        {/* Door Types with Images */}
                        <div className="col-span-8">
                          <h3 className="text-sm font-semibold text-ocean-400 uppercase tracking-wider mb-4">
                            Door Collections
                          </h3>
                          <div className="grid grid-cols-4 gap-4">
                            {doorTypes.map((door) => (
                              <Link
                                key={door.name}
                                href={door.href}
                                className="group"
                              >
                                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
                                  <Image
                                    src={door.image}
                                    alt={door.name}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                </div>
                                <span className="block font-medium text-ocean-800 group-hover:text-primary-500 transition-colors">
                                  {door.name}
                                </span>
                                <span className="block text-sm text-ocean-500 mt-1">
                                  {door.description}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Quick Links & CTA */}
                        <div className="col-span-4 border-l border-sand-200 pl-8">
                          <h3 className="text-sm font-semibold text-ocean-400 uppercase tracking-wider mb-4">
                            Quick Links
                          </h3>
                          <div className="space-y-3 mb-6">
                            <Link
                              href="/doors"
                              className="flex items-center gap-2 text-ocean-700 hover:text-primary-500 transition-colors font-medium"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                              View All Doors
                            </Link>
                            <Link
                              href="/gallery"
                              className="flex items-center gap-2 text-ocean-700 hover:text-primary-500 transition-colors font-medium"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                              Project Gallery
                            </Link>
                            <Link
                              href="/quote"
                              className="flex items-center gap-2 text-ocean-700 hover:text-primary-500 transition-colors font-medium"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                              Request a Quote
                            </Link>
                          </div>

                          {/* Featured CTA */}
                          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg p-5 text-white">
                            <h4 className="font-semibold mb-2">Free Consultation</h4>
                            <p className="text-sm text-white/90 mb-4">
                              Get expert advice on choosing the perfect doors for your home.
                            </p>
                            <Link
                              href="/quote"
                              className="inline-block bg-white text-primary-600 font-medium text-sm px-4 py-2 rounded hover:bg-sand-100 transition-colors"
                            >
                              Schedule Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink href="/gallery" isWhite={isHeaderWhite}>
              Gallery
            </NavLink>
            <NavLink href="/about" isWhite={isHeaderWhite}>
              About
            </NavLink>
            <NavLink href="/installation" isWhite={isHeaderWhite}>
              Installation
            </NavLink>
            <NavLink href="/blog" isWhite={isHeaderWhite}>
              Blog
            </NavLink>
            <NavLink href="/contact" isWhite={isHeaderWhite}>
              Contact
            </NavLink>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:818-427-6690"
              className={`flex items-center gap-2 font-medium transition-colors ${
                isHeaderWhite
                  ? "text-ocean-800 hover:text-primary-500"
                  : "text-white/90 hover:text-primary-300"
              }`}
            >
              <Phone className="w-4 h-4" />
              818-427-6690
            </a>
            <Link
              href="/quote"
              className="btn-primary rounded-sm text-sm px-6 py-3"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden relative z-10 p-2 ${isHeaderWhite ? "text-ocean-800" : "text-white"}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-ocean-900 mt-4 rounded-lg overflow-hidden"
            >
              <div className="py-6 px-4 space-y-4">
                <div>
                  <span className="text-wood-400 text-sm font-medium uppercase tracking-wide">
                    Our Doors
                  </span>
                  <div className="mt-2 space-y-2">
                    {doorTypes.map((door) => (
                      <MobileNavLink
                        key={door.name}
                        href={door.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {door.name}
                      </MobileNavLink>
                    ))}
                  </div>
                </div>
                <MobileNavLink
                  href="/gallery"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Gallery
                </MobileNavLink>
                <MobileNavLink
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </MobileNavLink>
                <MobileNavLink
                  href="/installation"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Installation
                </MobileNavLink>
                <MobileNavLink
                  href="/blog"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </MobileNavLink>
                <MobileNavLink
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </MobileNavLink>
                <div className="pt-4 border-t border-ocean-700">
                  <Link
                    href="/quote"
                    className="block btn-primary rounded-sm text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get a Free Quote
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
  isWhite,
}: {
  href: string;
  children: React.ReactNode;
  isWhite: boolean;
}) {
  return (
    <Link
      href={href}
      className={`font-medium transition-colors duration-300 ${
        isWhite
          ? "text-ocean-800 hover:text-primary-500"
          : "text-white/90 hover:text-primary-300"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      className="block text-white/90 hover:text-wood-400 transition-colors py-2"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
