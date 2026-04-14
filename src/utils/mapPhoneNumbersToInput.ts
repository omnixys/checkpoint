import { PhoneNumberPayload, PhoneNumberInput } from "@/checkpoint/generated/graphql";

export function mapPhoneNumbersToInput(
  phoneNumbers?: PhoneNumberPayload[],
): PhoneNumberInput[] | null {
  if (!phoneNumbers || phoneNumbers.length === 0) {
    return null;
  }

  return phoneNumbers.map((p) => ({
    /**
     * ONLY allowed fields for PhoneNumberInput
     */
    type: p.type,
    countryCode: normalizeCountryCode(p.countryCode),
    number: p.number,
    label: p.label ?? null,
    isPrimary: p.isPrimary ?? true,
  }));
}

/**
 * Ensure backend-safe countryCode format
 * "+49" → "49"
 */
function normalizeCountryCode(code?: string) {
  if (!code) return "49";

  return code.startsWith("+") ? code.slice(1) : code;
}
