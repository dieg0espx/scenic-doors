"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Copy,
  Trash2,
  Plus,
  Truck,
  Package,
  Wrench,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import type { ConfiguredItem, WizardState, WizardAction } from "@/lib/quote-wizard/types";
import { calculateQuoteTotals, DELIVERY_COSTS, INSTALLATION_COST } from "@/lib/quote-wizard/pricing";
import { createQuote } from "@/lib/actions/quotes";
import { updateLead } from "@/lib/actions/leads";

interface StepQuoteSummaryProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

function ItemCard({
  item,
  index,
  dispatch,
}: {
  item: ConfiguredItem;
  index: number;
  dispatch: React.Dispatch<WizardAction>;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-ocean-200 overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center text-sm font-bold shrink-0">
            {index + 1}
          </span>
          <div className="min-w-0">
            <h4 className="font-semibold text-ocean-900 text-sm truncate">{item.doorType}</h4>
            <p className="text-xs text-ocean-500">
              {item.width}&quot; x {item.height}&quot;
              {item.roomName && ` — ${item.roomName}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-ocean-900">
            ${item.itemTotal.toLocaleString()}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-ocean-400 hover:text-ocean-600 cursor-pointer"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-ocean-100 pt-3">
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div>
              <span className="text-ocean-400 text-xs">Color</span>
              <p className="text-ocean-800 font-medium">{item.exteriorFinish}</p>
            </div>
            <div>
              <span className="text-ocean-400 text-xs">Glass</span>
              <p className="text-ocean-800 font-medium">{item.glassType}</p>
            </div>
            <div>
              <span className="text-ocean-400 text-xs">Hardware</span>
              <p className="text-ocean-800 font-medium">{item.hardwareFinish}</p>
            </div>
            <div>
              <span className="text-ocean-400 text-xs">Est. Panels</span>
              <p className="text-ocean-800 font-medium">{item.panelCount}</p>
            </div>
            <div>
              <span className="text-ocean-400 text-xs">Base Price</span>
              <p className="text-ocean-800 font-medium">${item.basePrice.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-ocean-400 text-xs">Rough Opening</span>
              <p className="text-ocean-800 font-medium">{item.width + 1}&quot; x {item.height + 0.5}&quot;</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                dispatch({ type: "EDIT_ITEM", payload: index });
                dispatch({ type: "SET_STEP", payload: 3 });
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer"
            >
              <Pencil className="w-3 h-3" /> Edit
            </button>
            <button
              onClick={() => dispatch({ type: "DUPLICATE_ITEM", payload: index })}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-ocean-600 bg-ocean-50 rounded-lg hover:bg-ocean-100 transition-colors cursor-pointer"
            >
              <Copy className="w-3 h-3" /> Duplicate
            </button>
            <button
              onClick={() => dispatch({ type: "REMOVE_ITEM", payload: index })}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StepQuoteSummary({ state, dispatch }: StepQuoteSummaryProps) {
  const { items, services, contact, leadId, isSubmitting } = state;
  const totals = calculateQuoteTotals(items, services);

  async function handleSubmit() {
    dispatch({ type: "SET_SUBMITTING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const firstItem = items[0];
      const quoteItems = items.map((item, i) => ({
        id: item.id,
        name: item.doorType,
        description: `${item.width}" x ${item.height}" | ${item.exteriorFinish} | ${item.glassType} | ${item.hardwareFinish}${item.roomName ? ` | ${item.roomName}` : ""}`,
        quantity: 1,
        unit_price: item.itemTotal,
        total: item.itemTotal,
      }));

      const quote = await createQuote({
        client_name: `${contact.firstName} ${contact.lastName}`,
        client_email: contact.email,
        door_type: firstItem.doorType,
        material: "Aluminum",
        color: firstItem.exteriorFinish,
        glass_type: firstItem.glassType,
        size: `${firstItem.width}" x ${firstItem.height}"`,
        cost: totals.grandTotal,
        customer_type: contact.customerType,
        customer_phone: contact.phone,
        customer_zip: contact.zip,
        lead_status: "new",
        lead_id: leadId || undefined,
        items: JSON.stringify(quoteItems),
        subtotal: totals.subtotal,
        installation_cost: totals.installationCost,
        delivery_cost: totals.deliveryCost,
        tax: totals.tax,
        grand_total: totals.grandTotal,
        delivery_type: services.deliveryType === "none" ? "pickup" : "delivery",
      });

      if (leadId) {
        await updateLead(leadId, { has_quote: true });
      }

      dispatch({ type: "SET_QUOTE_ID", payload: quote.id });
      dispatch({ type: "SET_STEP", payload: 5 });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err instanceof Error ? err.message : "Failed to create quote",
      });
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-ocean-900 mb-2">
          Quote Summary
        </h2>
        <p className="text-ocean-500">Review your selections and submit your quote</p>
      </div>

      {/* Items */}
      <div className="space-y-3 mb-6">
        {items.map((item, i) => (
          <ItemCard key={item.id} item={item} index={i} dispatch={dispatch} />
        ))}
      </div>

      <button
        onClick={() => {
          dispatch({ type: "ADD_ANOTHER_ITEM" });
          dispatch({ type: "SET_STEP", payload: 2 });
        }}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-ocean-200 rounded-xl text-primary-600 font-medium hover:border-primary-300 hover:bg-primary-50/50 transition-colors mb-8 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add Another Item
      </button>

      {/* Services */}
      <div className="bg-white rounded-xl border border-ocean-200 p-6 mb-6">
        <h3 className="font-heading font-bold text-ocean-900 text-lg mb-4">Services</h3>

        {/* Delivery */}
        <div className="mb-5">
          <p className="text-sm font-medium text-ocean-700 mb-3">Delivery Option</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              {
                value: "none" as const,
                label: "No Delivery",
                price: "$0",
                icon: Package,
                desc: "Pick up from warehouse",
              },
              {
                value: "regular" as const,
                label: "Standard Delivery",
                price: `$${DELIVERY_COSTS.regular.toLocaleString()}`,
                icon: Truck,
                desc: "Curbside delivery to your address",
              },
              {
                value: "white-glove" as const,
                label: "White Glove",
                price: `$${DELIVERY_COSTS["white-glove"].toLocaleString()}`,
                icon: Truck,
                desc: "Inside delivery with placement",
              },
            ].map((opt) => {
              const isSelected = services.deliveryType === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => dispatch({ type: "SET_SERVICES", payload: { deliveryType: opt.value } })}
                  className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary-500 bg-primary-50"
                      : "border-ocean-200 hover:border-primary-300"
                  }`}
                >
                  <opt.icon className={`w-5 h-5 mb-2 ${isSelected ? "text-primary-500" : "text-ocean-400"}`} />
                  <p className="font-semibold text-sm text-ocean-900">{opt.label}</p>
                  <p className="text-xs text-ocean-500 mb-1">{opt.desc}</p>
                  <p className="text-sm font-bold text-primary-600">{opt.price}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Installation */}
        <div>
          <button
            onClick={() =>
              dispatch({
                type: "SET_SERVICES",
                payload: { includeInstallation: !services.includeInstallation },
              })
            }
            className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
              services.includeInstallation
                ? "border-primary-500 bg-primary-50"
                : "border-ocean-200 hover:border-primary-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wrench
                  className={`w-5 h-5 ${services.includeInstallation ? "text-primary-500" : "text-ocean-400"}`}
                />
                <div>
                  <p className="font-semibold text-sm text-ocean-900">
                    Professional Weatherproofing & Installation
                  </p>
                  <p className="text-xs text-ocean-500">
                    Expert installation including weatherproofing, alignment, and hardware adjustment
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-bold text-primary-600">${INSTALLATION_COST.toLocaleString()}</span>
                <div
                  className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${
                    services.includeInstallation ? "bg-primary-500" : "bg-ocean-200"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      services.includeInstallation ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Totals */}
      <div className="bg-white rounded-xl border border-ocean-200 p-6 mb-8">
        <h3 className="font-heading font-bold text-ocean-900 text-lg mb-4">Quote Totals</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-ocean-600">
            <span>All Items Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})</span>
            <span>${totals.subtotal.toLocaleString()}</span>
          </div>
          {totals.installationCost > 0 && (
            <div className="flex justify-between text-ocean-600">
              <span>Installation</span>
              <span>${totals.installationCost.toLocaleString()}</span>
            </div>
          )}
          {totals.deliveryCost > 0 && (
            <div className="flex justify-between text-ocean-600">
              <span>Delivery</span>
              <span>${totals.deliveryCost.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-ocean-600">
            <span>Estimated Tax (8%)</span>
            <span>${totals.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-ocean-200 text-lg font-bold text-ocean-900">
            <span>Grand Total</span>
            <span className="text-primary-600">
              ${totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {state.error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {state.error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => dispatch({ type: "SET_STEP", payload: 3 })}
          className="px-6 py-3 rounded-lg border border-ocean-200 text-ocean-600 font-medium hover:bg-ocean-50 transition-colors cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || items.length === 0}
          className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting Quote...
            </>
          ) : (
            "Save & Email Quote"
          )}
        </button>
      </div>

      <div className="text-center mt-4">
        <button
          onClick={() => dispatch({ type: "RESET" })}
          className="text-sm text-ocean-400 hover:text-ocean-600 transition-colors cursor-pointer"
        >
          Start New Quote
        </button>
      </div>
    </div>
  );
}
