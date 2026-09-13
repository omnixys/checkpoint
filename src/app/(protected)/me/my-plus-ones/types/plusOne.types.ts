import type {
  PhoneNumberType,
  PlusOneAgeCategory as PlusOneAgeCategoryGenerated,
} from "@/checkpoint/generated/graphql";
import { InvitationStatus } from "@/checkpoint/generated/graphql";

export type PlusOnePhoneNumberType = PhoneNumberType;
export type PlusOneAgeCategory = PlusOneAgeCategoryGenerated;

/**
 * A plus-one is locked once it has been approved (or accepted). Approved
 * plus-ones may only have their existing phone number adjusted; name, email,
 * age category and removal are read-only.
 */
export function isApprovedPlusOneStatus(
  status: InvitationStatus | string | null | undefined,
): boolean {
  return status === InvitationStatus.APPROVED || status === InvitationStatus.ACCEPTED;
}

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
