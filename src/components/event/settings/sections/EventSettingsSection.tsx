"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import type {
  EventCategory,
  GetEventSettingsQuery,
  InvitationApprovalMode,
} from "@/checkpoint/generated/graphql";

import { glassInputSx } from "@/checkpoint/themes/styles/glassInput";
import type { Safe } from "@/checkpoint/types/core/core.type";
import { mapSettingsPatchToInput } from "@/checkpoint/utils/event/settings.mapper";

const EVENT_CATEGORIES: EventCategory[] = [
  "GENERAL",
  "KONFERENZ",
  "MUSIK",
  "SOCIAL",
  "SPORTS",
  "WORKSHOP",
];

const APPROVAL_MODES: InvitationApprovalMode[] = [
  "MANUAL",
  "AUTO",
  "AUTO_INVITE_ONLY",
  "AUTO_PUBLIC_ONLY",
];

type SettingsType = Safe<Safe<GetEventSettingsQuery["event"]>["settings"]>;

interface Props {
  settings: SettingsType;
  actions: {
    updateSettings: (patch: any) => Promise<any>;
  };
}

function normalizeSettings(settings: SettingsType) {
  const fullSettings = settings;

  return {
    ...settings,
    allowPublicRsvp: fullSettings.allowPublicRsvp ?? true,
    allowPublicPlusOne: fullSettings.allowPublicPlusOne ?? true,
    allowPublicRsvpWebsite: fullSettings.allowPublicRsvpWebsite ?? false,
    allowPlusOneUpdate: fullSettings.allowPlusOneUpdate ?? false,
    publicRsvpWebsite: fullSettings.publicRsvpWebsite ?? "",
    isPublic: fullSettings.isPublic ?? false,
    category: fullSettings.category ?? "GENERAL",

    approvalMode: fullSettings.approvalMode ?? "MANUAL",
    maxPlusOnes: fullSettings.maxPlusOnes ?? 0,
    requireApprovalForPlusOnes: fullSettings.requireApprovalForPlusOnes ?? true,
    rsvpDeadline: fullSettings.rsvpDeadline ?? null,

    allowGuestSeatSelection: fullSettings.allowGuestSeatSelection ?? false,
    allowSeatOverbooking: fullSettings.allowSeatOverbooking ?? false,
    invitedByOptions: fullSettings.invitedByOptions ?? [],
    ticketReleaseAt: fullSettings.ticketReleaseAt ?? null,
  };
}

function datetimeValue(value?: string | null) {
  return value ? dayjs(value).format("YYYY-MM-DDTHH:mm") : "";
}

function normalizeOptionList(values: string[]) {
  return values
    .map((value) => value.trim())
    .filter((value, index, all) => value.length > 0 && all.indexOf(value) === index);
}

function splitOptions(value: string) {
  return normalizeOptionList(value.split(/[\n,]+/));
}

