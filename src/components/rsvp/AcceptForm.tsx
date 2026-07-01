"use client";

import { Box, Button, Stack, TextField, Typography, useTheme } from "@mui/material";
import { useMemo, useState } from "react";

import PhoneNumberDialog from "@/checkpoint/components/common/phoneNumber/PhoneNumberDialog";
import PhoneNumberListAccordion from "@/checkpoint/components/common/phoneNumber/PhoneNumberListAccordion";
import PlusOneDialog from "@/checkpoint/components/common/plus-one/PlusOneDialog";
import PlusOneListAccordion from "@/checkpoint/components/common/plus-one/PlusOneListAccordion";
import type { AppError } from "@/checkpoint/errors/app-error";
import type { GetInvitationQuery } from "@/checkpoint/generated/graphql";
import { useFieldError, useMutationError } from "@/checkpoint/hooks/error";
import { useRsvpForm } from "@/checkpoint/hooks/invitation/useRsvpForm";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import type { CallingCodeCountry } from "@/checkpoint/types/country.type";

type AcceptFormProps = {
  invitation: GetInvitationQuery["invitation"];
  countries: CallingCodeCountry[];
  onAccepted: () => void;
};

export default function AcceptForm({ invitation, countries, onAccepted }: AcceptFormProps) {
  const t = useTypedTranslations("rsvp");

  const theme = useTheme();
  const form = useRsvpForm(invitation);

  const [phoneDialogIndex, setPhoneDialogIndex] = useState<number | null>(null);
  const [plusOneDialogIndex, setPlusOneDialogIndex] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<AppError | null>(null);
  const handleMutationError = useMutationError({ operationName: "ReplyInvitation" });
  const firstNameError = useFieldError(submitError, "firstName");
  const lastNameError = useFieldError(submitError, "lastName");
  const emailError = useFieldError(submitError, "email");

  const selectedPhone = useMemo(() => {
    if (phoneDialogIndex === null) {
      return null;
    }

    return form.state.phoneNumbers[phoneDialogIndex] ?? null;
  }, [phoneDialogIndex, form.state.phoneNumbers]);

  const selectedPlusOne = useMemo(() => {
    if (plusOneDialogIndex === null) {
      return null;
    }

    return form.state.plusOnes[plusOneDialogIndex] ?? null;
  }, [plusOneDialogIndex, form.state.plusOnes]);

  const handleSubmit = async () => {
    try {
      setSubmitError(null);
      await form.submit();
      onAccepted();
    } catch (error) {
      setSubmitError(handleMutationError(error));
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 4,
        background: theme.palette.background.paper,
      }}
    >
      <Stack spacing={3}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
          }}
        >
          {t("acceptForm.title")}
        </Typography>

        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth={true}
            label={t("acceptForm.firstName")}
            value={form.state.firstName}
            error={firstNameError !== undefined}
            helperText={firstNameError}
            onChange={(e) => form.update("firstName", e.target.value)}
          />

          <TextField
            fullWidth={true}
            label={t("acceptForm.lastName")}
            value={form.state.lastName}
            error={lastNameError !== undefined}
            helperText={lastNameError}
            onChange={(e) => form.update("lastName", e.target.value)}
          />
        </Stack>

        <TextField
          fullWidth={true}
          label={t("acceptForm.email")}
          value={form.state.email}
          error={emailError !== undefined}
          helperText={emailError}
          onChange={(e) => form.update("email", e.target.value)}
        />

        <PhoneNumberListAccordion
          values={form.state.phoneNumbers}
          onAdd={form.addPhone}
          onEdit={setPhoneDialogIndex}
          onRemove={form.removePhone}
        />

        <PlusOneListAccordion
          values={form.state.plusOnes}
          onAdd={form.addPlusOne}
          onEdit={setPlusOneDialogIndex}
          onRemove={form.removePlusOne}
        />

        <Button variant="contained" disabled={!form.isValid} onClick={handleSubmit}>
          {t("acceptForm.submit")}
        </Button>
      </Stack>

      <PhoneNumberDialog
        open={phoneDialogIndex !== null}
        index={phoneDialogIndex}
        value={selectedPhone}
        countries={countries ?? []}
        onClose={() => setPhoneDialogIndex(null)}
        onChange={form.updatePhone}
      />

      <PlusOneDialog
        open={plusOneDialogIndex !== null}
        index={plusOneDialogIndex}
        value={selectedPlusOne}
        countries={countries ?? []}
        onClose={() => setPlusOneDialogIndex(null)}
        onChange={form.updatePlusOne}
        onAddPhone={form.addPlusOnePhone}
        onUpdatePhone={form.updatePlusOnePhone}
        onRemovePhone={form.removePlusOnePhone}
        onRemove={form.removePlusOne}
      />
    </Box>
  );
}
