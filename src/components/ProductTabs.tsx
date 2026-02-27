"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, LucideIcon } from "lucide-react";
import Image from "next/image";
import SpecificationsTable, { SpecificationRow } from "@/components/SpecificationsTable";

interface Tab {
  id: string;
  label: string;
}

interface Specification {
  label: string;
  value: string;
  unit: string;
}

interface EngineeringFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Configuration {
  title: string;
  description: string;
  features?: string[];
}

interface Option {
  title: string;
  description: string;
  note?: string;
}

interface GlazingOption {
  title: string;
  description: string;
}

export interface ProductTabsProps {
  // Overview tab
  overviewLabel?: string;
  overviewTitle: string;
  overviewDescription: string;
  overviewDescriptionExtra?: string;
  features: string[];
  featuredImages: {
    main: string;
    mainAlt: string;
    secondary: string;
    secondaryAlt: string;
    tertiary: string;
    tertiaryAlt: string;
  };

  // Specifications tab
  specifications?: Specification[];
  detailedSpecifications?: SpecificationRow[];
  engineeringFeatures?: EngineeringFeature[];
  certifications?: {
    title: string;
    items: string[];
  }[];

  // Gallery tab
  gallery: string[];
  galleryAltPrefix: string;

  // Options tab
  configurations?: Configuration[];
  configurationsTitle?: string;
  configurationsSubtitle?: string;
  glazingOptions?: GlazingOption[];
  glassOptions?: string[];
  frameColorOptions?: Option;
  screenOptions?: Option;
  customOptions?: Option[];

  // Preview tab (optional)
  previewComponent?: React.ReactNode;
}

const defaultTabs: Tab[] = [
  { id: "overview", label: "Overview" },
  { id: "specifications", label: "Specifications" },
  { id: "materials", label: "Materials & Glass" },
  { id: "gallery", label: "Gallery" },
];

