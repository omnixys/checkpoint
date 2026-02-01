import { GatewayGraphQLError } from "@/utils/graphqlHandler.error";
import { Seat } from "./seat.type";

export type GetSeatsByEventResult = {
  seats: Seat[];
  error?: GatewayGraphQLError;
};

export type GetSeatsByEventRequest = {
  eventId: string;
};

export type GetSeatByIdResult = {
  seat: Seat;
  error?: GatewayGraphQLError;
};

export type GetSeatByIdRequest = {
  seatId: string;
};
