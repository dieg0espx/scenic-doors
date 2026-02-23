"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, Download, SlidersHorizontal, Calendar, ChevronDown, ChevronsUpDown } from "lucide-react";

interface Props {
  onExportCSV: () => void;
  onToggleColumns: () => void;
  expandAll: boolean;
  onToggleExpandAll: () => void;
}

export default function QuoteSearchBar({
  onExportCSV,
  onToggleColumns,
  expandAll,
  onToggleExpandAll,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sortOpen, setSortOpen] = useState(false);

  function handleSearch(value: string) {
    setSearch(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`/admin/quotes?${params.toString()}`);
  }

  function toggleDueToday() {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("due_today") === "true") {
      params.delete("due_today");
    } else {
      params.set("due_today", "true");
    }
    router.push(`/admin/quotes?${params.toString()}`);
  }

  function handleSortChange(sort: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }
    router.push(`/admin/quotes?${params.toString()}`);
  }

  const isDueToday = searchParams.get("due_today") === "true";
  const currentSort = searchParams.get("sort") || "newest";

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search quotes..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/40 transition-all"
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={onExportCSV}
          title="Export CSV"
          className="inline-flex items-center gap-1.5 p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/50 text-xs font-medium hover:bg-white/[0.06] hover:text-white/80 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Export CSV</span>
        </button>

        <button
          onClick={onToggleColumns}
          title="Customize columns"
          className="inline-flex items-center gap-1.5 p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/50 text-xs font-medium hover:bg-white/[0.06] hover:text-white/80 transition-all cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Customize</span>
        </button>

        <button
          onClick={toggleDueToday}
          title="Due Today"
          className={`inline-flex items-center gap-1.5 p-2.5 sm:px-3 sm:py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
            isDueToday
              ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
              : "bg-white/[0.03] border-white/[0.08] text-white/50 hover:bg-white/[0.06] hover:text-white/80"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Due Today</span>
        </button>

        <button
          onClick={onToggleExpandAll}
          title={expandAll ? "Collapse All" : "Expand All"}
          className="inline-flex items-center gap-1.5 p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/50 text-xs font-medium hover:bg-white/[0.06] hover:text-white/80 transition-all cursor-pointer"
        >
          <ChevronsUpDown className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{expandAll ? "Collapse All" : "Expand All"}</span>
        </button>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            title="Sort order"
            className="inline-flex items-center gap-1.5 p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/50 text-xs font-medium hover:bg-white/[0.06] hover:text-white/80 transition-all cursor-pointer"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{currentSort === "newest" ? "Newest First" : "Oldest First"}</span>
          </button>
          {sortOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
              <div className="absolute right-0 mt-1 w-36 rounded-xl border border-white/[0.08] bg-[#161b22] shadow-xl z-20">
                <button
                  onClick={() => { handleSortChange("newest"); setSortOpen(false); }}
                  className={`w-full px-3 py-2 text-left text-xs rounded-t-xl transition-colors cursor-pointer ${
                    currentSort === "newest" ? "text-violet-300 bg-violet-500/10" : "text-white/50 hover:bg-white/[0.04]"
                  }`}
                >
                  Newest First
                </button>
                <button
                  onClick={() => { handleSortChange("oldest"); setSortOpen(false); }}
                  className={`w-full px-3 py-2 text-left text-xs rounded-b-xl transition-colors cursor-pointer ${
                    currentSort === "oldest" ? "text-violet-300 bg-violet-500/10" : "text-white/50 hover:bg-white/[0.04]"
                  }`}
                >
                  Oldest First
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
