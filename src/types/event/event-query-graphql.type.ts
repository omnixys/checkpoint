import { GatewayGraphQLError } from "@/utils/graphqlHandler.error";
import { Event } from "./event.type";

export type MyEventsResult = {
  myEvents: Event[];
  error?: GatewayGraphQLError;
};

export type EventByIdResult = {
  event: Event;
  error?: GatewayGraphQLError;
};

export type EventById2Result = {
  event2: Event;
  error?: GatewayGraphQLError;
};

export type EventByIdRequest = {
  eventId: string;
};

export type GetMyGuestIdsResult = {
  myGuests: string[];
  error?: GatewayGraphQLError;
};

export type GetMyGuestIdsRequest = {
  eventId: string;
};
