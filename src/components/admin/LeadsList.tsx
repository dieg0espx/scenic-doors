"use client";

import { useState, useTransition, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, UserPlus, Trash2, Filter, StickyNote, AlertTriangle, X, ChevronDown, Check } from "lucide-react";
import type { Lead } from "@/lib/types";
import { deleteLead, updateLeadWorkflow } from "@/lib/actions/leads";

const tempConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  hot: { bg: "bg-orange-400/10", text: "text-orange-300", dot: "bg-orange-400", label: "Hot" },
  warm: { bg: "bg-amber-400/10", text: "text-amber-300", dot: "bg-amber-400", label: "Warm" },
  cold: { bg: "bg-sky-400/10", text: "text-sky-300", dot: "bg-sky-400", label: "Cold" },
};

const workflowConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  contacted: { bg: "bg-violet-400/10", text: "text-violet-300", dot: "bg-violet-400", label: "Contacted" },
  qualified: { bg: "bg-emerald-400/10", text: "text-emerald-300", dot: "bg-emerald-400", label: "Qualified" },
  lost: { bg: "bg-red-400/10", text: "text-red-300", dot: "bg-red-400", label: "Lost" },
};

// Combined for filter dropdown
const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  ...tempConfig,
  ...workflowConfig,
};

// Grouped statuses — temperature (auto) vs. workflow (manual)
const TEMPERATURE_STATUSES = ["hot", "warm", "cold"];
const WORKFLOW_STATUSES = ["contacted", "qualified", "lost"];

