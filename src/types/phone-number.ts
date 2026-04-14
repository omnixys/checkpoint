/**
 * Runtime-safe representation of PhoneNumberType.
 *
 * Why:
 * - GraphQL Codegen with enumsAsTypes removes runtime enums
 * - We need a constant for iteration in UI
 * - This ensures strict typing AND runtime availability
 */
export const PHONE_NUMBER_TYPES = [
  "HOME",
  "MOBILE",
  "OTHER",
  "PRIVATE",
  "WHATSAPP",
  "WORK",
] as const;

export type PhoneNumberTypeConst = (typeof PHONE_NUMBER_TYPES)[number];
