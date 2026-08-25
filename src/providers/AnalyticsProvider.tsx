"use client";

import { Box, Button, Paper, Typography } from "@mui/material";
import { type ConsentState, createAnalytics } from "@omnixys/analytics-sdk/browser";
import { AnalyticsProvider as SdkAnalyticsProvider } from "@omnixys/analytics-sdk/react";
import { usePathname } from "next/navigation";
import type React from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { fetchAnalyticsToken } from "@/checkpoint/lib/analytics/browser-token-provider";
import { AuthEventsBus } from "@/checkpoint/lib/auth/AuthManager";
import { env } from "@/checkpoint/lib/env";
import { getLogger } from "@/checkpoint/utils/logger";
import { useActiveEvent } from "./ActiveEventProvider";
import { useAuth } from "./AuthProvider";

const logger = getLogger("Analytics");

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
      endpoint: env.BACKEND_SERVER_URL,
      flushAt: 10,
      tokenProvider: fetchAnalyticsToken,
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
      client
        .flush()
        .catch((error) => {
          logger.warn("Analytics flush before logout failed", {
            message: error instanceof Error ? error.message : String(error),
          });
        })
        .then(() => client.reset());
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
  const t = useTypedTranslations("common");
  if (consent !== "unknown") return null;

  return (
    <Paper
      component="aside"
      aria-label={t("analyticsConsent.label")}
      elevation={0}
      sx={{
        alignItems: "center",
        bottom: 16,
        display: "flex",
        flexWrap: "wrap",
        gap: 1.5,
        left: 16,
        maxWidth: 560,
        padding: 2,
        position: "fixed",
        right: 16,
        zIndex: 2000,
      }}
    >
      <Typography variant="body2" sx={{ flex: "1 1 280px" }}>
        {t("analyticsConsent.question")}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        <Button variant="outlined" onClick={() => void updateConsent("denied")}>
          {t("analyticsConsent.decline")}
        </Button>
        <Button variant="contained" onClick={() => void updateConsent("granted")}>
          {t("analyticsConsent.allow")}
        </Button>
      </Box>
    </Paper>
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
