"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Phone } from "lucide-react";

const doorTypes = [
  {
    name: "Folding Glass Walls",
    description: "Transform walls into seamless transitions",
    href: "/doors/folding",
  },
  {
    name: "Multi-Slide Systems",
    description: "Effortless operation, expansive design",
    href: "/doors/multi-slide",
  },
  {
    name: "Pivot Entry Doors",
    description: "Bold architectural presence",
    href: "/doors/pivot",
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-ocean-900/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="section-container">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <span
              className={`font-heading text-2xl md:text-3xl font-semibold tracking-wide transition-colors duration-300 ${
                isScrolled ? "text-white" : "text-white"
              }`}
            >
              SCENIC <span className="text-wood-400">DOORS</span>
            </span>
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
                    ? "text-white/90 hover:text-wood-400"
                    : "text-white/90 hover:text-wood-300"
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
                    {doorTypes.map((door) => (
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
              href="tel:8005551234"
              className={`flex items-center gap-2 font-medium transition-colors ${
                isScrolled
                  ? "text-white/90 hover:text-wood-400"
                  : "text-white/90 hover:text-wood-300"
              }`}
            >
              <Phone className="w-4 h-4" />
              (800) 555-1234
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
            className="lg:hidden relative z-10 p-2 text-white"
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
          ? "text-white/90 hover:text-wood-400"
          : "text-white/90 hover:text-wood-300"
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
