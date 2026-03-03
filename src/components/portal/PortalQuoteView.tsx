"use client";

import { useState } from "react";
import Image from "next/image";
import {
  DoorOpen,
  Layers,
  Palette,
  GlassWater,
  Ruler,
  Camera,
  MapPin,
  Loader2,
  Check,
  PanelLeft,
  Wrench,
} from "lucide-react";
import { updateDeliveryAddress } from "@/lib/actions/quotes";
import type { QuotePhoto, ApprovalDrawing } from "@/lib/types";
import DoorTypeAnimation from "@/components/DoorTypeAnimation";

interface QuoteData {
  id: string;
  door_type: string;
  material: string;
  color: string;
  glass_type: string;
  size: string;
  cost: number;
  notes: string | null;
  delivery_type: string | null;
  delivery_address: string | null;
  items: Array<{
    id: string;
    name: string;
    description?: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
  subtotal: number;
  installation_cost: number;
  delivery_cost: number;
  tax: number;
  grand_total: number;
}

interface PortalQuoteViewProps {
  quote: QuoteData;
  photos: QuotePhoto[];
  drawing?: ApprovalDrawing | null;
}

export default function PortalQuoteView({ quote, photos, drawing }: PortalQuoteViewProps) {
  const total = Number(quote.grand_total || quote.cost || 0);

  // Extract config from first item (full quotes store panelCount, panelLayout, etc.)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firstItem: any = Array.isArray(quote.items) && quote.items.length > 0 ? quote.items[0] : null;
  const itemPanelCount: number | undefined = drawing?.panel_count ?? firstItem?.panelCount;
  const itemPanelLayout: string | undefined = drawing?.configuration ?? firstItem?.panelLayout;

  const directionLabels: Record<string, string> = {
    left: "Slides Left",
    right: "Slides Right",
    "bi-part": "Bi-Part",
  };
  const swingLabels: Record<string, string> = {
    interior: "In-Swing",
    exterior: "Out-Swing",
    "in-swing": "In-Swing",
    "out-swing": "Out-Swing",
  };

  const specs = [
    { label: "Door Type", value: quote.door_type, icon: DoorOpen },
    { label: "Material", value: quote.material, icon: Layers },
    {
      label: "Overall Size",
      value: drawing
        ? `${drawing.overall_width}" x ${drawing.overall_height}"`
        : firstItem?.width && firstItem?.height
          ? `${firstItem.width}" x ${firstItem.height}"`
          : quote.size,
      icon: Ruler,
    },
    {
      label: "Panels",
      value: drawing
        ? String(drawing.panel_count)
        : firstItem?.panelCount
          ? String(firstItem.panelCount)
          : null,
      icon: PanelLeft,
    },
    {
      label: "Panel Layout",
      value: drawing?.configuration || firstItem?.panelLayout || null,
      icon: PanelLeft,
    },
    {
      label: "Opening Direction",
      value: drawing
        ? directionLabels[drawing.slide_direction] || drawing.slide_direction
        : null,
      icon: PanelLeft,
    },
    {
      label: "Swing",
      value: drawing
        ? drawing.in_swing.split(",").map((v) => swingLabels[v.trim()] || v.trim()).join(", ")
        : null,
      icon: PanelLeft,
    },
    {
      label: "Frame Color",
      value: drawing?.frame_color
        ? drawing.frame_color.split(",").map((v) => v.trim()).join(", ")
        : firstItem?.exteriorFinish || quote.color,
      icon: Palette,
    },
    ...(firstItem?.interiorFinish && firstItem.interiorFinish !== firstItem.exteriorFinish
      ? [{ label: "Interior Color", value: firstItem.interiorFinish as string, icon: Palette }]
      : []),
    {
      label: "Glass Type",
      value: firstItem?.glassType || quote.glass_type,
      icon: GlassWater,
    },
    {
      label: "Hardware",
      value: drawing?.hardware_color
        ? drawing.hardware_color.split(",").map((v) => v.trim()).join(", ")
        : firstItem?.hardwareFinish || null,
      icon: Wrench,
    },
    ...(drawing?.system_type || firstItem?.systemType
      ? [{ label: "System Type", value: (drawing?.system_type || firstItem?.systemType) as string, icon: Layers }]
      : []),
  ].filter((s) => s.value);

  const interiorPhotos = photos.filter((p) => p.photo_type === "interior");
  const exteriorPhotos = photos.filter((p) => p.photo_type === "exterior");

  return (
    <div className="space-y-6">
      {/* Door Preview */}
      {quote.door_type && (
        <div className="bg-white rounded-xl border border-ocean-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-ocean-100">
            <h3 className="text-sm font-semibold text-ocean-900 uppercase tracking-wider">
              Door Preview
            </h3>
          </div>
          <DoorTypeAnimation
            doorType={quote.door_type}
            compact={false}
            panelCount={itemPanelCount}
            panelLayout={itemPanelLayout}
          />
        </div>
      )}

      {/* Specs Grid */}
      <div className="bg-white rounded-xl border border-ocean-200 p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-ocean-900 mb-4 uppercase tracking-wider">
          Door Specifications
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {specs.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-ocean-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="w-3.5 h-3.5 text-ocean-400" />
                <span className="text-[11px] text-ocean-400 uppercase tracking-wider font-medium">{label}</span>
              </div>
              <p className="text-ocean-900 font-medium text-sm">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Line Items */}
      {Array.isArray(quote.items) && quote.items.length > 0 && (
        <div className="bg-white rounded-xl border border-ocean-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-ocean-100">
            <h3 className="text-sm font-semibold text-ocean-900 uppercase tracking-wider">
              Line Items
            </h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ocean-50">
                <th className="text-left px-5 py-2.5 text-xs uppercase tracking-wider text-ocean-400 font-semibold">
                  Item
                </th>
                <th className="text-right px-5 py-2.5 text-xs uppercase tracking-wider text-ocean-400 font-semibold">
                  Qty
                </th>
                <th className="text-right px-5 py-2.5 text-xs uppercase tracking-wider text-ocean-400 font-semibold">
                  Price
                </th>
                <th className="text-right px-5 py-2.5 text-xs uppercase tracking-wider text-ocean-400 font-semibold">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ocean-100">
              {quote.items.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="px-5 py-3 text-ocean-800">
                    {item.name}
                    {item.description && (
                      <p className="text-ocean-400 text-xs mt-0.5">{item.description}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right text-ocean-500">{item.quantity}</td>
                  <td className="px-5 py-3 text-right text-ocean-500">
                    ${Number(item.unit_price).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3 text-right text-ocean-900 font-medium">
                    ${Number(item.total).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pricing Summary */}
      <div className="bg-white rounded-xl border border-ocean-200 p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-ocean-900 mb-4 uppercase tracking-wider">
          Pricing Summary
        </h3>
        <div className="space-y-2 text-sm">
          {Number(quote.subtotal) > 0 && (
            <div className="flex justify-between text-ocean-600">
              <span>Subtotal</span>
              <span>${Number(quote.subtotal).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          {Number(quote.installation_cost) > 0 && (
            <div className="flex justify-between text-ocean-600">
              <span>Installation</span>
              <span>${Number(quote.installation_cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          {Number(quote.delivery_cost) > 0 && (
            <div className="flex justify-between text-ocean-600">
              <span>Delivery</span>
              <span>${Number(quote.delivery_cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          {Number(quote.tax) > 0 && (
            <div className="flex justify-between text-ocean-600">
              <span>Tax</span>
              <span>${Number(quote.tax).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="flex justify-between pt-3 border-t border-ocean-200 text-lg font-bold">
            <span className="text-ocean-900">Grand Total</span>
            <span className="text-primary-600">
              ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <DeliveryAddressSection quoteId={quote.id} initialAddress={quote.delivery_address} />

      {/* Notes */}
      {quote.notes && (
        <div className="bg-white rounded-xl border border-ocean-200 p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-ocean-900 mb-2 uppercase tracking-wider">
            Notes
          </h3>
          <p className="text-sm text-ocean-600">{quote.notes}</p>
        </div>
      )}

      {/* Photos */}
      {photos.length > 0 && (
        <div className="bg-white rounded-xl border border-ocean-200 p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-ocean-900 mb-4 uppercase tracking-wider flex items-center gap-2">
            <Camera className="w-4 h-4" /> Site Photos
          </h3>

          {interiorPhotos.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-ocean-400 uppercase tracking-wider font-medium mb-2">Interior</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {interiorPhotos.map((photo) => (
                  <div key={photo.id} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-ocean-200">
                    <Image src={photo.photo_url} alt={photo.caption || "Interior"} fill className="object-cover" />
                    {photo.caption && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/50 px-2 py-1">
                        <p className="text-white text-xs truncate">{photo.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {exteriorPhotos.length > 0 && (
            <div>
              <p className="text-xs text-ocean-400 uppercase tracking-wider font-medium mb-2">Exterior</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {exteriorPhotos.map((photo) => (
                  <div key={photo.id} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-ocean-200">
                    <Image src={photo.photo_url} alt={photo.caption || "Exterior"} fill className="object-cover" />
                    {photo.caption && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/50 px-2 py-1">
                        <p className="text-white text-xs truncate">{photo.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface AddressFields {
  street: string;
  unit: string;
  city: string;
  state: string;
  zip: string;
}

function parseAddress(raw: string | null): AddressFields {
  if (!raw) return { street: "", unit: "", city: "", state: "", zip: "" };
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.street !== undefined) return parsed;
  } catch {
    // Not JSON — legacy free-text, put it all in street
  }
  return { street: raw, unit: "", city: "", state: "", zip: "" };
}

function formatAddress(fields: AddressFields): string {
  return JSON.stringify(fields);
}

function DeliveryAddressSection({ quoteId, initialAddress }: { quoteId: string; initialAddress: string | null }) {
  const [fields, setFields] = useState<AddressFields>(() => parseAddress(initialAddress));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const initialFields = parseAddress(initialAddress);
  const hasChanged = JSON.stringify(fields) !== JSON.stringify(initialFields);
  const isValid = fields.street.trim() && fields.city.trim() && fields.state.trim() && fields.zip.trim();

  function update(key: keyof AddressFields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    if (!isValid) return;
    setSaving(true);
    try {
      await updateDeliveryAddress(quoteId, formatAddress(fields));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Failed to save address. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full px-3 py-2.5 bg-ocean-50 border border-ocean-200 rounded-lg text-ocean-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 placeholder-ocean-300";

  return (
    <div className="bg-white rounded-xl border border-ocean-200 p-5 sm:p-6">
      <h3 className="text-sm font-semibold text-ocean-900 mb-1 uppercase tracking-wider flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary-500" /> Delivery Location
      </h3>
      <p className="text-xs text-ocean-400 mb-4">
        Please provide the address where you&apos;d like the doors delivered.
      </p>

      <div className="space-y-3">
        {/* Street */}
        <div>
          <label className="block text-xs text-ocean-500 font-medium mb-1">Street Address</label>
          <input
            type="text"
            value={fields.street}
            onChange={(e) => update("street", e.target.value)}
            placeholder="123 Main St"
            className={inputClass}
          />
        </div>

        {/* Apt / Unit */}
        <div>
          <label className="block text-xs text-ocean-500 font-medium mb-1">
            Apt / Suite / Unit <span className="text-ocean-300">(optional)</span>
          </label>
          <input
            type="text"
            value={fields.unit}
            onChange={(e) => update("unit", e.target.value)}
            placeholder="Apt 4B"
            className={inputClass}
          />
        </div>

        {/* City + State + ZIP in one row */}
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-2">
            <label className="block text-xs text-ocean-500 font-medium mb-1">City</label>
            <input
              type="text"
              value={fields.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="Los Angeles"
              className={inputClass}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs text-ocean-500 font-medium mb-1">State</label>
            <input
              type="text"
              value={fields.state}
              onChange={(e) => update("state", e.target.value)}
              placeholder="CA"
              maxLength={2}
              className={inputClass}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-ocean-500 font-medium mb-1">ZIP Code</label>
            <input
              type="text"
              value={fields.zip}
              onChange={(e) => update("zip", e.target.value)}
              placeholder="90001"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-xs text-ocean-400">
          {saved && (
            <span className="text-green-600 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Address saved
            </span>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !isValid || !hasChanged}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
          {saving ? "Saving..." : "Save Address"}
        </button>
      </div>
    </div>
  );
}
