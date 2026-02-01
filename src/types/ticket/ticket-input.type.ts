import { PresenceState } from "./ticket-enum.type";

export type ActivateDeviceInput = {
  ticketId: string;
  deviceHash: string;
  devicePublicKey: string;
  ip: string;
};

export type UpdateTicketInput = {
  id: string;
  revoked?: boolean;
  deviceBoundKey?: string;
  currentState?: PresenceState;
  seatId?: string;
}

export type CreateTicketInput = {
  eventId: string;
  invitationId: string;
  seatId?: string;
  guestProfileId: string;
}

export type VerifyTokenInput = {
  token: string;
};

export type RotateNonceInput = { ticketId: string; nextNonce: number };

export type GenerateTokenInput = {
  ticketId: string;
  deviceHash: string;
};


