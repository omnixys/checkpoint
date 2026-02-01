import { PhoneNumberType } from "./user-enum-type";

export type PhoneNumberInput = {
  type: PhoneNumberType;
  number: string;
  label?: string;
  isPrimary?: boolean;
};

export type UpdateMeInput = {
  firstName: string;
  lastName: string;
  email: string;
};