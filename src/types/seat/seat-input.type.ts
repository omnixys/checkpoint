import { ShapeType } from "./seat-enum.type";

export type CreateSeatInput = {
  eventId: string;
  section?: string;
  table?: string;
  number?: number;
  note?: string;
}

export type BulkImportSeatsInput = {
  eventId: string;
  seats: CreateSeatInput[];
}

export type GuestEventSeatInput = {
  guestId: string;
  eventId: string;
}

export type AssignSeatsInput = {
  guestId?: string;
  seatId: string;
  note?: string;
  eventId: string;
};

export type AssignSeatInput = {
  guestId?: string;
  seatId: string;
  note?: string;
  invitationId?: string
};


export type SimpleSeatingConfigInput = {
  sections: number;
  tables: number;
  seats?: number; // optional → auto distribute if missing
}

export type  CustomSectionConfigInput = {
  name: string;
  tables: number;
}

export type  CustomTableConfigInput = {
  name: string;
  seats?: number; // optional, defaults to auto-calculated
}

export type SeatingConfigInput = {
  simple: SimpleSeatingConfigInput;
  sections: CustomSectionConfigInput[];
  tables: CustomTableConfigInput[];
  form: ShapeType;
}

export type RenameSectionInput = {
  sectionId: string;
  newName: string;
}

export type RenameTableInput = {
  tableId: string;
  newName: string;
};