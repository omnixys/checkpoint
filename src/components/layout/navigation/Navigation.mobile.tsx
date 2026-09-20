"use client";

import type { JSX } from "react";
import { useSupportNavigationUnread } from "@/checkpoint/hooks/support/useSupportNavigationUnread";
import { useInternalNavigationUnread } from "@/checkpoint/hooks/internal/useInternalNavigationUnread";
import {
  buildNavigation,
  withNavigationBadge,
} from "@/checkpoint/lib/experience/navigation-builder";
import { resolveExperience } from "@/checkpoint/lib/experience/resolver";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { MobileNavCarousel } from "./MobileNavCarousel";

export default function NavigationMobile(): JSX.Element {
  const { isAuthenticated } = useAuth();
  const { activeEvent, myRoles, myPermissions } = useActiveEvent();

  const roleIds = myRoles.map((r) => r.key);
  const experience = resolveExperience(roleIds, myPermissions, "mobile");
  const supportUnread = useSupportNavigationUnread(
    activeEvent?.id,
    experience.features.some((feature) => feature.id === "support"),
  );
  const internalUnread = useInternalNavigationUnread(
    activeEvent?.id,
    experience.features.some((feature) => feature.id === "notifications"),
  );
  const items = withNavigationBadge(
    withNavigationBadge(
      buildNavigation(experience, activeEvent?.id),
      "sidebar.support",
      supportUnread,
    ),
    "sidebar.notifications",
    internalUnread,
  );
  return <>{isAuthenticated && <MobileNavCarousel items={items} eventId={activeEvent?.id} />}</>;
}
