"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import type {
  CreatePlusOneInput,
  InvitationPayload,
  UpdatePlusOneInput,
} from "@/checkpoint/generated/graphql";
import { InvitationStatus } from "@/checkpoint/generated/graphql";
import useInvitationMutation from "@/checkpoint/hooks/invitation/useInvitationMutation";
import { formatEnum } from "@/checkpoint/i18n/format-enum";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import InvitationPlusOneDialog from "./InvitationPlusOneDialog";

interface Props {
  invitation: InvitationPayload;
  canManage: boolean;
  onChanged: () => void;
}

let optimisticIdCounter = 0;

function buildOptimisticPlusOne(input: CreatePlusOneInput): InvitationPayload {
  return {
    __typename: "InvitationPayload",
    id: `optimistic-${Date.now()}-${optimisticIdCounter++}`,
    eventId: input.eventId,
    eventName: null,
    eventEndsAt: null,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email ?? null,
    status: InvitationStatus.PENDING,
    plusOneAgeCategory: input.plusOneAgeCategory,
    phoneNumbers: (input.phoneNumbers ?? []).map((p) => ({
      __typename: "PhoneNumberPayload",
      id: `optimistic-phone-${optimisticIdCounter}`,
      infoId: "",
      createdAt: new Date().toISOString(),
      updatedAt: null,
      countryCode: p.countryCode,
      number: p.number,
      type: p.type,
      label: p.label ?? null,
      isPrimary: p.isPrimary ?? false,
    })),
    maxInvitees: 0,
    invitedByInvitationId: input.invitedByInvitationId,
    selectedInvitedBy: [],
    guestNote: null,
  } as unknown as InvitationPayload;
}

function applyOptimisticPatch(
  plusOne: InvitationPayload,
  input: UpdatePlusOneInput,
): InvitationPayload {
  return {
    ...plusOne,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email ?? null,
    plusOneAgeCategory: input.plusOneAgeCategory,
    phoneNumbers: (input.phoneNumbers ?? []).map((p) => ({
      __typename: "PhoneNumberPayload",
      id: p.label ? `${input.id}-phone-${p.label}` : `${input.id}-phone`,
      infoId: "",
      createdAt: new Date().toISOString(),
      updatedAt: null,
      countryCode: p.countryCode,
      number: p.number,
      type: p.type,
      label: p.label ?? null,
      isPrimary: p.isPrimary ?? false,
    })),
  };
}

function toInvitationPayload(plusOne: unknown): InvitationPayload {
  return plusOne as InvitationPayload;
}

