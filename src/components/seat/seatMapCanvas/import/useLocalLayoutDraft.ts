"use client";
import { useCallback, useState } from "react";
import type { LayoutDocument, MoveOperation } from "../core/document";
import type { ImportOperation } from "./domain";

/** An accepted import makes the entire mixed document local until a document-save exists. */
export function useLocalLayoutDraft(
  eventId: string,
  server: LayoutDocument | null,
  saveMove: (operation: MoveOperation) => Promise<void>,
) {
  const [local, setLocal] = useState<LayoutDocument | null>(null);
  const current = local?.eventId === eventId ? local : null;
  const document = current ?? server;
  const accept = useCallback(
    (operation: ImportOperation) => {
      if (operation.before !== document || operation.after.eventId !== eventId)
        throw new Error("Der Sitzplan hat sich geändert. Import bitte erneut prüfen.");
      setLocal(operation.after);
    },
    [document, eventId],
  );
  const move = useCallback(
    async (operation: MoveOperation) => {
      if (operation.before !== document) return;
      if (current) setLocal(operation.after);
      else await saveMove(operation);
    },
    [current, document, saveMove],
  );
  return { document, isLocal: current !== null, accept, move, discard: () => setLocal(null) };
}
