import {
  AssignSeatInput,
  AssignSeatsInput,
  GuestEventSeatInput,
  RenameSectionInput,
  RenameTableInput,
} from "../../seat/seat-input.type";
import { BulkRenamePayload, RenamePayload, Seat } from "./seat.type";

export type AssignSeatsResult = {
  assignSeat: string;
};

export type AssignSeatsRequest = {
  input: AssignSeatsInput;
};

export type GetGuestEventSeatResult = {
  getSeatByGuestAndEvent: Seat;
};

export type GetGuestEventSeatRequest = {
  input: GuestEventSeatInput;
};

export type AssignSeatResult = {
  assignSeat: string;
};

export type AssignSeatRequest = {
  input: AssignSeatInput;
};

export type RenameSectionResult = {
  renameSection: RenamePayload;
};

export type RenameSectionRequest = {
  input: RenameSectionInput;
};

export type RenameTableResult = {
  renameTable: RenamePayload;
};

export type RenameTableRequest = {
  input: RenameTableInput;
};

export type BulkRenameSectionsResult = {
  bulkRenameSections: BulkRenamePayload;
};

export type BulkRenameSectionsRequest = {
  input: RenameSectionInput[];
};

export type BulkRenameTablesResult = {
  bulkRenameTables: BulkRenamePayload;
};

export type BulkRenameTablesRequest = {
  input: RenameTableInput[];
};
