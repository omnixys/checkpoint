"use client";

import React from "react";

// import AppShell from "@/components/layout/AppShell";
import { usePathname } from "next/navigation";
import { ActiveEventProvider } from "./ActiveEventProvider";
import { AuthProvider } from "./AuthProvider";
import DateProvider from "./DateProvider";
import { DeviceProvider } from "./DeviceProvider";
import SwipeBackProvider from "./SwipeBackProvider";
import ThemeModeProvider from "./ThemeModeProvider";
import OnboardingModal from "@/checkpoint/components/onboarding/OnboardingModal";
import { ApolloRootProvider } from "@/checkpoint/providers/ApolloProvider";
import AppShell from "@/checkpoint/components/layout/AppShell";
import { env } from "@/checkpoint/lib/env";

type ProviderProps = { children: React.ReactNode };

export default function Provider({ children }: ProviderProps) {
  const pathname = usePathname();
  const AUTH_ROUTES = [
    `${env.CHECKPOINT_BASE_PATH}login`,
    `${env.CHECKPOINT_BASE_PATH}register`,
    `${env.CHECKPOINT_BASE_PATH}unlock`,
    `${env.CHECKPOINT_BASE_PATH}rsvp`,
    `${env.CHECKPOINT_BASE_PATH}password-reset`,
    `${env.CHECKPOINT_BASE_PATH}forgot-password`,
  ];

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  const [hydrated, setHydrated] = React.useState(false);
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);

    const done =
      typeof window !== "undefined" && localStorage.getItem("checkpoint.onboardingDone") === "1";

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
        <ApolloRootProvider>
          <AuthProvider>
            <ActiveEventProvider>
              <DateProvider>
                {/* ALWAYS keep hook tree alive */}
                {showOnboarding && <OnboardingModal onFinish={finishOnboarding} />}

                {isAuthRoute ? (
                  children
                ) : (
                  <SwipeBackProvider>
                    <AppShell>{children}</AppShell>
                  </SwipeBackProvider>
                )}
              </DateProvider>
            </ActiveEventProvider>
          </AuthProvider>
        </ApolloRootProvider>
      </ThemeModeProvider>
    </DeviceProvider>
  );
}
