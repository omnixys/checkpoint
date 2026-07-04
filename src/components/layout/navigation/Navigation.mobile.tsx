"use client";

import type { JSX } from "react";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { createNavigation } from "../navigation.config";
import { MobileNavCarousel } from "./MobileNavCarousel";
import { UserRoleType } from "@/checkpoint/generated/graphql";

export default function NavigationMobile(): JSX.Element {
  const t = useTypedTranslations("layout");

  const { isAuthenticated } = useAuth();
  const { activeEvent } = useActiveEvent();
  const role = activeEvent?.myRole ?? UserRoleType.GUEST;

  const items = createNavigation(role, t, activeEvent?.id);
  return <>{isAuthenticated && <MobileNavCarousel items={items} eventId={activeEvent?.id} />}</>;
}
