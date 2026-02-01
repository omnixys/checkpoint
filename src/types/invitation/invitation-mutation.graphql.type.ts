import { ApproveInvitationInput, ImportInvitationInput, InvitationCreateInput, RSVPInput } from "./invitation-input.type";
import { InvitationImportPayload } from "./invitation-payload.type";
import { Invitation } from "./invitation.type";

export type CreateInvitationResult = {
  createInvitation: Invitation;
};

export type CreateInvitationRequest = {
  input: InvitationCreateInput;
};

export type ApproveResult = {
  approveInvitation: Invitation;
};
export type ApproveRequest = {
  input: ApproveInvitationInput;
};

export type ImportInvitationResult = {
  importInvitations: InvitationImportPayload;
};

export type ImportInvitationRequest = {
  input: ImportInvitationInput;
};

export type ReplyInvitationRequest = {
  input: RSVPInput;
};

export type ReplyInvitationResult = {
  replyInvitation: Invitation;
};

/* ---------------------------------------------
 * BULK APPROVE + TICKET
 * ------------------------------------------- */
export type BulkApproveWithTicketRequest = {
  input: {
    invitationIds: string[];
    seatStrategy: "AUTO" | "MANUAL" | "NONE";
  };
};

export type BulkApproveWithTicketResult = {
  bulkApproveInvitationsAndCreateTickets: {
    total: number;
    approved: number;
    ticketsCreated: number;
  };
};