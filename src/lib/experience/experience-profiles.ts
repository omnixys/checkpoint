import type { RoleProfile } from "./types";

export const ROLE_PROFILES: Record<string, RoleProfile> = {
  ADMIN: {
    roleId: "ADMIN",
    priority: 100,
    allowedFeatureIds: [
      "event-dashboard",
      "notifications",
      "support",
      "guests",
      "invitations",
      "tickets",
      "seats",
      "seat-map",
      "security",
      "settings",
      "scans",
      "scanner",
      "scan-history",
      "calendar",
      "event-list",
      "create-event",
      "my-dashboard",
      "my-profile",
      "my-security",
      "my-ticket",
      "my-seat",
      "my-plus-ones",
      "my-support",
      "admin-console",
    ],
    navigationGroupOrder: ["main", "event", "tools", "personal", "admin"],
    dashboardWidgetIds: [
      "guest-stats",
      "scanner-quick",
      "security-status",
      "support-queue",
      "quick-actions",
      "event-meta",
      "scan-activity",
    ],
    mobileAllowedFeatureIds: [
      "event-dashboard",
      "notifications",
      "support",
      "scanner",
      "guests",
      "invitations",
      "tickets",
      "my-dashboard",
      "my-profile",
      "my-security",
      "my-ticket",
      "my-seat",
      "my-plus-ones",
      "my-support",
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
      "scans",
      "security",
      "scan-history",
      "event-list",
      "my-dashboard",
      "my-profile",
      "my-security",
    ],
    navigationGroupOrder: ["main", "event", "tools", "personal"],
    dashboardWidgetIds: [
      "guest-stats",
      "scanner-quick",
      "security-status",
      "quick-actions",
      "scan-activity",
    ],
    mobileAllowedFeatureIds: ["event-dashboard", "scanner", "guests", "my-dashboard", "my-profile"],
    mobileNavigationGroupOrder: ["main", "event", "personal"],
  },
  SUPPORT: {
    roleId: "SUPPORT",
    priority: 50,
    allowedFeatureIds: [
      "event-dashboard",
      "notifications",
      "support",
      "seats",
      "seat-map",
      "scanner",
      "scans",
      "scan-history",
      "event-list",
      "my-dashboard",
      "my-profile",
      "my-security",
      "my-support",
    ],
    navigationGroupOrder: ["main", "event", "tools", "personal"],
    dashboardWidgetIds: ["guest-stats", "scanner-quick", "quick-actions", "scan-activity"],
    mobileAllowedFeatureIds: [
      "event-dashboard",
      "notifications",
      "support",
      "my-dashboard",
      "my-profile",
    ],
    mobileNavigationGroupOrder: ["main", "event", "personal"],
  },
  GUEST: {
    roleId: "GUEST",
    priority: 10,
    allowedFeatureIds: ["my-dashboard", "my-ticket", "my-seat", "my-plus-ones", "my-profile"],
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
