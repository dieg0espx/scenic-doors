"use client";

import { useState } from "react";
import { Truck, Loader2, Check, Pencil, Package } from "lucide-react";
import { updateTrackingInfo } from "@/lib/actions/order-tracking";

interface Props {
  trackingId: string;
  quoteId: string;
  initialTrackingNumber: string | null;
  initialCarrier: string | null;
}

const CARRIERS = [
  { value: "FedEx", label: "FedEx", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  { value: "UPS", label: "UPS", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { value: "USPS", label: "USPS", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { value: "DHL", label: "DHL", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
  { value: "Freight", label: "Freight", color: "text-slate-400 bg-slate-500/10 border-slate-500/20" },
  { value: "Other", label: "Other", color: "text-white/50 bg-white/[0.04] border-white/[0.08]" },
];

export default function TrackingCodeInput({
  trackingId,
  quoteId,
  initialTrackingNumber,
  initialCarrier,
}: Props) {
  const [editing, setEditing] = useState(!initialTrackingNumber);
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber || "");
  const [carrier, setCarrier] = useState(initialCarrier || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (!trackingNumber.trim()) return;
    setSaving(true);
    try {
      await updateTrackingInfo(trackingId, quoteId, trackingNumber.trim(), carrier);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save tracking info");
    } finally {
      setSaving(false);
    }
  }

  // Display mode — show saved tracking info
  if (!editing && initialTrackingNumber) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-mono font-medium text-sm truncate">{trackingNumber}</p>
            {carrier && <p className="text-white/40 text-xs">{carrier}</p>}
          </div>
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] text-xs transition-all cursor-pointer"
          >
            <Pencil className="w-3 h-3" />
            Edit
          </button>
        </div>
      </div>
    );
  }

  // Edit mode
  return (
    <div className="space-y-4">
      {/* Tracking number input */}
      <div>
        <label className="text-white/30 text-[11px] uppercase tracking-wider font-medium mb-1.5 block">
          Tracking Number
        </label>
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="e.g. 1Z999AA10123456784"
          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm font-mono placeholder:text-white/15 focus:outline-none focus:ring-1 focus:ring-sky-500/50 focus:border-sky-500/30 transition-all"
        />
      </div>

      {/* Carrier selection — button group */}
      <div>
        <label className="text-white/30 text-[11px] uppercase tracking-wider font-medium mb-2 block">
          Shipping Carrier
        </label>
        <div className="flex flex-wrap gap-2">
          {CARRIERS.map((c) => {
            const isSelected = carrier === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => setCarrier(isSelected ? "" : c.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  isSelected
                    ? c.color + " ring-1 ring-current/20"
                    : "text-white/30 bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:text-white/50"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={handleSave}
          disabled={saving || !trackingNumber.trim()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 text-white text-sm font-medium hover:bg-sky-400 transition-colors cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Saved
            </>
          ) : (
            <>
              <Truck className="w-3.5 h-3.5" />
              Save Tracking
            </>
          )}
        </button>
        {initialTrackingNumber && (
          <button
            onClick={() => {
              setTrackingNumber(initialTrackingNumber);
              setCarrier(initialCarrier || "");
              setEditing(false);
            }}
            className="text-white/30 hover:text-white/50 text-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
