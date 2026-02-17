"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  MessageSquare,
  CheckSquare,
  Eye,
  Trash2,
  Download,
} from "lucide-react";
import type { Quote } from "@/lib/types";
import { deleteQuote } from "@/lib/actions/quotes";

const leadStatusConfig: Record<string, { dot: string; bg: string; text: string }> = {
  new: { dot: "bg-blue-400", bg: "bg-blue-400/10", text: "text-blue-300" },
  hot: { dot: "bg-red-400", bg: "bg-red-400/10", text: "text-red-300" },
  warm: { dot: "bg-amber-400", bg: "bg-amber-400/10", text: "text-amber-300" },
  cold: { dot: "bg-sky-400", bg: "bg-sky-400/10", text: "text-sky-300" },
  hold: { dot: "bg-gray-400", bg: "bg-gray-400/10", text: "text-gray-300" },
  archived: { dot: "bg-zinc-500", bg: "bg-zinc-500/10", text: "text-zinc-400" },
};

const customerTypeBadge: Record<string, string> = {
  residential: "bg-emerald-400/10 text-emerald-300",
  commercial: "bg-indigo-400/10 text-indigo-300",
  contractor: "bg-amber-400/10 text-amber-300",
};

interface Props {
  quote: Quote;
  expanded: boolean;
  onToggle: () => void;
  visibleColumns: Set<string>;
}

export default function ExpandableQuoteCard({
  quote,
  expanded,
  onToggle,
  visibleColumns,
}: Props) {
  const [deleting, setDeleting] = useState(false);
  const sc = leadStatusConfig[quote.lead_status] || leadStatusConfig.new;
  const notesCount = quote.quote_notes?.length ?? 0;
  const tasksCount = quote.quote_tasks?.length ?? 0;
  const assignedName = quote.admin_users?.name;
  const itemsCount = Array.isArray(quote.items) ? quote.items.length : 0;
  const total = Number(quote.grand_total || quote.cost || 0);

  async function handleDelete() {
    if (!confirm("Delete this quote? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await deleteQuote(quote.id);
    } catch {
      setDeleting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all hover:border-white/[0.1]">
      {/* Collapsed header - always visible */}
      <button
        onClick={onToggle}
        className="w-full px-4 sm:px-5 py-4 flex items-center gap-3 sm:gap-4 text-left cursor-pointer"
      >
        {/* Status dot */}
        <div className={`w-8 h-8 rounded-lg ${sc.bg} flex items-center justify-center shrink-0`}>
          <span className={`w-2.5 h-2.5 rounded-full ${sc.dot}`} />
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-white/25 font-mono text-[11px]">
              {quote.quote_number}
            </span>
            {assignedName && visibleColumns.has("assigned") && (
              <span className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-300 text-[10px] font-medium">
                {assignedName}
              </span>
            )}
            {visibleColumns.has("date") && (
              <span className="text-white/20 text-[11px]">
                {new Date(quote.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${sc.bg} ${sc.text}`}>
              {quote.lead_status.charAt(0).toUpperCase() + quote.lead_status.slice(1)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {visibleColumns.has("customer") && (
              <div className="flex items-center gap-1.5">
                <User className="w-3 h-3 text-white/20" />
                <span className="text-white text-sm font-medium truncate max-w-[160px]">
                  {quote.client_name}
                </span>
              </div>
            )}
            {visibleColumns.has("type") && quote.customer_type && (
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${customerTypeBadge[quote.customer_type] || customerTypeBadge.residential}`}>
                {quote.customer_type}
              </span>
            )}
            {visibleColumns.has("phone") && (quote.customer_phone || quote.client_email) && (
              <div className="hidden sm:flex items-center gap-1.5 text-white/30 text-xs">
                {quote.customer_phone && (
                  <>
                    <Phone className="w-3 h-3" />
                    <span>{quote.customer_phone}</span>
                  </>
                )}
              </div>
            )}
            {visibleColumns.has("email") && (
              <div className="hidden sm:flex items-center gap-1.5 text-white/30 text-xs">
                <Mail className="w-3 h-3" />
                <span className="truncate max-w-[180px]">{quote.client_email}</span>
              </div>
            )}
            {visibleColumns.has("zip") && quote.customer_zip && (
              <div className="hidden sm:flex items-center gap-1.5 text-white/30 text-xs">
                <MapPin className="w-3 h-3" />
                <span>{quote.customer_zip}</span>
              </div>
            )}
            {visibleColumns.has("items") && itemsCount > 0 && (
              <span className="text-white/25 text-[11px]">
                {itemsCount} item{itemsCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Total + chevron */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-white font-semibold text-sm sm:text-base">
            ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-white/25 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-4 border-t border-white/[0.04]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {/* Activity */}
                <div className="space-y-2">
                  <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium">
                    Activity
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-white/40 text-xs">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{notesCount} note{notesCount !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/40 text-xs">
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>{tasksCount} task{tasksCount !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                  {quote.follow_up_date && (
                    <div className="flex items-center gap-1.5 text-amber-300/70 text-xs">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        Follow up:{" "}
                        {new Date(quote.follow_up_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Quote info */}
                <div className="space-y-2">
                  <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium">
                    Quote Info
                  </p>
                  <div className="space-y-1 text-xs text-white/40">
                    <p>
                      Created:{" "}
                      {new Date(quote.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    {quote.assigned_date && (
                      <p>
                        Assigned:{" "}
                        {new Date(quote.assigned_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    )}
                    {quote.created_by && <p>Created by: {quote.created_by}</p>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 sm:items-end">
                  <Link
                    href={`/admin/quotes/${quote.id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium hover:bg-violet-500/15 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </Link>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/[0.06] border border-red-500/15 text-red-400/60 text-xs font-medium hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                    <Link
                      href={`/admin/quotes/${quote.id}/print`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/40 text-xs font-medium hover:bg-white/[0.06] hover:text-white/70 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Export
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
