import type { ContactInfo, ConfiguredItem } from "./types";

export interface ValidationErrors {
  [key: string]: string;
}

export function validateContactInfo(contact: ContactInfo): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!contact.firstName.trim()) errors.firstName = "First name is required";
  if (!contact.lastName.trim()) errors.lastName = "Last name is required";

  if (!contact.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
    errors.email = "Please enter a valid email";
  }

  if (!contact.phone.trim()) {
    errors.phone = "Phone is required";
  }

  if (!contact.zip.trim()) {
    errors.zip = "ZIP code is required";
  } else if (!/^\d{5}$/.test(contact.zip)) {
    errors.zip = "Please enter a valid 5-digit ZIP";
  }

  if (!contact.timeline) errors.timeline = "Please select a timeline";
  if (!contact.customerType) errors.customerType = "Please select a customer type";
  if (!contact.source) errors.source = "Please select how you heard about us";

  return errors;
}

export function validateConfiguration(item: ConfiguredItem): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!item.width || item.width <= 0) {
    errors.width = "Width is required";
  } else if (item.width > 240) {
    errors.width = "Maximum width is 240 inches";
  }

  if (!item.height || item.height <= 0) {
    errors.height = "Height is required";
  } else if (item.height > 140) {
    errors.height = "Maximum height is 140 inches";
  }

  if (!item.exteriorFinish) errors.exteriorFinish = "Please select a color";
  if (!item.glassType) errors.glassType = "Please select a glass type";
  if (!item.hardwareFinish) errors.hardwareFinish = "Please select a hardware finish";

  return errors;
}
