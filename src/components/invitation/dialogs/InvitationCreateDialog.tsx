"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Stack,
  Typography,
  TextField,
  Box,
  MenuItem,
  useTheme,
  alpha,
  Theme,
} from "@mui/material";
import { useParams } from "next/navigation";

import DialogTransition from "@/checkpoint/components/DialogTransition";
import PhoneNumberListAccordion from "@/checkpoint/components/common/phoneNumber/PhoneNumberListAccordion";

import { useInvitationForm } from "@/checkpoint/hooks/invitation/useInvitationForm";
import { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { CallingCodeCountry } from "@/checkpoint/types/country.type";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

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
export default function InvitationCreateDialog({ logic, callingCodeCountries }: Props) {
  const tInvitation = useTypedTranslations("invitation");
  const tCommon = useTypedTranslations("common");

  const theme = useTheme();
  const params = useParams();
  const eventId = String(params.id);

  const [loading, setLoading] = useState(false);

  const {
    values,
    setField,
    phoneNumbers,
    addPhone,
    removePhone,
    updatePhone,
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

      await logic.createInvitationMutation({
        variables: {
          input: buildCreateInput(),
        },
      });

      await logic.reload();
      handleClose();
    } catch (error) {
      console.error("Failed to create invitation", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={logic.createOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
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
                fullWidth
                autoFocus
                value={values.firstName}
                onChange={(e) => setField("firstName", e.target.value)}
              />

              <TextField
                label={tInvitation("createInv.lastName")}
                fullWidth
                value={values.lastName}
                onChange={(e) => setField("lastName", e.target.value)}
              />
            </Stack>

            <TextField
              label={tInvitation("createInv.email")}
              fullWidth
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
            />
          </Section>

          <Section theme={theme}>
            <PhoneNumberListAccordion
              values={phoneNumbers}
              onAdd={addPhone}
              onEdit={(index) => {
                // Editing logic can open a modal or inline edit
                console.log("Edit phone index:", index);
              }}
              onRemove={removePhone}
            />
          </Section>

          {/* INVITATION SECTION */}
          <Section title={tInvitation("createInv.invitation")} theme={theme}>
            <TextField
              type="number"
              label={tInvitation("createInv.maxInvitees")}
              fullWidth
              value={values.maxInvitees}
              onChange={(e) => setField("maxInvitees", Math.max(0, Number(e.target.value) || 0))}
            />

            <TextField
              select
              fullWidth
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
