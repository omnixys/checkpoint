import { EventInvitationQuery, SeatsQuery } from "@/checkpoint/generated/graphql";

export type SeatStatus = "free" | "taken" | "reserved" | "blocked";

export interface SeatFilter {
  search: string;
  status: "all" | SeatStatus;
}

export type RenameConflict = {
  type: string; // SECTION | TABLE
  name: string;
  id: string;
};

export type SeatFilterStatus = "all" | SeatStatus;

export interface Seat {
  id: string;
  status: string;
  eventId: string;
  number: number;
  label: string;
  note: string;

  section: {
    name: string;
    id: string;
  };

  table: {
    name: string;
    id: string;
  };
}

export type QuerySeat = NonNullable<SeatsQuery["seats"]>[number];
export type QueryInvitation = NonNullable<
  EventInvitationQuery["eventInvitation"]
>[number];
