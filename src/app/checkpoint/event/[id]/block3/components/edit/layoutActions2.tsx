"use client";

import { useMutation } from "@apollo/client/react";
import { createContext, useContext } from "react";
import { MOVE_SEAT, MOVE_TABLE, MOVE_SECTION, UNDO, REDO, SAVE_VERSION } from "./layoutActions";

export const LayoutActionsContext = createContext(null);

export function LayoutActionsProvider({ children }) {
  const [moveSeatMutation] = useMutation(MOVE_SEAT);
  const [moveTableMutation] = useMutation(MOVE_TABLE);
  const [moveSectionMutation] = useMutation(MOVE_SECTION);

  const [undoMutation] = useMutation(UNDO);
  const [redoMutation] = useMutation(REDO);
  const [saveVersionMutation] = useMutation(SAVE_VERSION);

  const actions = {
    moveSeat: (id, x, y, rotation) =>
      moveSeatMutation({ variables: { input: { id, x, y, rotation } } }),

    moveTable: (id, x, y) =>
      moveTableMutation({ variables: { input: { id, x, y } } }),

    moveSection: (id, x, y) =>
      moveSectionMutation({ variables: { input: { id, x, y } } }),

    undo: (eventId) => undoMutation({ variables: { eventId } }),

    redo: (eventId) => redoMutation({ variables: { eventId } }),

    saveVersion: (eventId, label = null) =>
      saveVersionMutation({
        variables: { input: { eventId, version: Date.now(), label } },
      }),
  };

  return (
    <LayoutActionsContext.Provider value={actions}>
      {children}
    </LayoutActionsContext.Provider>
  );
}

export function useLayoutActions() {
  return useContext(LayoutActionsContext);
}
