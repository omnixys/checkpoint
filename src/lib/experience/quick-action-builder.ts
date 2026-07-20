import { getFeature } from "./feature-registry";
import type { FeatureId, ResolvedExperience } from "./types";

export type QuickActionCategory = "guest" | "security" | "admin";

export interface QuickActionItem {
  featureId: FeatureId;
  label: string;
  path: string;
  iconName: string;
  category: QuickActionCategory;
  primary: boolean;
}

const ACTION_MAP: Array<{
  featureId: FeatureId;
  category: QuickActionCategory;
  pathTemplate: string;
  primary: boolean;
}> = [
  {
    featureId: "my-ticket",
    category: "guest",
    pathTemplate: "/me/my-qr?eventId={eventId}",
    primary: true,
  },
  {
    featureId: "my-seat",
    category: "guest",
    pathTemplate: "/me/my-seat?eventId={eventId}",
    primary: false,
  },

  {
    featureId: "scanner",
    category: "security",
    pathTemplate: "/scan?eventId={eventId}",
    primary: true,
  },
  {
    featureId: "scans",
    category: "security",
    pathTemplate: "/event/{eventId}/scans",
    primary: false,
  },
  {
    featureId: "guests",
    category: "security",
    pathTemplate: "/event/{eventId}/guest",
    primary: false,
  },
  {
    featureId: "seats",
    category: "security",
    pathTemplate: "/event/{eventId}/seat",
    primary: false,
  },

  {
    featureId: "invitations",
    category: "admin",
    pathTemplate: "/event/{eventId}/invitation",
    primary: true,
  },
  { featureId: "seats", category: "admin", pathTemplate: "/event/{eventId}/seat", primary: false },
  {
    featureId: "tickets",
    category: "admin",
    pathTemplate: "/event/{eventId}/ticket",
    primary: false,
  },
  {
    featureId: "security",
    category: "admin",
    pathTemplate: "/event/{eventId}/security",
    primary: false,
  },
  {
    featureId: "settings",
    category: "admin",
    pathTemplate: "/event/{eventId}/settings",
    primary: false,
  },
  {
    featureId: "notifications",
    category: "admin",
    pathTemplate: "/event/{eventId}/notification",
    primary: false,
  },
  {
    featureId: "guests",
    category: "admin",
    pathTemplate: "/event/{eventId}/guest",
    primary: false,
  },
  { featureId: "scans", category: "admin", pathTemplate: "/event/{eventId}/scans", primary: false },
];

export function buildQuickActions(
  experience: ResolvedExperience,
  eventId: string,
): QuickActionItem[] {
  const allowed = new Set(experience.allowedFeatureIds);

  return ACTION_MAP.filter((entry) => allowed.has(entry.featureId)).map((entry) => {
    const feature = getFeature(entry.featureId);
    return {
      featureId: entry.featureId,
      label: feature?.label ?? entry.featureId,
      path: entry.pathTemplate.replace("{eventId}", eventId),
      iconName: feature?.icon?.name ?? "Link",
      category: entry.category,
      primary: entry.primary,
    };
  });
}

export function groupQuickActions(items: QuickActionItem[]) {
  const groups: Record<QuickActionCategory, QuickActionItem[]> = {
    guest: [],
    security: [],
    admin: [],
  };
  for (const item of items) {
    groups[item.category].push(item);
  }
  return groups;
}
