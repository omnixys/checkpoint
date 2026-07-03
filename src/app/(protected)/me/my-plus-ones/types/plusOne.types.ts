export type PlusOnePhoneNumberType = "WHATSAPP" | "MOBILE" | "PRIVATE" | "WORK" | "HOME" | "OTHER";
export type PlusOneAgeCategory = "OVER_SIX" | "UNDER_SIX";

export interface PlusOnePhoneNumberInput {
  countryCode: string;
  number: string;
  type: PlusOnePhoneNumberType;
  label: string | null;
  isPrimary: boolean;
}

export interface PlusOneSeat {
  id: string;
  label?: string | null;
}

export interface PlusOneItem {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phoneNumber?: string | null;
  phoneNumbers: PlusOnePhoneNumberInput[];
  plusOneAgeCategory?: PlusOneAgeCategory | null;
  status?: string | null;
  seat?: PlusOneSeat | null;
}

export interface CreatePlusOneInput {
  firstName: string;
  lastName: string;
  email?: string;
  plusOneAgeCategory: PlusOneAgeCategory;
  phoneNumbers: PlusOnePhoneNumberInput[];
}

export interface UpdatePlusOneInput {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  plusOneAgeCategory: PlusOneAgeCategory;
  phoneNumbers: PlusOnePhoneNumberInput[];
}
