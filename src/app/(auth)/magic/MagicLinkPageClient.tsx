"use client";

import { Alert, CircularProgress, Stack, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { type JSX, useEffect, useRef, useState } from "react";
import { AppleButton } from "@/checkpoint/components/apple/AppleButton";
import { AppleCard } from "@/checkpoint/components/apple/AppleCard";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { setCurrentUser } from "@/checkpoint/lib/apollo/auth-context";
import { AuthManager } from "@/checkpoint/lib/auth/AuthManager";
import { getCurrentUser } from "@/checkpoint/lib/auth/get-current-user";
import { env } from "@/checkpoint/lib/env";

type VerificationState = "verifying" | "error";

export function safeMagicLinkRedirect(value: string | null): string {
  const fallback = `${env.CHECKPOINT_BASE_PATH}me/my-qr`;
  if (!value?.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  try {
    const url = new URL(value, "https://checkpoint.invalid");
    return url.origin === "https://checkpoint.invalid"
      ? `${url.pathname}${url.search}${url.hash}`
      : fallback;
  } catch {
    return fallback;
  }
}

export default function MagicLinkPageClient(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTypedTranslations("auth");
  const started = useRef(false);
  const [state, setState] = useState<VerificationState>("verifying");

  useEffect(() => {
    if (started.current) {
      return;
    }
    started.current = true;

    const token = searchParams.get("token");
    if (!token) {
      setState("error");
      return;
    }

    void (async () => {
      try {
        await AuthManager.verifyMagicLink(token);
        setCurrentUser(await getCurrentUser());
        router.replace(safeMagicLinkRedirect(searchParams.get("redirect")));
      } catch {
        setState("error");
      }
    })();
  }, [router, searchParams]);

  return (
    <AppleCard sx={{ maxWidth: 440 }}>
      {state === "verifying" ? (
        <Stack spacing={2} sx={{ alignItems: "center" }} role="status" aria-live="polite">
          <CircularProgress size={32} />
          <Typography>{t("magic.verifying")}</Typography>
        </Stack>
      ) : (
        <Stack spacing={2}>
          <Alert severity="error">
            <Typography variant="subtitle1">{t("magic.errorTitle")}</Typography>
            <Typography variant="body2">{t("magic.errorDescription")}</Typography>
          </Alert>
          <AppleButton
            type="button"
            fullWidth={true}
            variant="tonal"
            onClick={() => router.replace(`${env.CHECKPOINT_BASE_PATH}login`)}
          >
            {t("magic.backToLogin")}
          </AppleButton>
        </Stack>
      )}
    </AppleCard>
  );
}
