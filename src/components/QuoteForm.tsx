"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createQuote, updateQuote } from "@/lib/actions/quotes";
import {
  User, Mail, Phone, Building2, DoorOpen, Ruler, DollarSign,
  StickyNote, ChevronDown, Check, Layers, GlassWater, Paintbrush,
  Plus, X, Save, Truck, MapPin, Users, Search, UserPlus,
} from "lucide-react";

const DOOR_TYPES = [
  "Ultra Slim Multi-Slide", "Multi-Slide Patio", "Bi-Fold",
  "Slide & Stack", "Pocket", "Pivot Entry", "Fold-Up Windows",
];
const MATERIALS = [
  "Aluminum", "Solid Wood - Walnut", "Solid Wood - Oak",
  "Solid Wood - Mahogany", "Steel & Glass", "Bronze & Copper",
];
const COLORS = ["Black", "White", "Dark Brown", "Gray", "RAL Custom"];
const GLASS_TYPES = [
  "Dual-Glazed", "Triple-Glazed", "Quad-Glazed",
  "Frosted", "Tinted", "Low-E", "Acoustic", "Clear",
];

/* ── Custom Select Dropdown ─────────────────────────────── */
function CustomSelect({
  name,
  value,
  onChange,
  options,
  placeholder,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, close]);

  return (
    <div ref={ref} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all cursor-pointer
          ${open
            ? "bg-white/[0.06] border-violet-500/40 ring-2 ring-violet-500/20"
            : "bg-white/[0.03] border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.05]"
          }
          ${value ? "text-white" : "text-white/25"}
        `}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 ml-2 text-white/25 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-white/[0.08] bg-[#161b22] shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="max-h-56 overflow-y-auto py-1 custom-scrollbar">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); close(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors cursor-pointer active:bg-white/[0.06]
                  ${value === opt
                    ? "bg-violet-500/10 text-violet-300"
                    : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                  }
                `}
              >
                <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors
                  ${value === opt
                    ? "bg-violet-500 border-violet-500"
                    : "border-white/[0.12] bg-transparent"
                  }
                `}>
                  {value === opt && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="truncate">{opt}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Types ───────────────────────────────────────────────── */
interface ClientAddress {
  id: string;
  label: string;
  address: string;
  is_default: boolean;
}

interface ClientOption {
  id: string;
  name: string;
  email: string;
  client_addresses: ClientAddress[];
}

interface QuoteData {
  id: string;
  client_name: string;
  client_email: string;
  client_id?: string | null;
  door_type: string;
  material: string;
  color: string;
  glass_type: string;
  size: string;
  cost: number;
  notes: string | null;
  delivery_type?: string;
  delivery_address?: string;
}

interface QuoteFormProps {
  initialData?: QuoteData;
  clients?: ClientOption[];
}

/* ── Quote Form ──────────────────────────────────────────── */
export default function QuoteForm({ initialData, clients = [] }: QuoteFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!initialData;

  // Client mode
  const [clientMode, setClientMode] = useState<"existing" | "new">(
    initialData?.client_id ? "existing" : clients.length > 0 ? "existing" : "new"
  );
  const [selectedClientId, setSelectedClientId] = useState<string>(initialData?.client_id || "");
  const [clientSearch, setClientSearch] = useState("");
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [saveAsClient, setSaveAsClient] = useState(false);
  const clientDropdownRef = useRef<HTMLDivElement>(null);

  // Selected client data
  const selectedClient = clients.find((c) => c.id === selectedClientId);

  // Client name/email/phone/company for new client mode
  const [newClientName, setNewClientName] = useState(initialData?.client_name || "");
  const [newClientEmail, setNewClientEmail] = useState(initialData?.client_email || "");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientCompany, setNewClientCompany] = useState("");

  // Custom select state
  const [doorType, setDoorType] = useState(initialData?.door_type || "");
  const [material, setMaterial] = useState(initialData?.material || "");
  const [color, setColor] = useState(initialData?.color || "");
  const [glassType, setGlassType] = useState(initialData?.glass_type || "");
  const [deliveryType, setDeliveryType] = useState(initialData?.delivery_type || "delivery");
  const [deliveryAddress, setDeliveryAddress] = useState(initialData?.delivery_address || "");
  const [selectedAddressId, setSelectedAddressId] = useState("");

  // Filter clients based on search
  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(clientSearch.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(e.target as Node)) {
        setClientDropdownOpen(false);
      }
    }
    if (clientDropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [clientDropdownOpen]);

  function handleSelectClient(client: ClientOption) {
    setSelectedClientId(client.id);
    setClientSearch("");
    setClientDropdownOpen(false);
    // If client has a default address, select it
    const defaultAddr = client.client_addresses.find((a) => a.is_default);
    if (defaultAddr) {
      setSelectedAddressId(defaultAddr.id);
      setDeliveryAddress(defaultAddr.address);
    }
  }

  function handleSelectAddress(addrId: string) {
    setSelectedAddressId(addrId);
    const addr = selectedClient?.client_addresses.find((a) => a.id === addrId);
    if (addr) setDeliveryAddress(addr.address);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const clientName = clientMode === "existing" && selectedClient ? selectedClient.name : newClientName;
    const clientEmail = clientMode === "existing" && selectedClient ? selectedClient.email : newClientEmail;

    const data = {
      client_name: clientName,
      client_email: clientEmail,
      door_type: doorType,
      material: material,
      color: color,
      glass_type: glassType,
      size: (document.getElementById("size") as HTMLInputElement)?.value || "",
      cost: parseFloat((document.getElementById("cost") as HTMLInputElement)?.value || "0"),
      notes: (document.getElementById("notes") as HTMLTextAreaElement)?.value || undefined,
      delivery_type: deliveryType,
      delivery_address: deliveryType === "delivery" ? deliveryAddress : undefined,
      client_id: clientMode === "existing" ? selectedClientId || undefined : undefined,
      save_as_client: clientMode === "new" ? saveAsClient : undefined,
      client_phone: clientMode === "new" && saveAsClient ? newClientPhone || undefined : undefined,
      client_company: clientMode === "new" && saveAsClient ? newClientCompany || undefined : undefined,
    };

    try {
      if (isEdit) {
        await updateQuote(initialData.id, {
          ...data,
          client_id: clientMode === "existing" ? selectedClientId || undefined : undefined,
        });
      } else {
        await createQuote(data);
      }
      router.push("/admin/quotes");
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEdit ? "update" : "create"} quote`);
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/40 transition-all hover:border-white/[0.15] hover:bg-white/[0.05]";

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      {/* ── Section 1: Client ── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
        <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
            <User className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Client Information</h3>
            <p className="text-sm text-white/35">Who is this quote for?</p>
          </div>
        </div>
        <div className="p-5 sm:p-6 space-y-4">
          {/* Client mode toggle */}
          {clients.length > 0 && (
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() => { setClientMode("existing"); setSelectedClientId(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 sm:py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer active:scale-95 ${
                  clientMode === "existing"
                    ? "bg-violet-500/10 border-violet-500/30 text-violet-300 ring-2 ring-violet-500/20"
                    : "bg-white/[0.03] border-white/[0.08] text-white/40 hover:border-white/[0.15] hover:bg-white/[0.05]"
                }`}
              >
                <Users className="w-4 h-4" /> Existing Client
              </button>
              <button
                type="button"
                onClick={() => { setClientMode("new"); setSelectedClientId(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 sm:py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer active:scale-95 ${
                  clientMode === "new"
                    ? "bg-teal-500/10 border-teal-500/30 text-teal-300 ring-2 ring-teal-500/20"
                    : "bg-white/[0.03] border-white/[0.08] text-white/40 hover:border-white/[0.15] hover:bg-white/[0.05]"
                }`}
              >
                <UserPlus className="w-4 h-4" /> New Client
              </button>
            </div>
          )}

          {/* Existing client selector */}
          {clientMode === "existing" && clients.length > 0 ? (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                <Search className="w-3.5 h-3.5" /> Select Client
              </label>
              <div ref={clientDropdownRef} className="relative">
                {selectedClient ? (
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-violet-500/[0.06] border border-violet-500/20">
                    <div>
                      <p className="text-white font-medium text-sm">{selectedClient.name}</p>
                      <p className="text-white/40 text-xs">{selectedClient.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setSelectedClientId(""); setDeliveryAddress(""); setSelectedAddressId(""); }}
                      className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        type="text"
                        value={clientSearch}
                        onChange={(e) => { setClientSearch(e.target.value); setClientDropdownOpen(true); }}
                        onFocus={() => setClientDropdownOpen(true)}
                        className={inputClass + " pl-11"}
                        placeholder="Search by name or email..."
                      />
                    </div>
                    {clientDropdownOpen && (
                      <div className="absolute z-50 mt-2 w-full rounded-xl border border-white/[0.08] bg-[#161b22] shadow-2xl shadow-black/40 overflow-hidden">
                        <div className="max-h-56 overflow-y-auto py-1 custom-scrollbar">
                          {filteredClients.length === 0 ? (
                            <p className="px-4 py-3 text-white/30 text-sm">No clients found</p>
                          ) : (
                            filteredClients.map((c) => (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => handleSelectClient(c)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/60 hover:bg-white/[0.04] hover:text-white transition-colors cursor-pointer active:bg-white/[0.06]"
                              >
                                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                                  <User className="w-4 h-4 text-violet-400" />
                                </div>
                                <div className="text-left min-w-0">
                                  <p className="text-white text-sm truncate">{c.name}</p>
                                  <p className="text-white/30 text-xs truncate">{c.email}</p>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            /* New client inputs */
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="client_name" className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                    <User className="w-3.5 h-3.5" /> Full Name
                  </label>
                  <input
                    id="client_name"
                    name="client_name"
                    type="text"
                    required
                    className={inputClass}
                    placeholder="John Doe"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="client_email" className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                    <Mail className="w-3.5 h-3.5" /> Email Address
                  </label>
                  <input
                    id="client_email"
                    name="client_email"
                    type="email"
                    required
                    className={inputClass}
                    placeholder="john@example.com"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                  />
                </div>
              </div>
              {!isEdit && (
                <>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        saveAsClient
                          ? "bg-teal-500 border-teal-500"
                          : "border-white/[0.12] bg-transparent group-hover:border-white/[0.25]"
                      }`}
                      onClick={() => setSaveAsClient(!saveAsClient)}
                    >
                      {saveAsClient && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-white/50 text-sm">Save as new client in database</span>
                  </label>
                  {saveAsClient && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 mt-2 border-t border-white/[0.04]">
                      <div>
                        <label htmlFor="client_phone" className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                          <Phone className="w-3.5 h-3.5" /> Phone
                        </label>
                        <input
                          id="client_phone"
                          type="tel"
                          className={inputClass}
                          placeholder="+1 (555) 000-0000"
                          value={newClientPhone}
                          onChange={(e) => setNewClientPhone(e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="client_company" className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                          <Building2 className="w-3.5 h-3.5" /> Company
                        </label>
                        <input
                          id="client_company"
                          type="text"
                          className={inputClass}
                          placeholder="Company name"
                          value={newClientCompany}
                          onChange={(e) => setNewClientCompany(e.target.value)}
                        />
                      </div>
                      {deliveryType === "delivery" && (
                        <p className="sm:col-span-2 text-white/25 text-xs">
                          The delivery address below will be saved as the client&apos;s default address.
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Section 2: Door Specs ── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
        <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <DoorOpen className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Door Specifications</h3>
            <p className="text-sm text-white/35">Configure the door system details</p>
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                <DoorOpen className="w-3.5 h-3.5" /> Door Type
              </label>
              <CustomSelect
                name="door_type"
                value={doorType}
                onChange={setDoorType}
                options={DOOR_TYPES}
                placeholder="Select door type..."
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" /> Material
              </label>
              <CustomSelect
                name="material"
                value={material}
                onChange={setMaterial}
                options={MATERIALS}
                placeholder="Select material..."
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                <Paintbrush className="w-3.5 h-3.5" /> Color
              </label>
              <CustomSelect
                name="color"
                value={color}
                onChange={setColor}
                options={COLORS}
                placeholder="Select color..."
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                <GlassWater className="w-3.5 h-3.5" /> Glass Type
              </label>
              <CustomSelect
                name="glass_type"
                value={glassType}
                onChange={setGlassType}
                options={GLASS_TYPES}
                placeholder="Select glass type..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3: Pricing ── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
        <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Pricing & Dimensions</h3>
            <p className="text-sm text-white/35">Set the size and total cost</p>
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="size" className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                <Ruler className="w-3.5 h-3.5" /> Dimensions
              </label>
              <input id="size" name="size" type="text" required className={inputClass} placeholder='e.g. 72" x 96"' defaultValue={initialData?.size || ""} />
            </div>
            <div>
              <label htmlFor="cost" className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                <DollarSign className="w-3.5 h-3.5" /> Total Cost
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-sm font-medium">$</span>
                <input id="cost" name="cost" type="number" step="0.01" min="0" required className={inputClass + " pl-8"} placeholder="15,000.00" defaultValue={initialData?.cost || ""} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 4: Delivery ── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
        <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
            <Truck className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Delivery</h3>
            <p className="text-sm text-white/35">How should the product be received?</p>
          </div>
        </div>
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDeliveryType("delivery")}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 sm:py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer active:scale-95 ${
                deliveryType === "delivery"
                  ? "bg-sky-500/10 border-sky-500/30 text-sky-300 ring-2 ring-sky-500/20"
                  : "bg-white/[0.03] border-white/[0.08] text-white/40 hover:border-white/[0.15] hover:bg-white/[0.05]"
              }`}
            >
              <Truck className="w-4 h-4" /> Delivery
            </button>
            <button
              type="button"
              onClick={() => setDeliveryType("pickup")}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 sm:py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer active:scale-95 ${
                deliveryType === "pickup"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-300 ring-2 ring-amber-500/20"
                  : "bg-white/[0.03] border-white/[0.08] text-white/40 hover:border-white/[0.15] hover:bg-white/[0.05]"
              }`}
            >
              <MapPin className="w-4 h-4" /> Pickup
            </button>
          </div>
          {deliveryType === "delivery" && (
            <div className="space-y-3">
              {/* Address dropdown for existing client */}
              {clientMode === "existing" && selectedClient && selectedClient.client_addresses.length > 0 && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" /> Saved Addresses
                  </label>
                  <div className="space-y-2">
                    {selectedClient.client_addresses.map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => handleSelectAddress(addr.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all cursor-pointer ${
                          selectedAddressId === addr.id
                            ? "bg-sky-500/[0.06] border-sky-500/20 text-white"
                            : "bg-white/[0.02] border-white/[0.06] text-white/50 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium uppercase tracking-wider text-white/30">{addr.label}</span>
                          {addr.is_default && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300">Default</span>
                          )}
                        </div>
                        <p className="text-sm mt-0.5">{addr.address}</p>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => { setSelectedAddressId("custom"); setDeliveryAddress(""); }}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all cursor-pointer ${
                        selectedAddressId === "custom"
                          ? "bg-sky-500/[0.06] border-sky-500/20 text-white"
                          : "bg-white/[0.02] border-dashed border-white/[0.08] text-white/40 hover:bg-white/[0.04]"
                      }`}
                    >
                      + Enter custom address
                    </button>
                  </div>
                </div>
              )}
              {/* Manual address input */}
              {(clientMode === "new" || !selectedClient || selectedClient.client_addresses.length === 0 || selectedAddressId === "custom") && (
                <div>
                  <label htmlFor="delivery_address" className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" /> Delivery Address
                  </label>
                  <textarea
                    id="delivery_address"
                    name="delivery_address"
                    rows={2}
                    required
                    className={inputClass + " resize-none"}
                    placeholder="Enter the full delivery address..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Section 5: Notes ── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
        <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
            <StickyNote className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Additional Notes</h3>
            <p className="text-sm text-white/35">Optional remarks or special requirements</p>
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className={inputClass + " resize-none"}
            placeholder="e.g. Custom hardware finish, specific delivery window, site access notes..."
            defaultValue={initialData?.notes || ""}
          />
        </div>
      </div>

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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-3 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-base sm:text-sm font-medium transition-all shadow-lg shadow-violet-500/25 cursor-pointer active:scale-[0.98]"
          >
            {isEdit ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {loading
              ? (isEdit ? "Saving..." : "Creating...")
              : (isEdit ? "Save Changes" : "Create Quote")
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
