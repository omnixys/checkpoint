"use client";

import {
  EventFullFragment,
  GetActiveEventQuery,
  GetEventMetaQuery,
  MyEventsQuery,
  UserRoleType,
} from "@/checkpoint/generated/graphql";
import useEventQuery from "@/checkpoint/hooks/events/useEventQuery";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { getLogger } from "@/checkpoint/utils/logger";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/* ---------------------------------------------------------------------
 * Context Type
 * ------------------------------------------------------------------- */
interface ActiveEventContextValue {
  myEventList: MyEventsQuery['myEvents'];
  activeEvent?: GetActiveEventQuery['event'] | undefined;
  activeEventId?: string | undefined;
  activeRole?: UserRoleType | undefined;
  loading: boolean;

  selectEvent: (eventId: string) => void;
  clearEvent: () => void;
}

/* ---------------------------------------------------------------------
 * Context
 * ------------------------------------------------------------------- */
const ActiveEventContext = createContext<ActiveEventContextValue | undefined>(
  undefined,
);

/* ---------------------------------------------------------------------
 * Storage
 * ------------------------------------------------------------------- */
const STORAGE_KEY = "checkpoint.activeEventId";

/* ---------------------------------------------------------------------
 * Provider
 * ------------------------------------------------------------------- */
export function ActiveEventProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const { myEventList, activeEvent, myEventListLoading, activeEventLoading } =
    useEventQuery({
      eventId: activeEventId,
      loadActiveEvent: !activeEventId ? false : true,
      loadMyEventList: !activeEventId ? true : false,
      isAuthenticated,
    });

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

    if (myEventList?.length === 1 && !activeEventId) {
      const event = myEventList[0];
      if (!event) return;

      selectEvent(event.id);
    }
  }, [myEventList, isAuthenticated, activeEventId, selectEvent]);

  /* -------------------------------------------------
   * Derived role
   * ------------------------------------------------- */
  const activeRole = activeEvent?.myRole ?? undefined;

  /* -------------------------------------------------
   * Loading
   * ------------------------------------------------- */
  const loading = myEventListLoading || activeEventLoading;


  
  /* -------------------------------------------------
   * Context value
   * ------------------------------------------------- */
  const value = useMemo<ActiveEventContextValue>(
    () => ({
      myEventList: myEventList ?? [],
      activeEvent,
      activeEventId,
      activeRole,
      loading,
      selectEvent,
      clearEvent,
    }),
    [
      myEventList,
      activeEvent,
      activeEventId,
      activeRole,
      loading,
      selectEvent,
      clearEvent,
    ],
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

  if (!ctx) {
    throw new Error("useActiveEvent must be used inside ActiveEventProvider");
  }

  return ctx;
}
