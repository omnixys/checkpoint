import { PhoneNumberInput } from "../../user/user-input.type";

export type UserSignUpInput = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumbers?: PhoneNumberInput[];
};

export type GuestSignUpInput = {
  eventId: string;
  invitationId: string;
  seatId: string;
  guestProfileId: string;
};

export type LoginInput = {
  username: string;
  password: string;
};

export type ChangeMyPasswordInput = {
  oldPassword: string;
  newPassword: string;
};

export type UpdateMyProfileInput = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
};
