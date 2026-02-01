import { InvitationStatus, RsvpChoice } from "./invitation-enum.type";
import { PhoneNumber } from '../user/user.type';

export type Invitation = {
  id: string;
  firstName?: string;
  lastName?: string;
  guestProfileId?: string;

  eventId: string;
  status: InvitationStatus;
  maxInvitees: number;
  pendingContactId?: string;

  rsvpChoice?: RsvpChoice;
  rsvpAt?: string;

  approved?: boolean;
  approvedByUserId?: string;
  approvedAt?: string;

  invitedByInvitationId?: string;
  invitedByUserId?: string;
  plusOnes?: Invitation[];

  phoneNumber: string;

  createdAt: string;
  updatedAt: string;
};
