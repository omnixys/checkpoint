"use client";

import React from "react";

import AppShell from "@/components/layout/AppShell";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import { CssBaseline } from "@mui/material";
import { usePathname } from "next/navigation";
import { ActiveEventProvider } from "./ActiveEventProvider";
import { AuthProvider } from "./AuthProvider";
import DateProvider from "./DateProvider";
import { DeviceProvider } from "./DeviceProvider";
import SwipeBackProvider from "./SwipeBackProvider";
import ThemeModeProvider from "./ThemeModeProvider";

type ProviderProps = { children: React.ReactNode };

export default function Provider({ children }: ProviderProps) {
  const pathname = usePathname();
  const AUTH_ROUTES = [
    "/checkpoint/login",
    "/checkpoint/register",
    "/checkpoint/unlock",
    "/checkpoint/rsvp",
    "/checkpoint/password-reset",
    "/checkpoint/forgot-password",
  ];

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  const [hydrated, setHydrated] = React.useState(false);
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);

    const done =
      typeof window !== "undefined" &&
      localStorage.getItem("checkpoint.onboardingDone") === "1";

    if (!done) {
      setShowOnboarding(true);
    }
  }, []);

  const finishOnboarding = () => {
    localStorage.setItem("checkpoint.onboardingDone", "1");
    setShowOnboarding(false);
  };

  return (
    <DeviceProvider>
      <ThemeModeProvider>
        <CssBaseline />
        <AuthProvider>
          <ActiveEventProvider>
            <DateProvider>
              <SwipeBackProvider>
                {/* ALWAYS keep hook tree alive */}
                <div style={{ opacity: hydrated ? 1 : 0 }}>
                  {showOnboarding && (
                    <OnboardingModal onFinish={finishOnboarding} />
                  )}

                  {isAuthRoute ? children : <AppShell>{children}</AppShell>}
                </div>
              </SwipeBackProvider>
            </DateProvider>
          </ActiveEventProvider>
        </AuthProvider>
      </ThemeModeProvider>
    </DeviceProvider>
  );
}
