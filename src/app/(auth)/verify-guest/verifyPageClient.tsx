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
function mapVerifyMessage(message: string): {
  severity: "success" | "error";
  text: string;
} {
  switch (message) {
    case "SUCCESS":
      return {
        severity: "success",
        text: "Your access has been successfully activated.",
      };

    case "ALREADY_CONSUMED_OR_EXPIRED":
      return {
        severity: "error",
        text: "This link is no longer valid. Please request a new invitation.",
      };

    case "INVALID_TOKEN":
      return {
        severity: "error",
        text: "Invalid verification link.",
      };

    default:
      return {
        severity: "error",
        text: "Verification failed. Please try again.",
      };
  }
}

/* -------------------------------------------------------------------------- */
/* Main Page                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Verify Guest Page
 *
 * FLOW:
 * 1. Extract token from URL
 * 2. Execute verification mutation exactly once
 * 3. Display result
 * 4. Allow PDF download of credentials
 *
 * IMPORTANT:
 * - useRef guard prevents duplicate execution (React StrictMode safe)
 * - No mutation dependency → prevents re-trigger
 */
export default function VerifyPageClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [verifyGuest, { data, loading }] = useMutation<
    VerifyGuestSignUpMutation,
    VerifyGuestSignUpMutationVariables
  >(VerifyGuestSignUpDocument);

  /**
   * Prevent duplicate execution
   */
  const executedRef = useRef(false);

  /**
   * Reference to the content that will be exported as PDF
   */
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

  /**
   * Generates a PDF from the credential content.
   *
   * WHY:
   * - Uses html2canvas to capture styled UI
   * - Converts into PDF via jsPDF
   * - No backend dependency required
   */
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
        <Alert severity="error">
          Missing verification token. Please use the correct link.
        </Alert>
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
          <Typography variant="body1">Verifying your access...</Typography>
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
            Retry
          </Button>
        </Stack>
      </CenteredContainer>
    );
  }

  const result = data?.verifyGuestSignUp;

  if (!result) {
    return (
      <CenteredContainer>
        <Alert severity="error">Unexpected response from server.</Alert>
      </CenteredContainer>
    );
  }

  const mapped = mapVerifyMessage(result.message ?? "SUCCESS");

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
              <CredentialCard key={user.userId} user={user} />
            ))}
          </Stack>
        </div>

        {/* Download Button */}
        {mapped.severity === "success" && (
          <Button variant="contained" onClick={handleDownload}>
            Download as PDF
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
}: {
  user: {
    userId: string;
    username: string;
    password: string;
    email?: string | null;
  };
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
            Access Credentials
          </Typography>

          <Field label="Username" value={user.username} />
          <Field label="Password" value={user.password} />

          {user.email && <Field label="Email" value={user.email} />}
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
