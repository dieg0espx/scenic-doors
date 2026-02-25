"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientAction, updateClient } from "@/lib/actions/clients";
import {
  User, Mail, Phone, Building2, StickyNote,
  MapPin, Plus, X, Save, Trash2, Star,
} from "lucide-react";

interface AddressRow {
  id?: string;
  label: string;
  address: string;
  is_default: boolean;
}

interface ClientData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  notes: string | null;
  client_addresses?: AddressRow[];
}

interface ClientFormProps {
  initialData?: ClientData;
}

export default function ClientForm({ initialData }: ClientFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!initialData;

  const [addresses, setAddresses] = useState<AddressRow[]>(
    initialData?.client_addresses?.map((a) => ({
      id: a.id,
      label: a.label,
      address: a.address,
      is_default: a.is_default,
    })) || []
  );

  function addAddress() {
    setAddresses((prev) => [...prev, { label: "", address: "", is_default: prev.length === 0 }]);
  }

  function removeAddress(index: number) {
    setAddresses((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length > 0 && !next.some((a) => a.is_default)) {
        next[0].is_default = true;
      }
      return next;
    });
  }

  function updateAddress(index: number, field: keyof AddressRow, value: string | boolean) {
    setAddresses((prev) =>
      prev.map((a, i) => {
        if (field === "is_default" && value === true) {
          return { ...a, is_default: i === index };
        }
        return i === index ? { ...a, [field]: value } : a;
      })
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);

    const data = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      phone: (form.get("phone") as string) || undefined,
      company: (form.get("company") as string) || undefined,
      notes: (form.get("notes") as string) || undefined,
    };

    try {
      if (isEdit) {
        await updateClient(initialData.id, data);
      } else {
        const validAddresses = addresses.filter((a) => a.label && a.address);
        await createClientAction({ ...data, addresses: validAddresses });
      }
      router.push("/admin/clients");
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEdit ? "update" : "create"} client`);
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/40 transition-all hover:border-white/[0.15] hover:bg-white/[0.05]";

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      {/* ── Section 1: Contact Info ── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
        <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
            <User className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Contact Information</h3>
            <p className="text-sm text-white/35">Basic client details</p>
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                <User className="w-3.5 h-3.5" /> Full Name
              </label>
              <input id="name" name="name" type="text" required className={inputClass} placeholder="John Doe" defaultValue={initialData?.name || ""} />
            </div>
            <div>
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </label>
              <input id="email" name="email" type="email" required className={inputClass} placeholder="john@example.com" defaultValue={initialData?.email || ""} />
            </div>
            <div>
              <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                <Phone className="w-3.5 h-3.5" /> Phone
              </label>
              <input id="phone" name="phone" type="tel" className={inputClass} placeholder="+1 (555) 000-0000" defaultValue={initialData?.phone || ""} />
            </div>
            <div>
              <label htmlFor="company" className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" /> Company
              </label>
              <input id="company" name="company" type="text" className={inputClass} placeholder="Company name" defaultValue={initialData?.company || ""} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="notes" className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                <StickyNote className="w-3.5 h-3.5" /> Notes
              </label>
              <textarea id="notes" name="notes" rows={3} className={inputClass + " resize-none"} placeholder="Additional notes about this client..." defaultValue={initialData?.notes || ""} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Addresses (create only) ── */}
      {!isEdit && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
          <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Addresses</h3>
              <p className="text-sm text-white/35">Add one or more delivery addresses</p>
            </div>
          </div>
          <div className="p-5 sm:p-6 space-y-4">
            {addresses.map((addr, i) => (
              <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Address {i + 1}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateAddress(i, "is_default", true)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 sm:px-2 sm:py-1 rounded-lg text-sm sm:text-[11px] font-medium transition-all cursor-pointer active:scale-95 ${
                        addr.is_default
                          ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                          : "bg-white/[0.03] text-white/30 border border-white/[0.06] hover:bg-white/[0.06]"
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 sm:w-3 sm:h-3" /> Default
                    </button>
                    <button
                      type="button"
                      onClick={() => removeAddress(i)}
                      className="p-2.5 sm:p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer active:scale-95"
                    >
                      <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={addr.label}
                    onChange={(e) => updateAddress(i, "label", e.target.value)}
                    className={inputClass}
                    placeholder="Label (e.g. Home, Office)"
                  />
                  <textarea
                    value={addr.address}
                    onChange={(e) => updateAddress(i, "address", e.target.value)}
                    className={inputClass + " resize-none sm:col-span-2"}
                    rows={2}
                    placeholder="Full address..."
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addAddress}
              className="flex items-center justify-center w-full sm:w-auto gap-2 px-4 py-3 sm:py-2.5 rounded-xl border border-dashed border-white/[0.1] text-white/40 hover:text-white/70 hover:border-white/[0.2] text-sm font-medium transition-all cursor-pointer active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" /> Add Address
            </button>
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="flex items-start gap-3 text-red-400 text-sm bg-red-500/[0.08] border border-red-500/20 rounded-xl px-4 py-3">
          <X className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="sticky bottom-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117] to-transparent pt-6 pb-4 -mx-4 px-4 sm:static sm:bg-transparent sm:p-0 sm:m-0 sm:pt-2">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-base sm:text-sm font-medium transition-all shadow-lg shadow-teal-500/25 cursor-pointer active:scale-[0.98]"
          >
            {isEdit ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {loading
              ? (isEdit ? "Saving..." : "Creating...")
              : (isEdit ? "Save Changes" : "Create Client")
            }
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-8 py-3.5 sm:py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] text-white/40 hover:text-white/70 text-base sm:text-sm font-medium transition-all cursor-pointer active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