export default function ProductTabs({
  overviewLabel = "Features",
  overviewTitle,
  overviewDescription,
  overviewDescriptionExtra,
  features,
  featuredImages,
  specifications,
  detailedSpecifications,
  engineeringFeatures,
  certifications,
  gallery,
  galleryAltPrefix,
  configurations,
  configurationsTitle = "Configurations",
  configurationsSubtitle,
  glazingOptions,
  glassOptions,
  frameColorOptions,
  screenOptions,
  customOptions,
  previewComponent,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Add preview tab if component is provided
  const tabs = previewComponent
    ? [...defaultTabs, { id: "preview", label: "Preview" }]
    : defaultTabs;

  return (
    <div className="bg-white">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 sticky top-[72px] bg-white z-30">
        <div className="section-container">
          <nav className="flex gap-8 overflow-x-auto scrollbar-hide" aria-label="Product tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-500"
                    : "border-transparent text-ocean-500 hover:text-ocean-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <section className="py-16 md:py-24">
              <div className="section-container">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                      {overviewLabel}
                    </span>
                    <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-6">
                      {overviewTitle}
                    </h2>
                    <p className="text-ocean-600 mb-6 leading-relaxed">{overviewDescription}</p>
                    {overviewDescriptionExtra && (
                      <p className="text-ocean-600 mb-8 leading-relaxed">{overviewDescriptionExtra}</p>
                    )}
                    <ul className="space-y-3">
                      {features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
                          <span className="text-ocean-700 leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="col-span-2">
                      <img
                        src={featuredImages.main}
                        alt={featuredImages.mainAlt}
                        className="w-full aspect-video object-cover"
                      />
                    </div>
                    <div>
                      <img
                        src={featuredImages.secondary}
                        alt={featuredImages.secondaryAlt}
                        className="w-full aspect-square object-cover"
                      />
                    </div>
                    <div>
                      <img
                        src={featuredImages.tertiary}
                        alt={featuredImages.tertiaryAlt}
                        className="w-full aspect-square object-cover"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* Specifications Tab */}
        {activeTab === "specifications" && (
          <motion.div
            key="specifications"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Detailed Specifications Table */}
            {detailedSpecifications && detailedSpecifications.length > 0 && (
              <section className="py-16 md:py-24 bg-white">
                <div className="section-container max-w-5xl">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                  >
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                      Specifications
                    </span>
                    <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-4">
                      Product Details
                    </h2>
                    <p className="text-ocean-600 max-w-2xl mx-auto leading-relaxed">
                      Comprehensive specifications for your reference
                    </p>
                  </motion.div>

                  <SpecificationsTable specifications={detailedSpecifications} />
                </div>
              </section>
            )}

            {/* Engineering Features */}
            {engineeringFeatures && engineeringFeatures.length > 0 && (
              <section className="py-16 md:py-24 bg-gradient-to-br from-primary-800 to-primary-900">
                <div className="section-container">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 md:mb-16"
                  >
                    <span className="inline-block px-3 py-1 bg-primary-700 text-primary-100 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                      Engineering Excellence
                    </span>
                    <h2 className="font-heading text-3xl md:text-4xl text-white mb-4">
                      Built for Coastal Strength
                    </h2>
                    <p className="text-primary-200 max-w-2xl mx-auto">
                      Engineered to withstand the toughest conditions
                    </p>
                  </motion.div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {engineeringFeatures.map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white/10 backdrop-blur-sm p-6 md:p-8 text-center hover:bg-white/15 transition-colors"
                      >
                        <div className="bg-primary-700 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                          <feature.icon className="w-8 h-8 text-primary-100" />
                        </div>
                        <h3 className="font-heading text-lg md:text-xl text-white mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-primary-200 text-sm leading-relaxed">{feature.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Technical Specifications */}
            {specifications && specifications.length > 0 && (
              <section className="py-16 md:py-24 bg-white">
                <div className="section-container">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 md:mb-16"
                  >
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                      Performance
                    </span>
                    <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-4">
                      Technical Specifications
                    </h2>
                    <p className="text-ocean-600 max-w-2xl mx-auto">
                      Key performance metrics that matter
                    </p>
                  </motion.div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {specifications.map((spec, index) => (
                      <motion.div
                        key={spec.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-gradient-to-br from-primary-800 to-primary-900 p-6 md:p-8 text-center"
                      >
                        <p className="font-heading text-3xl md:text-4xl text-primary-100 mb-1">
                          {spec.value}
                        </p>
                        <p className="text-primary-300 text-sm mb-2">{spec.unit}</p>
                        <p className="text-white font-medium">{spec.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Certifications */}
                  {certifications && certifications.length > 0 && (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 md:p-12">
                      <h3 className="font-heading text-2xl text-ocean-900 text-center mb-8">
                        Certifications & Standards
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {certifications.map((cert) => (
                          <div key={cert.title} className="bg-white p-6">
                            <h4 className="font-heading text-lg text-ocean-900 mb-4 pb-3">
                              {cert.title}
                            </h4>
                            <ul className="space-y-2">
                              {cert.items.map((item) => (
                                <li key={item} className="flex items-start gap-2 text-ocean-600 text-sm">
                                  <Check className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </motion.div>
        )}

        {/* Materials & Glass Tab */}
        {activeTab === "materials" && (
          <motion.div
            key="materials"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <section className="py-16 md:py-24 bg-white">
              <div className="section-container">
                {/* Standard Frame Colors */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="mb-24"
                >
                  <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center bg-gray-50 p-8 md:p-12">
                    <div>
                      <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                        Frame Finishes
                      </span>
                      <h3 className="font-heading text-2xl md:text-3xl text-ocean-900 mb-3">
                        Standard Frame Colors
                      </h3>
                      <p className="text-lg font-medium text-primary-600 mb-6">
                        Clean, Classic, and Ready to Ship
                      </p>
                      <p className="text-ocean-600 leading-relaxed">
                        Our standard colors — black, white, dark brown, and gray — feature durable powder-coated finishes with UV resistance. These timeless tones complement both modern and traditional styles, offering faster production and reliable performance.
                      </p>
                    </div>
                    <div className="relative w-full aspect-square">
                      <Image
                        src="/products-styles/682fe0146bba8702e888d643_standard-colors.avif"
                        alt="Standard frame colors: Black, White, Dark Brown, and Grey"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Custom RAL Colors */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.05 }}
                  className="mb-24"
                >
                  <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="order-2 lg:order-1 relative w-full aspect-[4/3]">
                      <Image
                        src="/products-styles/682fde1387b844e9893fc4fe_RAL colors v2.webp"
                        alt="RAL custom color palette"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="order-1 lg:order-2">
                      <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                        Custom Options
                      </span>
                      <h3 className="font-heading text-2xl md:text-3xl text-ocean-900 mb-3">
                        Custom RAL Colors
                      </h3>
                      <p className="text-lg font-medium text-primary-600 mb-6">
                        Match Any Design Vision
                      </p>
                      <p className="text-ocean-600 leading-relaxed">
                        We offer custom powder-coating in any RAL color for precise matching. With over 200 standardized colors available, you can match existing elements or create a distinctive look with the same UV-resistant, durable finish as our standard colors.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Dual, Triple & Quad Glazing */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mb-24"
                >
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 p-8 md:p-12">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                      <div>
                        <span className="inline-block px-3 py-1 bg-white text-primary-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                          Glass Technology
                        </span>
                        <h3 className="font-heading text-2xl md:text-3xl text-ocean-900 mb-4">
                          Dual, Triple & Quad Glazing
                        </h3>
                        <p className="text-ocean-600 mb-8 leading-relaxed">
                          Choose from dual-, triple-, or quad-glazed insulated glass units for optimal thermal comfort, energy efficiency, and sound reduction.
                        </p>
                        <div className="space-y-4">
                          <div className="bg-white p-4">
                            <h4 className="font-heading text-base md:text-lg text-ocean-900 mb-1 font-semibold">
                              Dual-Glazed
                            </h4>
                            <p className="text-ocean-600 text-sm leading-relaxed">
                              Great all-around option for energy efficiency and sound reduction.
                            </p>
                          </div>
                          <div className="bg-white p-4">
                            <h4 className="font-heading text-base md:text-lg text-ocean-900 mb-1 font-semibold">
                              Triple-Glazed
                            </h4>
                            <p className="text-ocean-600 text-sm leading-relaxed">
                              Superior thermal performance for colder climates and noisy environments.
                            </p>
                          </div>
                          <div className="bg-white p-4">
                            <h4 className="font-heading text-base md:text-lg text-ocean-900 mb-1 font-semibold">
                              Quad-Glazed
                            </h4>
                            <p className="text-ocean-600 text-sm leading-relaxed">
                              Maximum efficiency for extreme climates and high-performance builds.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="relative w-full aspect-[4/3]">
                        <Image
                          src="/products-styles/682fc8698b0c670648905259_ig units.avif"
                          alt="Insulated glass units showing dual, triple, and quad glazing configurations"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Tinted & Specialty Glass */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-24"
                >
                  <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="order-2 lg:order-1 relative w-full aspect-[4/3]">
                      <Image
                        src="/products-styles/682fde36b49fbd589cb399e5_glass colors.avif"
                        alt="Tinted glass color options"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="order-1 lg:order-2">
                      <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                        Specialty Glass
                      </span>
                      <h3 className="font-heading text-2xl md:text-3xl text-ocean-900 mb-3">
                        Tinted & Specialty Glass
                      </h3>
                      <p className="text-lg font-medium text-primary-600 mb-6">
                        Performance Built In
                      </p>
                      <p className="text-ocean-600 leading-relaxed">
                        Our specialty glass options are engineered for performance, safety, and architectural appeal. Choose from tinted, frosted, Low-E coated, laminated safety, fire-rated, bullet-resistant, acoustic, and burglar-resistant glass in various thicknesses and configurations to meet your project needs.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Decorative Glass Styles */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mb-24"
                >
                  <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center bg-gray-50 p-8 md:p-12">
                    <div>
                      <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                        Privacy Solutions
                      </span>
                      <h3 className="font-heading text-2xl md:text-3xl text-ocean-900 mb-3">
                        Decorative Glass Styles
                      </h3>
                      <p className="text-lg font-medium text-primary-600 mb-6">
                        Privacy with Personality
                      </p>
                      <p className="text-ocean-600 leading-relaxed">
                        Our decorative glass options combine privacy with natural light through textured and patterned designs. From modern minimalist to artisan-inspired styles, these designer glass selections add visual interest while maintaining functional performance.
                      </p>
                    </div>
                    <div className="relative w-full aspect-square">
                      <Image
                        src="/products-styles/682fc890bd712ef0155cfbce_glass patterns.avif"
                        alt="Decorative glass patterns and textures"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Grid Styles */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mb-24"
                >
                  <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="order-2 lg:order-1 relative w-full aspect-[4/3]">
                      <Image
                        src="/products-styles/682fca19ba1bb5ac41c770f3_grids v2.avif"
                        alt="Grid styles and muntin patterns"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="order-1 lg:order-2">
                      <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                        Design Details
                      </span>
                      <h3 className="font-heading text-2xl md:text-3xl text-ocean-900 mb-3">
                        Grid Styles
                      </h3>
                      <p className="text-lg font-medium text-primary-600 mb-6">
                        Classic Detail Meets Modern Flexibility
                      </p>
                      <p className="text-ocean-600 leading-relaxed">
                        Customize your doors with grid styles (muntins) for traditional or contemporary looks. Choose surface-applied Simulated Divided Lites (SDL) for dimensional impact or Grille Between Glass (GBG) for easy cleaning, with multiple patterns and finishes available.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Screen Options */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center bg-gray-50 p-8 md:p-12">
                    <div>
                      <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                        Ventilation
                      </span>
                      <h3 className="font-heading text-2xl md:text-3xl text-ocean-900 mb-3">
                        Screen Options
                      </h3>
                      <p className="text-lg font-medium text-primary-600 mb-6">
                        Let Fresh Air In, Keep the Bugs Out
                      </p>
                      <p className="text-ocean-600 leading-relaxed">
                        High-quality screen systems with durable fiberglass mesh, retractable options, or stainless steel for extra durability. Available in fixed, in-swing, or rolling styles with aluminum alloy frames. Each screen is color-matched to your frame for a cohesive, elegant look.
                      </p>
                    </div>
                    <div className="relative w-full aspect-[4/3]">
                      <Image
                        src="/products-styles/682fc8d6669955c97bc15021_screens.avif"
                        alt="Screen options for doors and windows"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <section className="py-16 md:py-24 bg-white">
              <div className="section-container">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-12 md:mb-16"
                >
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                    Gallery
                  </span>
                  <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-4">
                    See It In Action
                  </h2>
                  <p className="text-ocean-600 max-w-2xl mx-auto">
                    Explore our product installations in real-world settings
                  </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gallery.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className={index === 0 ? "col-span-2 md:col-span-2 row-span-2" : ""}
                    >
                      <img
                        src={image}
                        alt={`${galleryAltPrefix} ${index + 1}`}
                        className="w-full h-full object-cover aspect-[4/3]"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        )}


        {/* Preview Tab */}
        {activeTab === "preview" && previewComponent && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <section className="py-0 bg-gray-50">
              {previewComponent}
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
