"use client";

import { useState } from "react";
import { addClientAddress, updateClientAddress, deleteClientAddress } from "@/lib/actions/clients";
import { MapPin, Plus, Pencil, Trash2, Star, Check, X, Loader2 } from "lucide-react";

interface Address {
  id: string;
  label: string;
  address: string;
  is_default: boolean;
}

export default function ClientAddresses({ clientId, addresses: initialAddresses }: { clientId: string; addresses: Address[] }) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formLabel, setFormLabel] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formDefault, setFormDefault] = useState(false);

  function startAdd() {
    setAdding(true);
    setEditing(null);
    setFormLabel("");
    setFormAddress("");
    setFormDefault(addresses.length === 0);
  }

  function startEdit(addr: Address) {
    setEditing(addr.id);
    setAdding(false);
    setFormLabel(addr.label);
    setFormAddress(addr.address);
    setFormDefault(addr.is_default);
  }

  function cancel() {
    setEditing(null);
    setAdding(false);
  }

  async function handleAdd() {
    if (!formLabel || !formAddress) return;
    setLoading(true);
    try {
      const newAddr = await addClientAddress(clientId, {
        label: formLabel,
        address: formAddress,
        is_default: formDefault,
      });
      setAddresses((prev) => {
        const updated = formDefault ? prev.map((a) => ({ ...a, is_default: false })) : [...prev];
        return [...(formDefault ? updated : prev), newAddr];
      });
      setAdding(false);
    } catch {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(id: string) {
    if (!formLabel || !formAddress) return;
    setLoading(true);
    try {
      await updateClientAddress(id, clientId, {
        label: formLabel,
        address: formAddress,
        is_default: formDefault,
      });
      setAddresses((prev) =>
        prev.map((a) => {
          if (a.id === id) return { ...a, label: formLabel, address: formAddress, is_default: formDefault };
          if (formDefault) return { ...a, is_default: false };
          return a;
        })
      );
      setEditing(null);
    } catch {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setLoading(true);
    try {
      await deleteClientAddress(id, clientId);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/40 transition-all";

  const AddressForm = ({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) => (
    <div className="rounded-xl border border-teal-500/20 bg-teal-500/[0.03] p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="text"
          value={formLabel}
          onChange={(e) => setFormLabel(e.target.value)}
          className={inputClass}
          placeholder="Label (e.g. Home)"
        />
        <textarea
          value={formAddress}
          onChange={(e) => setFormAddress(e.target.value)}
          className={inputClass + " resize-none sm:col-span-2"}
          rows={2}
          placeholder="Full address..."
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setFormDefault(!formDefault)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 sm:px-2.5 sm:py-1 rounded-lg text-sm sm:text-xs font-medium transition-all cursor-pointer active:scale-95 ${
            formDefault
              ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
              : "bg-white/[0.03] text-white/30 border border-white/[0.06] hover:bg-white/[0.06]"
          }`}
        >
          <Star className="w-3.5 h-3.5 sm:w-3 sm:h-3" /> Default
        </button>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCancel} className="p-2.5 sm:p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer active:scale-95">
            <X className="w-5 h-5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={loading || !formLabel || !formAddress}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-lg text-sm sm:text-xs font-medium bg-teal-500/15 text-teal-300 hover:bg-teal-500/25 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            {loading ? <Loader2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 animate-spin" /> : <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5" />} Save
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      {addresses.map((addr) =>
        editing === addr.id ? (
          <AddressForm key={addr.id} onSave={() => handleUpdate(addr.id)} onCancel={cancel} />
        ) : (
          <div key={addr.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-3.5 h-3.5 text-white/30 shrink-0" />
                <span className="text-white font-medium text-sm">{addr.label}</span>
                {addr.is_default && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/20">
                    <Star className="w-2.5 h-2.5" /> Default
                  </span>
                )}
              </div>
              <p className="text-white/40 text-sm whitespace-pre-line pl-5.5">{addr.address}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => startEdit(addr)}
                className="p-2.5 sm:p-1.5 rounded-lg text-white/20 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer active:scale-95"
              >
                <Pencil className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(addr.id)}
                disabled={loading}
                className="p-2.5 sm:p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
              >
                <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          </div>
        )
      )}

      {adding ? (
        <AddressForm onSave={handleAdd} onCancel={cancel} />
      ) : (
        <button
          type="button"
          onClick={startAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/[0.1] text-white/40 hover:text-white/70 hover:border-white/[0.2] text-sm font-medium transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Address
        </button>
      )}
    </div>
  );
}
