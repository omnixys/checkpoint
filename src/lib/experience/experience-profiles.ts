import type { RoleProfile } from "./types";

export const ROLE_PROFILES: Record<string, RoleProfile> = {
  ADMIN: {
    roleId: "ADMIN",
    priority: 100,
    allowedFeatureIds: [
      "event-dashboard",
      "notifications",
      "scanner",
      "guests",
      "invitations",
      "tickets",
      "seats",
      "seat-map",
      "event-list",
      "my-dashboard",
      "my-profile",
    ],
    navigationGroupOrder: ["main", "event", "tools", "personal"],
    dashboardWidgetIds: [
      "guest-stats",
      "scanner-quick",
      "security-status",
      "quick-actions",
      "event-meta",
      "scan-activity",
    ],
    mobileAllowedFeatureIds: [
      "event-dashboard",
      "notifications",
      "scanner",
      "guests",
      "invitations",
      "tickets",
      "my-dashboard",
      "my-profile",
    ],
    mobileNavigationGroupOrder: ["main", "event", "personal"],
  },
  SECURITY: {
    roleId: "SECURITY",
    priority: 70,
    allowedFeatureIds: [
      "event-dashboard",
      "guests",
      "seats",
      "seat-map",
      "scanner",
      "scan-history",
      "event-list",
      "my-dashboard",
      "my-profile",
    ],
    navigationGroupOrder: ["main", "event", "tools", "personal"],
    dashboardWidgetIds: [
      "guest-stats",
      "scanner-quick",
      "security-status",
      "quick-actions",
      "scan-activity",
    ],
    mobileAllowedFeatureIds: [
      "event-dashboard",
      "scanner",
      "guests",
      "my-dashboard",
      "my-profile",
    ],
    mobileNavigationGroupOrder: ["main", "event", "personal"],
  },
  SUPPORT: {
    roleId: "SUPPORT",
    priority: 50,
    allowedFeatureIds: [
      "event-dashboard",
      "guests",
      "seats",
      "seat-map",
      "scanner",
      "scan-history",
      "event-list",
      "my-dashboard",
      "my-profile",
    ],
    navigationGroupOrder: ["main", "event", "tools", "personal"],
    dashboardWidgetIds: [
      "guest-stats",
      "scanner-quick",
      "quick-actions",
      "scan-activity",
    ],
    mobileAllowedFeatureIds: [
      "event-dashboard",
      "scanner",
      "guests",
      "my-dashboard",
      "my-profile",
    ],
    mobileNavigationGroupOrder: ["main", "event", "personal"],
  },
  GUEST: {
    roleId: "GUEST",
    priority: 10,
    allowedFeatureIds: [
      "my-dashboard",
      "my-ticket",
      "my-seat",
      "my-plus-ones",
      "my-profile",
    ],
    navigationGroupOrder: ["personal"],
    dashboardWidgetIds: ["ticket-qr", "quick-actions"],
    mobileAllowedFeatureIds: ["my-dashboard", "my-ticket", "my-seat", "my-profile"],
    mobileNavigationGroupOrder: ["personal"],
  },
};

export function getProfile(roleId: string): RoleProfile | undefined {
  return ROLE_PROFILES[roleId];
}

export function getHighestPriorityProfile(roleIds: string[]): RoleProfile | undefined {
  let highest: RoleProfile | undefined;
  for (const roleId of roleIds) {
    const profile = ROLE_PROFILES[roleId];
    if (profile && (!highest || profile.priority > highest.priority)) {
      highest = profile;
    }
  }
  return highest;
}
