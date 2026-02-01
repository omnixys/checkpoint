"use client";

import React, { JSX } from "react";
import { useDevice } from "@/providers/DeviceProvider";

import NavigationMobile from "./Navigation.mobile";
import NavigationTablet from "./Navigation.tablet";
import NavigationDesktop from "./Navigation.desktop";

export default function Navigation(): JSX.Element {
  const { device } = useDevice();

  if (device === "mobile") return <NavigationMobile />;
  if (device === "tablet") return <NavigationTablet />;

  return <NavigationDesktop />;
}
