"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Loader2, Check, Plus } from "lucide-react";
import { updateInstallationCost } from "@/lib/actions/quotes";

export default function InstallationCostInput({
  quoteId,
  initialCost,
}: {
  quoteId: string;
  initialCost: number;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialCost > 0 ? String(initialCost) : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    const parsed = parseFloat(value) || 0;
    if (parsed < 0) return;

    setSaving(true);
    setError("");
    try {
      await updateInstallationCost(quoteId, parsed);
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  if (!editing && initialCost <= 0) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
      >
        <Plus className="w-3 h-3" />
        Add Installation Cost
      </button>
    );
  }

  if (!editing) {
    return (
      <div
        className="flex justify-between text-sm cursor-pointer group"
        onClick={() => setEditing(true)}
      >
        <span className="text-white/40 flex items-center gap-1.5">
          <Wrench className="w-3 h-3" />
          Installation
          <span className="text-[10px] text-white/20 opacity-0 group-hover:opacity-100 transition-opacity">(click to edit)</span>
        </span>
        <span className="text-white/60">${initialCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            placeholder="0.00"
            autoFocus
            className="w-full pl-7 pr-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-500/40 focus:ring-1 focus:ring-sky-500/20"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        </button>
        <button
          onClick={() => {
            setEditing(false);
            setValue(initialCost > 0 ? String(initialCost) : "");
          }}
          disabled={saving}
          className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white/60 transition-colors cursor-pointer disabled:opacity-50 text-xs"
        >
          Cancel
        </button>
      </div>
      <p className="text-[10px] text-white/25">Installation cost will be added to the balance invoice.</p>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
