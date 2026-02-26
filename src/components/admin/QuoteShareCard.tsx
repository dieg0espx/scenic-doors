"use client";

import { useState, useTransition } from "react";
import { Users, Check } from "lucide-react";
import { updateQuoteSharedWith } from "@/lib/actions/quotes";

interface SalesRep {
  id: string;
  name: string;
}

interface QuoteShareCardProps {
  quoteId: string;
  salesReps: SalesRep[];
  initialSharedWith: string[];
}

export default function QuoteShareCard({
  quoteId,
  salesReps,
  initialSharedWith,
}: QuoteShareCardProps) {
  const [sharedWith, setSharedWith] = useState<string[]>(initialSharedWith);
  const [isPending, startTransition] = useTransition();

  function toggle(userId: string) {
    const next = sharedWith.includes(userId)
      ? sharedWith.filter((id) => id !== userId)
      : [...sharedWith, userId];
    setSharedWith(next);
    startTransition(async () => {
      try {
        await updateQuoteSharedWith(quoteId, next);
      } catch {
        // Revert on error
        setSharedWith(sharedWith);
      }
    });
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
      <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
        <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
          <Users className="w-4 h-4 text-teal-400" />
        </div>
        <h2 className="text-base font-semibold text-white">Shared With</h2>
        {sharedWith.length > 0 && (
          <span className="text-white/20 text-xs font-medium ml-auto">{sharedWith.length}</span>
        )}
      </div>
      <div className="p-4 sm:p-6">
        {/* Preview chips of shared users */}
        {sharedWith.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 pb-4 border-b border-white/[0.06]">
            {sharedWith.map((uid) => {
              const rep = salesReps.find((r) => r.id === uid);
              return (
                <span
                  key={uid}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-400/10 text-teal-300 text-xs font-medium"
                >
                  {rep?.name || uid}
                </span>
              );
            })}
          </div>
        )}
        {salesReps.length === 0 ? (
          <p className="text-white/25 text-sm">No sales reps available</p>
        ) : (
          <div className="space-y-1.5">
            {salesReps.map((rep) => {
              const checked = sharedWith.includes(rep.id);
              return (
                <label
                  key={rep.id}
                  className="flex items-center gap-3 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-white/[0.03] transition-colors group"
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                      checked
                        ? "bg-teal-500 border-teal-500"
                        : "border-white/[0.12] bg-transparent group-hover:border-white/[0.25]"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      toggle(rep.id);
                    }}
                  >
                    {checked && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className={`text-sm ${checked ? "text-white/70" : "text-white/40"}`}>
                    {rep.name}
                  </span>
                </label>
              );
            })}
          </div>
        )}
        {isPending && (
          <p className="text-white/20 text-xs mt-2">Saving...</p>
        )}
      </div>
    </div>
  );
}
