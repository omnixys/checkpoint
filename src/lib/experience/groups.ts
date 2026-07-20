import type { NavigationGroupDefinition } from "./types";

export const NAVIGATION_GROUPS: Record<string, NavigationGroupDefinition> = {
  main: {
    id: "main",
    label: "",
    collapsible: false,
    defaultExpanded: true,
    order: 0,
  },
  event: {
    id: "event",
    label: "Event",
    collapsible: true,
    defaultExpanded: true,
    order: 1,
  },
  tools: {
    id: "tools",
    label: "Tools",
    collapsible: true,
    defaultExpanded: true,
    order: 2,
  },
  personal: {
    id: "personal",
    label: "Account",
    collapsible: true,
    defaultExpanded: true,
    order: 3,
  },
  admin: {
    id: "admin",
    label: "Administration",
    collapsible: true,
    defaultExpanded: false,
    order: 4,
  },
} as const;

export const NAVIGATION_GROUP_ORDER = Object.values(NAVIGATION_GROUPS)
  .sort((a, b) => a.order - b.order)
  .map((g) => g.id);
