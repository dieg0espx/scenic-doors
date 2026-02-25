"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2 } from "lucide-react";

const blogPosts: Record<string, {
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  content: string[];
}> = {
  "folding-glass-walls-indoor-outdoor-living": {
    title: "How Folding Glass Walls Transform Indoor-Outdoor Living",
    excerpt:
      "Discover how folding glass walls can seamlessly blend your indoor and outdoor spaces, creating a stunning open-concept living experience perfect for Southern California's climate.",
    image:
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070&auto=format&fit=crop",
    category: "Design Inspiration",
    date: "December 15, 2025",
    readTime: "5 min read",
    content: [
      "Southern California's year-round sunshine and mild climate make it the perfect setting for indoor-outdoor living. Folding glass walls, also known as bi-fold doors or accordion doors, have revolutionized how homeowners experience their living spaces, creating seamless transitions between interior comfort and exterior beauty.",

      "## The Magic of Disappearing Walls",

      "Unlike traditional sliding doors that limit your opening to a fraction of the wall space, folding glass walls can open up to 90% or more of your wall opening. When fully opened, the panels stack neatly to one side, essentially making the wall disappear. This creates an unobstructed flow between your living room, kitchen, or bedroom and your patio, pool area, or garden.",

      "## Benefits Beyond Aesthetics",

      "While the visual impact is undeniable, folding glass walls offer numerous practical benefits:",

      "**Natural Light**: Floor-to-ceiling glass panels flood your interior spaces with natural light, reducing the need for artificial lighting during the day and creating a more inviting atmosphere.",

      "**Ventilation**: Opening your walls allows fresh ocean breezes or mountain air to flow through your home, improving air quality and reducing reliance on air conditioning.",

      "**Expanded Living Space**: Your outdoor areas become true extensions of your interior, effectively increasing your usable living space without adding square footage.",

      "**Entertainment Ready**: Hosting becomes effortless when guests can flow freely between indoor and outdoor spaces. Your kitchen connects directly to the outdoor dining area, making serving and socializing seamless.",

      "## Design Considerations",

      "When planning your folding glass wall installation, consider these key factors:",

      "**Orientation**: South and west-facing installations will receive the most sunlight. Consider how this affects your interior temperature and furniture placement.",

      "**Threshold Options**: Choose between flush thresholds for seamless transitions or raised thresholds for better weather resistance in exposed locations.",

      "**Glass Selection**: Low-E coatings, tinted glass, or laminated options can address privacy, UV protection, and energy efficiency concerns.",

      "**Panel Configuration**: Work with your installer to determine the optimal number and size of panels for your opening and how they should stack when open.",

      "## Perfect for Southern California Living",

      "With over 280 sunny days per year, Southern California residents can maximize their investment in folding glass walls. Whether you're in a Malibu beach house, a Beverly Hills estate, or a San Diego coastal home, these systems allow you to embrace the outdoor lifestyle that makes our region so special.",

      "At Scenic Doors, we've installed hundreds of folding glass wall systems throughout Southern California. Our factory-certified installers work with premium brands like LaCantina, Western Window Systems, and Fleetwood to ensure your installation meets the highest standards of quality and craftsmanship.",

      "Ready to transform your living space? Contact us for a free consultation and discover how folding glass walls can bring the outdoors in.",
    ],
  },
  "guide-choosing-right-door-system": {
    title: "The Ultimate Guide to Choosing the Right Door System for Your Home",
    excerpt:
      "From folding doors to multi-slide systems and pivot entries, learn which door type best suits your architectural style, lifestyle needs, and budget.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
    category: "Buying Guide",
    date: "December 10, 2025",
    readTime: "8 min read",
    content: [
      "Choosing the right door system for your home is a significant decision that affects your daily living experience, energy efficiency, and property value. With multiple options available, understanding the differences between door types will help you make an informed choice that you'll be happy with for years to come.",

      "## Folding Glass Walls (Bi-Fold Doors)",

      "**Best For**: Maximum opening, entertaining, indoor-outdoor living",

      "Folding glass walls consist of multiple panels that fold and stack against each other, creating the largest possible opening. They're ideal for homeowners who want to completely open up a wall to connect indoor and outdoor spaces.",

      "**Pros**:",
      "- Up to 90%+ clear opening",
      "- Dramatic visual impact",
      "- Excellent ventilation",
      "- Multiple configuration options",

      "**Cons**:",
      "- Requires space for stacked panels",
      "- Higher price point",
      "- More moving parts to maintain",

      "## Multi-Slide Door Systems",

      "**Best For**: Large openings, ease of operation, modern aesthetics",

      "Multi-slide systems feature panels that glide on tracks, either stacking against each other or disappearing into wall pockets. They offer a sleek, contemporary look with effortless operation.",

      "**Pros**:",
      "- Smooth, quiet operation",
      "- Can accommodate very large panels",
      "- Pocket configurations hide panels completely",
      "- ADA-compliant threshold options",

      "**Cons**:",
      "- Pocket doors require wall construction",
      "- May not achieve as large an opening as folding systems",
      "- Premium pricing for pocket configurations",

      "## Pivot Entry Doors",

      "**Best For**: Grand entrances, architectural statements, unique designs",

      "Pivot doors rotate on a central or offset axis rather than swinging on side hinges. This allows for much larger, heavier doors that make a dramatic first impression.",

      "**Pros**:",
      "- Stunning architectural impact",
      "- Can accommodate oversized doors",
      "- Smooth, balanced operation",
      "- Wide range of materials and finishes",

      "**Cons**:",
      "- Requires more floor clearance",
      "- Higher cost than traditional entry doors",
      "- Professional installation essential",

      "## Key Decision Factors",

      "**Opening Size**: Measure your available opening and consider how much of it you want to be able to clear. Folding systems maximize openings; sliding systems offer flexibility.",

      "**Operation**: How often will you open the doors? For daily use, multi-slide systems offer the easiest operation. For occasional full openings, folding systems are worth the extra steps.",

      "**Architectural Style**: Match your door system to your home's design. Modern homes suit clean-lined multi-slide systems, while traditional or transitional homes may benefit from folding systems or statement pivot doors.",

      "**Budget**: Entry-level systems start around $800-1,000 per linear foot installed. Premium systems with advanced features can exceed $2,000 per linear foot. Pivot doors vary widely based on size and materials.",

      "**Climate**: Consider your local weather. Coastal locations need corrosion-resistant materials. Hot climates benefit from high-performance glass and thermal breaks.",

      "## Our Recommendation Process",

      "At Scenic Doors, we don't believe in one-size-fits-all solutions. Our consultation process includes:",

      "1. **Site Assessment**: We evaluate your opening, orientation, and structural requirements.",
      "2. **Lifestyle Discussion**: Understanding how you use your space helps us recommend the right system.",
      "3. **Design Coordination**: We work with your architect or designer to ensure seamless integration.",
      "4. **Budget Planning**: We present options at various price points without compromising on quality.",

      "Schedule your free consultation today and let our experts guide you to the perfect door system for your home.",
    ],
  },
  "energy-efficiency-modern-door-systems": {
    title: "Energy Efficiency: What to Look for in Modern Door Systems",
    excerpt:
      "Modern door systems offer impressive energy efficiency features. Learn about thermal breaks, low-E glass, and other technologies that can reduce your energy bills.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    category: "Technology",
    date: "December 5, 2025",
    readTime: "6 min read",
    content: [
      "Large glass door systems were once considered energy liabilities, but modern technology has transformed them into high-performance building elements. Today's premium door systems can meet or exceed energy codes while providing the aesthetic and lifestyle benefits homeowners desire.",

      "## Understanding Energy Performance Ratings",

      "Before diving into specific technologies, it's important to understand how door energy performance is measured:",

      "**U-Factor**: Measures how well the door prevents heat transfer. Lower numbers are better. Look for U-factors below 0.30 for excellent performance.",

      "**Solar Heat Gain Coefficient (SHGC)**: Measures how much solar radiation passes through. In cooling-dominated climates like Southern California, lower SHGC (below 0.25) reduces air conditioning needs.",

      "**Visible Transmittance (VT)**: Indicates how much natural light passes through. Higher VT means more daylight, which can reduce lighting energy use.",

      "## Key Energy-Efficient Technologies",

      "### Thermal Breaks",

      "Thermal breaks are non-conductive materials inserted into aluminum frames to prevent heat transfer. Without thermal breaks, aluminum frames act as thermal bridges, conducting heat between inside and outside.",

      "Premium systems use polyamide or other advanced materials to create effective thermal barriers. This can improve frame performance by 50% or more compared to non-thermally broken frames.",

      "### Low-E Glass Coatings",

      "Low-emissivity (Low-E) coatings are microscopically thin metallic layers applied to glass that reflect infrared heat while allowing visible light to pass through. There are several types:",

      "**Passive Low-E**: Best for cold climates, allows solar heat gain while retaining interior warmth.",

      "**Solar Control Low-E**: Ideal for Southern California, blocks solar heat gain while maintaining views and natural light.",

      "**Triple Silver Low-E**: Premium option offering the best combination of heat rejection and light transmission.",

      "### Insulated Glass Units (IGUs)",

      "Modern door systems use double or triple-pane glass with sealed air spaces between panes. These spaces can be filled with:",

      "**Air**: Standard option, provides decent insulation.",

      "**Argon**: Denser than air, improves insulation by 15-20% at minimal cost increase.",

      "**Krypton**: Even denser, offers best performance but at higher cost. Often used in triple-pane units.",

      "### Warm-Edge Spacers",

      "The spacers that separate glass panes in IGUs can be thermal weak points. Warm-edge spacers use materials with lower thermal conductivity than traditional aluminum spacers, reducing heat transfer at the glass edge and minimizing condensation.",

      "## Real-World Energy Savings",

      "While exact savings depend on many factors, homeowners typically see:",

      "- 10-25% reduction in cooling costs with solar control Low-E glass",
      "- 15-30% reduction in heating costs with proper thermal breaks",
      "- Reduced HVAC equipment sizing requirements for new construction",
      "- Improved comfort with fewer hot/cold spots near doors",

      "## Beyond Energy: Additional Benefits",

      "Energy-efficient door systems also provide:",

      "**UV Protection**: Low-E coatings block up to 99% of UV rays, protecting furniture, flooring, and artwork from fading.",

      "**Noise Reduction**: Multi-pane glass and quality seals significantly reduce exterior noise infiltration.",

      "**Condensation Resistance**: Warm-edge spacers and thermal breaks reduce the likelihood of condensation forming on glass surfaces.",

      "## Making the Right Choice",

      "At Scenic Doors, we help you balance energy performance with aesthetics and budget. All our installed systems meet California's stringent Title 24 energy requirements, and we can guide you to options that exceed code for maximum efficiency.",

      "Contact us to learn more about energy-efficient door options for your project.",
    ],
  },
  "coastal-living-door-solutions-beach-homes": {
    title: "Coastal Living: Best Door Solutions for Beach Homes",
    excerpt:
      "Living near the coast presents unique challenges. Explore door systems designed to withstand salt air, humidity, and provide stunning ocean views.",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
    category: "Coastal Living",
    date: "November 28, 2025",
    readTime: "7 min read",
    content: [
      "Coastal properties in Southern California offer incredible lifestyle benefits—ocean views, sea breezes, and a relaxed atmosphere. However, the same salt air and humidity that make beach living special can wreak havoc on door systems not designed for the environment. Here's what you need to know about selecting doors for your coastal home.",

      "## The Coastal Challenge",

      "Salt air is highly corrosive, attacking metal components, degrading seals, and accelerating wear on moving parts. Properties within a mile of the ocean experience significantly more exposure, but salt damage can occur several miles inland, especially in areas with strong onshore winds.",

      "Additional coastal challenges include:",

      "- **Humidity**: Promotes corrosion and can affect wood components",
      "- **Wind**: Coastal areas often experience higher wind loads",
      "- **Sand**: Abrasive particles can damage tracks and seals",
      "- **UV Exposure**: Intense coastal sun degrades finishes faster",

      "## Material Considerations",

      "### Aluminum Frames",

      "Aluminum is the most popular choice for coastal door systems, but not all aluminum is created equal:",

      "**Anodized Finishes**: Anodizing creates a hard, corrosion-resistant oxide layer. Class I anodizing (0.7 mil minimum) is recommended for coastal applications. However, anodized finishes can show wear over time.",

      "**Powder Coating**: Modern powder coatings, especially those meeting AAMA 2605 specifications, offer excellent corrosion resistance when properly applied to pre-treated aluminum. Colors are more flexible than anodizing.",

      "**Marine-Grade Options**: Some manufacturers offer specific coastal or marine-grade packages with enhanced corrosion protection, including upgraded fasteners and hardware.",

      "### Hardware and Fasteners",

      "This is often where coastal door systems fail first. Insist on:",

      "- **Stainless steel fasteners**: 316 marine-grade stainless for exposed fasteners",
      "- **Stainless or marine-grade hardware**: Hinges, handles, and locks rated for coastal use",
      "- **Non-ferrous rollers and tracks**: Avoid any bare steel components",

      "### Glass Selection",

      "For coastal homes, consider:",

      "**Laminated Glass**: Required in many coastal areas for impact resistance. Also provides better security and noise reduction.",

      "**Tinted or Reflective Options**: Reduce glare from water and sand while maintaining views.",

      "**Self-Cleaning Coatings**: Some glass coatings help shed salt deposits, reducing cleaning frequency.",

      "## Weather Performance",

      "Coastal areas often require doors rated for higher wind loads and water infiltration resistance. Key specifications include:",

      "**Design Pressure (DP) Rating**: Indicates resistance to wind load. Coastal California typically requires DP 40-50 or higher, depending on location and building height.",

      "**Water Infiltration Resistance**: Tested per ASTM E331 or similar. Higher ratings mean better protection during wind-driven rain.",

      "**Air Infiltration**: Tighter seals mean less salt air entering your home and better energy efficiency.",

      "## Maintenance for Longevity",

      "Even the best coastal door systems require regular maintenance:",

      "**Monthly**:",
      "- Rinse frames and glass with fresh water to remove salt deposits",
      "- Wipe down hardware with a damp cloth",

      "**Quarterly**:",
      "- Clean tracks and remove debris",
      "- Lubricate moving parts with appropriate lubricants",
      "- Inspect weather seals for damage",

      "**Annually**:",
      "- Professional inspection and adjustment",
      "- Touch up any finish damage promptly",
      "- Replace worn seals or hardware as needed",

      "## Our Coastal Expertise",

      "Scenic Doors has installed door systems in some of Southern California's most prestigious coastal properties, from Malibu to La Jolla. We understand the unique requirements of beach homes and work exclusively with manufacturers offering true coastal-grade products.",

      "Our coastal installations include extended warranties when maintenance guidelines are followed, giving you peace of mind that your investment is protected.",

      "Schedule a consultation to discuss the best door solutions for your coastal property.",
    ],
  },
  "pivot-doors-grand-entrance-statement": {
    title: "Pivot Doors: Making a Grand Entrance Statement",
    excerpt:
      "Pivot doors are becoming increasingly popular for homeowners looking to make a bold architectural statement. Learn about design options and installation considerations.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2032&auto=format&fit=crop",
    category: "Design Inspiration",
    date: "November 20, 2025",
    readTime: "5 min read",
    content: [
      "Your front door is more than just an entry point—it's the first impression visitors have of your home. Pivot doors have emerged as the ultimate statement piece for homeowners who want their entrance to reflect the caliber of what lies beyond. These architectural marvels combine engineering precision with bold design to create unforgettable first impressions.",

      "## What Makes Pivot Doors Different",

      "Unlike traditional doors that swing on hinges mounted to the side jamb, pivot doors rotate on a pivot point typically located near the top and bottom of the door panel. This fundamental difference enables:",

      "**Larger Sizes**: Without the weight constraints of side hinges, pivot doors can be significantly larger than traditional doors—up to 5 feet wide and 12 feet tall or more.",

      "**Heavier Materials**: The pivot mechanism distributes weight more evenly, allowing the use of solid wood slabs, thick glass panels, or heavy metal doors that would be impractical with conventional hinges.",

      "**Balanced Operation**: A properly engineered pivot door swings effortlessly with minimal effort, despite weighing hundreds of pounds.",

      "## Design Possibilities",

      "### Material Options",

      "**Solid Wood**: Nothing matches the warmth and character of a solid wood pivot door. Popular species include walnut, white oak, mahogany, and teak. Live-edge slabs create truly one-of-a-kind entries.",

      "**Steel and Glass**: For modern and industrial aesthetics, thermally broken steel frames with insulated glass panels offer clean lines and abundant light while maintaining energy efficiency.",

      "**Bronze and Copper**: These metals develop beautiful patinas over time, creating living finishes that evolve with your home. Hand-finished options add artisanal character.",

      "**Aluminum and Glass**: Sleek, minimal frames maximize glass area for contemporary homes focused on transparency and light.",

      "### Pivot Point Placement",

      "**Center Pivot**: The door panel is balanced at the center, creating symmetrical operation. Both sides of the door swing into or out of the opening equally.",

      "**Offset Pivot**: The pivot point is located off-center (typically about one-third from one edge). This creates a more traditional appearance while maintaining the pivot door advantages.",

      "### Design Elements",

      "- **Sidelights**: Flanking glass panels add width and light to your entry",
      "- **Transoms**: Overhead glazing increases height and grandeur",
      "- **Hardware**: From minimal concealed hinges to statement handles, hardware choices significantly impact the final aesthetic",
      "- **Finishes**: Stained, painted, weathered, or natural—your finish tells a story",

      "## Installation Considerations",

      "Pivot doors require careful planning and professional installation:",

      "**Structural Requirements**: The pivot hardware transfers significant loads to the floor and ceiling/header. These points must be engineered to handle the weight and forces involved.",

      "**Floor Clearance**: The bottom of a pivot door swings through an arc, requiring adequate clearance. Recessed floor plates can minimize trip hazards.",

      "**Weatherproofing**: Achieving weather resistance with pivot doors requires careful attention to seals and thresholds. Work with experienced installers who understand these challenges.",

      "**Building Codes**: Pivot doors must meet egress requirements and accessibility standards. Not all configurations are suitable for all applications.",

      "## The Scenic Doors Difference",

      "We specialize in custom pivot door installations, working with architects and homeowners to create entries that exceed expectations. Our process includes:",

      "1. **Design Consultation**: Understanding your vision and advising on feasibility",
      "2. **Custom Fabrication**: Working with skilled craftsmen to create your door",
      "3. **Professional Installation**: Our factory-trained team ensures perfect operation",
      "4. **Warranty Protection**: Standing behind our work with comprehensive coverage",

      "Whether you're building new or renovating, a pivot door can transform your entry from ordinary to extraordinary. Contact us to explore the possibilities.",
    ],
  },
  "maintaining-glass-door-systems-seasonal-guide": {
    title: "Maintaining Your Glass Door Systems: A Seasonal Guide",
    excerpt:
      "Proper maintenance ensures your door systems operate smoothly for years. Follow our seasonal maintenance checklist to protect your investment.",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
    category: "Maintenance",
    date: "November 15, 2025",
    readTime: "4 min read",
    content: [
      "Your premium door system represents a significant investment in your home. Like any precision-engineered product, regular maintenance ensures optimal performance, extends lifespan, and protects your warranty coverage. This seasonal guide provides everything you need to keep your doors operating beautifully year-round.",

      "## Spring Maintenance",

      "Spring is the ideal time for a thorough inspection and cleaning after winter months:",

      "### Cleaning",

      "**Glass Panels**:",
      "- Clean with a solution of mild dish soap and water",
      "- Avoid ammonia-based cleaners on Low-E coated glass",
      "- Use a soft cloth or squeegee to prevent scratching",
      "- Clean both interior and exterior surfaces",

      "**Frames**:",
      "- Wash aluminum frames with mild soap and water",
      "- Rinse thoroughly to remove soap residue",
      "- Avoid abrasive cleaners or scrub pads",
      "- Dry with a soft cloth to prevent water spots",

      "**Tracks**:",
      "- Vacuum debris from tracks",
      "- Wipe with a damp cloth",
      "- Remove any buildup that could impede operation",

      "### Inspection",

      "- Check weather seals for cracks, gaps, or compression damage",
      "- Inspect glass for chips, cracks, or seal failures (look for fogging between panes)",
      "- Examine frame finishes for scratches or corrosion",
      "- Test all locks and handles for smooth operation",

      "### Lubrication",

      "- Apply silicone-based lubricant to tracks (avoid petroleum-based products)",
      "- Lubricate hinges and pivot points",
      "- Apply light lubricant to lock mechanisms",

      "## Summer Maintenance",

      "Summer's heavy use means paying attention to operation:",

      "### Monthly Tasks",

      "- Wipe down tracks to remove dust and debris",
      "- Clean glass as needed to maintain clarity",
      "- Check that doors operate smoothly without binding or resistance",

      "### Operational Checks",

      "- Verify doors close and seal properly",
      "- Test multi-point locks engage fully",
      "- Listen for unusual sounds during operation",
      "- Check for smooth gliding without sticking",

      "### UV and Heat Considerations",

      "- Ensure interior furnishings aren't being damaged by direct sun",
      "- Consider window treatments for extreme heat days",
      "- Verify weatherstripping hasn't dried out or shrunk",

      "## Fall Preparation",

      "Prepare your doors for cooler, wetter weather:",

      "### Weather Seal Inspection",

      "- Check all perimeter seals for proper compression",
      "- Replace any cracked, torn, or flattened seals",
      "- Verify threshold seals make proper contact",
      "- Test weather resistance with a flashlight (look for light gaps from inside at night)",

      "### Hardware Service",

      "- Tighten any loose handles or locks",
      "- Adjust roller height if doors drag or don't seal properly",
      "- Lubricate all moving parts before wet weather",

      "### Drainage",

      "- Clear weep holes in frame bottoms",
      "- Ensure track drainage paths are unobstructed",
      "- Verify water can escape without pooling",

      "## Winter Care",

      "Even in mild Southern California, winter brings its challenges:",

      "### After Rain",

      "- Wipe down tracks that may have collected water",
      "- Check for any water infiltration around seals",
      "- Dry hardware to prevent water spots",

      "### Reduced Operation",

      "- Even if doors aren't used daily, operate them periodically",
      "- This prevents seals from taking a set and keeps mechanisms lubricated",
      "- Check that locks still engage smoothly",

      "## Professional Service",

      "We recommend professional service annually, including:",

      "- Roller adjustment and replacement if needed",
      "- Seal replacement assessment",
      "- Lock mechanism adjustment",
      "- Frame alignment verification",
      "- Complete operational testing",

      "## What NOT to Do",

      "Avoid these common maintenance mistakes:",

      "- Never use abrasive cleaners or steel wool",
      "- Don't use pressure washers on seals",
      "- Avoid petroleum-based lubricants on tracks",
      "- Never force a door that's binding—identify and fix the cause",
      "- Don't ignore minor issues—they become major problems",

      "## Warranty Considerations",

      "Most manufacturer warranties require proper maintenance. Keep records of your maintenance activities and any professional service. This documentation protects your warranty coverage and adds value when selling your home.",

      "Scenic Doors offers maintenance packages for all systems we install. Contact us to schedule your annual service visit or to address any operational concerns.",
    ],
  },
};

