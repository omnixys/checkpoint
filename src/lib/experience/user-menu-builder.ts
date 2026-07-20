import { getFeature } from "./feature-registry";
import type { FeatureCategory, FeatureId, ResolvedExperience } from "./types";

export interface UserMenuItem {
  featureId: FeatureId;
  label: string;
  path: string;
  iconName: string;
  category: "personal" | "action" | "utility";
}

const PERSONAL_FEATURES: FeatureId[] = ["my-profile", "my-ticket", "my-plus-ones", "my-support"];

const ACTION_CATEGORIES: FeatureCategory[] = ["tools", "admin"];

export function buildUserMenuItems(experience: ResolvedExperience): UserMenuItem[] {
  const allowed = new Set(experience.allowedFeatureIds);
  const items: UserMenuItem[] = [];

  // Personal features
  for (const fid of PERSONAL_FEATURES) {
    if (!allowed.has(fid)) continue;
    const feature = getFeature(fid);
    if (!feature) continue;
    items.push({
      featureId: fid,
      label: feature.label,
      path: `/${feature.path}`,
      iconName: feature.icon?.name ?? "Person",
      category: "personal",
    });
  }

  // Action features (tools, admin)
  for (const feature of experience.features) {
    if (!ACTION_CATEGORIES.includes(feature.category)) continue;
    if (PERSONAL_FEATURES.includes(feature.id)) continue; // already added
    items.push({
      featureId: feature.id,
      label: feature.label,
      path: `/${feature.path}`,
      iconName: feature.icon?.name ?? "Settings",
      category: "action",
    });
  }

  return items;
}
