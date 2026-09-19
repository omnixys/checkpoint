"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { importLayout, type SourceLayout } from "./core/adapter";
import type { LayoutDocument, LayoutOperation } from "./core/document";
export type PersistLayoutOperation = (operation: LayoutOperation) => Promise<void>;

export function useLayoutDocument(
  eventId: string,
  source: SourceLayout,
  persist: PersistLayoutOperation,
) {
  const imported = useMemo(() => {
    try {
      return { document: importLayout(eventId, source), error: null };
    } catch (error) {
      return {
        document: null,
        error: error instanceof Error ? error.message : "Sitzplan konnte nicht geladen werden.",
      };
    }
  }, [eventId, source]);
  const [local, setLocal] = useState<{ document: LayoutDocument; source: SourceLayout } | null>(
    null,
  );
  const [pending, setPending] = useState(false),
    [error, setError] = useState<string | null>(null);
  const flight = useRef<{ eventId: string } | null>(null),
    activeEvent = useRef(eventId);
  activeEvent.current = eventId;
  const latestSource = useRef(source);
  latestSource.current = source;
  // biome-ignore lint/correctness/useExhaustiveDependencies: Event changes invalidate in-flight work and local state.
  useEffect(() => {
    flight.current = null;
    setLocal(null);
    setPending(false);
    setError(null);
  }, [eventId]);
  useEffect(
    () => () => {
      flight.current = null;
    },
    [],
  );
  // Keep a preview stable while Apollo receives the mutation response; otherwise follow source refreshes.
  const document =
    local?.document.eventId === eventId && (pending || local.source === source)
      ? local.document
      : imported.document;
  const apply = useCallback(
    async (operation: LayoutOperation) => {
      if (
        flight.current ||
        operation.before.eventId !== eventId ||
        operation.before === operation.after
      )
        return;
      if (!operation.after.nodes[operation.nodeId]) return;
      const token = { eventId };
      flight.current = token;
      setPending(true);
      setError(null);
      setLocal({ document: operation.after, source });
      try {
        await persist(operation);
        if (flight.current !== token || activeEvent.current !== eventId) return;
        // Apollo receives the correctly typed moved entity; subsequent query changes can replace the local copy.
        setLocal({ document: operation.after, source: latestSource.current });
      } catch (failure) {
        if (flight.current !== token || activeEvent.current !== eventId) return;
        setLocal({ document: operation.before, source: latestSource.current });
        setError(
          failure instanceof Error
            ? failure.message
            : "Verschieben fehlgeschlagen. Die Bewegung wurde zurückgenommen.",
        );
      } finally {
        if (flight.current === token) {
          flight.current = null;
          setPending(false);
        }
      }
    },
    [eventId, persist, source],
  );
  return {
    document,
    pending,
    error: imported.error ?? error,
    move: apply,
    resize: apply,
    clearError: () => setError(null),
  };
}