const relatedPosts = [
  {
    title: "How Folding Glass Walls Transform Indoor-Outdoor Living",
    slug: "folding-glass-walls-indoor-outdoor-living",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "The Ultimate Guide to Choosing the Right Door System",
    slug: "guide-choosing-right-door-system",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
  },
  {
    title: "Energy Efficiency in Modern Door Systems",
    slug: "energy-efficiency-modern-door-systems",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPosts[slug];

  if (!post) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-4xl text-ocean-900 mb-4">Post Not Found</h1>
            <Link href="/blog" className="text-primary-600 hover:text-primary-500">
              Return to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const renderContent = (content: string[]) => {
    return content.map((block, index) => {
      if (block.startsWith("## ")) {
        return (
          <h2 key={index} className="font-heading text-2xl md:text-3xl text-ocean-900 mt-12 mb-6">
            {block.replace("## ", "")}
          </h2>
        );
      }
      if (block.startsWith("### ")) {
        return (
          <h3 key={index} className="font-heading text-xl md:text-2xl text-ocean-900 mt-8 mb-4">
            {block.replace("### ", "")}
          </h3>
        );
      }
      if (block.startsWith("**") && block.endsWith("**:")) {
        return (
          <p key={index} className="font-semibold text-ocean-900 mt-6 mb-2">
            {block.replace(/\*\*/g, "").replace(":", "")}
          </p>
        );
      }
      if (block.startsWith("- ")) {
        return (
          <li key={index} className="text-ocean-700 leading-relaxed ml-6 mb-2">
            {block.replace("- ", "")}
          </li>
        );
      }
      // Handle bold text within paragraphs
      const formattedText = block.split(/(\*\*.*?\*\*)/).map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="text-ocean-900">{part.replace(/\*\*/g, "")}</strong>;
        }
        return part;
      });

      return (
        <p key={index} className="text-ocean-700 leading-relaxed mb-6">
          {formattedText}
        </p>
      );
    });
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-primary-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${post.image}')` }}
            />
          </div>
          <div className="section-container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <Link
                href="/blog"
                className="text-primary-300 text-sm mb-6 inline-flex items-center gap-2 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
              <span className="text-primary-300 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                {post.category}
              </span>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white mb-6">
                {post.title}
              </h1>
              <div className="flex items-center gap-6 text-primary-200 text-sm">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="relative -mt-8">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full aspect-[16/9] object-cover shadow-2xl"
              />
            </motion.div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16 bg-white">
          <div className="section-container">
            <div className="max-w-3xl mx-auto">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="prose prose-lg max-w-none"
              >
                {renderContent(post.content)}
              </motion.article>

              {/* Share */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-12 pt-8 border-t border-ocean-200"
              >
                <div className="flex items-center gap-4">
                  <span className="text-ocean-600 font-medium">Share this article:</span>
                  <button className="p-2 bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <section className="py-16 bg-primary-50">
          <div className="section-container">
            <h2 className="font-heading text-2xl md:text-3xl text-ocean-900 mb-8">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts
                .filter((p) => p.slug !== slug)
                .slice(0, 3)
                .map((relatedPost, index) => (
                  <motion.article
                    key={relatedPost.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link href={`/blog/${relatedPost.slug}`} className="group block">
                      <div className="bg-white overflow-hidden">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="font-heading text-lg text-ocean-900 group-hover:text-primary-600 transition-colors">
                            {relatedPost.title}
                          </h3>
                          <span className="inline-flex items-center gap-2 text-primary-600 text-sm mt-4 group-hover:gap-3 transition-all">
                            Read Article
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
            </div>
          </div>
        </section>

        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
