/* ------------------------------------------------------------------
 * Mock statistics for event stats page
 * Replace with API data later
 * ---------------------------------------------------------------- */

export type GuestEventStats = {
  invited: number;
  confirmed: number;
  declined: number;
  checkedIn: number;
};

export type AdminEventStats = GuestEventStats & {
  currentlyInside: number;
  peakInside: number;
  avgStayMinutes: number;
  scansToday: number;
};

export const guestStatsMock: GuestEventStats | null = {
  invited: 250,
  confirmed: 198,
  declined: 22,
  checkedIn: 143,
};

export const adminStatsMock: AdminEventStats | null = {
  invited: 250,
  confirmed: 198,
  declined: 22,
  checkedIn: 143,
  currentlyInside: 96,
  peakInside: 132,
  avgStayMinutes: 87,
  scansToday: 421,
};
