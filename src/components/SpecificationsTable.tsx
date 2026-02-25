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
      className="bg-white shadow-sm overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-4 px-6 bg-gray-50 font-heading text-lg text-ocean-900">
                Specification
              </th>
              <th className="text-left py-4 px-6 bg-gray-50 font-heading text-lg text-ocean-900">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {specifications.map((spec, index) => (
              <motion.tr
                key={spec.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              >
                <td className="py-4 px-6 font-medium text-ocean-700">
                  {spec.label}
                </td>
                <td className="py-4 px-6 text-ocean-900">
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
