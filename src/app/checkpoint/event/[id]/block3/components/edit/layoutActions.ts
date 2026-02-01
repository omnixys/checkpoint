"use client";
import { gql } from "@apollo/client";

export const MOVE_SEAT = gql`
  mutation MoveSeat($input: MoveSeatInput!) {
    moveSeat(input: $input) {
      id
      x
      y
      rotation
    }
  }
`;

export const MOVE_TABLE = gql`
  mutation MoveTable($input: MoveTableInput!) {
    moveTable(input: $input) {
      id
      x
      y
    }
  }
`;

export const MOVE_SECTION = gql`
  mutation MoveSection($input: MoveSectionInput!) {
    moveSection(input: $input) {
      id
      x
      y
    }
  }
`;

// Versioning
export const SAVE_VERSION = gql`
  mutation SaveVersion($input: SaveLayoutVersionInput!) {
    saveLayoutVersion(input: $input) {
      id
      version
      label
    }
  }
`;

export const UNDO = gql`
  mutation UndoLayout($eventId: String!) {
    undoLayout(eventId: $eventId)
  }
`;

export const REDO = gql`
  mutation RedoLayout($eventId: String!) {
    redoLayout(eventId: $eventId)
  }
`;
