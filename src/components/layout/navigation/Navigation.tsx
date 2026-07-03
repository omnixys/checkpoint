"use client";

import type { JSX } from "react";
import { useDevice } from "@/checkpoint/providers/DeviceProvider";
import NavigationDesktop from "./Navigation.desktop";
import NavigationMobile from "./Navigation.mobile";
import NavigationTablet from "./Navigation.tablet";

export default function Navigation(): JSX.Element {
  const { device } = useDevice();

  if (device === "mobile") {
    return <NavigationMobile />;
  }
  if (device === "tablet") {
    return <NavigationTablet />;
  }

  return <NavigationDesktop />;
}
