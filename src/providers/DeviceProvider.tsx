"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type DeviceType = "mobile" | "tablet" | "desktop";

interface DeviceContextValue {
  device: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const DeviceContext = createContext<DeviceContextValue | undefined>(undefined);

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [device, setDevice] = useState<DeviceType>("desktop");

  // Detect on first render + window resize
  useEffect(() => {
    const detect = () => {
      const w = window.innerWidth;

      if (w < 768) setDevice("mobile");
      else if (w < 1200) setDevice("tablet");
      else setDevice("desktop");
    };

    detect();
    window.addEventListener("resize", detect);
    return () => window.removeEventListener("resize", detect);
  }, []);

  return (
    <DeviceContext.Provider
      value={{
        device,
        isMobile: device === "mobile",
        isTablet: device === "tablet",
        isDesktop: device === "desktop",
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice(): DeviceContextValue {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error("useDevice must be inside DeviceProvider");
  return ctx;
}
