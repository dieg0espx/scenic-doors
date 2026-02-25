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
            <section className="py-24">
              <div className="section-container">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-primary-500 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                      {overviewLabel}
                    </span>
                    <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-6">
                      {overviewTitle}
                    </h2>
                    <p className="text-ocean-600 mb-6">{overviewDescription}</p>
                    {overviewDescriptionExtra && (
                      <p className="text-ocean-600 mb-8">{overviewDescriptionExtra}</p>
                    )}
                    <ul className="space-y-4">
                      {features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
                          <span className="text-ocean-700">{feature}</span>
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
              <section className="py-24 bg-white">
                <div className="section-container max-w-5xl">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                  >
                    <span className="text-primary-500 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                      Specifications
                    </span>
                    <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-4">
                      Product Details
                    </h2>
                    <p className="text-ocean-600 max-w-2xl mx-auto">
                      Comprehensive specifications for your reference
                    </p>
                  </motion.div>

                  <SpecificationsTable specifications={detailedSpecifications} />
                </div>
              </section>
            )}

            {/* Engineering Features */}
            {engineeringFeatures && engineeringFeatures.length > 0 && (
              <section className="py-24 bg-primary-800">
                <div className="section-container">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                  >
                    <span className="text-primary-300 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                      Engineering Excellence
                    </span>
                    <h2 className="font-heading text-3xl md:text-4xl text-white">
                      Built for Coastal Strength
                    </h2>
                  </motion.div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {engineeringFeatures.map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-primary-900/50 p-8 text-center"
                      >
                        <feature.icon className="w-12 h-12 text-primary-300 mx-auto mb-4" />
                        <h3 className="font-heading text-xl text-white mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-primary-200 text-sm">{feature.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Technical Specifications */}
            {specifications && specifications.length > 0 && (
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
                      Performance
                    </span>
                    <h2 className="font-heading text-3xl md:text-4xl text-ocean-900">
                      Technical Specifications
                    </h2>
                  </motion.div>

                  <div className="grid md:grid-cols-4 gap-8 text-center mb-16">
                    {specifications.map((spec, index) => (
                      <motion.div
                        key={spec.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-primary-800 p-8"
                      >
                        <p className="font-heading text-4xl text-primary-300 mb-1">
                          {spec.value}
                        </p>
                        <p className="text-white/60 text-sm mb-2">{spec.unit}</p>
                        <p className="text-white font-medium">{spec.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Certifications */}
                  {certifications && certifications.length > 0 && (
                    <div className="bg-gray-50 p-8 md:p-12">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {certifications.map((cert) => (
                          <div key={cert.title}>
                            <h4 className="font-heading text-lg text-ocean-900 mb-4">
                              {cert.title}
                            </h4>
                            <ul className="space-y-2 text-ocean-600">
                              {cert.items.map((item) => (
                                <li key={item}>{item}</li>
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
            <section className="py-24 bg-neutral-50">
              <div className="section-container">
                {/* Standard Frame Colors */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="mb-20"
                >
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <h3 className="font-heading text-2xl md:text-3xl text-ocean-900 mb-4">
                        Standard Frame Colors
                      </h3>
                      <p className="text-lg text-ocean-700 mb-4">
                        Clean, Classic, and Ready to Ship
                      </p>
                      <p className="text-ocean-600 mb-6">
                        Our standard colors — black, white, dark brown, and gray — are
                        timeless, neutral tones that work beautifully with most home
                        exteriors and interiors. These powder-coated finishes are
                        factory-applied for long-lasting durability, UV resistance, and
                        a premium look.
                      </p>
                      <p className="text-ocean-600">
                        By choosing a standard color, you benefit from faster
                        production times and a tried-and-true palette that complements
                        both modern and traditional architectural styles. Custom color
                        options are available for those who want to match an exact shade
                        or unique design vision.
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
                  className="mb-20"
                >
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="order-2 lg:order-1 relative w-full aspect-[4/3]">
                      <Image
                        src="/products-styles/682fde1387b844e9893fc4fe_RAL colors v2.webp"
                        alt="RAL custom color palette"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="order-1 lg:order-2">
                      <h3 className="font-heading text-2xl md:text-3xl text-ocean-900 mb-4">
                        Custom RAL Colors
                      </h3>
                      <p className="text-lg text-ocean-700 mb-6">
                        Match Any Design Vision
                      </p>
                      <p className="text-ocean-600 mb-6">
                        For projects requiring exact color matching or unique aesthetic
                        vision, we offer custom powder-coating in any RAL color. The RAL
                        color system provides a standardized palette of over 200 colors,
                        ensuring precise color matching across all project elements.
                      </p>
                      <p className="text-ocean-600">
                        Custom colors are perfect for architects and designers who need
                        to match existing building elements, brand colors, or create a
                        truly distinctive look. All custom finishes receive the same
                        UV-resistant, durable powder coating as our standard colors.
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
                  className="mb-20"
                >
                  <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
                    <div>
                      <h3 className="font-heading text-2xl md:text-3xl text-ocean-900 mb-4">
                        Dual, Triple & Quad Glazing
                      </h3>
                      <p className="text-ocean-600 mb-6">
                        At Scenic Doors, we offer advanced insulated glass units (IGUs) in
                        dual-, triple-, and quad-glazed configurations to give you the
                        perfect balance of thermal comfort, energy efficiency, and sound
                        reduction — no matter your climate or project needs.
                      </p>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-heading text-lg text-ocean-900 mb-2">
                            Dual-Glazed (Double Pane)
                          </h4>
                          <p className="text-ocean-600 text-sm">
                            Two panes of glass with an insulating air or gas-filled space between. A great all-around option for energy efficiency, UV protection, and basic sound reduction.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-heading text-lg text-ocean-900 mb-2">
                            Triple-Glazed (Triple Pane)
                          </h4>
                          <p className="text-ocean-600 text-sm">
                            Three panes of glass with two insulating chambers for superior thermal performance. Ideal for colder climates or noisy environments where extra insulation matters.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-heading text-lg text-ocean-900 mb-2">
                            Quad-Glazed (Quad Pane)
                          </h4>
                          <p className="text-ocean-600 text-sm">
                            Four panes of glass with three insulating layers offer maximum energy efficiency and sound control. Designed for extreme climates, passive homes, or luxury builds where performance is critical.
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
                </motion.div>

                {/* Tinted & Specialty Glass */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-20"
                >
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="order-2 lg:order-1 relative w-full aspect-[4/3]">
                      <Image
                        src="/products-styles/682fde36b49fbd589cb399e5_glass colors.avif"
                        alt="Tinted glass color options"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="order-1 lg:order-2">
                      <h3 className="font-heading text-2xl md:text-3xl text-ocean-900 mb-4">
                        Tinted & Specialty Glass
                      </h3>
                      <p className="text-lg text-ocean-700 mb-6">
                        Performance Built In
                      </p>
                      <p className="text-ocean-600 mb-6">
                        Scenic Doors offers a full range of tinted and specialty glass
                        options engineered for performance, safety, and architectural
                        appeal. Whether you're enhancing energy efficiency, improving
                        privacy, or adding security, our specialty glass systems are
                        designed to meet the demands of high-performance homes and
                        commercial spaces.
                      </p>
                      <p className="text-ocean-600 mb-6">
                        Choose from a variety of glass configurations, including single
                        pane (5–20mm thick), laminated safety glass, double or triple
                        toughened insulated units, and advanced toughened laminated
                        combinations.
                      </p>
                      <p className="text-ocean-600">
                        Our offerings include frosted, Low-E coated, and tinted glass for
                        solar control and glare reduction — as well as fire-rated and
                        bullet-resistant glass for projects that require maximum
                        protection. We also offer acoustic glass for noise reduction and
                        burglar-resistant options for added peace of mind.
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
                  className="mb-20"
                >
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <h3 className="font-heading text-2xl md:text-3xl text-ocean-900 mb-4">
                        Decorative Glass Styles
                      </h3>
                      <p className="text-lg text-ocean-700 mb-6">
                        Privacy with Personality
                      </p>
                      <p className="text-ocean-600 mb-6">
                        Enhance your doors and windows with Scenic's decorative glass
                        options that combine privacy, natural light, and beautiful design.
                        Our textured and patterned glass offerings bring personality to
                        your space while keeping sightlines obscured and interiors bright.
                      </p>
                      <p className="text-ocean-600">
                        From modern minimalist to artisan-inspired styles, our privacy
                        glass selection offers both visual interest and functional
                        performance. Perfect for bathrooms, entryways, and statement
                        openings, these designer glass options elevate the look of any
                        room.
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
                  className="mb-20"
                >
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="order-2 lg:order-1 relative w-full aspect-[4/3]">
                      <Image
                        src="/products-styles/682fca19ba1bb5ac41c770f3_grids v2.avif"
                        alt="Grid styles and muntin patterns"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="order-1 lg:order-2">
                      <h3 className="font-heading text-2xl md:text-3xl text-ocean-900 mb-4">
                        Grid Styles
                      </h3>
                      <p className="text-lg text-ocean-700 mb-6">
                        Classic Detail Meets Modern Flexibility
                      </p>
                      <p className="text-ocean-600">
                        Add character and visual structure to your Scenic Doors with
                        customizable grid styles (muntins) that suit both traditional and
                        contemporary architecture. Choose between surface-applied
                        Simulated Divided Lites (SDL) for bold, dimensional looks or
                        Grille Between Glass (GBG) options for easy cleaning and sleek
                        design. With multiple patterns, finishes, and layout options
                        available, our grids let you personalize your space while
                        maintaining energy efficiency and glass performance.
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
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <h3 className="font-heading text-2xl md:text-3xl text-ocean-900 mb-4">
                        Screen Options
                      </h3>
                      <p className="text-lg text-ocean-700 mb-6">
                        Let Fresh Air In, Keep the Bugs Out
                      </p>
                      <p className="text-ocean-600 mb-6">
                        Scenic Doors offers a variety of high-quality screen systems
                        designed to maximize comfort without compromising your view or
                        style. From durable fiberglass mesh to sleek retractable screens
                        and stainless steel options for extra durability, we provide
                        solutions that blend seamlessly with your door or window system.
                      </p>
                      <p className="text-ocean-600">
                        Our screens are engineered for everyday use, with aluminum alloy
                        frames that keep the mesh tight and secure for years. Whether you
                        need fixed, in-swing, or rolling screens, we'll customize the
                        size, handle height, and finish to suit your home. Every screen is
                        color-matched to your frame, delivering a cohesive look that's
                        both functional and elegant.
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
                    Gallery
                  </span>
                  <h2 className="font-heading text-3xl md:text-4xl text-ocean-900">
                    See It In Action
                  </h2>
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
