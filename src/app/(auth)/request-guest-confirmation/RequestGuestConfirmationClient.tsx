"use client";

import { useMutation } from "@apollo/client/react";
import { Alert, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AppleButton } from "@/checkpoint/components/apple/AppleButton";
import { AppleCard } from "@/checkpoint/components/apple/AppleCard";
import {
  RequestGuestConfirmationDocument,
  type RequestGuestConfirmationMutation,
  type RequestGuestConfirmationMutationVariables,
} from "@/checkpoint/generated/graphql";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

function normalizeIdentifier(value: string): string | null {
  const trimmed = value.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return trimmed.toLowerCase();
  }
  return parsePhoneNumberFromString(trimmed)?.isValid()
    ? (parsePhoneNumberFromString(trimmed)?.number ?? null)
    : null;
}

export default function RequestGuestConfirmationClient() {
  const t = useTypedTranslations("auth");
  const eventId = useSearchParams().get("eventId");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [sent, setSent] = useState(false);
  const [transportError, setTransportError] = useState(false);
  const [requestConfirmation, { loading }] = useMutation<
    RequestGuestConfirmationMutation,
    RequestGuestConfirmationMutationVariables
  >(RequestGuestConfirmationDocument);

  async function submit(): Promise<void> {
    const normalizedIdentifier = normalizeIdentifier(identifier);
    if (!eventId || !firstName.trim() || !lastName.trim() || !normalizedIdentifier) {
      setInvalid(true);
      return;
    }
    try {
      setInvalid(false);
      setTransportError(false);
      await requestConfirmation({
        variables: {
          input: {
            eventId,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            identifier: normalizedIdentifier,
          },
        },
      });
      setSent(true);
    } catch {
      setSent(false);
      setTransportError(true);
    }
  }

  if (!eventId) {
    return <Alert severity="error">{t("confirmationRequest.missingEvent")}</Alert>;
  }

  return (
    <AppleCard sx={{ maxWidth: 480, width: "100%" }}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={0.5}>
            <Typography variant="h5">{t("confirmationRequest.title")}</Typography>
            <Typography color="text.secondary" variant="body2">
              {t("confirmationRequest.description")}
            </Typography>
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              autoComplete="given-name"
              fullWidth
              label={t("confirmationRequest.firstName")}
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
            <TextField
              autoComplete="family-name"
              fullWidth
              label={t("confirmationRequest.lastName")}
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </Stack>
          <TextField
            autoComplete="email"
            error={invalid}
            fullWidth
            helperText={invalid ? t("confirmationRequest.invalid") : undefined}
            inputMode="email"
            label={t("confirmationRequest.identifier")}
            value={identifier}
            onChange={(event) => {
              setIdentifier(event.target.value);
              setInvalid(false);
              setSent(false);
            }}
          />
          {sent ? (
            <Alert role="status" severity="success">
              {t("confirmationRequest.sent")}
            </Alert>
          ) : null}
          {transportError ? (
            <Alert severity="error">{t("confirmationRequest.networkError")}</Alert>
          ) : null}
          <AppleButton disabled={loading} fullWidth type="submit" variant="accent">
            {loading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              t("confirmationRequest.submit")
            )}
          </AppleButton>
        </Stack>
      </form>
    </AppleCard>
  );
}
