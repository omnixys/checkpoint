import { GatewayGraphQLError } from "@/utils/graphqlHandler.error";
import {
  ActivateDeviceInput,
  CreateTicketInput,
  GenerateTokenInput,
  VerifyTokenInput,
} from "./ticket-input.type";
import { Ticket, VerifyPayload } from "./ticket.type";

export type CreateTicketResult = {
  createTicket: Ticket;
  error?: GatewayGraphQLError;
};

export type CreateTicketRequest = {
  input: CreateTicketInput;
};

export type CreateTokenResult = {
  generateToken: string;
  error?: GatewayGraphQLError;
};

export type CreateTokenRequest = {
  input: GenerateTokenInput;
};

export type ScanTicketResult = {
  verifyToken: VerifyPayload;
  error?: GatewayGraphQLError;
};

export type ScanTicketRequest = {
  input: VerifyTokenInput;
};

export type ActivateDeviceResult = {
  activateDevice: Ticket;
  error?: GatewayGraphQLError;
};

export type ActivateDeviceRequest = {
  input: ActivateDeviceInput;
};
