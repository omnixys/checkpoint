"use client";

import {
  alpha,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  type Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { useParams } from "next/navigation";
import type React from "react";
import { useState } from "react";
import PhoneNumberListAccordion from "@/checkpoint/components/common/phoneNumber/PhoneNumberListAccordion";
import DialogTransition from "@/checkpoint/components/DialogTransition";
import type { AppError } from "@/checkpoint/errors/app-error";
import { useFieldError, useMutationError } from "@/checkpoint/hooks/error";
import { useInvitationForm } from "@/checkpoint/hooks/invitation/useInvitationForm";
import type { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import type { CallingCodeCountry } from "@/checkpoint/types/country.type";

/**
 * Props for InvitationCreateDialog
 */
type Props = {
  logic: InvitationLogic;
  callingCodeCountries: CallingCodeCountry[];
};

/**
 * Reusable section container for dialog layout
 * Provides consistent spacing, background and borders
 */
function Section({
  title,
  children,
  theme,
}: {
  title?: string | undefined;
  children: React.ReactNode;
  theme: Theme;
}) {
  return (
    <Box
      sx={{
        p: 2.5,
        // background: "rgba(255,255,255,0.02)",
        // border: "1px solid rgba(255,255,255,0.05)",

        borderRadius: theme.shape.sectionRadius,
        background: alpha(theme.palette.background.paper, 0.02),
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Stack spacing={2}>
        {title && <Typography sx={{ fontWeight: 600 }}>{title}</Typography>}
        {children}
      </Stack>
    </Box>
  );
}

/**
 * InvitationCreateDialog
 *
 * Responsibilities:
 * - Manage invitation creation UI
 * - Handle form state
 * - Submit data via InvitationLogic
 */
export default function InvitationCreateDialog({
  logic,
  callingCodeCountries: _callingCodeCountries,
}: Props) {
  const tInvitation = useTypedTranslations("invitation");
  const tCommon = useTypedTranslations("common");

  const theme = useTheme();
  const params = useParams();
  const eventId = String(params.id);

  const [loading, setLoading] = useState(false);
  const [appError, setAppError] = useState<AppError | null>(null);
  const handleMutationError = useMutationError({ operationName: "CreateInvitation" });
  const firstNameError = useFieldError(appError, "firstName");
  const lastNameError = useFieldError(appError, "lastName");
  const emailError = useFieldError(appError, "email");

  const {
    values,
    setField,
    phoneNumbers,
    addPhone,
    removePhone,
    isValid,
    resetForm,
    buildCreateInput,
  } = useInvitationForm({
    eventId,
    defaultCountry: "+49",
    autoCreateFirstPhone: true,
  });

  /**
   * Close dialog and reset form state
   */
  const handleClose = () => {
    logic.setCreateOpen(false);
    resetForm();
  };

  /**
   * Handles invitation creation
   */
  const handleCreate = async () => {
    if (!isValid || loading) return;

    try {
      setLoading(true);
      setAppError(null);

      const selectedEvent = logic.allEventOptions.find((event) => event.id === values.eventId);
      const eventEndsAt = selectedEvent?.settings?.endsAt;

      if (!eventEndsAt) {
        throw new Error("Missing event end time for invitation creation");
      }

      await logic.createInvitationMutation({
        variables: {
          input: buildCreateInput({
            autoApproveOnAccept: false,
            eventEndsAt,
            eventName: selectedEvent?.name ?? null,
          }),
        },
      });

      await logic.reload();
      handleClose();
    } catch (error) {
      setAppError(handleMutationError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={logic.createOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth={true}
      slots={{
        transition: DialogTransition,
      }}
      slotProps={{
        paper: {
          sx: {
            overflow: "hidden",
            boxShadow: `0 40px 120px ${alpha(theme.palette.background.paper, 0.35)}`,

            p: theme.spacing(3),
            borderRadius: theme.shape.borderRadius2,
            background: alpha(theme.palette.background.paper, 1),
            border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          },
        },
      }}
    >
      {/* -------------------------------- HEADER -------------------------------- */}
      <DialogTitle sx={{ px: 3, pt: 3, pb: 2 }}>
        <Stack spacing={0.5}>
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 700,
            }}
          >
            {tInvitation("createInv.title")}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {tInvitation("createInv.subtitle")}{" "}
          </Typography>
        </Stack>
      </DialogTitle>

      {/* -------------------------------- CONTENT -------------------------------- */}
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* PERSON SECTION */}
          <Section title={tInvitation("createInv.person")} theme={theme}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label={tInvitation("createInv.firstName")}
                fullWidth={true}
                autoFocus={true}
                value={values.firstName}
                error={firstNameError !== undefined}
                helperText={firstNameError}
                onChange={(e) => setField("firstName", e.target.value)}
              />

              <TextField
                label={tInvitation("createInv.lastName")}
                fullWidth={true}
                value={values.lastName}
                error={lastNameError !== undefined}
                helperText={lastNameError}
                onChange={(e) => setField("lastName", e.target.value)}
              />
            </Stack>

            <TextField
              label={tInvitation("createInv.email")}
              fullWidth={true}
              value={values.email}
              error={emailError !== undefined}
              helperText={emailError}
              onChange={(e) => setField("email", e.target.value)}
            />
          </Section>

          <Section theme={theme}>
            <PhoneNumberListAccordion
              values={phoneNumbers}
              onAdd={addPhone}
              onEdit={() => undefined}
              onRemove={removePhone}
            />
          </Section>

          {/* INVITATION SECTION */}
          <Section title={tInvitation("createInv.invitation")} theme={theme}>
            <TextField
              type="number"
              label={tInvitation("createInv.maxInvitees")}
              fullWidth={true}
              value={values.maxInvitees}
              onChange={(e) => setField("maxInvitees", Math.max(0, Number(e.target.value) || 0))}
            />

            <TextField
              select={true}
              fullWidth={true}
              label={tInvitation("createInv.invitedBy")}
              value={values.eventId}
              onChange={(e) => setField("eventId", e.target.value)}
              helperText={tInvitation("createInv.invitedByHelp")}
            >
              <MenuItem value="">
                <em>{tInvitation("createInv.noAssignment")}</em>
              </MenuItem>

              {logic.events?.map((event) => {
                const name = event.name?.trim() || tInvitation("createInv.unknown");

                return (
                  <MenuItem key={event.id} value={event.id}>
                    <Stack
                      direction="row"
                      sx={{
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{name}</span>

                      <Typography variant="caption" color="text.secondary">
                        {event.id}
                      </Typography>
                    </Stack>
                  </MenuItem>
                );
              })}
            </TextField>
          </Section>
        </Stack>
      </DialogContent>

      {/* -------------------------------- ACTIONS -------------------------------- */}
      <DialogActions
        sx={{
          px: theme.spacing(3),
          py: theme.spacing(2),

          position: "sticky",
          bottom: 0,

          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",

          background: alpha(theme.palette.background.default, 0.25),
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        }}
      >
        <Button onClick={handleClose}> {tCommon("cancel")}</Button>

        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={!isValid || loading}
          sx={{
            borderRadius: "12px",
            px: 3,
          }}
        >
          {loading ? tInvitation("createInv.creating") : tInvitation("createInv.submit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
