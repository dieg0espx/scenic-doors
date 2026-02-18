import type { ConfiguredItem, ServiceOptions } from "./types";

export const BASE_PRICES: Record<string, number> = {
  "multi-slide-pocket": 8500,
  "ultra-slim": 12000,
  "bi-fold": 7500,
  "slide-stack": 9000,
  "awning-window": 6000,
};

export const POCKET_UPCHARGE = 1200;

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

export const INSTALLATION_COST = 1750;
export const TAX_RATE = 0.08;

/* ── Product-specific configuration rules ─────────────── */

export interface ProductConfig {
  displayName: string;
  hasSystemType: boolean;
  maxWidth: number;
  maxHeight: number;
  hasPanelCount: boolean;
  panelMinWidth: number;
  panelMaxWidth: number;
  usableOpeningOffset: number;
  hasRoomName: boolean;
  hardwareOptions: string[];
  detailedGlass: boolean;
}

export const PRODUCT_CONFIGS: Record<string, ProductConfig> = {
  "multi-slide-pocket": {
    displayName: "Sliders, Multi-Slide & Pocket Door Systems",
    hasSystemType: true,
    maxWidth: 240,
    maxHeight: 140,
    hasPanelCount: true,
    panelMinWidth: 35,
    panelMaxWidth: 60,
    usableOpeningOffset: 3,
    hasRoomName: false,
    hardwareOptions: ["Black", "White", "Silver"],
    detailedGlass: true,
  },
  "ultra-slim": {
    displayName: "Ultra Slim Multi-Slide & Pocket Systems",
    hasSystemType: true,
    maxWidth: 240,
    maxHeight: 140,
    hasPanelCount: true,
    panelMinWidth: 35,
    panelMaxWidth: 60,
    usableOpeningOffset: 3,
    hasRoomName: false,
    hardwareOptions: ["Black", "White", "Silver"],
    detailedGlass: true,
  },
  "bi-fold": {
    displayName: "Bi-Fold Doors and Windows",
    hasSystemType: false,
    maxWidth: 240,
    maxHeight: 120,
    hasPanelCount: true,
    panelMinWidth: 25,
    panelMaxWidth: 39,
    usableOpeningOffset: 5,
    hasRoomName: false,
    hardwareOptions: ["Black", "White", "Silver"],
    detailedGlass: false,
  },
  "slide-stack": {
    displayName: "Slide & Stack System",
    hasSystemType: false,
    maxWidth: 240,
    maxHeight: 120,
    hasPanelCount: true,
    panelMinWidth: 25,
    panelMaxWidth: 39,
    usableOpeningOffset: 5,
    hasRoomName: false,
    hardwareOptions: ["Black", "White", "Silver"],
    detailedGlass: false,
  },
  "awning-window": {
    displayName: "Awning Window",
    hasSystemType: false,
    maxWidth: 240,
    maxHeight: 140,
    hasPanelCount: false,
    panelMinWidth: 0,
    panelMaxWidth: 0,
    usableOpeningOffset: 0,
    hasRoomName: true,
    hardwareOptions: ["Black", "White", "Bronze"],
    detailedGlass: true,
  },
};

/* ── Panel helpers ────────────────────────────────────── */

export interface PanelCountOption {
  count: number;
  perPanelWidth: number;
  symmetry: "symmetrical" | "asymmetrical";
}

export function getAvailablePanelCounts(
  width: number,
  offset: number,
  minPanelWidth: number,
  maxPanelWidth: number
): PanelCountOption[] {
  if (width <= 0) return [];
  const usable = width - offset;
  if (usable <= 0) return [];
  const options: PanelCountOption[] = [];
  for (let n = 2; n <= 10; n++) {
    const pw = usable / n;
    if (pw >= minPanelWidth && pw <= maxPanelWidth) {
      options.push({
        count: n,
        perPanelWidth: Math.round(pw * 10) / 10,
        symmetry: n % 2 === 0 ? "symmetrical" : "asymmetrical",
      });
    }
  }
  return options;
}

const SLIDING_LAYOUTS: Record<number, string[]> = {
  2: [
    "Operating + Fixed",
    "Fixed + Operating",
    "Both Fixed",
  ],
  3: [
    "Operating + Operating + Fixed",
    "Operating + Fixed + Operating (L)",
    "Operating + Fixed + Operating (R)",
    "Operating + Fixed + Fixed",
    "Fixed + Operating + Fixed",
    "Fixed + Fixed + Operating",
    "Fixed + Fixed + Operating (L)",
    "All Fixed",
  ],
  4: [
    "Operating + Fixed + Fixed + Operating",
  ],
  6: [
    "Operating + Fixed + Fixed + Fixed + Fixed + Operating",
  ],
};

function getBifoldLayouts(panelCount: number): string[] {
  const layouts: string[] = [
    `All Left (${panelCount}L)`,
    `All Right (${panelCount}R)`,
  ];
  if (panelCount % 2 === 0) {
    const half = panelCount / 2;
    layouts.push(`Split ${half}L-${half}R`);
  }
  return layouts;
}

function getSlideStackLayouts(panelCount: number): string[] {
  if (panelCount === 2) {
    return ["1L + 1R", "2L", "2R"];
  }
  return [
    `All Left (${panelCount}L)`,
    `All Right (${panelCount}R)`,
  ];
}

export function getPanelLayouts(panelCount: number, slug: string): string[] {
  if (panelCount <= 0) return [];
  if (slug === "bi-fold") return getBifoldLayouts(panelCount);
  if (slug === "slide-stack") return getSlideStackLayouts(panelCount);
  return SLIDING_LAYOUTS[panelCount] ?? [];
}

/* ── Price calculations ───────────────────────────────── */

export function calculateItemTotal(item: ConfiguredItem): number {
  const glassMod = GLASS_MODIFIERS[item.glassType] ?? 0;
  const pocketUpcharge = item.systemType === "pocket" ? POCKET_UPCHARGE : 0;
  const panels = item.panelCount || 1;
  return item.basePrice + pocketUpcharge + glassMod * panels;
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
