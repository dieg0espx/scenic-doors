"use client";

import { useState } from "react";
import { Search, UserPlus, Trash2, Filter } from "lucide-react";
import type { Lead } from "@/lib/types";
import { deleteLead } from "@/lib/actions/leads";

const statusConfig: Record<string, { bg: string; text: string }> = {
  new: { bg: "bg-blue-400/10", text: "text-blue-300" },
  contacted: { bg: "bg-violet-400/10", text: "text-violet-300" },
  qualified: { bg: "bg-emerald-400/10", text: "text-emerald-300" },
  lost: { bg: "bg-red-400/10", text: "text-red-300" },
};

interface Props {
  leads: Lead[];
}

export default function LeadsList({ leads }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [showNonConverted, setShowNonConverted] = useState(false);

  const sources = Array.from(new Set(leads.map((l) => l.source).filter(Boolean)));
  const statuses = Array.from(new Set(leads.map((l) => l.status)));

  const filtered = leads.filter((l) => {
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.email?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
    if (showNonConverted && l.has_quote) return false;
    return true;
  });

  async function handleDelete(id: string) {
    if (!confirm("Delete this lead?")) return;
    try {
      await deleteLead(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete lead");
    }
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.08] p-12 sm:p-16 text-center">
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
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/40 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/50 text-xs font-medium cursor-pointer focus:outline-none"
          >
            <option value="all">All Status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/50 text-xs font-medium cursor-pointer focus:outline-none"
          >
            <option value="all">All Sources</option>
            {sources.map((s) => (
              <option key={s} value={s!}>{s}</option>
            ))}
          </select>
          <button
            onClick={() => setShowNonConverted(!showNonConverted)}
            className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              showNonConverted
                ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                : "bg-white/[0.03] border-white/[0.08] text-white/50 hover:bg-white/[0.06]"
            }`}
          >
            <Filter className="w-3.5 h-3.5" /> Non-Converted Only
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-white/[0.04]">
          {filtered.map((lead) => {
            const sc = statusConfig[lead.status] || statusConfig.new;
            return (
              <div key={lead.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-medium text-sm">{lead.name}</p>
                    {lead.email && <p className="text-white/30 text-xs">{lead.email}</p>}
                  </div>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${sc.bg} ${sc.text}`}>
                    {lead.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/30">
                  {lead.phone && <span>{lead.phone}</span>}
                  {lead.source && <span>{lead.source}</span>}
                  {lead.has_quote && <span className="text-emerald-300/70">Has Quote</span>}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                  <span className="text-white/20 text-xs">
                    {new Date(lead.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <button
                    onClick={() => handleDelete(lead.id)}
                    className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop table */}
        <table className="hidden md:table w-full text-sm">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Name</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Contact</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Source</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Status</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Quote</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Date</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.map((lead) => {
              const sc = statusConfig[lead.status] || statusConfig.new;
              return (
                <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-white font-medium text-[13px]">{lead.name}</p>
                    {lead.customer_type && <p className="text-white/25 text-[11px] capitalize">{lead.customer_type}</p>}
                  </td>
                  <td className="px-5 py-3.5">
                    {lead.email && <p className="text-white/50 text-xs">{lead.email}</p>}
                    {lead.phone && <p className="text-white/30 text-xs">{lead.phone}</p>}
                  </td>
                  <td className="px-5 py-3.5 text-white/40 text-xs">{lead.source || "—"}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${sc.bg} ${sc.text}`}>
                      {lead.status}
                    </span>
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
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="p-1.5 rounded-lg text-white/15 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && leads.length > 0 && (
        <div className="text-center py-8">
          <p className="text-white/25 text-sm">No leads match your filters</p>
        </div>
      )}
    </div>
  );
}
