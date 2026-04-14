"use client";

import React, { JSX, useEffect } from "react";

import { MobileNavCarousel } from "./MobileNavCarousel";
import { createNavigation } from "../navigation.config";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useAuth } from "@/checkpoint/providers/AuthProvider";

export default function NavigationMobile(): JSX.Element {
  const { isAuthenticated } = useAuth();
  const { activeEvent } = useActiveEvent();
  const role = activeEvent?.myRole ?? "GUEST";

  const items = createNavigation(role, activeEvent?.id);

  return <>{isAuthenticated && <MobileNavCarousel items={items} eventId={activeEvent?.id} />}</>;
}
