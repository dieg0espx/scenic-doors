"use client";

import {
  Clock,
  Factory,
  Truck,
  CheckCircle2,
  Package,
  MapPin,
} from "lucide-react";
import type { OrderTracking } from "@/lib/types";

interface PortalTrackingProps {
  tracking: OrderTracking | null;
}

const STAGE_STEPS = [
  { key: "deposit_1_pending", label: "Deposit Received", icon: Package },
  { key: "manufacturing", label: "Manufacturing", icon: Factory },
  { key: "deposit_2_pending", label: "Final Payment", icon: Package },
  { key: "shipping", label: "Shipping", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

export default function PortalTracking({ tracking }: PortalTrackingProps) {
  if (!tracking) {
    return (
      <div className="bg-white rounded-xl border border-ocean-200 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-ocean-100 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-7 h-7 text-ocean-400" />
        </div>
        <h3 className="text-lg font-semibold text-ocean-900 mb-2">Tracking Not Yet Available</h3>
        <p className="text-ocean-500 text-sm max-w-md mx-auto">
          Order tracking will become available once your order is confirmed and manufacturing begins.
        </p>
      </div>
    );
  }

  const currentStageIndex = STAGE_STEPS.findIndex((s) => s.key === tracking.stage);

  return (
    <div className="space-y-6">
      {/* Stage Timeline */}
      <div className="bg-white rounded-xl border border-ocean-200 p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-ocean-900 mb-6 uppercase tracking-wider">
          Order Progress
        </h3>
        <div className="space-y-0">
          {STAGE_STEPS.map((step, i) => {
            const isCompleted = i < currentStageIndex;
            const isCurrent = i === currentStageIndex;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                          ? "bg-primary-500 text-white ring-4 ring-primary-500/20"
                          : "bg-ocean-100 text-ocean-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {i < STAGE_STEPS.length - 1 && (
                    <div
                      className={`w-0.5 h-12 ${
                        i < currentStageIndex ? "bg-green-500" : "bg-ocean-200"
                      }`}
                    />
                  )}
                </div>
                <div className="pb-8">
                  <h4
                    className={`font-semibold text-sm ${
                      isCurrent ? "text-primary-600" : isCompleted ? "text-green-700" : "text-ocean-400"
                    }`}
                  >
                    {step.label}
                    {isCurrent && (
                      <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </h4>
                  {step.key === "manufacturing" && tracking.estimated_completion && (
                    <p className="text-xs text-ocean-500 mt-1">
                      Est. completion:{" "}
                      {new Date(tracking.estimated_completion).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                  {step.key === "shipping" && tracking.estimated_delivery && (
                    <p className="text-xs text-ocean-500 mt-1">
                      Est. delivery:{" "}
                      {new Date(tracking.estimated_delivery).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tracking Number */}
      {tracking.tracking_number && (
        <div className="bg-white rounded-xl border border-ocean-200 p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-ocean-900 mb-3 uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4" /> Shipping Information
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-ocean-50 rounded-lg p-3">
              <span className="text-[11px] text-ocean-400 uppercase tracking-wider font-medium">
                Tracking Number
              </span>
              <p className="text-ocean-900 font-mono font-medium text-sm mt-0.5">
                {tracking.tracking_number}
              </p>
            </div>
            {tracking.shipping_carrier && (
              <div className="bg-ocean-50 rounded-lg p-3">
                <span className="text-[11px] text-ocean-400 uppercase tracking-wider font-medium">
                  Carrier
                </span>
                <p className="text-ocean-900 font-medium text-sm mt-0.5">
                  {tracking.shipping_carrier}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shipping Updates */}
      {Array.isArray(tracking.shipping_updates) && tracking.shipping_updates.length > 0 && (
        <div className="bg-white rounded-xl border border-ocean-200 p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-ocean-900 mb-4 uppercase tracking-wider">
            Shipping Updates
          </h3>
          <div className="space-y-3">
            {tracking.shipping_updates.map((update, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-ocean-100 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-ocean-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ocean-900">{update.status}</p>
                  <p className="text-xs text-ocean-500">
                    {new Date(update.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                    {update.location && ` — ${update.location}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {tracking.notes && (
        <div className="bg-white rounded-xl border border-ocean-200 p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-ocean-900 mb-2 uppercase tracking-wider">
            Order Notes
          </h3>
          <p className="text-sm text-ocean-600">{tracking.notes}</p>
        </div>
      )}
    </div>
  );
}
