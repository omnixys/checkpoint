"use client";

import React, { JSX } from "react";

import NavigationMobile from "./Navigation.mobile";
import NavigationTablet from "./Navigation.tablet";
import NavigationDesktop from "./Navigation.desktop";
import { useDevice } from "@/checkpoint/providers/DeviceProvider";

export default function Navigation(): JSX.Element {
  const { device } = useDevice();

  if (device === "mobile") return <NavigationMobile />;
  if (device === "tablet") return <NavigationTablet />;

  return <NavigationDesktop />;
}
