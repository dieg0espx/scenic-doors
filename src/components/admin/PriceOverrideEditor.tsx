"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { overrideQuotePrice } from "@/lib/actions/quotes";

interface Props {
  quoteId: string;
  currentTotal: number;
  /** If true, the edit button is hidden (e.g. deposit already paid) */
  locked?: boolean;
  /** Compact mode for inline header usage */
  compact?: boolean;
}

export default function PriceOverrideEditor({ quoteId, currentTotal, locked, compact }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentTotal.toFixed(2));
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  function handleOpen() {
    if (locked) return;
    setValue(currentTotal.toFixed(2));
    setEditing(true);
  }

  function handleCancel() {
    setEditing(false);
    setValue(currentTotal.toFixed(2));
  }

  async function handleSave() {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) return;
    if (Math.abs(num - currentTotal) < 0.01) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await overrideQuotePrice(quoteId, Math.round(num * 100) / 100);
      setEditing(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update price");
    } finally {
      setSaving(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  }

  if (editing) {
    return (
      <div className="flex items-center justify-center gap-2">
        <span className={`font-bold text-white/50 ${compact ? "text-sm" : "text-2xl"}`}>$</span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={saving}
          className={`font-bold text-white bg-white/[0.06] border border-white/[0.12] rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/40 disabled:opacity-50 ${
            compact ? "w-28 text-sm px-2 py-1" : "w-40 text-2xl px-3 py-1.5"
          }`}
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={handleCancel}
          disabled={saving}
          className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white/60 hover:bg-white/[0.08] transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 group ${compact ? "justify-end" : "justify-center"}`}>
      <p className={`font-bold text-white ${compact ? "text-sm" : "text-3xl"}`}>
        ${currentTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </p>
      {!locked && (
        <button
          onClick={handleOpen}
          className="p-1 rounded-lg text-white/15 group-hover:text-white/40 hover:!text-white/60 hover:bg-white/[0.06] transition-all cursor-pointer"
          title="Override price"
        >
          <Pencil className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
