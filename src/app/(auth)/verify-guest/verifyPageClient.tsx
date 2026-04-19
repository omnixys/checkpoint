"use client";

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
  Alert,
  Button,
} from "@mui/material";

import { useMutation } from "@apollo/client/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  VerifyGuestSignUpMutation,
  VerifyGuestSignUpMutationVariables,
  VerifyGuestSignUpDocument,
} from "@/checkpoint/generated/graphql";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

/* -------------------------------------------------------------------------- */
/* Helper: Message Mapping                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Maps backend response message to user-friendly UI state.
 *
 * WHY:
 * - Decouples backend enums from UI wording
 * - Allows flexible UX changes without backend impact
 */
function mapVerifyMessage(
  message: string,
  t: (key: any) => any,
): {
  severity: "success" | "error";
  text: string;
} {
  switch (message) {
    case "SUCCESS":
      return {
        severity: "success",
        text: t("verify.success"),
      };

    case "ALREADY_CONSUMED_OR_EXPIRED":
      return {
        severity: "error",
        text: t("verify.expired"),
      };

    case "INVALID_TOKEN":
      return {
        severity: "error",
        text: t("verify.invalid"),
      };

    default:
      return {
        severity: "error",
        text: t("verify.failed"),
      };
  }
}

/* -------------------------------------------------------------------------- */
/* Main Page                                                                  */
/* -------------------------------------------------------------------------- */

export default function VerifyPageClient() {
    const t = useTypedTranslations("auth");

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [verifyGuest, { data, loading }] = useMutation<
    VerifyGuestSignUpMutation,
    VerifyGuestSignUpMutationVariables
  >(VerifyGuestSignUpDocument);

  const executedRef = useRef(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token || executedRef.current) return;

    executedRef.current = true;

    verifyGuest({
      variables: { token },
    }).catch((err) => {
      setErrorMessage(err?.message ?? "Verification failed. Please try again.");
    });
  }, [token]);

  /* ------------------------------------------------------------------------ */
  /* PDF Download Logic                                                       */
  /* ------------------------------------------------------------------------ */

  const handleDownload = async () => {
    if (!pdfRef.current) return;

    const canvas = await html2canvas(pdfRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    pdf.save("guest-credentials.pdf");
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

          <Button variant="contained" onClick={() => window.location.reload()}>
            {t("verify.retry")}
          </Button>
        </Stack>
      </CenteredContainer>
    );
  }

  const result = data?.verifyGuestSignUp;

  if (!result) {
    return (
      <CenteredContainer>
        <Alert severity="error">{t("verify.unexpected")}</Alert>
      </CenteredContainer>
    );
  }

  const mapped = mapVerifyMessage(result.message ?? "SUCCESS", t);

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
            <Alert severity={mapped.severity}>{mapped.text}</Alert>

            {result.results?.map((user) => (
              <CredentialCard key={user.userId} user={user} t={t} />
            ))}
          </Stack>
        </div>

        {/* Download Button */}
        {mapped.severity === "success" && (
          <Button variant="contained" onClick={handleDownload}>
            {t("verify.download")}
          </Button>
        )}
      </Stack>
    </CenteredContainer>
  );
}

/* -------------------------------------------------------------------------- */
/* Layout                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Centered layout wrapper
 *
 * WHY:
 * - Consistent page structure
 * - Clean UX
 */
function CenteredContainer({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
      }}
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
  t
}: {
  user: {
    userId: string;
    username: string;
    password: string;
    email?: string | null;
  };
  t: (key: any) => any;
}) {
  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 3,
        backdropFilter: "blur(14px)",
      }}
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

          <Field
            label={t("verify.credentials.username")}
            value={user.username}
          />
          <Field
            label={t("verify.credentials.password")}
            value={user.password}
          />

          {user.email && (
            <Field label={t("verify.credentials.email")} value={user.email} />
          )}
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
        sx={{
          fontFamily: "monospace",
          wordBreak: "break-all",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
