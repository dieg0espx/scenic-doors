"use client";

import Image from "next/image";
import {
  DoorOpen,
  Layers,
  Palette,
  GlassWater,
  Ruler,
  Camera,
} from "lucide-react";
import type { QuotePhoto } from "@/lib/types";

interface QuoteData {
  door_type: string;
  material: string;
  color: string;
  glass_type: string;
  size: string;
  cost: number;
  notes: string | null;
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
}

export default function PortalQuoteView({ quote, photos }: PortalQuoteViewProps) {
  const total = Number(quote.grand_total || quote.cost || 0);

  const specs = [
    { label: "Door Type", value: quote.door_type, icon: DoorOpen },
    { label: "Material", value: quote.material, icon: Layers },
    { label: "Color", value: quote.color, icon: Palette },
    { label: "Glass Type", value: quote.glass_type, icon: GlassWater },
    { label: "Size", value: quote.size, icon: Ruler },
  ];

  const interiorPhotos = photos.filter((p) => p.photo_type === "interior");
  const exteriorPhotos = photos.filter((p) => p.photo_type === "exterior");

  return (
    <div className="space-y-6">
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
