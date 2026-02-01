import { GatewayGraphQLError } from "@/utils/graphqlHandler.error";
import { Ticket } from "./ticket.type";

export type GetTicketsByEventRequest = {
  eventId: string;
};

export type GetTicketsByEventResult = {
  ticketsByEvent: Ticket[];
  error?: GatewayGraphQLError;
};

export type GetMyTicketsResult = {
  getMyTickets: Ticket[];
  error?: GatewayGraphQLError;
};

export type GetTicketByIdRequest = {
  ticketId: string;
};

export type GetTicketByIdResult = {
  ticketById: Ticket;
  error?: GatewayGraphQLError;
};

export type GetTicketById2Request = {
  ticketId: string;
};

export type GetTicketById2Result = {
  ticketById2: Ticket;
  error?: GatewayGraphQLError;
};
