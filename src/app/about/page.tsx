"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/sections/CTABanner";
import {
  Award,
  Users,
  Clock,
  Shield,
  ArrowRight,
  Ruler,
  Maximize2,
  Wrench,
  HelpCircle,
  CheckCircle,
  DollarSign,
  Heart,
  ChevronDown,
} from "lucide-react";

const stats = [
  { number: "25+", label: "Years Experience", icon: Clock },
  { number: "1000+", label: "Projects Completed", icon: Award },
  { number: "6", label: "Counties Served", icon: Users },
  { number: "100%", label: "Certified Installers", icon: Shield },
];

const values = [
  {
    title: "Craftsmanship",
    description: "Precision and quality in every installation.",
  },
  {
    title: "Integrity",
    description: "Transparent pricing and honest communication.",
  },
  {
    title: "Innovation",
    description: "The latest door technology and solutions.",
  },
  {
    title: "Excellence",
    description: "Highest standards from start to finish.",
  },
];

const milestones = [
  { year: "1998", event: "Founded in Orange County" },
  { year: "2005", event: "First certified LaCantina installer" },
  { year: "2012", event: "Expanded to 6 SoCal counties" },
  { year: "2018", event: "1000th installation completed" },
];

const evaluationFeatures = [
  {
    icon: Ruler,
    title: "Accurate Measurements",
    description:
      "Meticulous, precise measurements to guarantee a custom fit for your new Scenic Door.",
  },
  {
    icon: Maximize2,
    title: "Design Possibilities",
    description:
      "We evaluate your space and provide clear guidance on size and configuration options.",
  },
  {
    icon: Wrench,
    title: "Proactive Solutions",
    description:
      "We identify and address potential site-specific considerations before installation day.",
  },
  {
    icon: HelpCircle,
    title: "Answer Questions",
    description:
      "Discuss any concerns and get clear explanations about the entire process.",
  },
];

const trustReasons = [
  {
    icon: Award,
    title: "Certified Professionals",
    description:
      "Highly skilled, certified door installation specialists who treat your home as their own.",
  },
  {
    icon: CheckCircle,
    title: "Perfect Fit Guaranteed",
    description:
      "Thorough evaluation and expert craftsmanship ensure flawless installation every time.",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description:
      "Honest, upfront pricing with detailed estimates. No hidden fees or surprises.",
  },
  {
    icon: Heart,
    title: "Stress-Free Experience",
    description:
      "We manage every detail from first contact to final walkthrough.",
  },
  {
    icon: Shield,
    title: "Long-Term Performance",
    description:
      "Installation to the highest standards ensures your door performs beautifully for decades.",
  },
];

