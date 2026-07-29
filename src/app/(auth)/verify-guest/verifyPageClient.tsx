"use client";

import { useMutation } from "@apollo/client/react";
import {
  Alert,
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import html2canvas from "html2canvas";
import jsPdf from "jspdf";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  VerifyGuestSignUpDocument,
  type VerifyGuestSignUpMutation,
  type VerifyGuestSignUpMutationVariables,
} from "@/checkpoint/generated/graphql";
import { useMutationError } from "@/checkpoint/hooks/error";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { setCurrentUser } from "@/checkpoint/lib/apollo/auth-context";
import { AuthManager } from "@/checkpoint/lib/auth/AuthManager";
import { getCurrentUser } from "@/checkpoint/lib/auth/get-current-user";
import { env } from "@/checkpoint/lib/env";
import { useAnalytics } from "@/checkpoint/providers/AnalyticsProvider";

/* -------------------------------------------------------------------------- */
/* Main Page                                                                  */
/* -------------------------------------------------------------------------- */

export default function VerifyPageClient() {
  const router = useRouter();
  const analytics = useAnalytics();
  const t = useTypedTranslations("auth");
  const handleVerifyError = useMutationError({ operationName: "VerifyGuestSignUp" });
  const handleLoginError = useMutationError({ operationName: "CredentialsLogin" });

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [verifyGuest, { data, loading }] = useMutation<
    VerifyGuestSignUpMutation,
    VerifyGuestSignUpMutationVariables
  >(VerifyGuestSignUpDocument);

  const executedRef = useRef(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token || executedRef.current) {
      return;
    }

    executedRef.current = true;

    verifyGuest({
      variables: { token },
    }).catch((error: unknown) => {
      setErrorMessage(handleVerifyError(error).message);
    });
  }, [handleVerifyError, token, verifyGuest]);

  /* ------------------------------------------------------------------------ */
  /* PDF Download Logic                                                       */
  /* ------------------------------------------------------------------------ */

  const handleDownload = async () => {
    if (!pdfRef.current) {
      return;
    }

    analytics.track("TicketDownloadStarted");
    const canvas = await html2canvas(pdfRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPdf({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    pdf.save("guest-credentials.pdf");
    analytics.track("TicketDownloaded");
  };

  const login = async (username: string, password: string) => {
    if (loading) {
      return;
    }

    try {
      setIsLoggingIn(true);
      await AuthManager.login({ username, password });
      const user = await getCurrentUser();
      setCurrentUser(user);
      router.replace(env.CHECKPOINT_BASE_PATH);
    } catch (error) {
      handleLoginError(error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* UI States                                                                */
  /* ------------------------------------------------------------------------ */

  if (!token) {
    return (
      <CenteredContainer>
        <Alert severity="error">{t("verify.missingToken")}</Alert>
      </CenteredContainer>
    );
  }

  if (loading) {
    return (
      <CenteredContainer>
        <Stack
          spacing={2}
          sx={{
            alignItems: "center",
          }}
        >
          <CircularProgress />
          <Typography>{t("verify.loading")}</Typography>{" "}
        </Stack>
      </CenteredContainer>
    );
  }

  if (errorMessage) {
    return (
      <CenteredContainer>
        <Stack spacing={2}>
          <Alert severity="error">{errorMessage}</Alert>

          <Button
            variant="contained"
            onClick={() => {
              executedRef.current = false;
              setErrorMessage(null);
              verifyGuest({ variables: { token } });
            }}
          >
            {t("verify.retry")}
          </Button>
        </Stack>
      </CenteredContainer>
    );
  }

  const result = data?.verifyGuestSignUp;

  if (!result?.results || result.results.length === 0 || !result.results[0]) {
    return (
      <CenteredContainer>
        <Alert severity="error">{t("verify.unexpected")}</Alert>
      </CenteredContainer>
    );
  }

  const rootInvitee = result.results[0];

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <CenteredContainer>
      <Stack
        spacing={3}
        sx={{
          alignItems: "center",
        }}
      >
        {/* PDF Content */}
        <div ref={pdfRef}>
          <Stack spacing={3} sx={{ maxWidth: 520, alignItems: "center" }}>
            <Alert severity="success">{t("verify.success")}</Alert>

            {result.results?.map((user) => (
              <CredentialCard key={user.userId} user={user} t={t} />
            ))}
          </Stack>
        </div>

        {/* Download Button */}
        <Button variant="contained" onClick={handleDownload}>
          {t("verify.download")}
        </Button>
        <Button
          variant="contained"
          disabled={isLoggingIn}
          onClick={() => login(rootInvitee.username, rootInvitee.password)}
        >
          {isLoggingIn ? <CircularProgress size={20} /> : t("verify.login")}
        </Button>
      </Stack>
    </CenteredContainer>
  );
}

/* -------------------------------------------------------------------------- */
/* Layout                                                                     */
/* -------------------------------------------------------------------------- */

function CenteredContainer({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={(theme) => ({
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,

        background: `linear-gradient(
          180deg,
          ${theme.palette.background.default} 0%,
          ${theme.palette.background.paper} 100%
        )`,
      })}
    >
      {children}
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Credential Card                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Displays credentials in a structured format.
 *
 * WHY:
 * - Improves readability
 * - Allows future extension (copy button, QR, etc.)
 */
function CredentialCard({
  user,
  t,
}: {
  user: {
    userId: string;
    username: string;
    password: string;
    email?: string | null;
  };
  t: ReturnType<typeof useTypedTranslations<"auth">>;
}) {
  return (
    <Card
      sx={(theme) => ({
        width: "100%",
        borderRadius: 4,

        background: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: "blur(20px)",

        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,

        boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.25)}`,
      })}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
            }}
          >
            {t("verify.credentials.title")}
          </Typography>

          <Field label={t("verify.credentials.username")} value={user.username} />
          <Field label={t("verify.credentials.password")} value={user.password} />

          {user.email && <Field label={t("verify.credentials.email")} value={user.email} />}
        </Stack>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Field Component                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Generic display field
 *
 * WHY:
 * - Consistent formatting
 * - Easy extensibility (copy, mask, etc.)
 */
function Field({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.3}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>

      <Typography
        variant="body1"
        sx={(theme) => ({
          fontFamily: "monospace",
          wordBreak: "break-all",

          px: 1.2,
          py: 0.6,
          borderRadius: 1.5,

          background: alpha(theme.palette.background.default, 0.6),
        })}
      >
        {value}
      </Typography>
    </Stack>
  );
}
