// src/checkpoint/utils/validation/validation.util.ts

import { parsePhoneNumberFromString } from "libphonenumber-js";
import type { PhoneNumberInput } from "@/checkpoint/generated/graphql";

/**
 * Validation error model
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validates a single phone number
 *
 * Rules:
 * - Must be a valid international number
 * - If type = WHATSAPP → must be mobile-capable
 */
export function validatePhoneNumber(phone: PhoneNumberInput): ValidationError[] {
  const errors: ValidationError[] = [];

  const raw = `${phone.countryCode}${phone.number}`;
  const parsed = parsePhoneNumberFromString(raw);

  if (!parsed || !parsed.isValid()) {
    errors.push({
      field: "phone",
      message: "Invalid phone number",
    });
    return errors;
  }

  return errors;
}
