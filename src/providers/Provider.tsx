"use client";

import type { ConsentState } from "@omnixys/analytics-sdk/browser";
import type { BrowserObservabilityConfig } from "@omnixys/observability-ts/browser";
import { ObservabilityProvider } from "@omnixys/observability-ts/react";
// import AppShell from "@/components/layout/AppShell";
import { usePathname } from "next/navigation";
import type React from "react";
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
import { AnalyticsIdentityBridge, CheckpointAnalyticsProvider } from "./AnalyticsProvider";
import { AuthProvider } from "./AuthProvider";
import DateProvider from "./DateProvider";
import { DeviceProvider } from "./DeviceProvider";
import ThemeModeProvider, { type ThemeProfile } from "./ThemeModeProvider";

const browserConfig: BrowserObservabilityConfig = {
  serviceName: env.OTEL_SERVICE_NAME,
  environment: env.NODE_ENV,
  sampleRate: env.OTEL_SAMPLE_RATE,
  otlpEndpoint: env.OTEL_ENDPOINT,
  instrumentations: ["fetch", "xhr", "document-load"],
  enabled: env.IS_PRODUCTION,
};

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
            <ObservabilityProvider config={{ browser: browserConfig }}>
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
            </ObservabilityProvider>
          </ErrorProvider>
        </ThemeRegistry>
      </ThemeModeProvider>
    </DeviceProvider>
  );
}
