"use client";

import { BottomNavigation, BottomNavigationAction, Box, Paper, Typography } from "@mui/material";
import React, { JSX, useEffect } from "react";

import { useActiveEvent } from "@/providers/ActiveEventProvider";
import { useAuth } from "@/providers/AuthProvider";
import { MobileNavCarousel } from "./MobileNavCarousel";
import { createNavigation } from "../navigation.config";
import { EventRole } from "@/types/event/event-enum.type";


export default function NavigationMobile(): JSX.Element {
  const { isAuthenticated } = useAuth();
  const { activeEvent } = useActiveEvent();
  const role: EventRole = activeEvent?.myRole ?? EventRole.GUEST;

const items = createNavigation(role, activeEvent?.id);

  return <>{isAuthenticated && <MobileNavCarousel items={items} eventId={activeEvent?.id} />}</>;
};