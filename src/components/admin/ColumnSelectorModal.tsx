"use client";

import { X, Check } from "lucide-react";

const ALL_COLUMNS = [
  { key: "customer", label: "Customer Name" },
  { key: "type", label: "Customer Type" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "zip", label: "ZIP Code" },
  { key: "assigned", label: "Assigned To" },
  { key: "date", label: "Date" },
  { key: "items", label: "Items Count" },
];

export const DEFAULT_COLUMNS = new Set([
  "customer",
  "type",
  "email",
  "assigned",
  "date",
  "items",
]);

interface Props {
  visible: Set<string>;
  onChange: (cols: Set<string>) => void;
  onClose: () => void;
}

export default function ColumnSelectorModal({
  visible,
  onChange,
  onClose,
}: Props) {
  function toggleColumn(key: string) {
    const next = new Set(visible);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    onChange(next);
  }

  function resetDefaults() {
    onChange(new Set(DEFAULT_COLUMNS));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#161b22] shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white">Customize Columns</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-1">
          {ALL_COLUMNS.map((col) => {
            const isActive = visible.has(col.key);
            return (
              <button
                key={col.key}
                onClick={() => toggleColumn(col.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors cursor-pointer ${
                  isActive
                    ? "bg-violet-500/10 text-violet-300"
                    : "text-white/40 hover:bg-white/[0.04] hover:text-white/60"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? "bg-violet-500 border-violet-500"
                      : "border-white/[0.12] bg-transparent"
                  }`}
                >
                  {isActive && <Check className="w-3 h-3 text-white" />}
                </div>
                {col.label}
              </button>
            );
          })}
        </div>
        <div className="px-4 pb-4">
          <button
            onClick={resetDefaults}
            className="w-full py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/40 text-xs font-medium hover:bg-white/[0.06] hover:text-white/60 transition-colors cursor-pointer"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
