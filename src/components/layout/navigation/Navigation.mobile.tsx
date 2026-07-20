"use client";

import type { JSX } from "react";
import { buildNavigation } from "@/checkpoint/lib/experience/navigation-builder";
import { resolveExperience } from "@/checkpoint/lib/experience/resolver";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { MobileNavCarousel } from "./MobileNavCarousel";

export default function NavigationMobile(): JSX.Element {
  const { isAuthenticated } = useAuth();
  const { activeEvent, myRoles, myPermissions } = useActiveEvent();

  const roleIds = myRoles.map((r) => r.key);
  const experience = resolveExperience(roleIds, myPermissions, "mobile");
  const items = buildNavigation(experience, activeEvent?.id);
  return <>{isAuthenticated && <MobileNavCarousel items={items} eventId={activeEvent?.id} />}</>;
}
