"use client";

import { type ConsentState, createAnalytics } from "@omnixys/analytics-sdk/browser";
import { AnalyticsProvider as SdkAnalyticsProvider } from "@omnixys/analytics-sdk/react";
import { usePathname } from "next/navigation";
import type React from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { publicAnalyticsReference } from "@/checkpoint/lib/analytics/public-reference";
import { AuthEventsBus } from "@/checkpoint/lib/auth/AuthManager";
import { env } from "@/checkpoint/lib/env";
import { useActiveEvent } from "./ActiveEventProvider";
import { useAuth } from "./AuthProvider";

interface AnalyticsConsentContextValue {
  consent: ConsentState;
  updateConsent(state: ConsentState): Promise<void>;
}

const AnalyticsConsentContext = createContext<AnalyticsConsentContextValue | undefined>(undefined);
const CheckpointAnalyticsContext = createContext<ReturnType<typeof createAnalytics> | null>(null);

export function CheckpointAnalyticsProvider({
  children,
  initialConsent,
}: {
  children: React.ReactNode;
  initialConsent: ConsentState;
}) {
  const [consent, setConsent] = useState(initialConsent);
  const [client] = useState(() =>
    createAnalytics({
      consent: initialConsent,
      endpoint: env.ANALYTICS_GATEWAY_URL,
      flushAt: 10,
      tokenProvider: async () => {
        const publicReference = publicAnalyticsReference(globalThis.location);
        const response = await fetch(`${env.ANALYTICS_GATEWAY_URL}/v1/analytics/token`, {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ publicReference }),
        });
        if (!response.ok) {
          throw new Error(`Analytics token request failed with HTTP ${response.status}`);
        }
        const payload = (await response.json()) as { token?: unknown };
        if (typeof payload.token !== "string" || !payload.token) {
          throw new Error("Analytics token response did not contain a token");
        }
        return payload.token;
      },
      context: () => ({
        application: "checkpoint",
        path: globalThis.location?.pathname,
      }),
    }),
  );

  const updateConsent = useCallback(
    async (state: ConsentState) => {
      if (state !== "granted") {
        client.setConsent(state);
        setConsent(state);
      }
      const response = await fetch("/api/analytics/consent", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ state }),
      });
      if (!response.ok) throw new Error("Analytics consent could not be updated");
      if (state === "granted") {
        client.setConsent(state);
        setConsent(state);
      }
    },
    [client],
  );

  useEffect(() => {
    const reset = () => {
      void client.flush().finally(() => client.reset());
    };
    AuthEventsBus.on("auth:logout", reset);
    return () => AuthEventsBus.off("auth:logout", reset);
  }, [client]);

  return (
    <AnalyticsConsentContext.Provider value={{ consent, updateConsent }}>
      <CheckpointAnalyticsContext.Provider value={client}>
        <SdkAnalyticsProvider client={client}>
          <AnalyticsNavigation />
          {children}
          <AnalyticsConsentBanner />
        </SdkAnalyticsProvider>
      </CheckpointAnalyticsContext.Provider>
    </AnalyticsConsentContext.Provider>
  );
}

function AnalyticsConsentBanner() {
  const { consent, updateConsent } = useAnalyticsConsent();
  if (consent !== "unknown") return null;

  return (
    <aside
      aria-label="Analytics consent"
      style={{
        alignItems: "center",
        background: "var(--mui-palette-background-paper, #fff)",
        border: "1px solid rgba(127, 127, 127, 0.3)",
        borderRadius: 16,
        bottom: 16,
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        left: 16,
        maxWidth: 560,
        padding: 16,
        position: "fixed",
        right: 16,
        zIndex: 2000,
      }}
    >
      <span style={{ flex: "1 1 280px" }}>
        Allow privacy-safe product analytics to help improve Checkpoint?
      </span>
      <button type="button" onClick={() => void updateConsent("denied")}>
        Decline
      </button>
      <button type="button" onClick={() => void updateConsent("granted")}>
        Allow
      </button>
    </aside>
  );
}

function AnalyticsNavigation() {
  const analytics = useAnalytics();
  const pathname = usePathname();

  useEffect(() => {
    analytics.page("$pageview", { path: pathname });
  }, [analytics, pathname]);

  return null;
}

export function AnalyticsIdentityBridge() {
  const analytics = useAnalytics();
  const { currentUser } = useAuth();
  const { activeEventId } = useActiveEvent();

  useEffect(() => {
    if (currentUser?.id) analytics.identify(currentUser.id);
  }, [analytics, currentUser?.id]);

  useEffect(() => {
    if (activeEventId) analytics.group(activeEventId);
  }, [activeEventId, analytics]);

  return null;
}

export function useAnalyticsConsent(): AnalyticsConsentContextValue {
  const context = useContext(AnalyticsConsentContext);
  if (!context) {
    throw new Error("useAnalyticsConsent must be used inside CheckpointAnalyticsProvider");
  }
  return context;
}

export function useAnalytics() {
  return useContext(CheckpointAnalyticsContext) ?? NOOP_ANALYTICS;
}

const NOOP_ANALYTICS = {
  alias: () => "",
  flush: async () => {},
  group: () => "",
  identify: () => "",
  page: () => "",
  reset: () => {},
  screen: () => "",
  track: () => "",
};
