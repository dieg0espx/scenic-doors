"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createQuote, updateQuote, sendQuoteToClient, notifyNewQuote } from "@/lib/actions/quotes";
import {
  User, Mail, Phone, Building2, DoorOpen, Ruler, DollarSign,
  StickyNote, ChevronDown, Check, Layers, GlassWater, Paintbrush,
  Plus, X, Save, Truck, MapPin, Users, Search, UserPlus,
  Calendar, Tag, Thermometer, Wrench, Trash2, Copy, ChevronRight,
} from "lucide-react";

import { PRODUCTS } from "@/lib/quote-wizard/product-data";
import {
  PRODUCT_CONFIGS,
  getAvailablePanelCounts,
  getPanelLayouts,
  calculateItemTotal,
  calculateQuoteTotals,
  DELIVERY_COSTS,
  INSTALLATION_COST,
  TAX_RATE,
  GLASS_MODIFIERS,
} from "@/lib/quote-wizard/pricing";
import type { ConfiguredItem, ServiceOptions } from "@/lib/quote-wizard/types";
import { createEmptyItem } from "@/lib/quote-wizard/types";

const EXTERIOR_COLORS = ["Black", "White", "Bronze (paint)", "Anodized Aluminum"];
const INTERIOR_COLORS = ["Black", "White", "Bronze (paint)", "Anodized Aluminum"];
const GLASS_TYPES = Object.keys(GLASS_MODIFIERS);
const CUSTOMER_TYPES = ["homeowner", "contractor", "architect", "dealer", "other"];
const LEAD_STATUSES = ["new", "hot", "warm", "cold", "hold", "archived"];

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
                <span className="truncate capitalize">{opt}</span>
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

