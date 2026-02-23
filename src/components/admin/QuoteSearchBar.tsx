"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Search,
  Download,
  SlidersHorizontal,
  Calendar,
  ChevronDown,
  ChevronsUpDown,
  Check,
  X,
} from "lucide-react";

/* ── dropdown option configs ── */

const STATUS_OPTIONS = [
  { key: "new", label: "New", dot: "bg-blue-400" },
  { key: "hot", label: "Hot", dot: "bg-red-400" },
  { key: "warm", label: "Warm", dot: "bg-amber-400" },
  { key: "cold", label: "Cold", dot: "bg-sky-400" },
  { key: "hold", label: "Hold", dot: "bg-gray-400" },
  { key: "archived", label: "Archived", dot: "bg-zinc-500" },
];

const INTENT_OPTIONS = [
  { key: "full", label: "Detailed Quote", dot: "bg-emerald-400" },
  { key: "medium", label: "General Estimate", dot: "bg-amber-400" },
  { key: "browse", label: "Price Inquiry", dot: "bg-sky-400" },
];

/* ── reusable multi-select filter dropdown ── */

function FilterDropdown({
  paramKey,
  label,
  options,
  counts,
}: {
  paramKey: string;
  label: string;
  options: { key: string; label: string; dot?: string }[];
  counts: Record<string, number>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get(paramKey) || "";
  const selected = raw ? raw.split(",") : [];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function toggle(key: string) {
    let next: string[];
    if (selected.includes(key)) {
      next = selected.filter((k) => k !== key);
    } else {
      next = [...selected, key];
    }
    apply(next);
  }

  function apply(keys: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    if (keys.length === 0 || keys.length === options.length) {
      params.delete(paramKey);
    } else {
      params.set(paramKey, keys.join(","));
    }
    router.push(`/admin/quotes?${params.toString()}`);
  }

  function clear() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(paramKey);
    router.push(`/admin/quotes?${params.toString()}`);
    setOpen(false);
  }

  const hasFilter = selected.length > 0;

  // Button label
  let buttonLabel = label;
  if (selected.length === 1) {
    buttonLabel = options.find((o) => o.key === selected[0])?.label || label;
  } else if (selected.length > 1) {
    buttonLabel = `${selected.length} selected`;
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
          hasFilter
            ? "bg-violet-500/10 border-violet-500/25 text-violet-300"
            : "bg-white/[0.03] border-white/[0.08] text-white/50 hover:bg-white/[0.06] hover:text-white/80"
        }`}
      >
        <span className="whitespace-nowrap">{buttonLabel}</span>
        {hasFilter ? (
          <button
            onClick={(e) => { e.stopPropagation(); clear(); }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        ) : (
          <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
        )}
      </button>

      {open && (
        <div className="absolute left-0 mt-1.5 w-56 rounded-xl border border-white/[0.08] bg-[#161b22] shadow-2xl z-30 py-1 overflow-hidden">
          {options.map((opt) => {
            const count = counts[opt.key] ?? 0;
            const isChecked = selected.includes(opt.key);
            return (
              <button
                key={opt.key}
                onClick={() => toggle(opt.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                  isChecked
                    ? "text-violet-300 bg-violet-500/8"
                    : "text-white/50 hover:bg-white/[0.04] hover:text-white/70"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                  isChecked
                    ? "bg-violet-500 border-violet-500"
                    : "border-white/20 bg-transparent"
                }`}>
                  {isChecked && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                {opt.dot && (
                  <span className={`w-2 h-2 rounded-full ${opt.dot} shrink-0`} />
                )}
                <span className="flex-1">{opt.label}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white/[0.04]">
                  {count}
                </span>
              </button>
            );
          })}
          {selected.length > 0 && (
            <div className="border-t border-white/[0.06] mt-1 pt-1 px-3 pb-1.5">
              <button
                onClick={clear}
                className="text-[11px] text-white/30 hover:text-white/60 transition-colors cursor-pointer"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── main search bar ── */

interface Props {
  statusCounts: Record<string, number>;
  intentCounts: Record<string, number>;
  onExportCSV: () => void;
  onToggleColumns: () => void;
  expandAll: boolean;
  onToggleExpandAll: () => void;
}

export default function QuoteSearchBar({
  statusCounts,
  intentCounts,
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
    <div className="flex flex-col sm:flex-row gap-2.5">
      {/* Filter dropdowns */}
      <div className="flex gap-2 shrink-0">
        <FilterDropdown paramKey="status" label="Status" options={STATUS_OPTIONS} counts={statusCounts} />
        <FilterDropdown paramKey="intent" label="Quote Type" options={INTENT_OPTIONS} counts={intentCounts} />
      </div>

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
      <div className="flex gap-2 shrink-0">
        <button
          onClick={toggleDueToday}
          title="Due Today"
          className={`inline-flex items-center gap-1.5 p-2.5 sm:px-3 sm:py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
            isDueToday
              ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
              : "bg-white/[0.03] border-white/[0.08] text-white/50 hover:bg-white/[0.06] hover:text-white/80"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Due Today</span>
        </button>

        <button
          onClick={onToggleExpandAll}
          title={expandAll ? "Collapse All" : "Expand All"}
          className="inline-flex items-center gap-1.5 p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/50 text-xs font-medium hover:bg-white/[0.06] hover:text-white/80 transition-all cursor-pointer"
        >
          <ChevronsUpDown className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{expandAll ? "Collapse" : "Expand"}</span>
        </button>

        <button
          onClick={onToggleColumns}
          title="Customize columns"
          className="inline-flex items-center gap-1.5 p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/50 text-xs font-medium hover:bg-white/[0.06] hover:text-white/80 transition-all cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Columns</span>
        </button>

        <button
          onClick={onExportCSV}
          title="Export CSV"
          className="inline-flex items-center gap-1.5 p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/50 text-xs font-medium hover:bg-white/[0.06] hover:text-white/80 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            title="Sort order"
            className="inline-flex items-center gap-1.5 p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/50 text-xs font-medium hover:bg-white/[0.06] hover:text-white/80 transition-all cursor-pointer"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            <span className="hidden sm:inline">{currentSort === "newest" ? "Newest" : "Oldest"}</span>
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
