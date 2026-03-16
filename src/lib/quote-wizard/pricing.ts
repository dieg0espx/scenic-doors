import type { ConfiguredItem, ServiceOptions } from "./types";

export const RATES_PER_SQFT: Record<string, number> = {
  "multi-slide-pocket": 105,
  "ultra-slim": 130,
  "bi-fold": 110,
  "slide-stack": 120,
  "awning-window": 95,
};

export const GLASS_MODIFIERS: Record<string, number> = {
  "Low-E3 Glass": 0,
  "Clear Glass": -50,
  "Laminated Glass": 75,
  "Triple-Pane Glass": 0,
};

export const INSTALLATION_RATE = 30;
export const DELIVERY_COST = 800;
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
    maxWidth: 292,
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
    maxWidth: 60,
    maxHeight: 60,
    hasPanelCount: false,
    panelMinWidth: 24,
    panelMaxWidth: 60,
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
  for (let n = 2; n <= 8; n++) {
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
  5: [
    "Operating + Fixed + Fixed + Fixed + Operating",
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

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calculateSquareFeet(width: number, height: number): number {
  return (width * height) / 144;
}

export function calculateItemTotal(item: ConfiguredItem): number {
  const sqft = calculateSquareFeet(item.width, item.height);
  const rate = RATES_PER_SQFT[item.doorTypeSlug] ?? 0;
  const glassPerUnit = GLASS_MODIFIERS[item.glassType] ?? 0;
  const glassMultiplier = item.doorTypeSlug === "bi-fold"
    ? Math.ceil((item.panelCount || 1) / 2)
    : (item.panelCount || 1);
  const glassMod = glassPerUnit * glassMultiplier;
  return round2(sqft * rate + glassMod);
}

export function calculateQuoteTotals(
  items: ConfiguredItem[],
  services: ServiceOptions
) {
  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const totalSqFt = items.reduce(
    (sum, item) => sum + calculateSquareFeet(item.width, item.height),
    0
  );
  const installationCost = services.includeInstallation
    ? round2(totalSqFt * INSTALLATION_RATE)
    : 0;
  const deliveryCost = DELIVERY_COST;
  const taxableAmount = subtotal + installationCost + deliveryCost;
  const tax = round2(taxableAmount * TAX_RATE);
  const grandTotal = round2(taxableAmount + tax);

  return { subtotal, installationCost, deliveryCost, tax, grandTotal };
}

/* ── Per-item pricing breakdown ───────────────────────── */

export interface ItemPricingBreakdown {
  perPanelWidth: number | null;
  squareFeet: number;
  ratePerSqFt: number;
  baseProductPrice: number;
  glassPriceModifier: number;
  panelCount: number;
  totalGlassModifier: number;
  productPrice: number;
}

/**
 * Calculates a full pricing breakdown for a single item.
 * Accepts either a ConfiguredItem from wizard state or a loosely-typed
 * item object from the DB JSON. Gracefully returns zeros when fields
 * are missing (old quotes).
 */
export function calculateItemBreakdown(item: {
  width?: number;
  height?: number;
  panelCount?: number;
  doorTypeSlug?: string;
  glassType?: string;
  ratePerSqFt?: number;
  squareFeet?: number;
  glassPriceModifier?: number;
  baseProductPrice?: number;
}): ItemPricingBreakdown {
  const width = Number(item.width) || 0;
  const height = Number(item.height) || 0;
  const panelCount = Number(item.panelCount) || 1;
  const offset = item.doorTypeSlug ? (PRODUCT_CONFIGS[item.doorTypeSlug]?.usableOpeningOffset ?? 0) : 0;
  const usableWidth = width - offset;
  const perPanelWidth = panelCount > 1 && usableWidth > 0 ? round2(usableWidth / panelCount) : null;

  const squareFeet = item.squareFeet
    ? Number(item.squareFeet)
    : width && height
      ? calculateSquareFeet(width, height)
      : 0;

  const ratePerSqFt = item.ratePerSqFt
    ? Number(item.ratePerSqFt)
    : item.doorTypeSlug
      ? (RATES_PER_SQFT[item.doorTypeSlug] ?? 0)
      : 0;

  const baseProductPrice = item.baseProductPrice
    ? Number(item.baseProductPrice)
    : round2(squareFeet * ratePerSqFt);

  const glassPriceModifier = item.glassPriceModifier !== undefined
    ? Number(item.glassPriceModifier)
    : item.glassType
      ? (GLASS_MODIFIERS[item.glassType] ?? 0)
      : 0;

  const glassMultiplier = item.doorTypeSlug === "bi-fold"
    ? Math.ceil(panelCount / 2)
    : panelCount;
  const totalGlassModifier = round2(glassPriceModifier * glassMultiplier);
  const productPrice = round2(baseProductPrice + totalGlassModifier);

  return {
    perPanelWidth,
    squareFeet: round2(squareFeet),
    ratePerSqFt,
    baseProductPrice,
    glassPriceModifier,
    panelCount,
    totalGlassModifier,
    productPrice,
  };
}
