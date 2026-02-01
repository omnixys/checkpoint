"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { PhoneNumberType } from "@/components/../types/user/user-enum-type";
import { PhoneNumberInput } from "@/components/../types/user/user-input.type";
import DialogTransition from "@/components/invitationList/DialogTransition";
import { UseInvitationLogicReturn } from "@/components/invitationList/hooks/useInvitationLogic";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "next/navigation";

/* ---------------------------------------------------------------------
 * Dialog for creating a single invitation with typed phone numbers
 * ------------------------------------------------------------------- */
export default function InvitationCreateDialog({
  logic,
}: {
  logic: UseInvitationLogicReturn;
}) {
  const { id: eventId } = useParams();
  const [value, setValue] = useState({
    firstName: "",
    lastName: "",
    maxPlusOnes: 0,
    phoneNumbers: [] as PhoneNumberInput[],
  });

  /* -------------------------------------------------------------------
   * Add a new phone number entry
   * ------------------------------------------------------------------ */
  const addPhone = () => {
    const isFirst = value.phoneNumbers.length === 0;

    const newPhone: PhoneNumberInput = {
      type: PhoneNumberType.MOBILE,
      number: "",
      label: "",
      isPrimary: isFirst,
    };

    setValue((v) => ({
      ...v,
      phoneNumbers: [...v.phoneNumbers, newPhone],
    }));
  };

  /* -------------------------------------------------------------------
   * Update a field of a phone number item
   * ------------------------------------------------------------------ */
  const updatePhone = (
    index: number,
    field: keyof PhoneNumberInput,
    val: string | boolean,
  ) => {
    const updated = [...value.phoneNumbers];
    (updated[index] as any)[field] = val;

    // Ensure only one primary number exists
    if (field === "isPrimary" && val === true) {
      updated.forEach((p, i) => {
        if (i !== index) p.isPrimary = false;
      });
    }

    setValue((v) => ({
      ...v,
      phoneNumbers: updated,
    }));
  };

  /* -------------------------------------------------------------------
   * Remove a phone number entry
   * ------------------------------------------------------------------ */
  const removePhone = (index: number) => {
    const updated = [...value.phoneNumbers];
    const removed = updated.splice(index, 1)[0];

    // If primary removed → set first one as primary
    if (removed?.isPrimary && updated.length > 0) {
      updated[0].isPrimary = true;
    }

    setValue((v) => ({ ...v, phoneNumbers: updated }));
  };

  /* -------------------------------------------------------------------
   * Create invitation mutation
   * ------------------------------------------------------------------ */
  const create = () => {
    logic
      .createInvitation({
        variables: {
          input: {
            eventId: eventId as string,
            firstName: value.firstName,
            lastName: value.lastName,
            maxInvitees: value.maxPlusOnes,
            phoneNumbers: value.phoneNumbers,
          },
        },
      })
      .then(() => {
        logic.setCreateOpen(false);
        logic.refetch();
      });
  };

  return (
    <Dialog
      open={logic.createOpen}
      onClose={() => logic.setCreateOpen(false)}
      maxWidth="sm"
      fullWidth
      TransitionComponent={DialogTransition}
    >
      <DialogTitle>Neue Einladung</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {/* First/Last Name */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Vorname"
              fullWidth
              value={value.firstName}
              onChange={(e) =>
                setValue((v) => ({ ...v, firstName: e.target.value }))
              }
            />

            <TextField
              label="Nachname"
              fullWidth
              value={value.lastName}
              onChange={(e) =>
                setValue((v) => ({ ...v, lastName: e.target.value }))
              }
            />
          </Stack>

          {/* Add phone button */}
          <Button
            startIcon={<AddIcon />}
            onClick={addPhone}
            sx={{ borderRadius: 3, alignSelf: "flex-start" }}
          >
            Telefonnummer hinzufügen
          </Button>

          {/* Phone number entries */}
          {value.phoneNumbers.map((p, index) => (
            <Stack
              key={index}
              spacing={1}
              sx={{
                p: 2,
                borderRadius: 3,
                background: "rgba(255,255,255,0.35)",
                backdropFilter: "blur(15px)",
              }}
            >
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2" fontWeight={600}>
                  Nummer {index + 1}
                </Typography>

                <IconButton onClick={() => removePhone(index)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>

              {/* Type */}
              <TextField
                select
                label="Typ"
                value={p.type}
                onChange={(e) =>
                  updatePhone(index, "type", e.target.value as PhoneNumberType)
                }
              >
                {Object.values(PhoneNumberType).map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>

              {/* Number */}
              <TextField
                label="Telefonnummer"
                value={p.number}
                onChange={(e) => updatePhone(index, "number", e.target.value)}
                fullWidth
              />

              {/* Label */}
              <TextField
                label="Label (optional)"
                value={p.label ?? ""}
                onChange={(e) => updatePhone(index, "label", e.target.value)}
              />

              {/* Primary switch */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography>Primär</Typography>
                <Switch
                  checked={p.isPrimary ?? false}
                  onChange={(e) =>
                    updatePhone(index, "isPrimary", e.target.checked)
                  }
                />
              </Stack>
            </Stack>
          ))}

          {/* Plus-Ones */}
          <TextField
            type="number"
            label="Max. Plus-Ones"
            value={value.maxPlusOnes}
            onChange={(e) =>
              setValue((v) => {
                const n = Number(e.target.value);

                // Prevent negative numbers
                const safe = n < 0 ? 0 : n;

                return {
                  ...v,
                  maxPlusOnes: safe,
                };
              })
            }
            inputProps={{
              min: 0, // Prevent negative user input on UI level
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ pr: 3, pb: 2 }}>
        <Button onClick={() => logic.setCreateOpen(false)}>Abbrechen</Button>
        <Button variant="contained" onClick={create}>
          Erstellen
        </Button>
      </DialogActions>
    </Dialog>
  );
}
