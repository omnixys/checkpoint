import {
  EventInvitationQuery,
  SeatListQuery,
  SeatsQuery,
} from "@/checkpoint/generated/graphql";

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

// TODO name optimieren
export type SeatListType = NonNullable<SeatListQuery["seats"]>[number];
export type QueryInvitation = NonNullable<
  EventInvitationQuery["eventInvitation"]
>[number];

