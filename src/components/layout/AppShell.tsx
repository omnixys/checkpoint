"use client";

import type React from "react";
import { useDevice } from "@/checkpoint/providers/DeviceProvider";
import AppShellDesktop from "./AppShell.desktop";
import AppShellMobile from "./AppShell.mobile";
import AppShellTablet from "./AppShell.tablet";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { device } = useDevice();

  if (device === "mobile") {
    return <AppShellMobile>{children}</AppShellMobile>;
  }
  if (device === "tablet") {
    return <AppShellTablet>{children}</AppShellTablet>;
  }

  return <AppShellDesktop>{children}</AppShellDesktop>;
}
