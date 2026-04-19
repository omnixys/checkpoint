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
} from "@mui/material";
import { useParams } from "next/navigation";

import DialogTransition from "@/checkpoint/components/DialogTransition";
import PhoneNumberListAccordion from "@/checkpoint/components/common/phoneNumber/PhoneNumberListAccordion";

import { useInvitationForm } from "@/checkpoint/hooks/invitation/useInvitationForm";
import { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { CallingCodeCountry } from "@/checkpoint/types/country.type";
import { EventListItem } from "@/checkpoint/types/event.type";

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
}: {
  title?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <Stack spacing={2}>
        {title && (
          <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
        )}
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
  callingCodeCountries,
}: Props) {
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

      await logic.createInvitation({
        variables: {
          input: buildCreateInput(),
        },
      });

      await logic.refetch();
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
            borderRadius: "20px",
            overflow: "hidden",
            backdropFilter: "blur(30px)",
            background: "rgba(20,20,20,0.75)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
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
            Neue Einladung
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Erstelle einen neuen Gast und verwalte seine Einladung
          </Typography>
        </Stack>
      </DialogTitle>

      {/* -------------------------------- CONTENT -------------------------------- */}
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* PERSON SECTION */}
          <Section title="Person">
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Vorname"
                fullWidth
                autoFocus
                value={values.firstName}
                onChange={(e) => setField("firstName", e.target.value)}
              />

              <TextField
                label="Nachname"
                fullWidth
                value={values.lastName}
                onChange={(e) => setField("lastName", e.target.value)}
              />
            </Stack>

            <TextField
              label="E-Mail"
              fullWidth
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
            />
          </Section>

          <Section>
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
          <Section title="Einladung">
            <TextField
              type="number"
              label="Max. Begleitpersonen"
              fullWidth
              value={values.maxInvitees}
              onChange={(e) =>
                setField(
                  "maxInvitees",
                  Math.max(0, Number(e.target.value) || 0),
                )
              }
            />

            <TextField
              select
              fullWidth
              label="Eingeladen von (optional)"
              value={values.eventId}
              onChange={(e) => setField("eventId", e.target.value)}
              helperText="Optional: Wer hat diese Person eingeladen?"
            >
              <MenuItem value="">
                <em>Keine Zuordnung</em>
              </MenuItem>

              {logic.events?.map((event: EventListItem) => {
                const name = event.name?.trim() || "Unbekannt";

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
          px: 3,
          py: 2,
          position: "sticky",
          bottom: 0,
          backdropFilter: "blur(20px)",
          background: "rgba(0,0,0,0.6)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Button onClick={handleClose}>Abbrechen</Button>

        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={!isValid || loading}
          sx={{
            borderRadius: "12px",
            px: 3,
          }}
        >
          {loading ? "Erstellen..." : "Einladung erstellen"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
