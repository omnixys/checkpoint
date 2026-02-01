import { gql } from "@apollo/client";

export const ASSIGN_SEAT = gql`
  mutation AssignSeat($input: AssignSeatInput!) {
    assignSeat(input: $input) {
      id
      eventId
      number
      note
      guestId
      section {
        name
      }
      table {
        name
      }
    }
  }
`;


export const RENAME_SECTION = gql`
  mutation renameSection($input: RenameSectionInput!) {
    renameSection(input: $input) {
      success
      affectedSeats
    }
  }
`;

export const RENAME_TABLE = gql`
  mutation renameTable($input: RenameTableInput!) {
    renameTable(input: $input) {
      success
      affectedSeats
    }
  }
`;

export const BULK_RENAME_SECTIONS = gql`
  mutation BulkRenameSections($input: [RenameSectionInput!]!) {
    bulkRenameSections(inputs: $input) {
      success
      affectedSections
      affectedSeats
      conflicts {
        type
        id
        name
      }
    }
  }
`;

export const BULK_RENAME_TABLES = gql`
  mutation BulkRenameTables($input: [RenameTableInput!]!) {
    bulkRenameTables(inputs: $input) {
      success
      affectedTables
      affectedSeats
      conflicts {
        type
        id
        name
      }
    }
  }
`;