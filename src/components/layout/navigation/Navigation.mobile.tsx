"use client";

import React, { JSX, useEffect } from "react";

import { MobileNavCarousel } from "./MobileNavCarousel";
import { createNavigation } from "../navigation.config";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

export default function NavigationMobile(): JSX.Element {
  const t = useTypedTranslations("layout");

  const { isAuthenticated } = useAuth();
  const { activeEvent } = useActiveEvent();
  const role = activeEvent?.myRole ?? "GUEST";

  const items = createNavigation(role, t, activeEvent?.id);
  return <>{isAuthenticated && <MobileNavCarousel items={items} eventId={activeEvent?.id} />}</>;
}
