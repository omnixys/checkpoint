import type { ComponentType } from "react";
import type { EventPermissionKey } from "@/checkpoint/lib/rbac/event-permissions";

export type FeatureId =
  | "event-dashboard"
  | "notifications"
  | "support"
  | "guests"
  | "invitations"
  | "tickets"
  | "seats"
  | "seat-map"
  | "security"
  | "settings"
  | "scans"
  | "scanner"
  | "scan-history"
  | "calendar"
  | "event-list"
  | "create-event"
  | "my-dashboard"
  | "my-profile"
  | "my-security"
  | "my-ticket"
  | "my-seat"
  | "my-plus-ones"
  | "my-support"
  | "admin-console";

export type FeatureCategory = "event" | "tools" | "personal" | "admin";

export type IconComponent = ComponentType<{ className?: string }>;

export interface FeatureDefinition {
  id: FeatureId;
  category: FeatureCategory;
  label: string;
  description: string;
  icon: IconComponent;
  path: string;
  requiredPermissions: EventPermissionKey[];
  widgetIds?: string[];
  tourId?: string;
  premium?: boolean;
  disabledWithoutEvent?: boolean;
}

export interface NavigationGroupDefinition {
  id: string;
  label: string;
  collapsible: boolean;
  defaultExpanded: boolean;
  order: number;
}

export type DeviceType = "desktop" | "tablet" | "mobile";

export interface RoleProfile {
  roleId: string;
  priority: number;
  allowedFeatureIds: FeatureId[];
  navigationGroupOrder: string[];
  dashboardWidgetIds?: string[];
  quickActionIds?: string[];
  mobileAllowedFeatureIds?: FeatureId[];
  mobileNavigationGroupOrder?: string[];
}

export interface ResolvedExperience {
  primaryRole: string;
  allowedFeatureIds: FeatureId[];
  navigationGroupOrder: string[];
  dashboardWidgetIds: string[];
  quickActionIds: string[];
  features: FeatureDefinition[];
}
