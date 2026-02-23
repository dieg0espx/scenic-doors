"use client";

import { useState, useEffect } from "react";
import type { Quote } from "@/lib/types";
import { exportToCSV } from "@/lib/utils/csv-export";
import QuoteSearchBar from "@/components/admin/QuoteSearchBar";
import ExpandableQuoteCard from "@/components/admin/ExpandableQuoteCard";
import ColumnSelectorModal, {
  DEFAULT_COLUMNS,
} from "@/components/admin/ColumnSelectorModal";
import { FileText } from "lucide-react";

interface Props {
  quotes: Quote[];
  counts: Record<string, number>;
  intentCounts: Record<string, number>;
  userNameMap?: Record<string, string>;
}

const STORAGE_KEY = "scenic-quote-columns";

export default function QuotesPageClient({ quotes, counts, intentCounts, userNameMap = {} }: Props) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [expandAll, setExpandAll] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(DEFAULT_COLUMNS);

  // Load saved columns from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setVisibleColumns(new Set(JSON.parse(saved)));
      }
    } catch {
      // ignore
    }
  }, []);

  function handleColumnChange(cols: Set<string>) {
    setVisibleColumns(cols);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(cols)));
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleExpandAll() {
    if (expandAll) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(quotes.map((q) => q.id)));
    }
    setExpandAll(!expandAll);
  }

  function handleExportCSV() {
    exportToCSV(
      quotes,
      [
        { header: "Quote #", accessor: (q) => q.quote_number },
        { header: "Client", accessor: (q) => q.client_name },
        { header: "Email", accessor: (q) => q.client_email },
        { header: "Phone", accessor: (q) => q.customer_phone },
        { header: "Type", accessor: (q) => q.customer_type },
        { header: "Door Type", accessor: (q) => q.door_type },
        { header: "Status", accessor: (q) => q.lead_status },
        { header: "Total", accessor: (q) => q.grand_total || q.cost },
        { header: "Created", accessor: (q) => q.created_at },
      ],
      `quotes-export-${new Date().toISOString().split("T")[0]}`
    );
  }

  return (
    <div className="space-y-4">
      <QuoteSearchBar
        statusCounts={counts}
        intentCounts={intentCounts}
        onExportCSV={handleExportCSV}
        onToggleColumns={() => setShowColumnModal(true)}
        expandAll={expandAll}
        onToggleExpandAll={toggleExpandAll}
      />

      {quotes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.08] p-8 sm:p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7 text-violet-400/60" />
          </div>
          <h3 className="text-lg font-semibold text-white/60 mb-1">
            No quotes found
          </h3>
          <p className="text-white/30 text-sm">
            Try adjusting your filters or create a new quote.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {quotes.map((quote) => (
            <ExpandableQuoteCard
              key={quote.id}
              quote={quote}
              expanded={expandedIds.has(quote.id)}
              onToggle={() => toggleExpand(quote.id)}
              visibleColumns={visibleColumns}
              userNameMap={userNameMap}
            />
          ))}
        </div>
      )}

      {showColumnModal && (
        <ColumnSelectorModal
          visible={visibleColumns}
          onChange={handleColumnChange}
          onClose={() => setShowColumnModal(false)}
        />
      )}
    </div>
  );
}
