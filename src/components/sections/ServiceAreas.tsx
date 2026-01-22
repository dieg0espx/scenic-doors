"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useState } from "react";
import UsaMap from "@mirawision/usa-map-react";

const areas = [
  { 
    name: "California", 
    highlight: "Los Angeles • Orange County • San Diego • Bay Area",
    region: "california",
    code: "CA"
  },
  { 
    name: "Arizona", 
    highlight: "Phoenix • Scottsdale • Tucson • Flagstaff",
    region: "arizona",
    code: "AZ"
  },
  { 
    name: "Washington", 
    highlight: "Seattle • Bellevue • Spokane • Tacoma",
    region: "washington",
    code: "WA"
  },
  { 
    name: "Nevada", 
    highlight: "Las Vegas • Reno • Henderson",
    region: "nevada",
    code: "NV"
  },
  { 
    name: "Oregon", 
    highlight: "Portland • Eugene • Bend",
    region: "oregon",
    code: "OR"
  },
  { 
    name: "Utah", 
    highlight: "Salt Lake City • Park City • St. George",
    region: "utah",
    code: "UT"
  },
];

export default function ServiceAreas() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const isServedState = (code: string) => {
    return areas.some(area => area.code === code);
  };

  return (
    <section className="py-16 md:py-20 bg-white relative overflow-hidden">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary-500 font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
              Service Areas
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-ocean-900 mb-4">
              States Served
            </h2>
            <p className="text-ocean-600 leading-relaxed mb-6 max-w-lg">
              Comprehensive coverage across the West Coast & border states
            </p>

            {/* Areas list */}
            <div className="grid grid-cols-2 gap-4">
              {areas.map((area, index) => (
                <motion.div
                  key={area.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="group"
                  onMouseEnter={() => setHoveredRegion(area.region)}
                  onMouseLeave={() => setHoveredRegion(null)}
                >
                  <div className="flex items-start gap-3 p-4 bg-primary-50 hover:bg-primary-100 transition-colors cursor-pointer">
                    <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-ocean-900 group-hover:text-primary-600 transition-colors">
                        {area.name}
                      </p>
                      <p className="text-xs text-ocean-500 mt-0.5">{area.highlight}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Full USA Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-lg p-6">
              {/* Full USA Map using @mirawision/usa-map-react */}
              <div className="w-full">
                <UsaMap
                  customStates={areas.reduce((acc, area) => {
                    acc[area.code] = {
                      fill: hoveredRegion === area.region ? "#3898ec" : "#2d7db5",
                      onClick: () => {
                        setHoveredRegion(area.region);
                      },
                    };
                    return acc;
                  }, {} as Record<string, { fill: string; onClick: () => void }>)}
                  defaultState={{
                    fill: "#e5e7eb",
                  }}
                  onStateClick={(stateCode) => {
                    const area = areas.find(a => a.code === stateCode);
                    if (area) {
                      setHoveredRegion(area.region);
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
