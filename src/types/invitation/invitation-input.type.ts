import { PhoneNumberInput } from "../../user/user-input.type";
import { RsvpChoice } from "./invitation-enum.type";

export type ApproveInput = {
  id: string;
  approve: boolean;
};

export type InvitationUpdateInput = {
  rsvpChoice?: RsvpChoice;
  approved?: boolean;
  maxInvitees?: number;
  invitedByInvitationId?: string;
  guestProfileId?: string;
};

export type InvitationCreateInput = {
  eventId: string;
  maxInvitees: number;
  invitedByInvitationId?: string;
  firstName: string;
  lastName: string;
  phoneNumbers?: PhoneNumberInput[];
};

export type ImportInvitationInput = {
  eventId: string;
  uploadId: string | null;
  uploadType: string | null;
};

export type AcceptRSVPInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumbers?: PhoneNumberInput[];
};

export type RSVPInput = {
  invitationId: string;
  choice: RsvpChoice;
  replyInput?: AcceptRSVPInput;
};

export type ApproveInvitationInput = {
  invitationId: string;
  approved: boolean;
};
