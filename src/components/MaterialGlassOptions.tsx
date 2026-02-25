"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const glazingOptions = [
  {
    title: "Dual-Glazed (Double Pane)",
    description:
      "Two panes of glass with an insulating air or gas-filled space between. A great all-around option for energy efficiency, UV protection, and basic sound reduction.",
  },
  {
    title: "Triple-Glazed (Triple Pane)",
    description:
      "Three panes of glass with two insulating chambers for superior thermal performance. Ideal for colder climates or noisy environments where extra insulation matters.",
  },
  {
    title: "Quad-Glazed (Quad Pane)",
    description:
      "Four panes of glass with three insulating layers offer maximum energy efficiency and sound control. Designed for extreme climates, passive homes, or luxury builds where performance is critical.",
  },
];

export default function MaterialGlassOptions() {
  return (
    <section className="py-24 bg-neutral-50">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary-500 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
            Customization Options
          </span>
          <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-6">
            Material & Glass Options
          </h2>
          <p className="text-ocean-600">
            Customize your doors with premium materials, advanced glazing, and
            specialty glass options designed for performance, beauty, and
            energy efficiency.
          </p>
        </motion.div>

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
                {glazingOptions.map((option) => (
                  <div key={option.title}>
                    <h4 className="font-heading text-lg text-ocean-900 mb-2">
                      {option.title}
                    </h4>
                    <p className="text-ocean-600 text-sm">{option.description}</p>
                  </div>
                ))}
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
                burglar-resistant options for added peace of mind. Whether you
                need durability, discretion, or specialized performance, Scenic's
                glass options are built to match your project's needs.
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
                maintaining energy efficiency and glass performance. It's the
                perfect blend of form and function.
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
  );
}
