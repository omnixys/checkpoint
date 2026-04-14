"use client";

import {
  EventFullFragment,
  UserRoleType,
  MyEventsQuery,
  MyEventsDocument,
  EventQuery,
  EventQueryVariables,
  EventDocument,
} from "@/checkpoint/generated/graphql";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { getLogger } from "@/checkpoint/utils/logger";
import { useQuery } from "@apollo/client/react";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/* ---------------------------------------------------------------------
 * Context Type
 * ------------------------------------------------------------------- */
interface ActiveEventContextValue {
  events: EventFullFragment[];
  activeEvent?: EventFullFragment | undefined;
  activeEventId?: string | undefined;
  activeRole?: UserRoleType | undefined;
  loading: boolean;

  selectEvent: (eventId: string) => void;
  clearEvent: () => void;
}

/* ---------------------------------------------------------------------
 * Context
 * ------------------------------------------------------------------- */
const ActiveEventContext = createContext<ActiveEventContextValue | undefined>(undefined);

/* ---------------------------------------------------------------------
 * Storage
 * ------------------------------------------------------------------- */
const STORAGE_KEY = "checkpoint.activeEventId";

/* ---------------------------------------------------------------------
 * Provider
 * ------------------------------------------------------------------- */
export function ActiveEventProvider({ children }: { children: React.ReactNode }) {
  const logger = getLogger("ActiveEventProvider");
  const { isAuthenticated } = useAuth();

  /* -------------------------------------------------
   * State: activeEventId ONLY
   * ------------------------------------------------- */
  const [activeEventId, setActiveEventId] = useState<string | undefined>();

  /* -------------------------------------------------
   * Restore from localStorage (client only)
   * ------------------------------------------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setActiveEventId(stored);
    }
  }, []);

  /* -------------------------------------------------
   * Fetch events
   * ------------------------------------------------- */
  const eventsQuery = useQuery<MyEventsQuery>(MyEventsDocument, {
    skip: !isAuthenticated,
    fetchPolicy: "cache-and-network",
  });

  const events = eventsQuery.data?.myEvents ?? [];

  /* -------------------------------------------------
   * Fetch active event (derived state)
   * ------------------------------------------------- */
  const AdminGetEventQuery = useQuery<EventQuery, EventQueryVariables>(EventDocument, {
    skip: !activeEventId,
    variables: { id: activeEventId ?? "" },
    fetchPolicy: "cache-and-network",
  });

  const activeEvent = AdminGetEventQuery.data?.event ?? undefined;

  /* -------------------------------------------------
   * Select event
   * ------------------------------------------------- */
  const selectEvent = useCallback(
    (eventId: string) => {
      logger.debug("Selecting event:", eventId);

      setActiveEventId(eventId);

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, eventId);
      }
    },
    [logger],
  );

  /* -------------------------------------------------
   * Clear event
   * ------------------------------------------------- */
  const clearEvent = useCallback(() => {
    logger.debug("Clearing active event");

    setActiveEventId(undefined);

    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [logger]);

  /* -------------------------------------------------
   * Reset on logout (CRITICAL)
   * ------------------------------------------------- */
  useEffect(() => {
    if (!isAuthenticated) {
      clearEvent();
    }
  }, [isAuthenticated, clearEvent]);

  /* -------------------------------------------------
   * Auto-select if exactly 1 event
   * ------------------------------------------------- */
useEffect(() => {
  if (!isAuthenticated) return;

  if (events.length === 1 && !activeEventId) {
    const event = events[0];
    if (!event) return;

    selectEvent(event.id);
  }
}, [events, isAuthenticated, activeEventId, selectEvent]);

  /* -------------------------------------------------
   * Derived role
   * ------------------------------------------------- */
  const activeRole = activeEvent?.myRole ?? undefined;

  /* -------------------------------------------------
   * Loading
   * ------------------------------------------------- */
  const loading = eventsQuery.loading || AdminGetEventQuery.loading;

  /* -------------------------------------------------
   * Context value
   * ------------------------------------------------- */
  const value = useMemo<ActiveEventContextValue>(
    () => ({
      events,
      activeEvent,
      activeEventId,
      activeRole,
      loading,
      selectEvent,
      clearEvent,
    }),
    [events, activeEvent, activeEventId, activeRole, loading, selectEvent, clearEvent],
  );

  return <ActiveEventContext.Provider value={value}>{children}</ActiveEventContext.Provider>;
}

/* ---------------------------------------------------------------------
 * Hook
 * ------------------------------------------------------------------- */
export function useActiveEvent(): ActiveEventContextValue {
  const ctx = useContext(ActiveEventContext);

  if (!ctx) {
    throw new Error("useActiveEvent must be used inside ActiveEventProvider");
  }

  return ctx;
}