const faqs = [
  {
    question: 'What is a "Pre-Installation Site Evaluation" and why is it important?',
    answer:
      "Our Pre-Installation Site Evaluation is a comprehensive visit by a skilled Scenic Doors technician to your home. It's crucial because it allows us to take highly accurate measurements of your opening, assess structural considerations, identify any potential challenges, and confirm operational clearances for your new scenic door. This meticulous step ensures a perfect fit, a smooth installation process, and avoids unexpected issues, ultimately saving you time and money.",
  },
  {
    question: "Can you install a larger door than my current opening allows?",
    answer:
      "Absolutely! During your Pre-Installation Site Evaluation, our experts will carefully assess your existing opening to determine if it can be safely and aesthetically enlarged. We'll evaluate structural elements, discuss possibilities, and provide clear recommendations on whether a larger door opening is feasible. Our goal is to help you achieve your vision for a more expansive and beautiful entrance.",
  },
  {
    question: "How long does a typical Scenic Door installation take?",
    answer:
      "The duration of a door installation varies depending on the complexity of the project, the size of the door, and any modifications needed to the opening. However, with our thorough pre-installation planning, most standard Scenic Door installations are completed within one to two days. We prioritize efficiency without compromising on quality or safety. We'll provide a more precise timeline during your site evaluation.",
  },
  {
    question: "Do I need to prepare anything before the installation team arrives?",
    answer:
      "During your Pre-Installation Site Evaluation, we'll advise you on any specific preparations needed. Generally, we ask that you clear the immediate work area, moving any furniture, decorations, or personal items that might obstruct access to the existing opening. Our team will handle the rest, including protecting your home and cleaning up thoroughly after the installation is complete.",
  },
  {
    question: "What is included in your installation service?",
    answer:
      "Our professional door installation service includes everything from the precise measurement and evaluation of your opening, the expert installation of your new Scenic Door, to ensuring proper sealing, trim, and operational functionality. We also include a thorough clean-up of the work area and a final walkthrough to ensure your complete satisfaction.",
  },
  {
    question: "Is your installation team insured and certified?",
    answer:
      "Yes, absolutely. Our door installation specialists are highly trained, certified, and fully insured for your peace of mind. They adhere to the highest industry standards for safety and craftsmanship, ensuring your new scenic door is installed with the utmost care and expertise.",
  },
  {
    question: "What is the cost of installation?",
    answer:
      "The cost of door installation varies based on the size of the door, the complexity of the opening, and any modifications required. We believe in transparent and fair pricing. During your Pre-Installation Site Evaluation, we will provide a detailed, itemized quote so you know exactly what to expect, with no hidden fees.",
  },
  {
    question: "Do you offer a warranty on your installation work?",
    answer:
      "Yes, we stand behind the quality of our work. All our scenic door installations come with a comprehensive warranty on our labor, in addition to the manufacturer's warranty on the door itself. This ensures your long-term confidence in your investment.",
  },
  {
    question: "Do you remove the old door?",
    answer:
      "Yes, as part of our comprehensive door replacement service, we will carefully remove and dispose of your old door and frame. You won't have to worry about a thing!",
  },
  {
    question: "Will the installation process be disruptive to my home life?",
    answer:
      "We understand that any home improvement project can cause some disruption. Our team works diligently to minimize this. We schedule installations at your convenience, work efficiently and respectfully within your home, and ensure thorough cleanup. We aim for a swift and smooth process, allowing you to enjoy your beautiful new scenic door with minimal interruption.",
  },
  {
    question: "What kind of mess can I expect during installation?",
    answer:
      "Installing a new door, especially if an opening is being enlarged, can create dust and debris. However, our professional door installers take great care to protect your home. We use drop cloths, dust barriers, and other protective measures to contain the work area. After installation, we perform a thorough cleanup, removing all debris and leaving your space tidy.",
  },
  {
    question: "Do you handle the necessary permits if I'm enlarging my opening?",
    answer:
      "Navigating permits can be confusing. While the homeowner is typically responsible for securing permits for structural changes like enlarging an opening, we can certainly guide you through the process and provide any necessary documentation or specifications related to the door itself. We recommend checking with your local building department early in the planning process.",
  },
  {
    question: "What if there's an issue with my existing framing or wall during installation?",
    answer:
      "Our Pre-Installation Site Evaluation is designed to identify most potential issues beforehand. However, if unforeseen issues with the existing framing or wall are discovered during installation, our experienced team will assess the situation, explain the necessary corrective actions, and discuss any potential additional costs with you transparently before proceeding.",
  },
  {
    question: "Do you install doors purchased from other companies?",
    answer:
      "At Scenic Doors, we specialize in the expert installation of our own premium scenic doors. This allows us to guarantee the quality and performance of both the product and the installation, as our team is intimately familiar with the specifications and nuances of our unique door systems.",
  },
  {
    question: "What kind of maintenance will my new door require after installation?",
    answer:
      "Our beautiful scenic doors are designed for durability and ease of maintenance. During the final walkthrough, our installers will provide you with specific care instructions relevant to your door's material and operating mechanism. Generally, regular cleaning and occasional lubrication of moving parts will keep your door operating smoothly for years.",
  },
  {
    question: "Do you offer a maintenance plan?",
    answer:
      "Yes, we do! To give you even greater peace of mind and extend the life of your beautiful investment, we offer an exclusive door maintenance plan. This plan includes routine inspections, adjustments, and lubrication by our expert technicians to ensure your scenic door continues to operate smoothly and beautifully.",
  },
];

function FAQItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white border border-sand-200 rounded-lg overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left group hover:bg-sand-50 transition-colors"
      >
        <span className="font-medium text-ocean-900 pr-4 group-hover:text-primary-600 transition-colors text-sm">
          {question}
        </span>
        <div
          className={`w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 transition-colors ${
            isOpen ? "bg-primary-600" : ""
          }`}
        >
          <ChevronDown
            className={`w-4 h-4 transition-all duration-300 ${
              isOpen ? "rotate-180 text-white" : "text-primary-600"
            }`}
          />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <p className="text-ocean-600 leading-relaxed text-sm px-4 pb-4 border-t border-sand-100 pt-3">
          {answer}
        </p>
      </div>
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero + Story Combined Section */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-white">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              {/* Left - Image with overlay quote */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop"
                    alt="Premium door installation"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Quote overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-900/95 via-primary-900/80 to-transparent p-6 pt-16">
                  <p className="font-heading text-xl md:text-2xl text-white leading-snug">
                    "Every home deserves an entrance that makes a statement."
                  </p>
                  <p className="text-primary-300 text-sm mt-2">
                    — Our Founding Vision, 1998
                  </p>
                </div>
              </motion.div>

              {/* Right - Content */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="text-primary-500 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                  About Scenic Doors
                </span>
                <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-ocean-900 mb-6">
                  Crafting Entrances,
                  <span className="text-primary-500"> Building Trust</span>
                </h1>
                <div className="space-y-4 text-ocean-700 mb-8">
                  <p>
                    For over 25 years, Scenic Doors has been transforming
                    Southern California homes with premium door installations.
                    What started as a small family operation has grown into the
                    region's most respected name in architectural doors.
                  </p>
                  <p>
                    Today, we're proud to be factory-certified installers for
                    the industry's leading brands, including LaCantina, Western
                    Window Systems, and Fleetwood. Our team of skilled craftsmen
                    brings decades of combined experience to every project.
                  </p>
                </div>

                {/* Milestones inline */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {milestones.map((item, index) => (
                    <motion.div
                      key={item.year}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <span className="font-heading text-2xl text-primary-500">
                        {item.year}
                      </span>
                      <span className="text-ocean-600 text-sm">{item.event}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-4 pt-6 border-t border-sand-300">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      className="text-center"
                    >
                      <p className="font-heading text-2xl md:text-3xl text-ocean-900">
                        {stat.number}
                      </p>
                      <p className="text-ocean-500 text-xs">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section - Compact */}
        <section className="py-16 bg-primary-800">
          <div className="section-container">
            <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:w-1/4"
              >
                <span className="text-primary-300 font-medium tracking-[0.2em] uppercase text-xs mb-2 block">
                  Our Values
                </span>
                <h2 className="font-heading text-2xl md:text-3xl text-white">
                  What Drives Us
                </h2>
              </motion.div>

              <div className="lg:w-3/4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-primary-900/50 p-5 border-l-2 border-primary-400"
                  >
                    <h3 className="font-heading text-lg text-white mb-1">
                      {value.title}
                    </h3>
                    <p className="text-primary-200 text-sm">
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Installation Section */}
        <section id="installation" className="py-16 md:py-20 bg-white scroll-mt-24">
          <div className="section-container">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <span className="text-primary-500 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                Installation Services
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-ocean-900 mb-4">
                Your Scenic Door, Installed with Confidence & Care
              </h2>
              <p className="text-ocean-700 leading-relaxed">
                We believe bringing your vision to life should be stress-free.
                From your initial idea to the perfect finished installation,
                we're with you every step of the way.
              </p>
            </motion.div>

            {/* Pre-Installation Evaluation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-sand-100 p-6 md:p-10 mb-12"
            >
              <div className="text-center mb-8">
                <h3 className="font-heading text-xl md:text-2xl text-ocean-900 mb-2">
                  The Scenic Difference: Free Pre-Installation Evaluation
                </h3>
                <p className="text-ocean-600 text-sm max-w-2xl mx-auto">
                  Our commitment begins before installation day with a
                  comprehensive site assessment by our experienced technicians.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {evaluationFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center bg-white p-5"
                  >
                    <div className="w-12 h-12 bg-primary-600 flex items-center justify-center mx-auto mb-3">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-heading text-base text-ocean-900 mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-ocean-600 text-xs leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Why Trust Us */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h3 className="font-heading text-xl md:text-2xl text-ocean-900">
                Why Homeowners Trust Scenic Doors
              </h3>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
              {trustReasons.map((reason, index) => (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-primary-800 p-5 border-t-2 border-primary-400"
                >
                  <reason.icon className="w-8 h-8 text-primary-300 mb-3" />
                  <h4 className="font-heading text-base text-white mb-1">
                    {reason.title}
                  </h4>
                  <p className="text-primary-200 text-xs leading-relaxed">
                    {reason.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mb-16"
            >
              <Link
                href="/quote"
                className="inline-flex items-center gap-3 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 font-medium transition-colors"
              >
                <span>Schedule Your Free Evaluation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h3 className="font-heading text-xl md:text-2xl text-ocean-900">
                Frequently Asked Questions
              </h3>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-3 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                  index={index}
                />
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