export default function EventSettingsSection({ settings, actions }: Props) {
  const theme = useTheme();

  const [local, setLocal] = useState<SettingsType>(() => normalizeSettings(settings));
  const [dirty, setDirty] = useState(false);
  const [optionInput, setOptionInput] = useState("");

  useEffect(() => {
    setLocal(normalizeSettings(settings));
    setDirty(false);
  }, [settings]);

  const update = <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSave = async () => {
    setDirty(false);

    const input = {
      ...mapSettingsPatchToInput(settings, local),
      allowPublicRsvp: local.allowPublicRsvp,
      allowPublicPlusOne: local.allowPublicPlusOne,
      allowPublicRsvpWebsite: local.allowPublicRsvpWebsite,
      allowPlusOneUpdate: local.allowPlusOneUpdate,
      publicRsvpWebsite: local.publicRsvpWebsite?.trim() || null,
      isPublic: local.isPublic,
      category: local.category,
      approvalMode: local.approvalMode,
      maxPlusOnes: local.maxPlusOnes,
      requireApprovalForPlusOnes: local.requireApprovalForPlusOnes,
      rsvpDeadline: local.rsvpDeadline ? new Date(local.rsvpDeadline) : null,
      ticketReleaseAt: local.ticketReleaseAt ? new Date(local.ticketReleaseAt) : null,
      allowGuestSeatSelection: local.allowGuestSeatSelection,
      allowSeatOverbooking: local.allowSeatOverbooking,
      invitedByOptions: normalizeOptionList(local.invitedByOptions ?? []),
    };

    await actions.updateSettings(input);
  };

  const addInvitedByOptions = (values: string[]) => {
    const next = normalizeOptionList([...(local.invitedByOptions ?? []), ...values]);

    update("invitedByOptions", next);
    setOptionInput("");
  };

  const removeInvitedByOption = (value: string) => {
    update(
      "invitedByOptions",
      (local.invitedByOptions ?? []).filter((option) => option !== value),
    );
  };

  const panelSx = {
    p: 2.5,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 2,
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.72)",
    boxShadow: theme.palette.mode === "dark" ? "none" : "0 10px 30px rgba(15,23,42,0.06)",
  };

  const inputSx = glassInputSx(theme);

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between" }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Event Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visibility, RSVP, capacity and schedule.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Chip
            color={local.isActive ? "success" : "default"}
            label={local.isActive ? "Active" : "Inactive"}
            size="small"
          />
          <Chip
            color={local.isPublic ? "primary" : "default"}
            label={local.isPublic ? "Public" : "Private"}
            size="small"
            variant={local.isPublic ? "filled" : "outlined"}
          />
        </Stack>
      </Stack>

      <Box sx={panelSx}>
        <Stack spacing={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Status & Visibility
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={local.isActive}
                  onChange={(e) => update("isActive", e.target.checked)}
                />
              }
              label="Active"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(local.isPublic)}
                  onChange={(e) => update("isPublic", e.target.checked)}
                />
              }
              label="Public Event"
            />
          </Stack>

          <TextField
            select={true}
            label="Category"
            value={local.category ?? "GENERAL"}
            onChange={(e) => update("category", e.target.value as EventCategory)}
            sx={inputSx}
          >
            {EVENT_CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Box>

      <Box sx={panelSx}>
        <Stack spacing={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            RSVP
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(local.allowPublicRsvp)}
                  onChange={(e) => update("allowPublicRsvp", e.target.checked)}
                />
              }
              label="Public RSVP"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(local.allowPublicPlusOne)}
                  onChange={(e) => update("allowPublicPlusOne", e.target.checked)}
                />
              }
              label="Public Plus One"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(local.allowPlusOneUpdate)}
                  onChange={(e) => update("allowPlusOneUpdate", e.target.checked)}
                />
              }
              label="Allow Plus One Updates"
            />
          </Stack>

          <Divider />

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              select={true}
              fullWidth={true}
              label="Approval Mode"
              value={local.approvalMode ?? "MANUAL"}
              onChange={(e) => update("approvalMode", e.target.value as InvitationApprovalMode)}
              sx={inputSx}
            >
              {APPROVAL_MODES.map((mode) => (
                <MenuItem key={mode} value={mode}>
                  {mode}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth={true}
              label="Max Plus Ones"
              type="number"
              value={local.maxPlusOnes ?? 0}
              onChange={(e) => update("maxPlusOnes", Number(e.target.value))}
              sx={inputSx}
            />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(local.requireApprovalForPlusOnes)}
                  onChange={(e) => update("requireApprovalForPlusOnes", e.target.checked)}
                />
              }
              label="Automatically Approve Plus Ones"
              sx={{ minWidth: 180 }}
            />
            <TextField
              fullWidth={true}
              label="RSVP Deadline"
              type="datetime-local"
              value={datetimeValue(local.rsvpDeadline)}
              onChange={(e) =>
                update(
                  "rsvpDeadline",
                  e.target.value ? new Date(e.target.value).toISOString() : null,
                )
              }
              sx={inputSx}
            />
          </Stack>

          <Divider />

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(local.allowPublicRsvpWebsite)}
                  onChange={(e) => update("allowPublicRsvpWebsite", e.target.checked)}
                />
              }
              label="RSVP Website"
              sx={{ minWidth: 180 }}
            />
            <TextField
              fullWidth={true}
              disabled={!local.allowPublicRsvpWebsite}
              label="Public RSVP Website"
              value={local.publicRsvpWebsite ?? ""}
              onChange={(e) => update("publicRsvpWebsite", e.target.value)}
              sx={inputSx}
            />
          </Stack>

          <Divider />

          <Stack spacing={1.5}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                RSVP source options
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Optional choices shown as checkboxes in public RSVP.
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <TextField
                fullWidth={true}
                label="Add source option"
                value={optionInput}
                onChange={(event) => setOptionInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addInvitedByOptions(splitOptions(optionInput));
                  }
                }}
                onPaste={(event) => {
                  const values = splitOptions(event.clipboardData.getData("text"));

                  if (values.length > 1) {
                    event.preventDefault();
                    addInvitedByOptions(values);
                  }
                }}
                sx={inputSx}
              />
              <Button
                disabled={splitOptions(optionInput).length === 0}
                onClick={() => addInvitedByOptions(splitOptions(optionInput))}
                startIcon={<AddRoundedIcon />}
                sx={{ minHeight: 48, minWidth: { sm: 140 } }}
                variant="outlined"
              >
                Add
              </Button>
            </Stack>

            {(local.invitedByOptions ?? []).length > 0 && (
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }} useFlexGap={true}>
                {(local.invitedByOptions ?? []).map((option) => (
                  <Chip
                    key={option}
                    label={option}
                    onDelete={() => removeInvitedByOption(option)}
                    variant="outlined"
                  />
                ))}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Box>

      <Box sx={panelSx}>
        <Stack spacing={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Capacity & Security
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              fullWidth={true}
              label="Rotate Seconds"
              type="number"
              value={local.rotateSeconds}
              onChange={(e) => update("rotateSeconds", Number(e.target.value))}
              sx={inputSx}
            />
            <TextField
              fullWidth={true}
              label="Max Seats"
              type="number"
              value={local.maxSeats}
              onChange={(e) => update("maxSeats", Number(e.target.value))}
              sx={inputSx}
            />
          </Stack>
          <FormControlLabel
            control={
              <Switch
                checked={local.allowReEntry}
                onChange={(e) => update("allowReEntry", e.target.checked)}
              />
            }
            label="Allow Re-Entry"
          />
          <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(local.allowGuestSeatSelection)}
                  onChange={(e) => update("allowGuestSeatSelection", e.target.checked)}
                />
              }
              label="Allow Guest Seat Selection"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(local.allowSeatOverbooking)}
                  onChange={(e) => update("allowSeatOverbooking", e.target.checked)}
                />
              }
              label="Allow Seat Overbooking"
            />
          </Stack>
        </Stack>
      </Box>

      <Box sx={panelSx}>
        <Stack spacing={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Schedule
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              fullWidth={true}
              label="Starts At"
              type="datetime-local"
              value={datetimeValue(local.startsAt)}
              onChange={(e) => update("startsAt", new Date(e.target.value).toISOString())}
              sx={inputSx}
            />
            <TextField
              fullWidth={true}
              label="Ends At"
              type="datetime-local"
              value={datetimeValue(local.endsAt)}
              onChange={(e) => update("endsAt", new Date(e.target.value).toISOString())}
              sx={inputSx}
            />
          </Stack>
          <TextField
            fullWidth={true}
            label="Ticket Release At"
            type="datetime-local"
            value={datetimeValue(local.ticketReleaseAt as string | null | undefined)}
            onChange={(e) =>
              update(
                "ticketReleaseAt" as keyof SettingsType,
                e.target.value ? new Date(e.target.value).toISOString() : null,
              )
            }
            helperText="If set, ticket/QR generation is delayed until this time instead of happening immediately on approval."
            sx={inputSx}
          />
        </Stack>
      </Box>

      <Box sx={panelSx}>
        <Stack spacing={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Guest Information
          </Typography>
          <TextField
            label="Dress Code"
            value={local.dressCode ?? ""}
            onChange={(e) => update("dressCode", e.target.value)}
            sx={inputSx}
          />
          <TextField
            label="Description"
            minRows={4}
            multiline={true}
            value={local.description ?? ""}
            onChange={(e) => update("description", e.target.value)}
            sx={inputSx}
          />
        </Stack>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button disabled={!dirty} onClick={handleSave} startIcon={<SaveIcon />} variant="contained">
          Save Settings
        </Button>
      </Box>
    </Stack>
  );
}
