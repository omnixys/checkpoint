"use client";

// import AppShell from "@/components/layout/AppShell";
import { usePathname } from "next/navigation";
import type React from "react";
import type { ConsentState } from "@omnixys/analytics-sdk/browser";
import ErrorBoundary from "@/checkpoint/components/error/ErrorBoundary";
import AppShell from "@/checkpoint/components/layout/AppShell";
import { env } from "@/checkpoint/lib/env";
import ThemeRegistry from "@/checkpoint/lib/mui/ThemeRegistry";
import { ApolloRootProvider } from "@/checkpoint/providers/ApolloProvider";
import { ErrorProvider } from "@/checkpoint/providers/ErrorProvider";
import OnboardingProvider from "@/checkpoint/providers/OnboardingProvider";
import SwipeBackProvider from "@/checkpoint/providers/SwipeBackProvider";
import TourProvider from "@/checkpoint/providers/TourProvider";
import { ActiveEventProvider } from "./ActiveEventProvider";
import { AuthProvider } from "./AuthProvider";
import DateProvider from "./DateProvider";
import { DeviceProvider } from "./DeviceProvider";
import ThemeModeProvider, { type ThemeProfile } from "./ThemeModeProvider";
import {
  AnalyticsIdentityBridge,
  CheckpointAnalyticsProvider,
} from "./AnalyticsProvider";

interface ProviderProps {
  children: React.ReactNode;
  initialAnalyticsConsent: ConsentState;
  initialThemeProfile: ThemeProfile | null;
}

export default function Provider({
  children,
  initialAnalyticsConsent,
  initialThemeProfile,
}: ProviderProps) {
  const pathname = usePathname();
  const AuthRoutes = [
    `${env.CHECKPOINT_BASE_PATH}login`,
    `${env.CHECKPOINT_BASE_PATH}register`,
    `${env.CHECKPOINT_BASE_PATH}unlock`,
    `${env.CHECKPOINT_BASE_PATH}rsvp`,
    `${env.CHECKPOINT_BASE_PATH}password-reset`,
    `${env.CHECKPOINT_BASE_PATH}forgot-password`,
  ];

  const isAuthRoute = AuthRoutes.some((route) => pathname.startsWith(route));

  return (
    <DeviceProvider>
      <ThemeModeProvider initialThemeProfile={initialThemeProfile}>
        <ThemeRegistry>
          <ErrorProvider>
            <ErrorBoundary>
              <CheckpointAnalyticsProvider initialConsent={initialAnalyticsConsent}>
                <ApolloRootProvider>
                  <AuthProvider>
                    <ActiveEventProvider>
                      <AnalyticsIdentityBridge />
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
              </CheckpointAnalyticsProvider>
            </ErrorBoundary>
          </ErrorProvider>
        </ThemeRegistry>
      </ThemeModeProvider>
    </DeviceProvider>
  );
}
