export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zip: string;
  referralCode: string;
  timeline: string;
  customerType: string;
  source: string;
}

export interface ConfiguredItem {
  id: string;
  doorType: string;
  doorTypeSlug: string;
  systemType: string;
  width: number;
  height: number;
  panelCount: number;
  panelLayout: string;
  roomName: string;
  exteriorFinish: string;
  interiorFinish: string;
  glassType: string;
  hardwareFinish: string;
  basePrice: number;
  glassPriceModifier: number;
  itemTotal: number;
}

export interface ServiceOptions {
  deliveryType: "regular" | "white-glove" | "none";
  includeInstallation: boolean;
}

export interface GeneralPreferences {
  approximateSize: string;    // "small" | "medium" | "large" | "extra-large" | "not-sure"
  colorPreference: string;    // "light" | "dark" | "wood-tones" | "not-sure"
  glassPreference: string;    // "standard" | "energy-efficient" | "privacy" | "not-sure"
  projectNotes: string;
}

export interface WizardState {
  currentStep: number;
  contact: ContactInfo;
  items: ConfiguredItem[];
  currentItemIndex: number | null;
  services: ServiceOptions;
  leadId: string | null;
  quoteId: string | null;
  isSubmitting: boolean;
  error: string | null;
  intentLevel: "browse" | "medium" | "full" | null;
  browseInterests: string[];
  generalPreferences: GeneralPreferences;
}

export type WizardAction =
  | { type: "SET_CONTACT"; payload: Partial<ContactInfo> }
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_LEAD_ID"; payload: string }
  | { type: "SELECT_PRODUCT"; payload: { doorType: string; doorTypeSlug: string; basePrice: number } }
  | { type: "UPDATE_CURRENT_ITEM"; payload: Partial<ConfiguredItem> }
  | { type: "SAVE_CURRENT_ITEM" }
  | { type: "EDIT_ITEM"; payload: number }
  | { type: "DUPLICATE_ITEM"; payload: number }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "ADD_ANOTHER_ITEM" }
  | { type: "SET_SERVICES"; payload: Partial<ServiceOptions> }
  | { type: "SET_QUOTE_ID"; payload: string }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET" }
  | { type: "SET_INTENT"; payload: "browse" | "medium" | "full" }
  | { type: "SET_BROWSE_INTERESTS"; payload: string[] }
  | { type: "SET_GENERAL_PREFERENCES"; payload: Partial<GeneralPreferences> };

export const initialContact: ContactInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  zip: "",
  referralCode: "",
  timeline: "",
  customerType: "",
  source: "",
};

export const initialServices: ServiceOptions = {
  deliveryType: "none",
  includeInstallation: false,
};

export const initialGeneralPreferences: GeneralPreferences = {
  approximateSize: "",
  colorPreference: "",
  glassPreference: "",
  projectNotes: "",
};

export function createEmptyItem(): ConfiguredItem {
  return {
    id: crypto.randomUUID(),
    doorType: "",
    doorTypeSlug: "",
    systemType: "slider",
    width: 0,
    height: 0,
    panelCount: 0,
    panelLayout: "",
    roomName: "",
    exteriorFinish: "",
    interiorFinish: "",
    glassType: "",
    hardwareFinish: "",
    basePrice: 0,
    glassPriceModifier: 0,
    itemTotal: 0,
  };
}

export const initialState: WizardState = {
  currentStep: 1,
  contact: initialContact,
  items: [],
  currentItemIndex: null,
  services: initialServices,
  leadId: null,
  quoteId: null,
  isSubmitting: false,
  error: null,
  intentLevel: null,
  browseInterests: [],
  generalPreferences: initialGeneralPreferences,
};

export function getStepLabels(intentLevel: string | null): string[] {
  switch (intentLevel) {
    case "browse":  return ["Contact", "Intent", "Explore Prices", "Done"];
    case "medium":  return ["Contact", "Intent", "Product", "Preferences", "Summary", "Done"];
    case "full":    return ["Contact", "Intent", "Product", "Configure", "Summary", "Done"];
    default:        return ["Contact", "Intent"];
  }
}
