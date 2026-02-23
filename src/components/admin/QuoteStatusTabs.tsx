"use client";

import { useRouter, useSearchParams } from "next/navigation";

const TABS = [
  { key: "all", label: "View All" },
  { key: "new", label: "New" },
  { key: "hot", label: "Hot" },
  { key: "warm", label: "Warm" },
  { key: "cold", label: "Cold" },
  { key: "hold", label: "Hold" },
  { key: "archived", label: "Archived" },
];

const tabColors: Record<string, string> = {
  all: "bg-white/10 text-white",
  new: "bg-blue-400/15 text-blue-300",
  hot: "bg-red-400/15 text-red-300",
  warm: "bg-amber-400/15 text-amber-300",
  cold: "bg-sky-400/15 text-sky-300",
  hold: "bg-gray-400/15 text-gray-300",
  archived: "bg-zinc-500/15 text-zinc-400",
};

interface Props {
  counts: Record<string, number>;
}

export default function QuoteStatusTabs({ counts }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("status") || "all";

  function handleClick(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "all") {
      params.delete("status");
    } else {
      params.set("status", key);
    }
    router.push(`/admin/quotes?${params.toString()}`);
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:overflow-visible scrollbar-hide">
      {TABS.map((tab) => {
        const isActive = current === tab.key;
        const count = tab.key === "all"
          ? Object.values(counts).reduce((a, b) => a + b, 0)
          : counts[tab.key] ?? 0;

        return (
          <button
            key={tab.key}
            onClick={() => handleClick(tab.key)}
            className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              isActive
                ? `${tabColors[tab.key]} ring-1 ring-white/10`
                : "bg-white/[0.03] text-white/35 hover:bg-white/[0.06] hover:text-white/60"
            }`}
          >
            {tab.label}
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${
                isActive ? "bg-white/10" : "bg-white/[0.04]"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