interface AdminUserOption {
  id: string;
  name: string;
  email: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface QuoteData extends Record<string, any> {
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
  customer_type?: string;
  customer_phone?: string;
  customer_zip?: string;
  assigned_to?: string | null;
  lead_status?: string;
  items?: { id?: string; name: string; quantity: number; unit_price: number; total: number }[];
  subtotal?: number;
  installation_cost?: number;
  delivery_cost?: number;
  tax?: number;
  grand_total?: number;
  follow_up_date?: string;
}

interface QuoteFormProps {
  initialData?: QuoteData;
  clients?: ClientOption[];
  adminUsers?: AdminUserOption[];
}

/* ── Door Item Card ─────────────────────────────────────── */
function DoorItemCard({
  item,
  index,
  onUpdate,
  onRemove,
  onDuplicate,
  canRemove,
  inputClass,
  totalItems,
}: {
  item: ConfiguredItem;
  index: number;
  onUpdate: (updates: Partial<ConfiguredItem>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  canRemove: boolean;
  inputClass: string;
  totalItems: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const config = item.doorTypeSlug ? PRODUCT_CONFIGS[item.doorTypeSlug] : null;

  const panelCountOptions = useMemo(() => {
    if (!config || !config.hasPanelCount || item.width <= 0) return [];
    return getAvailablePanelCounts(
      item.width,
      config.usableOpeningOffset,
      config.panelMinWidth,
      config.panelMaxWidth
    );
  }, [config, item.width]);

  const panelLayoutOptions = useMemo(() => {
    if (!item.doorTypeSlug || item.panelCount <= 0) return [];
    return getPanelLayouts(item.panelCount, item.doorTypeSlug);
  }, [item.doorTypeSlug, item.panelCount]);

  const isTwoTone = item.interiorFinish !== "" && item.interiorFinish !== item.exteriorFinish;

  function handleProductChange(slug: string) {
    const product = PRODUCTS.find((p) => p.slug === slug);
    if (!product) return;
    const newConfig = PRODUCT_CONFIGS[slug];
    const updates: Partial<ConfiguredItem> = {
      doorType: product.name,
      doorTypeSlug: slug,
      basePrice: product.basePrice,
      systemType: newConfig?.hasSystemType ? "slider" : "",
      width: 0,
      height: 0,
      panelCount: 0,
      panelLayout: "",
      roomName: "",
      exteriorFinish: "",
      interiorFinish: "",
      glassType: "",
      hardwareFinish: "",
    };
    onUpdate(updates);
  }

  function handleWidthChange(w: number) {
    onUpdate({ width: w, panelCount: 0, panelLayout: "" });
  }

  function handlePanelCountChange(count: number) {
    onUpdate({ panelCount: count, panelLayout: "" });
  }

  const itemTotal = item.doorTypeSlug ? calculateItemTotal(item) : 0;

  // Sync itemTotal when dependencies change
  useEffect(() => {
    if (item.itemTotal !== itemTotal) {
      onUpdate({ itemTotal });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemTotal]);

  return (
    <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.015]" style={{ zIndex: totalItems - index }}>
      {/* Card Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl cursor-pointer hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <DoorOpen className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-semibold text-white">
              Item {index + 1}{item.doorType ? `: ${item.doorType}` : ""}
            </h4>
            {item.doorType && item.width > 0 && (
              <p className="text-xs text-white/35">
                {item.width}&quot; x {item.height}&quot;
                {item.exteriorFinish ? ` | ${item.exteriorFinish}` : ""}
                {itemTotal > 0 ? ` | $${itemTotal.toLocaleString()}` : ""}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {itemTotal > 0 && (
            <span className="text-sm font-semibold text-emerald-400 mr-2">
              ${itemTotal.toLocaleString()}
            </span>
          )}
          <ChevronRight className={`w-4 h-4 text-white/25 transition-transform ${expanded ? "rotate-90" : ""}`} />
        </div>
      </button>

      {expanded && (
        <div className="p-5 sm:p-6 space-y-4">
          {/* Product Type */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
              <DoorOpen className="w-3.5 h-3.5" /> Product Type
            </label>
            <CustomSelect
              name={`item_${index}_product`}
              value={item.doorType}
              onChange={(val) => {
                const product = PRODUCTS.find((p) => p.name === val);
                if (product) handleProductChange(product.slug);
              }}
              options={PRODUCTS.map((p) => p.name)}
              placeholder="Select a product..."
            />
          </div>

          {config && (
            <>
              {/* System Type (if applicable) */}
              {config.hasSystemType && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                    <Layers className="w-3.5 h-3.5" /> System Type
                  </label>
                  <div className="flex gap-3">
                    {["slider", "pocket"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => onUpdate({ systemType: type })}
                        className={`flex-1 py-3 sm:py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer active:scale-95 capitalize ${
                          item.systemType === type
                            ? "bg-violet-500/10 border-violet-500/30 text-violet-300 ring-2 ring-violet-500/20"
                            : "bg-white/[0.03] border-white/[0.08] text-white/40 hover:border-white/[0.15] hover:bg-white/[0.05]"
                        }`}
                      >
                        {type}{type === "pocket" ? " (+$1,200)" : ""}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                    <Ruler className="w-3.5 h-3.5" /> Width (inches)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={config.maxWidth}
                    className={inputClass}
                    placeholder={`Max ${config.maxWidth}"`}
                    value={item.width || ""}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                    <Ruler className="w-3.5 h-3.5" /> Height (inches)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={config.maxHeight}
                    className={inputClass}
                    placeholder={`Max ${config.maxHeight}"`}
                    value={item.height || ""}
                    onChange={(e) => onUpdate({ height: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Panel Count */}
              {config.hasPanelCount && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                      <Layers className="w-3.5 h-3.5" /> Panel Count
                    </label>
                    {panelCountOptions.length > 0 ? (
                      <CustomSelect
                        name={`item_${index}_panels`}
                        value={item.panelCount > 0 ? `${item.panelCount} panels (${panelCountOptions.find(o => o.count === item.panelCount)?.perPanelWidth}" each)` : ""}
                        onChange={(val) => {
                          const count = parseInt(val);
                          handlePanelCountChange(count);
                        }}
                        options={panelCountOptions.map(
                          (o) => `${o.count} panels (${o.perPanelWidth}" each)`
                        )}
                        placeholder={item.width > 0 ? "Select panel count..." : "Enter width first"}
                      />
                    ) : (
                      <div className={inputClass + " flex items-center text-white/25"}>
                        {item.width > 0 ? "No valid panel counts for this width" : "Enter width first"}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                      <Layers className="w-3.5 h-3.5" /> Panel Layout
                    </label>
                    {panelLayoutOptions.length > 0 ? (
                      <CustomSelect
                        name={`item_${index}_layout`}
                        value={item.panelLayout}
                        onChange={(val) => onUpdate({ panelLayout: val })}
                        options={panelLayoutOptions}
                        placeholder="Select layout..."
                      />
                    ) : (
                      <div className={inputClass + " flex items-center text-white/25"}>
                        {item.panelCount > 0 ? "No layouts available" : "Select panel count first"}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Room Name (awning window) */}
              {config.hasRoomName && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5" /> Room Name
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Master Bedroom"
                    value={item.roomName}
                    onChange={(e) => onUpdate({ roomName: e.target.value })}
                  />
                </div>
              )}

              {/* Finish */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                  <Paintbrush className="w-3.5 h-3.5" /> Exterior Finish
                </label>
                <CustomSelect
                  name={`item_${index}_exterior`}
                  value={item.exteriorFinish}
                  onChange={(val) => onUpdate({ exteriorFinish: val, interiorFinish: isTwoTone ? item.interiorFinish : "" })}
                  options={EXTERIOR_COLORS}
                  placeholder="Select exterior finish..."
                />
              </div>

              {/* Two-tone toggle */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isTwoTone
                        ? "bg-violet-500 border-violet-500"
                        : "border-white/[0.12] bg-transparent group-hover:border-white/[0.25]"
                    }`}
                    onClick={() => {
                      if (isTwoTone) {
                        onUpdate({ interiorFinish: "" });
                      } else {
                        onUpdate({ interiorFinish: item.exteriorFinish || INTERIOR_COLORS[0] });
                      }
                    }}
                  >
                    {isTwoTone && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="text-white/50 text-sm">Two-tone (different interior finish)</span>
                </label>
                {isTwoTone && (
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                      <Paintbrush className="w-3.5 h-3.5" /> Interior Finish
                    </label>
                    <CustomSelect
                      name={`item_${index}_interior`}
                      value={item.interiorFinish}
                      onChange={(val) => onUpdate({ interiorFinish: val })}
                      options={INTERIOR_COLORS}
                      placeholder="Select interior finish..."
                    />
                  </div>
                )}
              </div>

              {/* Glass Type */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                  <GlassWater className="w-3.5 h-3.5" /> Glass Type
                </label>
                <CustomSelect
                  name={`item_${index}_glass`}
                  value={item.glassType}
                  onChange={(val) => {
                    onUpdate({ glassType: val, glassPriceModifier: GLASS_MODIFIERS[val] ?? 0 });
                  }}
                  options={GLASS_TYPES.map((g) => {
                    const mod = GLASS_MODIFIERS[g];
                    return mod === 0 ? g : `${g}`;
                  })}
                  placeholder="Select glass type..."
                />
                {item.glassType && GLASS_MODIFIERS[item.glassType] !== 0 && (
                  <p className="text-xs text-white/30 mt-1.5">
                    {GLASS_MODIFIERS[item.glassType] > 0 ? "+" : ""}${GLASS_MODIFIERS[item.glassType]} per panel
                  </p>
                )}
              </div>

              {/* Hardware Finish */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                  <Wrench className="w-3.5 h-3.5" /> Hardware Finish
                </label>
                <CustomSelect
                  name={`item_${index}_hardware`}
                  value={item.hardwareFinish}
                  onChange={(val) => onUpdate({ hardwareFinish: val })}
                  options={config.hardwareOptions}
                  placeholder="Select hardware finish..."
                />
              </div>
            </>
          )}

          {/* Item Price + Actions */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.04]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onDuplicate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/40 hover:text-white/70 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all cursor-pointer"
              >
                <Copy className="w-3 h-3" /> Duplicate
              </button>
              {canRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400/60 hover:text-red-400 bg-red-500/[0.03] border border-red-500/[0.06] hover:bg-red-500/[0.08] transition-all cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-white/30 uppercase tracking-wider">Item Total</p>
              <p className="text-lg font-bold text-emerald-400">
                ${itemTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Quote Form ──────────────────────────────────────────── */
export default function QuoteForm({ initialData, clients = [], adminUsers = [] }: QuoteFormProps) {
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

  // New fields
  const [customerType, setCustomerType] = useState(initialData?.customer_type || "homeowner");
  const [customerPhone, setCustomerPhone] = useState(initialData?.customer_phone || "");
  const [customerZip, setCustomerZip] = useState(initialData?.customer_zip || "");
  const [assignedTo, setAssignedTo] = useState(initialData?.assigned_to || "");
  const [leadStatus, setLeadStatus] = useState(initialData?.lead_status || "new");
  const [followUpDate, setFollowUpDate] = useState(initialData?.follow_up_date || "");

  // Door items
  const [items, setItems] = useState<ConfiguredItem[]>([createEmptyItem()]);

  // Services
  const [services, setServices] = useState<ServiceOptions>({
    deliveryType: "none",
    includeInstallation: false,
  });

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
  }

  // Item management
  function updateItem(index: number, updates: Partial<ConfiguredItem>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...updates } : item)));
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function duplicateItem(index: number) {
    setItems((prev) => {
      const copy = { ...prev[index], id: crypto.randomUUID() };
      return [...prev.slice(0, index + 1), copy, ...prev.slice(index + 1)];
    });
  }

  function addItem() {
    setItems((prev) => [...prev, createEmptyItem()]);
  }

  // Calculate totals
  const totals = useMemo(() => {
    return calculateQuoteTotals(items, services);
  }, [items, services]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const clientName = clientMode === "existing" && selectedClient ? selectedClient.name : newClientName;
    const clientEmail = clientMode === "existing" && selectedClient ? selectedClient.email : newClientEmail;

    const firstItem = items[0];
    const quoteItems = items.map((item) => ({
      id: item.id,
      name: item.doorType,
      description: `${item.width}" x ${item.height}" | ${item.exteriorFinish}${item.interiorFinish && item.interiorFinish !== item.exteriorFinish ? ` / ${item.interiorFinish} interior` : ""} | ${item.glassType} | ${item.hardwareFinish}${item.roomName ? ` | ${item.roomName}` : ""}`,
      quantity: 1,
      unit_price: item.itemTotal,
      total: item.itemTotal,
    }));

    const notes = (document.getElementById("notes") as HTMLTextAreaElement)?.value || "";

    const data = {
      client_name: clientName,
      client_email: clientEmail,
      door_type: firstItem?.doorType || "",
      material: "Aluminum",
      color: firstItem?.exteriorFinish || "",
      glass_type: firstItem?.glassType || "",
      size: firstItem ? `${firstItem.width}" x ${firstItem.height}"` : "",
      cost: totals.grandTotal,
      notes: notes || undefined,
      delivery_type: services.deliveryType === "none" ? "pickup" : "delivery",
      client_id: clientMode === "existing" ? selectedClientId || undefined : undefined,
      save_as_client: clientMode === "new" ? saveAsClient : undefined,
      client_phone: clientMode === "new" && saveAsClient ? newClientPhone || undefined : undefined,
      client_company: clientMode === "new" && saveAsClient ? newClientCompany || undefined : undefined,
      customer_type: customerType,
      customer_phone: customerPhone || undefined,
      customer_zip: customerZip || undefined,
      assigned_to: assignedTo || undefined,
      lead_status: leadStatus,
      items: JSON.stringify(quoteItems),
      subtotal: totals.subtotal,
      installation_cost: totals.installationCost,
      delivery_cost: totals.deliveryCost,
      tax: totals.tax,
      grand_total: totals.grandTotal,
      follow_up_date: followUpDate || undefined,
    };

    try {
      if (isEdit) {
        await updateQuote(initialData.id, data);
      } else {
        const quote = await createQuote(data);

        // Send quote email to client (non-blocking)
        try {
          await sendQuoteToClient(quote.id, window.location.origin);
        } catch {
          // Don't block redirect if email fails
        }

        // Notify admin/sales reps (non-blocking)
        try {
          await notifyNewQuote(quote.id, window.location.origin);
        } catch {
          // Don't block redirect if notification fails
        }
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
      <div className="relative z-[60] rounded-2xl border border-white/[0.06] bg-white/[0.015]">
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
                      onClick={() => { setSelectedClientId(""); }}
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
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Customer fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 mt-4 border-t border-white/[0.04]">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5" /> Customer Type
              </label>
              <CustomSelect
                name="customer_type"
                value={customerType}
                onChange={setCustomerType}
                options={CUSTOMER_TYPES}
                placeholder="Select type..."
              />
            </div>
            <div>
              <label htmlFor="customer_phone" className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                <Phone className="w-3.5 h-3.5" /> Customer Phone
              </label>
              <input
                id="customer_phone"
                type="tel"
                className={inputClass}
                placeholder="+1 (555) 000-0000"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="customer_zip" className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" /> ZIP Code
              </label>
              <input
                id="customer_zip"
                type="text"
                className={inputClass}
                placeholder="90210"
                value={customerZip}
                onChange={(e) => setCustomerZip(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Lead Management ── */}
      <div className="relative z-[50] rounded-2xl border border-white/[0.06] bg-white/[0.015]">
        <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
            <Thermometer className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Lead Management</h3>
            <p className="text-sm text-white/35">Assign and track this quote</p>
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                <Thermometer className="w-3.5 h-3.5" /> Lead Status
              </label>
              <CustomSelect
                name="lead_status"
                value={leadStatus}
                onChange={setLeadStatus}
                options={LEAD_STATUSES}
                placeholder="Select status..."
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                <User className="w-3.5 h-3.5" /> Assigned To
              </label>
              <CustomSelect
                name="assigned_to"
                value={
                  assignedTo
                    ? adminUsers.find((u) => u.id === assignedTo)?.name || ""
                    : "Unassigned"
                }
                onChange={(val) => {
                  if (val === "Unassigned") {
                    setAssignedTo("");
                  } else {
                    const user = adminUsers.find((u) => u.name === val);
                    if (user) setAssignedTo(user.id);
                  }
                }}
                options={["Unassigned", ...adminUsers.map((u) => u.name)]}
                placeholder="Select assignee..."
              />
            </div>
            <div>
              <label htmlFor="follow_up_date" className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" /> Follow-Up Date
              </label>
              <input
                id="follow_up_date"
                type="date"
                className={inputClass + " [color-scheme:dark]"}
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3: Door Items ── */}
      <div className="relative z-[40] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <DoorOpen className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Door Items</h3>
              <p className="text-sm text-white/35">Configure each door system</p>
            </div>
          </div>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium hover:bg-amber-500/15 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        {items.map((item, index) => (
          <DoorItemCard
            key={item.id}
            item={item}
            index={index}
            onUpdate={(updates) => updateItem(index, updates)}
            onRemove={() => removeItem(index)}
            onDuplicate={() => duplicateItem(index)}
            canRemove={items.length > 1}
            inputClass={inputClass}
            totalItems={items.length}
          />
        ))}
      </div>

      {/* ── Section 4: Services ── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
        <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
            <Truck className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Services</h3>
            <p className="text-sm text-white/35">Delivery and installation options</p>
          </div>
        </div>
        <div className="p-5 sm:p-6 space-y-4">
          {/* Delivery */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5" /> Delivery
            </label>
            <div className="flex gap-3">
              {(["regular", "white-glove", "none"] as const).map((type) => {
                const labels: Record<string, string> = {
                  regular: "Regular ($800)",
                  "white-glove": "White Glove ($1,500)",
                  none: "None",
                };
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setServices((s) => ({ ...s, deliveryType: type }))}
                    className={`flex-1 py-3 sm:py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer active:scale-95 ${
                      services.deliveryType === type
                        ? "bg-sky-500/10 border-sky-500/30 text-sky-300 ring-2 ring-sky-500/20"
                        : "bg-white/[0.03] border-white/[0.08] text-white/40 hover:border-white/[0.15] hover:bg-white/[0.05]"
                    }`}
                  >
                    {labels[type]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Installation */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  services.includeInstallation
                    ? "bg-sky-500 border-sky-500"
                    : "border-white/[0.12] bg-transparent group-hover:border-white/[0.25]"
                }`}
                onClick={() => setServices((s) => ({ ...s, includeInstallation: !s.includeInstallation }))}
              >
                {services.includeInstallation && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <div>
                <span className="text-white/70 text-sm font-medium">Include Installation</span>
                <span className="text-white/30 text-sm ml-2">($1,750)</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* ── Section 5: Pricing Summary ── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
        <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Pricing Summary</h3>
            <p className="text-sm text-white/35">Auto-calculated from items and services</p>
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <div className="space-y-3">
            {/* Item breakdown */}
            {items.map((item, i) =>
              item.doorType && item.itemTotal > 0 ? (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-white/50">
                    {item.doorType}{item.width > 0 ? ` (${item.width}" x ${item.height}")` : ""}
                  </span>
                  <span className="text-white/70 font-medium">${item.itemTotal.toLocaleString()}</span>
                </div>
              ) : null
            )}

            <div className="border-t border-white/[0.06] pt-3 mt-3" />

            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">Subtotal</span>
              <span className="text-white/70 font-medium">${totals.subtotal.toLocaleString()}</span>
            </div>

            {totals.deliveryCost > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">
                  Delivery ({services.deliveryType === "white-glove" ? "White Glove" : "Regular"})
                </span>
                <span className="text-white/70 font-medium">${totals.deliveryCost.toLocaleString()}</span>
              </div>
            )}

            {totals.installationCost > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Installation</span>
                <span className="text-white/70 font-medium">${totals.installationCost.toLocaleString()}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
              <span className="text-white/70 font-medium">${totals.tax.toLocaleString()}</span>
            </div>

            <div className="border-t border-white/[0.06] pt-3 mt-1" />

            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">Grand Total</span>
              <span className="text-2xl font-bold text-emerald-400">
                ${totals.grandTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 6: Notes ── */}
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
