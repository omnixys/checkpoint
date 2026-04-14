// src/checkpoint/constants/phone-number.constants.ts

import { PhoneNumberInput } from "@/checkpoint/generated/graphql";

/**
 * Runtime-safe list of supported phone number types.
 *
 * IMPORTANT:
 * - This list is REQUIRED because `enumsAsTypes: true` removes runtime enums
 * - Type is derived from GraphQL → ensures compile-time safety
 * - If backend enum changes, TypeScript will fail here immediately
 */
export const PHONE_NUMBER_TYPES: PhoneNumberInput["type"][] = [
  "MOBILE",
  "HOME",
  "WORK",
  "WHATSAPP",
];

/**
 * Default phone type used across the application.
 */
export const DEFAULT_PHONE_TYPE: PhoneNumberInput["type"] = "WHATSAPP";
