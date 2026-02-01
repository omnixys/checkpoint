import { PhoneNumberType } from "../../user/user-enum-type";

export interface SignUpStep1 {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export interface SignUpStep2Item {
  type: PhoneNumberType;
  number: string;
  isPrimary: boolean;
}

export interface SignUpStep3 {
  password: string;
  passwordConfirm: string;
}

export type AuthToken = {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
  idToken: string;
  scope: string;
};