export default function InvitationPlusOneSection({ invitation, canManage, onChanged }: Props) {
  const t = useTypedTranslations("invitation");
  const { enqueueSnackbar } = useSnackbar();
  const {
    createPlusOneMutation,
    updatePlusOneMutation,
    removePlusOneMutation,
    updateInvitationPlusOneLimitMutation,
  } = useInvitationMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<InvitationPayload | null>(null);

  const [plusOnes, setPlusOnes] = useState<InvitationPayload[]>(invitation.plusOnes ?? []);
  const [remaining, setRemaining] = useState(invitation.maxInvitees);
  const [limitValue, setLimitValue] = useState(String(invitation.maxInvitees));
  const [limitSaving, setLimitSaving] = useState(false);

  useEffect(() => {
    setPlusOnes(invitation.plusOnes ?? []);
    setRemaining(invitation.maxInvitees);
    setLimitValue(String((invitation.plusOnes?.length ?? 0) + invitation.maxInvitees));
  }, [invitation]);

  if (!canManage) {
    return null;
  }

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (plusOne: InvitationPayload) => {
    setEditing(plusOne);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
  };

  const handleCreate = async (input: CreatePlusOneInput): Promise<void> => {
    const optimistic = buildOptimisticPlusOne(input);
    setPlusOnes((prev) => [...prev, optimistic]);
    setRemaining((prev) => Math.max(0, prev - 1));

    try {
      const result = await createPlusOneMutation({
        variables: { input },
      });
      const created = result.data?.createPlusOnesInvitation;
      if (created) {
        setPlusOnes((prev) =>
          prev.map((plusOne) =>
            plusOne.id === optimistic.id ? toInvitationPayload(created) : plusOne,
          ),
        );
      }
      enqueueSnackbar(t("plusOnes.created"), { variant: "success" });
      onChanged();
    } catch {
      setPlusOnes((prev) => prev.filter((plusOne) => plusOne.id !== optimistic.id));
      setRemaining((prev) => prev + 1);
      enqueueSnackbar(t("plusOnes.errorCreate"), { variant: "error" });
    }
  };

  const handleUpdate = async (input: UpdatePlusOneInput): Promise<void> => {
    const snapshot = plusOnes;
    setPlusOnes((prev) =>
      prev.map((plusOne) =>
        plusOne.id === input.id ? applyOptimisticPatch(plusOne, input) : plusOne,
      ),
    );

    try {
      const result = await updatePlusOneMutation({
        variables: { input },
      });
      const updated = result.data?.updatePlusOnesInvitation;
      if (updated) {
        setPlusOnes((prev) =>
          prev.map((plusOne) => (plusOne.id === input.id ? toInvitationPayload(updated) : plusOne)),
        );
      }
      enqueueSnackbar(t("plusOnes.updated"), { variant: "success" });
      onChanged();
    } catch {
      setPlusOnes(snapshot);
      enqueueSnackbar(t("plusOnes.errorUpdate"), { variant: "error" });
    }
  };

  const handleRemove = async (plusOne: InvitationPayload): Promise<void> => {
    const snapshot = plusOnes;
    setPlusOnes((prev) => prev.filter((entry) => entry.id !== plusOne.id));
    setRemaining((prev) => prev + 1);

    try {
      await removePlusOneMutation({
        variables: { id: plusOne.id },
      });
      enqueueSnackbar(t("plusOnes.removed"), { variant: "success" });
      onChanged();
    } catch {
      setPlusOnes(snapshot);
      setRemaining((prev) => Math.max(0, prev - 1));
      enqueueSnackbar(t("plusOnes.errorRemove"), { variant: "error" });
    }
  };

  const usedCapacity = plusOnes.length;
  const totalCapacity = usedCapacity + remaining;
  const requestedLimit = Number(limitValue);
  const limitIsValid = Number.isInteger(requestedLimit) && requestedLimit >= usedCapacity;
  const limitHasChanged = limitIsValid && requestedLimit !== totalCapacity;

  const handleLimitSave = async (): Promise<void> => {
    if (!limitHasChanged || limitSaving) {
      return;
    }

    setLimitSaving(true);
    try {
      const result = await updateInvitationPlusOneLimitMutation({
        variables: { input: { id: invitation.id, maxPlusOnes: requestedLimit } },
      });
      const updated = result.data?.updateInvitationPlusOneLimit;
      if (!updated) {
        throw new Error("Plus-one limit update response was incomplete");
      }
      setRemaining(updated.maxInvitees);
      setLimitValue(String(usedCapacity + updated.maxInvitees));
      enqueueSnackbar(t("plusOnes.limitUpdated"), { variant: "success" });
      onChanged();
    } catch {
      enqueueSnackbar(t("plusOnes.errorLimitUpdate"), { variant: "error" });
    } finally {
      setLimitSaving(false);
    }
  };

  return (
    <Box>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <GroupRoundedIcon fontSize="small" color="primary" />
          <Typography variant="subtitle2">{t("plusOnes.manageTitle")}</Typography>
        </Stack>

        <Button
          size="small"
          variant="contained"
          startIcon={<AddRoundedIcon />}
          disabled={remaining < 1}
          onClick={openCreate}
        >
          {t("plusOnes.add")}
        </Button>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {t("plusOnes.remaining", { count: remaining })}
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 1.5 }}>
        <TextField
          label={t("plusOnes.limitLabel")}
          size="small"
          type="number"
          value={limitValue}
          onChange={(event) => setLimitValue(event.target.value)}
          error={Boolean(limitValue) && !limitIsValid}
          helperText={
            limitIsValid
              ? t("plusOnes.limitUsage", { assigned: usedCapacity, total: requestedLimit })
              : t("plusOnes.limitMinimum", { count: usedCapacity })
          }
          slotProps={{ htmlInput: { inputMode: "numeric", min: usedCapacity, step: 1 } }}
          sx={{ minWidth: { sm: 220 } }}
        />
        <Button
          disabled={!limitHasChanged || limitSaving}
          onClick={() => void handleLimitSave()}
          variant="outlined"
        >
          {t("plusOnes.saveLimit")}
        </Button>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {plusOnes.length === 0 ? (
        <Stack spacing={1} sx={{ alignItems: "center", py: 3, textAlign: "center" }}>
          <PersonRoundedIcon color="action" />
          <Typography variant="body2" color="text.secondary">
            {t("plusOnes.emptyTitle")}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("plusOnes.emptyManageDescription")}
          </Typography>
        </Stack>
      ) : (
        <Stack spacing={1}>
          {plusOnes.map((plusOne) => {
            const statusLabel = formatEnum(t, "plusOnes.status", plusOne.status);
            const primaryPhone =
              plusOne.phoneNumbers.find((phone) => phone.isPrimary) ?? plusOne.phoneNumbers[0];

            return (
              <Box
                key={plusOne.id}
                sx={{
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: (theme) => theme.palette.divider,
                  p: 1.5,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: "center", justifyContent: "space-between" }}
                >
                  <Stack spacing={0.5}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {plusOne.firstName} {plusOne.lastName}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      useFlexGap={true}
                      sx={{ flexWrap: "wrap", alignItems: "center" }}
                    >
                      <Chip size="small" label={statusLabel} variant="outlined" />
                      {plusOne.email ? (
                        <Chip
                          size="small"
                          icon={<EmailRoundedIcon />}
                          label={plusOne.email}
                          variant="outlined"
                        />
                      ) : null}
                      {primaryPhone ? (
                        <Chip
                          size="small"
                          icon={<PhoneIphoneRoundedIcon />}
                          label={`${primaryPhone.countryCode} ${primaryPhone.number}`}
                          variant="outlined"
                        />
                      ) : null}
                    </Stack>
                  </Stack>

                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title={t("plusOnes.actions.edit")}>
                      <IconButton aria-label="Edit plus-one" onClick={() => openEdit(plusOne)}>
                        <EditRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={t("plusOnes.actions.delete")}>
                      <IconButton
                        aria-label="Delete plus-one"
                        onClick={() => void handleRemove(plusOne)}
                      >
                        <DeleteRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      )}

      <InvitationPlusOneDialog
        open={dialogOpen}
        mode={editing ? "edit" : "create"}
        eventId={invitation.eventId}
        invitedByInvitationId={invitation.id}
        initialValue={editing}
        parentInvitation={invitation}
        onClose={closeDialog}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </Box>
  );
}
