"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useQuery } from "@apollo/client/react";

import {
  EVENT_BY_ID,
  MY_EVENTS,
} from "@/graphql/event/event-query.graphql";
import { EventRole } from "@/types/event/event-enum.type";
import {
  EventByIdRequest,
  EventByIdResult,
  MyEventsResult,
} from "@/types/event/event-query-graphql.type";
import { Event } from "@/types/event/event.type";
import { getLogger } from "@/utils/logger";
import { useAuth } from "./AuthProvider";

/* ---------------------------------------------------------------------
 * Context Type
 * ------------------------------------------------------------------- */
interface ActiveEventContextValue {
  events: Event[];
  activeEvent?: Event;
  activeEventId?: string;
  activeRole?: EventRole;
  loading: boolean;

  selectEvent: (eventId: string) => Promise<void>;
  clearEvent: () => void;
}

/* ---------------------------------------------------------------------
 * Create Context
 * ------------------------------------------------------------------- */
const ActiveEventContext = createContext<ActiveEventContextValue | undefined>(
  undefined
);

/* ---------------------------------------------------------------------
 * Persistent Storage Key
 * ------------------------------------------------------------------- */
const STORAGE_KEY = "checkpoint.activeEventId";

/* ---------------------------------------------------------------------
 * Provider Component
 * ------------------------------------------------------------------- */
export function ActiveEventProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const logger = getLogger("ActiveEventProvider");

  const { isAuthenticated } = useAuth();

  /* -------------------------------------------------
   * RESTORE SAVED activeEventId ON INITIAL LOAD
   * ------------------------------------------------- */
  const [activeEventId, setActiveEventId] = useState<string | undefined>(() => {
    if (typeof window === "undefined") return undefined;
    return localStorage.getItem(STORAGE_KEY) ?? undefined;
  });

  const [activeEvent, setActiveEvent] = useState<Event | undefined>(undefined);

  /* -------------------------------------------------
   * Load list of Events (myEvents)
   * ------------------------------------------------- */
  const {
    data: eventsData,
    loading: eventsLoading,
    refetch: refetchMyEvents,
  } = useQuery<MyEventsResult>(MY_EVENTS, {
    skip: !isAuthenticated,
    fetchPolicy: "network-only",
  });

  const events: Event[] = eventsData?.myEvents ?? [];

  /* -------------------------------------------------
   * Load selected event's full details
   * ------------------------------------------------- */
  const {
    data: eventByIdData,
    loading: eventByIdLoading,
    refetch: refetchEventById,
  } = useQuery<EventByIdResult, EventByIdRequest>(EVENT_BY_ID, {
    skip: !activeEventId,
    variables: { eventId: activeEventId! },
    fetchPolicy: "network-only",
  });

  /* -------------------------------------------------
   * When event details loaded → update activeEvent
   * ------------------------------------------------- */
  useEffect(() => {
    if (eventByIdData?.event) {
      setActiveEvent(eventByIdData.event);
    }
  }, [eventByIdData]);

  /* -------------------------------------------------
   * Persist activeEventId
   * ------------------------------------------------- */
  const selectEvent = useCallback(
    async (eventId: string) => {
      logger.debug("Selecting event:", eventId);

      localStorage.setItem(STORAGE_KEY, eventId);
      setActiveEventId(eventId);

      await refetchEventById({ eventId });
    },
    [refetchEventById]
  );

  const clearEvent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setActiveEventId(undefined);
    setActiveEvent(undefined);
  }, []);

  /* -------------------------------------------------
   * Auto-select if only one event exists
   * ------------------------------------------------- */
  useEffect(() => {
    if (!isAuthenticated) {
      clearEvent();
      return;
    }

    // Only auto-select if user has exactly 1 event AND none chosen yet
    if (events.length === 1 && !activeEventId) {
      void selectEvent(events[0].id);
    }
  }, [events, isAuthenticated, activeEventId, selectEvent, clearEvent]);

  /* -------------------------------------------------
   * Active Role
   * ------------------------------------------------- */
  const activeRole = activeEvent?.myRole ?? undefined;

  /* -------------------------------------------------
   * Combined Loading State
   * ------------------------------------------------- */
  const loading = eventsLoading || eventByIdLoading;

  /* -------------------------------------------------
   * Context Value
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
    [
      events,
      activeEvent,
      activeEventId,
      activeRole,
      loading,
      selectEvent,
      clearEvent,
    ]
  );

  return (
    <ActiveEventContext.Provider value={value}>
      {children}
    </ActiveEventContext.Provider>
  );
}

/* ---------------------------------------------------------------------
 * Hook
 * ------------------------------------------------------------------- */
export function useActiveEvent(): ActiveEventContextValue {
  const ctx = useContext(ActiveEventContext);
  if (!ctx)
    throw new Error("useActiveEvent must be used inside ActiveEventProvider");
  return ctx;
}
