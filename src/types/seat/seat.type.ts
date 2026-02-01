export type Seat = {
  id: string;
  status: string;
  eventId: string;
  sectionId: string;
  tableId?: string;
  number?: number;
  label?: string;
  note?: string;
  x?: number;
  y?: number;
  rotation?: number;
  seatType?: string;
  guestId?: string;
  invitationId?: string;
  meta?: any;
  createdAt: Date;
  updatedAt: Date;

  section: Section;
  table: Table;
}

export type Section = {
  id: string;
  eventId: string;
  name: string;
  order: number;
  capacity?: number;
  meta: any;
  x: number;
  y: number;
  createdAt: Date;
  updatedAt: Date;

  Tables: Table[];
  seats: Seat[]
}

export type Table = {
  id: string;
  eventId: string;
  sectionId: string;
  name: string;
  order: number;
  capacity?: number;
  meta: any;
  x: number;
  y: number;
  createdAt: Date;
  updatedAt: Date;

  section: Section;
  seats: Seat[];
};


export type SeatStatus = "free" | "taken" | "reserved" | "blocked";

export interface SeatFilter {
  search: string;
  status: "all" | SeatStatus;
}


export type RenamePayload = {
  success: boolean;
  affectedSeats: number;
}

export type BulkRenamePayload = {
  success: boolean;
  affectedSeats: number;
  conflicts: RenameConflict[];
};

export type RenameConflict = {
  type: string; // SECTION | TABLE
  name: string;
  id: string
};

export type SeatFilterStatus = "all" | SeatStatus;