import { Badge } from "@mui/material";
import type { JSX } from "react";
import { NAVIGATION_GROUPS } from "./groups";
import type { FeatureDefinition, ResolvedExperience } from "./types";

export interface NavItem {
  label: string;
  icon: JSX.Element;
  path: string;
  tourId?: string;
  disabled?: boolean;
  groupId: string;
}

export interface GroupedNavItems {
  groupId: string;
  groupLabel: string;
  items: NavItem[];
}

export function withNavigationBadge(
  items: NavItem[],
  tourId: string,
  badgeCount: number,
): NavItem[] {
  if (badgeCount <= 0) return items;

  return items.map((item) =>
    item.tourId === tourId
      ? {
          ...item,
          icon: (
            <Badge
              badgeContent={badgeCount}
              max={99}
              overlap="circular"
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "primary.main",
                  border: "2px solid",
                  borderColor: "background.paper",
                  color: "primary.contrastText",
                  fontWeight: 700,
                },
              }}
            >
              {item.icon}
            </Badge>
          ),
        }
      : item,
  );
}

function buildPath(feature: FeatureDefinition, activeEventId?: string): string {
  let path = feature.path;
  if (path.includes("{id}") && activeEventId) {
    path = path.replace("{id}", activeEventId);
  }
  return `/${path}`;
}

export function buildNavigation(experience: ResolvedExperience, activeEventId?: string): NavItem[] {
  const hasEvent = Boolean(activeEventId);

  return experience.features.map((feature) => {
    const IconComponent = feature.icon;
    return {
      label: feature.label,
      icon: <IconComponent />,
      path: buildPath(feature, activeEventId),
      ...(feature.tourId ? { tourId: feature.tourId } : {}),
      ...(feature.disabledWithoutEvent && !hasEvent ? { disabled: true } : {}),
      groupId: feature.category,
    };
  });
}

export function buildGroupedNavigation(
  experience: ResolvedExperience,
  activeEventId?: string,
): GroupedNavItems[] {
  const flatItems = buildNavigation(experience, activeEventId);
  const groupMap = new Map<string, NavItem[]>();

  for (const item of flatItems) {
    const existing = groupMap.get(item.groupId);
    if (existing) {
      existing.push(item);
    } else {
      groupMap.set(item.groupId, [item]);
    }
  }

  const result: GroupedNavItems[] = [];
  const seen = new Set<string>();

  for (const groupId of experience.navigationGroupOrder) {
    const groupItems = groupMap.get(groupId);
    if (groupItems && groupItems.length > 0) {
      result.push({
        groupId,
        groupLabel: NAVIGATION_GROUPS[groupId]?.label ?? groupId,
        items: groupItems,
      });
      seen.add(groupId);
    }
  }

  for (const [groupId, groupItems] of groupMap) {
    if (!seen.has(groupId) && groupItems.length > 0) {
      result.push({
        groupId,
        groupLabel: NAVIGATION_GROUPS[groupId]?.label ?? groupId,
        items: groupItems,
      });
    }
  }

  return result;
}
