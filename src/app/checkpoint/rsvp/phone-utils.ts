// phone.utils.ts
import {
  CountryCode,
  parsePhoneNumberFromString,
  getCountryCallingCode,
} from "libphonenumber-js";

/* -------------------------------------------------------
 * Types
 * ----------------------------------------------------- */

export type CountryItem = {
  code: CountryCode;
  label: string;
  callingCode: string;
  flag: string; // emoji fallback
};

/* -------------------------------------------------------
 * Country list (ISO-3166, auto-generated via libphonenumber)
 * ----------------------------------------------------- */

const COUNTRY_NAMES: Partial<Record<CountryCode, string>> = {
  DE: "Germany",
  US: "United States",
  FR: "France",
  GB: "United Kingdom",
  IT: "Italy",
  ES: "Spain",
  NL: "Netherlands",
  BE: "Belgium",
  AT: "Austria",
  CH: "Switzerland",
  PL: "Poland",
  CZ: "Czech Republic",
  SK: "Slovakia",
  HU: "Hungary",
  RO: "Romania",
  BG: "Bulgaria",
  GR: "Greece",
  PT: "Portugal",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  IE: "Ireland",
  IS: "Iceland",
  CA: "Canada",
  AU: "Australia",
  NZ: "New Zealand",
  JP: "Japan",
  CN: "China",
  KR: "South Korea",
  IN: "India",
  BR: "Brazil",
  AR: "Argentina",
  MX: "Mexico",
  ZA: "South Africa",
  NG: "Nigeria",
  EG: "Egypt",
  TR: "Turkey",
  SA: "Saudi Arabia",
  AE: "United Arab Emirates",
};

/* -------------------------------------------------------
 * Helper: ISO → Flag Emoji
 * ----------------------------------------------------- */

function isoToFlag(code: CountryCode): string {
  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split("")
      .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

/* -------------------------------------------------------
 * Exported country list
 * ----------------------------------------------------- */

export const COUNTRIES: CountryItem[] = (
  Object.keys(COUNTRY_NAMES) as CountryCode[]
).map((code) => ({
  code,
  label: COUNTRY_NAMES[code] ?? code,
  callingCode: `+${getCountryCallingCode(code)}`,
  flag: isoToFlag(code),
}));


/* -------------------------------------------------------
 * Phone normalization
 * ----------------------------------------------------- */

export function normalizeNationalPhone(
  input: string,
  defaultCountry?: CountryCode
): string | null {
  const phone = parsePhoneNumberFromString(input, {
    defaultCountry,
    extract: true,
  });

  if (!phone || !phone.isValid()) {
    return null;
  }

  return phone.nationalNumber;
}

export function buildInternationalPhone(
  country: CountryCode,
  nationalNumber: string
): string {
  return `+${getCountryCallingCode(country)}${nationalNumber}`;
}
