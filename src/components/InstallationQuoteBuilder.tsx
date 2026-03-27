"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Plus, Trash2, Loader2, Send, Save, CheckCircle2, PenLine } from "lucide-react";
import {
  createInstallationQuote,
  updateInstallationQuote,
  sendInstallationQuote,
  deleteInstallationQuote,
} from "@/lib/actions/installation-quotes";
import type { InstallationQuote } from "@/lib/actions/installation-quotes";

interface Props {
  quoteId: string;
  installationQuote: InstallationQuote | null;
}

interface LineItem {
  description: string;
  price: string;
}

export default function InstallationQuoteBuilder({ quoteId, installationQuote }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [items, setItems] = useState<LineItem[]>(
    installationQuote?.items.length
      ? installationQuote.items.map((i) => ({ description: i.description, price: String(i.price) }))
      : [{ description: "", price: "" }]
  );
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const status = installationQuote?.status;

  function addItem() {
    setItems([...items, { description: "", price: "" }]);
  }

  function removeItem(idx: number) {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  }

  function updateItem(idx: number, field: keyof LineItem, value: string) {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    setItems(updated);
  }

  const total = items.reduce((sum, i) => sum + (parseFloat(i.price) || 0), 0);
  const isValid = items.every((i) => i.description.trim() && parseFloat(i.price) > 0);

  async function handleSave() {
    if (!isValid) return;
    setSaving(true);
    setError("");
    try {
      const parsed = items.map((i) => ({ description: i.description.trim(), price: parseFloat(i.price) }));
      if (installationQuote) {
        await updateInstallationQuote(installationQuote.id, parsed);
      } else {
        await createInstallationQuote(quoteId, parsed);
      }
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleSend() {
    if (!installationQuote) return;
    setSending(true);
    setError("");
    try {
      await sendInstallationQuote(installationQuote.id, window.location.origin);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setSending(false);
    }
  }

  async function handleDelete() {
    if (!installationQuote) return;
    setDeleting(true);
    try {
      await deleteInstallationQuote(installationQuote.id);
      setEditing(false);
      setItems([{ description: "", price: "" }]);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  // No installation quote yet — show add button
  if (!installationQuote && !editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
      >
        <Plus className="w-3 h-3" />
        Create Installation Quote
      </button>
    );
  }

  // Read-only views for sent/approved/paid
  if (installationQuote && !editing && status !== "draft") {
    const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
      sent: { bg: "bg-sky-400/10", text: "text-sky-300", label: "Sent" },
      approved: { bg: "bg-emerald-400/10", text: "text-emerald-300", label: "Approved" },
      paid: { bg: "bg-emerald-400/10", text: "text-emerald-300", label: "Paid" },
    };
    const s = statusStyles[status || "sent"];

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-white/40 text-sm flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5" />
            Installation Quote
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium ${s.bg} ${s.text}`}>
            {status === "approved" && <PenLine className="w-2.5 h-2.5" />}
            {status === "paid" && <CheckCircle2 className="w-2.5 h-2.5" />}
            {s.label}
          </span>
        </div>
        <div className="space-y-1.5">
          {installationQuote.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-white/50">{item.description}</span>
              <span className="text-white/60">${Number(item.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-semibold pt-1.5 border-t border-white/[0.06]">
            <span className="text-white/60">Total</span>
            <span className="text-white">${Number(installationQuote.total).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        {status === "sent" && (
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors cursor-pointer disabled:opacity-50"
          >
            {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
            Resend to Client
          </button>
        )}
      </div>
    );
  }

  // Draft — read-only with edit/send/delete
  if (installationQuote && !editing && status === "draft") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-white/40 text-sm flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5" />
            Installation Quote
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-400/10 text-amber-300">
            Draft
          </span>
        </div>
        <div className="space-y-1.5">
          {installationQuote.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-white/50">{item.description}</span>
              <span className="text-white/60">${Number(item.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-semibold pt-1.5 border-t border-white/[0.06]">
            <span className="text-white/60">Total</span>
            <span className="text-white">${Number(installationQuote.total).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer disabled:opacity-50"
          >
            {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
            Send to Client
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer disabled:opacity-50"
          >
            {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
            Delete
          </button>
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>
    );
  }

  // Edit mode
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-white/40 text-sm flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5" />
          Installation Quote
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={item.description}
              onChange={(e) => updateItem(idx, "description", e.target.value)}
              placeholder="Description"
              className="flex-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:border-sky-500/40 focus:ring-1 focus:ring-sky-500/20"
            />
            <div className="relative w-28">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={item.price}
                onChange={(e) => updateItem(idx, "price", e.target.value)}
                placeholder="0.00"
                className="w-full pl-7 pr-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:border-sky-500/40 focus:ring-1 focus:ring-sky-500/20"
              />
            </div>
            {items.length > 1 && (
              <button
                onClick={() => removeItem(idx)}
                className="p-2 text-white/20 hover:text-red-400 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
      >
        <Plus className="w-3 h-3" />
        Add Line Item
      </button>

      {total > 0 && (
        <div className="flex justify-between text-sm font-semibold pt-2 border-t border-white/[0.06]">
          <span className="text-white/60">Total</span>
          <span className="text-white">${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
        </div>
      )}

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          disabled={saving || !isValid}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          Save
        </button>
        <button
          onClick={() => {
            setEditing(false);
            if (installationQuote) {
              setItems(installationQuote.items.map((i) => ({ description: i.description, price: String(i.price) })));
            } else {
              setItems([{ description: "", price: "" }]);
            }
          }}
          className="px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/60 bg-white/[0.04] border border-white/[0.08] transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
