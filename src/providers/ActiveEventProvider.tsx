"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import type React from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { GetActiveEventQuery, MyEventsQuery } from "@/checkpoint/generated/graphql";
import { UserRoleType } from "@/checkpoint/generated/graphql";
import useEventQuery from "@/checkpoint/hooks/events/useEventQuery";
import {
  type EventPermissionKey,
  permissionsForLegacyRole,
  uniquePermissions,
} from "@/checkpoint/lib/rbac/event-permissions";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import {
  clearActiveEventCookie,
  writeActiveEventCookie,
} from "@/checkpoint/providers/active-event-cookie";
import { getLogger } from "@/checkpoint/utils/logger";

/* ---------------------------------------------------------------------
 * Context Type
 * ------------------------------------------------------------------- */
interface ActiveEventContextValue {
  myEventList: MyEventsQuery["myEvents"];
  activeEvent?: GetActiveEventQuery["event"] | undefined;
  activeEventId?: string | undefined;
  activeRole?: UserRoleType | undefined;
  myRoles: Array<{
    id: string;
    key: string;
    name: string;
    color?: string | null;
    icon?: string | null;
    systemKey?: string | null;
  }>;
  myPermissions: EventPermissionKey[];
  can: (permission: EventPermissionKey) => boolean;
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

const MY_EVENT_ACCESS_QUERY = gql`
  query MyEventAccess($eventId: ID!) {
    myEventAccess(eventId: $eventId) {
      eventId
      userId
      permissions
      roles {
        id
        key
        name
        color
        icon
        systemKey
      }
    }
  }
`;

type EventWithAccess = NonNullable<GetActiveEventQuery["event"]> & {
  myAccess?: {
    roles?: ActiveEventContextValue["myRoles"] | null;
    permissions?: string[] | null;
  } | null;
};

interface MyEventAccessQueryData {
  myEventAccess: {
    roles: ActiveEventContextValue["myRoles"];
    permissions: string[];
  };
}

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
    if (typeof window === "undefined") {
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setActiveEventId(stored);
      writeActiveEventCookie(stored);
    }
  }, []);

  const { myEventList, activeEvent, myEventListLoading, activeEventLoading } = useEventQuery({
    eventId: activeEventId,
    loadActiveEvent: !!activeEventId,
    loadMyEventList: true,
    isAuthenticated,
  });
  const { data: accessData, loading: activeAccessLoading } = useQuery<MyEventAccessQueryData>(
    MY_EVENT_ACCESS_QUERY,
    {
      variables: { eventId: activeEventId ?? "" },
      skip: !activeEventId || !isAuthenticated,
    },
  );

  /* -------------------------------------------------
   * Select event
   * ------------------------------------------------- */
  const selectEvent = useCallback(
    (eventId: string) => {
      logger.debug("Selecting event:", eventId);

      setActiveEventId(eventId);

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, eventId);
        writeActiveEventCookie(eventId);
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
      clearActiveEventCookie();
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
    if (!isAuthenticated) {
      return;
    }

    if (myEventList?.length === 1 && !activeEventId) {
      const event = myEventList[0];
      if (!event) {
        return;
      }

      selectEvent(event.id);
    }
  }, [myEventList, isAuthenticated, activeEventId, selectEvent]);

  /* -------------------------------------------------
   * Derived access and role
   * ------------------------------------------------- */
  const activeEventWithAccess = activeEvent as EventWithAccess | undefined;
  const myRoles = useMemo(
    () => accessData?.myEventAccess.roles ?? activeEventWithAccess?.myAccess?.roles ?? [],
    [accessData, activeEventWithAccess],
  );
  const activeRole = useMemo(() => {
    if (activeEvent?.myRole) {
      return activeEvent.myRole;
    }

    const roleKeys = new Set(myRoles.map((role) => role.key));
    const highestPriorityRole = [
      UserRoleType.ADMIN,
      UserRoleType.SECURITY,
      UserRoleType.SUPPORT,
      UserRoleType.DRIVER,
      UserRoleType.USHER,
      UserRoleType.GUEST,
    ].find((role) => roleKeys.has(role));

    return highestPriorityRole;
  }, [activeEvent?.myRole, myRoles]);
  const myPermissions = useMemo(
    () =>
      uniquePermissions(
        accessData?.myEventAccess.permissions ??
          activeEventWithAccess?.myAccess?.permissions ??
          permissionsForLegacyRole(activeRole),
      ),
    [accessData, activeEventWithAccess, activeRole],
  );
  const can = useCallback(
    (permission: EventPermissionKey) => myPermissions.includes(permission),
    [myPermissions],
  );

  /* -------------------------------------------------
   * Loading
   * ------------------------------------------------- */
  const loading = myEventListLoading || activeEventLoading || activeAccessLoading;

  /* -------------------------------------------------
   * Context value
   * ------------------------------------------------- */
  const value = useMemo<ActiveEventContextValue>(
    () => ({
      myEventList: myEventList ?? [],
      activeEvent,
      activeEventId,
      activeRole,
      myRoles,
      myPermissions,
      can,
      loading,
      selectEvent,
      clearEvent,
    }),
    [
      myEventList,
      activeEvent,
      activeEventId,
      activeRole,
      myRoles,
      myPermissions,
      can,
      loading,
      selectEvent,
      clearEvent,
    ],
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
