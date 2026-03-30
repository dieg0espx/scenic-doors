"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Loader2,
  Tag,
  Calendar,
  Percent,
  ToggleLeft,
  ToggleRight,
  Pencil,
  Check,
  X,
} from "lucide-react";
import {
  createGlobalDiscount,
  updateGlobalDiscount,
  deleteGlobalDiscount,
} from "@/lib/actions/global-discounts";
import type { GlobalDiscount } from "@/lib/actions/global-discounts";

const DOOR_OPTIONS = [
  { slug: "multi-slide-pocket", label: "Multi-Slide & Pocket" },
  { slug: "ultra-slim", label: "Ultra Slim Multi-Slide" },
  { slug: "bi-fold", label: "Bi-Fold Doors" },
  { slug: "slide-stack", label: "Slide-&-Stack" },
];

interface Props {
  discounts: GlobalDiscount[];
}

export default function GlobalDiscountsManager({ discounts: initial }: Props) {
  const [discounts, setDiscounts] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state (shared for create & edit)
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [applyTo, setApplyTo] = useState<"all" | "specific">("all");
  const [selectedDoors, setSelectedDoors] = useState<string[]>([]);

  function resetForm() {
    setName("");
    setPercentage("");
    setStartDate("");
    setEndDate("");
    setApplyTo("all");
    setSelectedDoors([]);
    setShowForm(false);
    setEditingId(null);
  }

  function startEdit(d: GlobalDiscount) {
    setName(d.name);
    setPercentage(String(d.percentage));
    setStartDate(d.start_date);
    setEndDate(d.end_date);
    setApplyTo(d.door_types ? "specific" : "all");
    setSelectedDoors(d.door_types || []);
    setEditingId(d.id);
    setShowForm(true);
  }

  function toggleDoor(slug: string) {
    setSelectedDoors((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function validateForm(): boolean {
    const pct = parseFloat(percentage);
    if (!name.trim() || isNaN(pct) || pct <= 0 || pct > 100 || !startDate || !endDate) {
      alert("Please fill in all fields correctly.");
      return false;
    }
    if (new Date(endDate) < new Date(startDate)) {
      alert("End date must be after start date.");
      return false;
    }
    if (applyTo === "specific" && selectedDoors.length === 0) {
      alert("Please select at least one door type.");
      return false;
    }
    return true;
  }

  async function handleCreate() {
    if (!validateForm()) return;
    setSaving(true);
    try {
      await createGlobalDiscount({
        name: name.trim(),
        percentage: parseFloat(percentage),
        door_types: applyTo === "all" ? null : selectedDoors,
        start_date: startDate,
        end_date: endDate,
      });
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create discount");
      setSaving(false);
    }
  }

  async function handleSaveEdit() {
    if (!editingId || !validateForm()) return;
    setSaving(true);
    try {
      await updateGlobalDiscount(editingId, {
        name: name.trim(),
        percentage: parseFloat(percentage),
        door_types: applyTo === "all" ? null : selectedDoors,
        start_date: startDate,
        end_date: endDate,
      });
      setDiscounts((prev) =>
        prev.map((d) =>
          d.id === editingId
            ? {
                ...d,
                name: name.trim(),
                percentage: parseFloat(percentage),
                door_types: applyTo === "all" ? null : selectedDoors,
                start_date: startDate,
                end_date: endDate,
              }
            : d
        )
      );
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update discount");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(discount: GlobalDiscount) {
    setTogglingId(discount.id);
    try {
      await updateGlobalDiscount(discount.id, { active: !discount.active });
      setDiscounts((prev) =>
        prev.map((d) => (d.id === discount.id ? { ...d, active: !d.active } : d))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this discount?")) return;
    setDeletingId(id);
    try {
      await deleteGlobalDiscount(id);
      setDiscounts((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  function isCurrentlyActive(d: GlobalDiscount) {
    if (!d.active) return false;
    const today = new Date().toISOString().split("T")[0];
    return d.start_date <= today && d.end_date >= today;
  }

  const isEditing = editingId !== null;

  return (
    <div className="space-y-6">
      {/* Create Button */}
      {!showForm && (
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Discount
        </button>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 space-y-5">
          <h3 className="text-lg font-semibold text-white">
            {isEditing ? "Edit Discount" : "Create New Discount"}
          </h3>

          {/* Name */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/40 font-medium mb-1.5">
              Discount Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Labor Day Sale, Summer Special..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/40"
            />
          </div>

          {/* Percentage */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/40 font-medium mb-1.5">
              Discount Percentage
            </label>
            <div className="relative w-40">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="100"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="10"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/40 pr-10"
              />
              <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/40 font-medium mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/40 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/40 font-medium mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/40 [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Apply To */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/40 font-medium mb-2.5">
              Applies To
            </label>
            <div className="flex gap-3 mb-3">
              <button
                onClick={() => setApplyTo("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  applyTo === "all"
                    ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                    : "bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/60"
                }`}
              >
                All Doors
              </button>
              <button
                onClick={() => setApplyTo("specific")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  applyTo === "specific"
                    ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                    : "bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/60"
                }`}
              >
                Specific Doors
              </button>
            </div>
            {applyTo === "specific" && (
              <div className="flex flex-wrap gap-2">
                {DOOR_OPTIONS.map((door) => (
                  <button
                    key={door.slug}
                    onClick={() => toggleDoor(door.slug)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedDoors.includes(door.slug)
                        ? "bg-sky-500/20 border border-sky-500/40 text-sky-300"
                        : "bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-white/50"
                    }`}
                  >
                    {door.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={isEditing ? handleSaveEdit : handleCreate}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm hover:from-amber-400 hover:to-orange-400 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isEditing ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {isEditing ? "Save Changes" : "Create Discount"}
            </button>
            <button
              onClick={resetForm}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/60 bg-white/[0.03] border border-white/[0.06] transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Discounts List */}
      {discounts.length === 0 && !showForm ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-8 sm:p-12 text-center">
          <Tag className="w-10 h-10 text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No discounts created yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {discounts.map((d) => {
            const live = isCurrentlyActive(d);
            return (
              <div
                key={d.id}
                className={`rounded-2xl border bg-white/[0.015] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${
                  live ? "border-emerald-500/20" : "border-white/[0.06]"
                }`}
              >
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    {live && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live
                      </span>
                    )}
                    {!d.active && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.05] text-white/30 text-[10px] font-semibold uppercase tracking-wider">
                        Disabled
                      </span>
                    )}
                    {d.active && !live && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-semibold uppercase tracking-wider">
                        Scheduled
                      </span>
                    )}
                    <h3 className="text-white font-semibold text-sm truncate">{d.name}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <Percent className="w-3 h-3" />
                      {d.percentage}% off
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(d.start_date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      {" — "}
                      {new Date(d.end_date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {d.door_types
                        ? d.door_types
                            .map((slug) => DOOR_OPTIONS.find((o) => o.slug === slug)?.label || slug)
                            .join(", ")
                        : "All Doors"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(d)}
                    disabled={showForm}
                    className="p-2 rounded-lg text-white/20 hover:text-sky-400 hover:bg-sky-500/10 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggle(d)}
                    disabled={togglingId === d.id}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                      d.active
                        ? "text-emerald-400 hover:bg-emerald-500/10"
                        : "text-white/20 hover:bg-white/[0.04]"
                    } disabled:opacity-50`}
                    title={d.active ? "Disable" : "Enable"}
                  >
                    {togglingId === d.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : d.active ? (
                      <ToggleRight className="w-5 h-5" />
                    ) : (
                      <ToggleLeft className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    disabled={deletingId === d.id}
                    className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer disabled:opacity-50"
                    title="Delete"
                  >
                    {deletingId === d.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