/* ── Workflow Dropdown (inline) ────────────────────────── */
function WorkflowDropdown({
  value,
  onChange,
  compact,
}: {
  value: string | null;
  onChange: (v: string) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, close]);

  const current = value ? workflowConfig[value] : null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-all cursor-pointer active:scale-95 ${
          current
            ? `${current.bg} ${current.text}`
            : "bg-white/[0.04] text-white/30"
        } ${
          compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"
        } ${open ? "ring-2 ring-white/10" : "hover:brightness-125"}`}
      >
        {current && <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />}
        {current ? current.label : "—"}
        <ChevronDown className={`w-3 h-3 opacity-50 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-40 rounded-xl border border-white/[0.08] bg-[#161b22] shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="py-1">
            {WORKFLOW_STATUSES.map((s) => {
              const sc = workflowConfig[s];
              const isSelected = value === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(s);
                    close();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? `${sc.bg} ${sc.text}`
                      : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${sc.dot} ${isSelected ? "" : "opacity-40"}`} />
                  <span className="flex-1 text-left font-medium">{sc.label}</span>
                  {isSelected && <Check className="w-3 h-3 opacity-70" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Status Filter Dropdown (multi-select, grouped) ────── */
function StatusFilterDropdown({
  selected,
  onChange,
}: {
  selected: Set<string>;
  onChange: (v: Set<string>) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, close]);

  const isFiltered = selected.size > 0;
  const label = !isFiltered
    ? "All Status"
    : selected.size === 1
    ? statusConfig[Array.from(selected)[0]]?.label || "1 status"
    : `${selected.size} statuses`;

  function toggle(s: string) {
    const next = new Set(selected);
    if (next.has(s)) next.delete(s); else next.add(s);
    onChange(next);
  }

  function renderGroup(title: string, statuses: string[]) {
    return (
      <>
        <p className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-wider text-white/20 font-semibold">{title}</p>
        {statuses.map((s) => {
          const sc = statusConfig[s];
          if (!sc) return null;
          const isSelected = selected.has(s);
          return (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors cursor-pointer ${
                isSelected
                  ? `${sc.bg} ${sc.text}`
                  : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${sc.dot} ${isSelected ? "" : "opacity-40"}`} />
              <span className="flex-1 text-left font-medium">{sc.label}</span>
              {isSelected && <Check className="w-3 h-3 opacity-70" />}
            </button>
          );
        })}
      </>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer active:scale-[0.97] ${
          isFiltered
            ? "bg-violet-500/10 border-violet-500/30 text-violet-300"
            : "bg-white/[0.03] border-white/[0.08] text-white/50 hover:bg-white/[0.06]"
        } ${open ? "ring-2 ring-violet-500/20" : ""}`}
      >
        <span className="max-w-[7rem] truncate">{label}</span>
        <ChevronDown className={`w-3 h-3 opacity-40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-44 rounded-xl border border-white/[0.08] bg-[#161b22] shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="max-h-72 overflow-y-auto py-1 custom-scrollbar">
            {/* Clear all */}
            <button
              type="button"
              onClick={() => onChange(new Set())}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors cursor-pointer ${
                !isFiltered
                  ? "bg-violet-500/10 text-violet-300"
                  : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
              }`}
            >
              <span className="flex-1 text-left font-medium">All Status</span>
              {!isFiltered && <Check className="w-3 h-3 opacity-70" />}
            </button>

            <div className="mx-2.5 my-1 border-t border-white/[0.06]" />
            {renderGroup("Temperature", TEMPERATURE_STATUSES)}

            <div className="mx-2.5 my-1 border-t border-white/[0.06]" />
            {renderGroup("Workflow", WORKFLOW_STATUSES)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Generic Filter Dropdown (single-select, for sources etc.) ── */
function FilterDropdown({
  value,
  onChange,
  options,
  allLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  allLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, close]);

  const isFiltered = value !== "all";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer active:scale-[0.97] ${
          isFiltered
            ? "bg-violet-500/10 border-violet-500/30 text-violet-300"
            : "bg-white/[0.03] border-white/[0.08] text-white/50 hover:bg-white/[0.06]"
        } ${open ? "ring-2 ring-violet-500/20" : ""}`}
      >
        <span className="max-w-[7rem] truncate">
          {isFiltered ? options.find((o) => o.value === value)?.label || value : allLabel}
        </span>
        <ChevronDown className={`w-3 h-3 opacity-40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 min-w-[10rem] rounded-xl border border-white/[0.08] bg-[#161b22] shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="max-h-56 overflow-y-auto py-1 custom-scrollbar">
            <button
              type="button"
              onClick={() => { onChange("all"); close(); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors cursor-pointer ${
                value === "all"
                  ? "bg-violet-500/10 text-violet-300"
                  : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
              }`}
            >
              <span className="flex-1 text-left font-medium">{allLabel}</span>
              {value === "all" && <Check className="w-3 h-3 opacity-70" />}
            </button>

            {options.length > 0 && (
              <div className="mx-2.5 my-1 border-t border-white/[0.06]" />
            )}

            {options.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); close(); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-violet-500/10 text-violet-300"
                      : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
                  }`}
                >
                  <span className="flex-1 text-left font-medium">{opt.label}</span>
                  {isSelected && <Check className="w-3 h-3 opacity-70" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  leads: Lead[];
  needsAttentionIds?: Set<string>;
  isAdmin?: boolean;
}

/* ── Bulk Status Dropdown (for bulk actions bar) ───────── */
function BulkStatusDropdown({ onSelect }: { onSelect: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, close]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all active:scale-[0.97] ${
          open
            ? "bg-violet-500/10 border-violet-500/30 text-violet-300 ring-2 ring-violet-500/20"
            : "bg-white/[0.05] border-white/[0.1] text-white/60 hover:bg-white/[0.08] hover:text-white/80"
        }`}
      >
        Set Status
        <ChevronDown className={`w-3 h-3 opacity-50 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-40 rounded-xl border border-white/[0.08] bg-[#161b22] shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="py-1">
            <p className="px-3 pt-1.5 pb-1 text-[10px] uppercase tracking-wider text-white/20 font-semibold">Set workflow</p>
            {WORKFLOW_STATUSES.map((s) => {
              const sc = workflowConfig[s];
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => { onSelect(s); close(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-white/50 hover:bg-white/[0.04] hover:text-white/80 transition-colors cursor-pointer"
                >
                  <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                  <span className="flex-1 text-left font-medium">{sc.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LeadsList({ leads, needsAttentionIds = new Set(), isAdmin = true }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set());
  const [sourceFilter, setSourceFilter] = useState("all");
  const [showNonConverted, setShowNonConverted] = useState(false);
  const [showNeedsAttention, setShowNeedsAttention] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const sources = Array.from(new Set(leads.map((l) => l.source).filter(Boolean)));

  const filtered = leads.filter((l) => {
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.email?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter.size > 0 && !statusFilter.has(l.status) && !(l.workflow_status && statusFilter.has(l.workflow_status))) return false;
    if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
    if (showNonConverted && l.has_quote) return false;
    if (showNeedsAttention && !needsAttentionIds.has(l.id)) return false;
    return true;
  });

  async function handleDelete(id: string) {
    if (!confirm("Delete this lead?")) return;
    try {
      await deleteLead(id);
      setSelectedIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete lead");
    }
  }

  async function handleInlineWorkflowChange(id: string, newWorkflow: string) {
    startTransition(async () => {
      try {
        await updateLeadWorkflow(id, newWorkflow);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to update workflow");
      }
    });
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((l) => l.id)));
    }
  }

  async function handleBulkWorkflowUpdate(newWorkflow: string) {
    if (selectedIds.size === 0) return;
    startTransition(async () => {
      try {
        await Promise.all(Array.from(selectedIds).map((id) => updateLeadWorkflow(id, newWorkflow)));
        setSelectedIds(new Set());
      } catch (err) {
        alert(err instanceof Error ? err.message : "Bulk update failed");
      }
    });
  }

  async function handleBulkDelete() {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} lead(s)?`)) return;
    startTransition(async () => {
      try {
        await Promise.all(Array.from(selectedIds).map((id) => deleteLead(id)));
        setSelectedIds(new Set());
      } catch (err) {
        alert(err instanceof Error ? err.message : "Bulk delete failed");
      }
    });
  }

  function navigateToLead(id: string) {
    router.push(`/admin/leads/${id}`);
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.08] p-8 sm:p-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-7 h-7 text-teal-400/60" />
        </div>
        <h3 className="text-lg font-semibold text-white/60 mb-1">No leads yet</h3>
        <p className="text-white/30 text-sm">Leads will appear here as they come in.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk actions bar (admin only) */}
      {isAdmin && selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl bg-violet-500/[0.06] border border-violet-500/20">
          <span className="text-violet-300 text-sm font-medium">{selectedIds.size} selected</span>
          <BulkStatusDropdown onSelect={handleBulkWorkflowUpdate} />
          <button
            onClick={handleBulkDelete}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-medium hover:bg-red-500/15 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-3 h-3" /> Delete
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="ml-auto p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/40 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap sm:shrink-0">
          <StatusFilterDropdown
            selected={statusFilter}
            onChange={setStatusFilter}
          />
          <FilterDropdown
            value={sourceFilter}
            onChange={setSourceFilter}
            options={sources.map((s) => ({ value: s!, label: s! }))}
            allLabel="All Sources"
          />
          <button
            onClick={() => setShowNonConverted(!showNonConverted)}
            className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              showNonConverted
                ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                : "bg-white/[0.03] border-white/[0.08] text-white/50 hover:bg-white/[0.06]"
            }`}
          >
            <Filter className="w-3.5 h-3.5" /> <span className="sm:hidden">No Quote</span><span className="hidden sm:inline">Non-Converted Only</span>
          </button>
          {needsAttentionIds.size > 0 && (
            <button
              onClick={() => setShowNeedsAttention(!showNeedsAttention)}
              className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                showNeedsAttention
                  ? "bg-orange-500/10 border-orange-500/30 text-orange-300"
                  : "bg-white/[0.03] border-white/[0.08] text-white/50 hover:bg-white/[0.06]"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Needs Attention
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-white/[0.04]">
          {filtered.map((lead) => (
              <div
                key={lead.id}
                className="p-4 space-y-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => navigateToLead(lead.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium text-sm truncate">{lead.name}</p>
                      {lead.notes && <StickyNote className="w-3 h-3 text-amber-400/50 shrink-0" />}
                      {lead.customer_type && (
                        <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-400/10 text-indigo-300 capitalize">
                          {lead.customer_type}
                        </span>
                      )}
                    </div>
                    {lead.email && <p className="text-white/30 text-xs truncate">{lead.email}</p>}
                  </div>
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {(() => {
                      const tc = tempConfig[lead.status] || tempConfig.hot;
                      return (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium ${tc.bg} ${tc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${tc.dot}`} />
                          {tc.label}
                        </span>
                      );
                    })()}
                    <WorkflowDropdown
                      value={lead.workflow_status}
                      onChange={(v) => handleInlineWorkflowChange(lead.id, v)}
                      compact
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/30">
                  {lead.phone && <span>{lead.phone}</span>}
                  {lead.phone && lead.source && <span className="text-white/15">·</span>}
                  {lead.source && <span>{lead.source}</span>}
                  {(lead.phone || lead.source) && lead.has_quote && <span className="text-white/15">·</span>}
                  {lead.has_quote && <span className="text-emerald-300/70">Has Quote</span>}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                  <span className="text-white/20 text-xs">
                    {new Date(lead.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(lead.id); }}
                      className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
          ))}
        </div>

        {/* Desktop table */}
        <table className="hidden md:table w-full text-sm">
          <thead>
            <tr className="bg-white/[0.02]">
              {isAdmin && (
                <th className="text-left px-3 py-3.5 w-10">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedIds.size === filtered.length}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 rounded border-white/20 bg-white/[0.03] text-violet-500 focus:ring-violet-500/30 cursor-pointer"
                  />
                </th>
              )}
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Name</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Contact</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Source</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Temp</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Workflow</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Quote</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Date</th>
              {isAdmin && <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                  onClick={() => navigateToLead(lead.id)}
                >
                  {isAdmin && (
                    <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(lead.id)}
                        onChange={() => toggleSelect(lead.id)}
                        className="w-3.5 h-3.5 rounded border-white/20 bg-white/[0.03] text-violet-500 focus:ring-violet-500/30 cursor-pointer"
                      />
                    </td>
                  )}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <p className="text-white font-medium text-[13px]">{lead.name}</p>
                      {lead.notes && <StickyNote className="w-3 h-3 text-amber-400/50 shrink-0" />}
                    </div>
                    {lead.customer_type && <p className="text-white/25 text-[11px] capitalize">{lead.customer_type}</p>}
                  </td>
                  <td className="px-5 py-3.5">
                    {lead.email && <p className="text-white/50 text-xs">{lead.email}</p>}
                    {lead.phone && <p className="text-white/30 text-xs">{lead.phone}</p>}
                  </td>
                  <td className="px-5 py-3.5 text-white/40 text-xs">{lead.source || "—"}</td>
                  <td className="px-5 py-3.5">
                    {(() => {
                      const tc = tempConfig[lead.status] || tempConfig.hot;
                      return (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium ${tc.bg} ${tc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${tc.dot}`} />
                          {tc.label}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <WorkflowDropdown
                      value={lead.workflow_status}
                      onChange={(v) => handleInlineWorkflowChange(lead.id, v)}
                    />
                  </td>
                  <td className="px-5 py-3.5">
                    {lead.has_quote ? (
                      <span className="text-emerald-300/70 text-xs">Yes</span>
                    ) : (
                      <span className="text-white/20 text-xs">No</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-white/25 text-xs">
                    {new Date(lead.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="p-1.5 rounded-lg text-white/15 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && leads.length > 0 && (
        <div className="text-center py-6 sm:py-8">
          <p className="text-white/25 text-sm">No leads match your filters</p>
        </div>
      )}
    </div>
  );
}
