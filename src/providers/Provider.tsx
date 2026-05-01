"use client";

import React from "react";

// import AppShell from "@/components/layout/AppShell";
import { usePathname } from "next/navigation";
import { ActiveEventProvider } from "./ActiveEventProvider";
import { AuthProvider } from "./AuthProvider";
import DateProvider from "./DateProvider";
import { DeviceProvider } from "./DeviceProvider";
import ThemeModeProvider from "./ThemeModeProvider";
import OnboardingModal from "@/checkpoint/components/onboarding/OnboardingModal";
import { ApolloRootProvider } from "@/checkpoint/providers/ApolloProvider";
import AppShell from "@/checkpoint/components/layout/AppShell";
import { env } from "@/checkpoint/lib/env";
import ThemeRegistry from "@/checkpoint/lib/mui/ThemeRegistry";
import OnboardingProvider from "@/checkpoint/providers/OnboardingProvider";
import TourProvider from "@/checkpoint/providers/TourProvider";
import SwipeBackProvider  from "@/checkpoint/providers/SwipeBackProvider";

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

  return (
    <DeviceProvider>
      <ThemeModeProvider>
        <ThemeRegistry>
          <ApolloRootProvider>
            <AuthProvider>
              <ActiveEventProvider>
                <DateProvider>
                  <TourProvider>
                    <OnboardingProvider>
                      {isAuthRoute ? (
                        children
                      ) : (
                        <SwipeBackProvider>
                          <AppShell>{children}</AppShell>
                        </SwipeBackProvider>
                      )}
                    </OnboardingProvider>
                  </TourProvider>
                </DateProvider>
              </ActiveEventProvider>
            </AuthProvider>
          </ApolloRootProvider>
        </ThemeRegistry>
      </ThemeModeProvider>
    </DeviceProvider>
  );
}
