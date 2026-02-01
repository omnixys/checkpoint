// app/security/guests/types.ts

export type GuestStatus = "NOT_ARRIVED" | "CHECKED_IN";
export type Presence = "INSIDE" | "OUTSIDE";

export type SecurityGuestVM = {
  ticketId: string;
  guestId: string;

  name: string;
  seat?: SeatVM;

  status: GuestStatus;
  presence: Presence;

  checkedInAt?: string;
};

export type SeatVM = {
  section?: string;
  table?: string;
  number?: string;
};
