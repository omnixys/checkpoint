import type { EventPermissionKey } from "@/checkpoint/lib/rbac/event-permissions";
import { getHighestPriorityProfile } from "./experience-profiles";
import { getFeaturesByIds, getFeaturesByPermissions } from "./feature-registry";
import type { DeviceType, ResolvedExperience } from "./types";

export function resolveExperience(
  roleIds: string[],
  permissions: EventPermissionKey[],
  device?: DeviceType,
): ResolvedExperience {
  const profile = getHighestPriorityProfile(roleIds);

  if (profile) {
    const isMobile = device === "mobile";
    const profileFeatureIds =
      isMobile && profile.mobileAllowedFeatureIds
        ? profile.mobileAllowedFeatureIds
        : profile.allowedFeatureIds;
    const navigationGroupOrder =
      isMobile && profile.mobileNavigationGroupOrder
        ? profile.mobileNavigationGroupOrder
        : profile.navigationGroupOrder;

    const permittedFeatures = getFeaturesByPermissions(permissions);
    const permittedIds = new Set(permittedFeatures.map((f) => f.id));
    const filteredIds = profileFeatureIds.filter((id) => permittedIds.has(id));
    const features = getFeaturesByIds(filteredIds);

    return {
      primaryRole: profile.roleId,
      allowedFeatureIds: filteredIds,
      navigationGroupOrder,
      dashboardWidgetIds: profile.dashboardWidgetIds ?? [],
      quickActionIds: profile.quickActionIds ?? [],
      features,
    };
  }

  if (permissions.length > 0) {
    const features = getFeaturesByPermissions(permissions);
    return {
      primaryRole: roleIds[0] ?? "CUSTOM",
      allowedFeatureIds: features.map((f) => f.id),
      navigationGroupOrder: ["personal", "tools", "event"],
      dashboardWidgetIds: [],
      quickActionIds: [],
      features,
    };
  }

  const minimalFeatures = getFeaturesByIds(["my-dashboard", "my-profile"]);
  return {
    primaryRole: roleIds[0] ?? "UNKNOWN",
    allowedFeatureIds: ["my-dashboard", "my-profile"],
    navigationGroupOrder: ["personal"],
    dashboardWidgetIds: [],
    quickActionIds: [],
    features: minimalFeatures,
  };
}
