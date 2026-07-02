export type PlusOnePhoneNumberType = "WHATSAPP" | "MOBILE" | "PRIVATE" | "WORK" | "HOME" | "OTHER";
export type PlusOneAgeCategory = "OVER_SIX" | "UNDER_SIX";

export type PlusOnePhoneNumberInput = {
  countryCode: string;
  number: string;
  type: PlusOnePhoneNumberType;
  label: string;
  isPrimary: boolean;
};

export type PlusOneSeat = {
  id: string;
  label?: string | null;
};

export type PlusOneItem = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phoneNumber?: string | null;
  phoneNumbers: PlusOnePhoneNumberInput[];
  plusOneAgeCategory?: PlusOneAgeCategory | null;
  status?: string | null;
  seat?: PlusOneSeat | null;
};

export type CreatePlusOneInput = {
  firstName: string;
  lastName: string;
  email?: string;
  plusOneAgeCategory: PlusOneAgeCategory;
  phoneNumbers: PlusOnePhoneNumberInput[];
};

export type UpdatePlusOneInput = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  plusOneAgeCategory: PlusOneAgeCategory;
  phoneNumbers: PlusOnePhoneNumberInput[];
};
