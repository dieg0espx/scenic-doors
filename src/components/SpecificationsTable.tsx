"use client";

import { motion } from "framer-motion";

export interface SpecificationRow {
  label: string;
  value: string;
}

interface SpecificationsTableProps {
  specifications: SpecificationRow[];
}

export default function SpecificationsTable({ specifications }: SpecificationsTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-primary-800 to-ocean-900">
              <th className="text-left py-5 px-8 font-heading text-lg text-white tracking-wide">
                Specification
              </th>
              <th className="text-left py-5 px-8 font-heading text-lg text-white tracking-wide">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {specifications.map((spec, index) => (
              <motion.tr
                key={spec.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                className="group hover:bg-primary-50/50 transition-all duration-200"
              >
                <td className="py-5 px-8 font-semibold text-ocean-800 group-hover:text-primary-700 transition-colors">
                  {spec.label}
                </td>
                <td className="py-5 px-8 text-ocean-900 font-medium">
                  {spec.value}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
