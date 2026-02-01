import { EventRole } from "@/types/event/event-enum.type";
import { PhoneNumberType } from "./user-enum-type";

export type User = {
  id: string;
  username: string;
  phoneNumbers?: PhoneNumber[];
  ticketIds: string[];
  invitationIds?: string[];
  createdAt: Date;
  updatedAt: Date;
  roles: EventRole[];
  personalInfo: PersonalInfo;
};

export type PersonalInfo = {
  firstName: string;
  lastName: string;
  email: string;
};

export type PhoneNumber = {
  id: string;
  number: string;
  type?: PhoneNumberType;
  isPrimary?: boolean;
};
