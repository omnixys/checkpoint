"use client";

import { useCallback, useState } from "react";

export type EventTabKey = "timeline" | "details" | "map";

const LEGACY_TAB_ALIASES: Record<string, EventTabKey> = {
  settings: "details",
  location: "map",
  description: "details",
};

/**
 * Central tab state logic
 */
export function useEventTabs(defaultTab: EventTabKey = "timeline") {
  const [active, setActive] = useState<EventTabKey>(defaultTab);

  const changeTab = useCallback((tab: string) => {
    setActive((LEGACY_TAB_ALIASES[tab] ?? tab) as EventTabKey);
  }, []);

  return {
    active,
    changeTab,
  };
}
