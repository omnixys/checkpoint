"use client";

import React from "react";

import AppShellMobile from "./AppShell.mobile";
import AppShellTablet from "./AppShell.tablet";
import AppShellDesktop from "./AppShell.desktop";
import { useDevice } from "@/checkpoint/providers/DeviceProvider";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { device } = useDevice();

  if (device === "mobile") return <AppShellMobile>{children}</AppShellMobile>;
  if (device === "tablet") return <AppShellTablet>{children}</AppShellTablet>;

  return <AppShellDesktop>{children}</AppShellDesktop>;
}
