import { GatewayGraphQLError } from "@/utils/graphqlHandler.error";
import { CreateEventInput } from "./event-input.type";
import { Event } from "./event.type";

export type CreateEventResult = {
  createEvent: Event;
  error?: GatewayGraphQLError;
};

export type CreateEventRequest = {
  input: CreateEventInput;
};
