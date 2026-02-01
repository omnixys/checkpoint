import { PresenceState, ScanVerdict } from "./ticket-enum.type";

export type Ticket = {
  id: string;
  eventId: string;
  invitationId: string;
  seatId: string;
  guestProfileId: string;
  deviceHash: string;
  devicePublicKey: string;
  deviceActivationAt: string;
  deviceActivationIP: string;
  lastNonce: number;
  nextNonce: number;
  rotationSeconds: number;
  lastRotatedAt: string;
  currentState: PresenceState;
  checkedInAt: string;
  revoked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type EventToken = {
  token: string;
  exp: number;
  jti: string;
};


export type VerifyPayload = {
    ticket: Ticket;
  payload: TicketTokenPayload;
  verdict: ScanVerdict;
  valid: boolean;
  expectedNonce: number;
  receivedNonce: number;
  deviceMatched: boolean;
}

export type TicketTokenPayload = {
  tid: string; 
  eid: string;
  gid?: string;
  sid?: string;
  dn: number;
  ts: number;
  dh?: string;
}