"use client";

import { useEffect, useState } from "react";
import { Tag, X } from "lucide-react";

interface ActiveDiscount {
  id: string;
  name: string;
  percentage: number;
  door_types: string[] | null;
  end_date: string;
}

const DOOR_LABELS: Record<string, string> = {
  "multi-slide-pocket": "Multi-Slide & Pocket",
  "ultra-slim": "Ultra Slim Multi-Slide",
  "bi-fold": "Bi-Fold Doors",
  "slide-stack": "Slide-&-Stack",
};

export default function PromoBanner() {
  const [discounts, setDiscounts] = useState<ActiveDiscount[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/active-discounts")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDiscounts(data);
        }
      })
      .catch(() => {});
  }, []);

  if (dismissed || discounts.length === 0) return null;

  return (
    <div className="bg-ocean-900 text-white border-b border-white/[0.06] mb-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-center gap-2 text-center relative">
        <Tag className="w-3.5 h-3.5 shrink-0 hidden sm:block" />
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-[11px] sm:text-xs font-medium pr-6">
          {discounts.map((d) => {
            const doorLabel = d.door_types
              ? d.door_types.map((s) => DOOR_LABELS[s] || s).join(", ")
              : "All Doors";
            const endFormatted = new Date(d.end_date + "T00:00:00").toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            return (
              <span key={d.id}>
                <strong>{d.name}</strong> — {d.percentage}% off {doorLabel} · Ends {endFormatted}
              </span>
            );
          })}
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
