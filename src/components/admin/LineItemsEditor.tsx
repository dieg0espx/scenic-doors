"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Hash, Pencil, Check, X, Loader2, Percent } from "lucide-react";
import { updateLineItemPrices } from "@/lib/actions/quotes";

interface LineItem {
  id?: string;
  name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total: number;
  [key: string]: unknown;
}

interface Props {
  quoteId: string;
  items: LineItem[];
  currentDiscount: number;
  locked?: boolean;
}

export default function LineItemsEditor({ quoteId, items, currentDiscount, locked }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [editItems, setEditItems] = useState<LineItem[]>([]);
  const [discount, setDiscount] = useState(currentDiscount);
  const [saving, setSaving] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && firstInputRef.current) {
      firstInputRef.current.focus();
      firstInputRef.current.select();
    }
  }, [editing]);

  function handleStartEdit() {
    if (locked) return;
    setEditItems(items.map((item) => ({ ...item })));
    setDiscount(currentDiscount);
    setEditing(true);
  }

  function handleCancel() {
    setEditing(false);
  }

  function handlePriceChange(idx: number, newPrice: string) {
    setEditItems((prev) => {
      const updated = [...prev];
      const price = parseFloat(newPrice) || 0;
      updated[idx] = {
        ...updated[idx],
        unit_price: price,
        total: price * updated[idx].quantity,
      };
      return updated;
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateLineItemPrices(quoteId, editItems, discount);
      setEditing(false);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update prices");
    } finally {
      setSaving(false);
    }
  }

  const itemsCount = items.length;
  const displayItems = editing ? editItems : items;
  const activeDiscount = editing ? discount : currentDiscount;
  const subtotal = displayItems.reduce((sum, item) => sum + Number(item.total), 0);
  const discountAmount = subtotal * (activeDiscount / 100);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
            <Hash className="w-4 h-4 text-sky-400" />
          </div>
          <h2 className="text-base font-semibold text-white">Line Items</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/25 text-xs">{itemsCount} item{itemsCount !== 1 ? "s" : ""}</span>
          {!locked && !editing && (
            <button
              onClick={handleStartEdit}
              className="p-1.5 rounded-lg text-white/20 hover:text-white/50 hover:bg-white/[0.06] transition-all cursor-pointer"
              title="Edit prices"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          {editing && (
            <div className="flex items-center gap-1.5">
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
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="text-left px-2 sm:px-5 py-3 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Item</th>
              <th className="text-right px-2 sm:px-4 py-3 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Qty</th>
              <th className="text-right px-2 sm:px-4 py-3 text-[11px] uppercase tracking-wider text-white/30 font-semibold hidden sm:table-cell">Price</th>
              <th className="text-right px-2 sm:px-5 py-3 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {displayItems.map((item, idx) => (
              <tr key={(item.id as string) || idx} className="hover:bg-white/[0.01] transition-colors">
                <td className="px-2 sm:px-5 py-3 text-white/70">
                  <span className="line-clamp-2 sm:line-clamp-none">{String(item.name)}</span>
                  {item.description ? (
                    <p className="text-white/25 text-xs mt-0.5 hidden sm:block">{String(item.description)}</p>
                  ) : null}
                </td>
                <td className="px-2 sm:px-4 py-3 text-right text-white/50">{Number(item.quantity)}</td>
                <td className="px-2 sm:px-4 py-3 text-right text-white/50 hidden sm:table-cell">
                  {editing ? (
                    <input
                      ref={idx === 0 ? firstInputRef : undefined}
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unit_price}
                      onChange={(e) => handlePriceChange(idx, e.target.value)}
                      disabled={saving}
                      className="w-28 text-right text-sm text-white bg-white/[0.06] border border-white/[0.12] rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500/40 disabled:opacity-50"
                    />
                  ) : (
                    `$${Number(item.unit_price).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                  )}
                </td>
                <td className="px-2 sm:px-5 py-3 text-right text-white font-medium">
                  ${Number(item.total).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Discount row */}
      {(editing || activeDiscount > 0) && (
        <div className="px-4 sm:px-6 py-3 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Percent className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-sm text-white/50">Discount</span>
          </div>
          <div className="flex items-center gap-2">
            {editing ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  disabled={saving}
                  className="w-20 text-right text-sm text-white bg-white/[0.06] border border-white/[0.12] rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/40 disabled:opacity-50"
                />
                <span className="text-white/30 text-sm">%</span>
                {discountAmount > 0 && (
                  <span className="text-red-400/70 text-sm ml-2">
                    -${discountAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-red-400/70 text-sm">
                -{activeDiscount}% (-${discountAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })})
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
