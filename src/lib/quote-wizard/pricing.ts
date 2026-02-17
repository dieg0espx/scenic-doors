import type { ConfiguredItem, ServiceOptions } from "./types";

export const BASE_PRICES: Record<string, number> = {
  "multi-slide": 8500,
  "ultra-slim": 12000,
  "bi-fold": 7500,
  "slide-stack": 9000,
  "pocket": 10500,
  "fold-up-windows": 6000,
};

export const GLASS_MODIFIERS: Record<string, number> = {
  "Low-E3 Glass": 0,
  "Clear Glass": -50,
  "Laminated Glass": 75,
};

export const DELIVERY_COSTS: Record<string, number> = {
  regular: 800,
  "white-glove": 1500,
  none: 0,
};

export const INSTALLATION_COST = 1500;
export const TAX_RATE = 0.08;

export function estimatePanelCount(width: number, doorTypeSlug: string): number {
  if (width <= 0) return 1;
  const panelWidth = doorTypeSlug === "bi-fold" || doorTypeSlug === "fold-up-windows" ? 30 : 36;
  return Math.max(1, Math.ceil(width / panelWidth));
}

export function calculateItemTotal(item: ConfiguredItem): number {
  const glassMod = GLASS_MODIFIERS[item.glassType] ?? 0;
  return item.basePrice + glassMod * item.panelCount;
}

export function calculateQuoteTotals(
  items: ConfiguredItem[],
  services: ServiceOptions
) {
  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const deliveryCost = DELIVERY_COSTS[services.deliveryType] ?? 0;
  const installationCost = services.includeInstallation ? INSTALLATION_COST : 0;
  const taxableAmount = subtotal + deliveryCost + installationCost;
  const tax = Math.round(taxableAmount * TAX_RATE * 100) / 100;
  const grandTotal = Math.round((taxableAmount + tax) * 100) / 100;

  return { subtotal, deliveryCost, installationCost, tax, grandTotal };
}
