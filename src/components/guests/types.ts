// app/security/guests/types.ts

import type { GetFullSeatInfoQuery } from "@/checkpoint/generated/graphql";
import type { StripMeta } from "@/checkpoint/types/core/core.type";

export type GuestStatus = "NOT_ARRIVED" | "CHECKED_IN";
export type Presence = "INSIDE" | "OUTSIDE";
export type Filter = "ALL" | GuestStatus | Presence;

export interface GuestDTO {
  ticketId: string;
  guestId: string;

  name: string;

  seat?: fullSeatInfo | undefined;

  status: GuestStatus;
  presence: Presence;

  checkedInAt?: string;
}

export type fullSeatInfo = StripMeta<GetFullSeatInfoQuery["seat"]>;
