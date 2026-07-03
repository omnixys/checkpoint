"use client";

import { useCallback, useState } from "react";

export type EventTabKey = "timeline" | "settings" | "location" | "description";

/**
 * Central tab state logic
 */
export function useEventTabs(defaultTab: EventTabKey = "timeline") {
  const [active, setActive] = useState<EventTabKey>(defaultTab);

  const changeTab = useCallback((tab: string) => {
    setActive(tab as EventTabKey);
  }, []);

  return {
    active,
    changeTab,
  };
}
