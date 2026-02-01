"use client";

import React from "react";
import { useDevice } from "@/providers/DeviceProvider";

import AppShellMobile from "./AppShell.mobile";
import AppShellTablet from "./AppShell.tablet";
import AppShellDesktop from "./AppShell.desktop";

export default function AppShell({ children }: {
  children: React.ReactNode;
}) {
  const { device } = useDevice();

  if (device === "mobile") return <AppShellMobile>{children}</AppShellMobile>;
  if (device === "tablet") return <AppShellTablet>{children}</AppShellTablet>;

  return (
      <AppShellDesktop>{children}</AppShellDesktop>
  );
}
