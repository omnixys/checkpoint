"use client";

import { useState, useEffect } from "react";
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

import { EventCategory, SettingsPayload } from "@/checkpoint/generated/graphql";

import { glassInputSx } from "@/checkpoint/themes/styles/glassInput";
import { mapSettingsPatchToInput } from "@/checkpoint/utils/event/settings.mapper";

const EVENT_CATEGORIES: EventCategory[] = [
  "GENERAL",
  "KONFERENZ",
  "MUSIK",
  "SOCIAL",
  "SPORTS",
  "WORKSHOP",
];

type FullSettingsPayload = SettingsPayload & {
  allowPublicRsvp?: boolean;
  allowPublicPlusOne?: boolean;
  allowPublicRsvpWebsite?: boolean;
  allowPlusOneUpdate?: boolean;
  publicRsvpWebsite?: string | null;
  isPublic?: boolean;
  category?: EventCategory;
};

type Props = {
  settings: SettingsPayload;
  actions: {
    updateSettings: (patch: any) => Promise<any>;
  };
};

function normalizeSettings(settings: SettingsPayload): FullSettingsPayload {
  const fullSettings = settings as FullSettingsPayload;

  return {
    ...settings,
    allowPublicRsvp: fullSettings.allowPublicRsvp ?? true,
    allowPublicPlusOne: fullSettings.allowPublicPlusOne ?? true,
    allowPublicRsvpWebsite: fullSettings.allowPublicRsvpWebsite ?? false,
    allowPlusOneUpdate: fullSettings.allowPlusOneUpdate ?? false,
    publicRsvpWebsite: fullSettings.publicRsvpWebsite ?? "",
    isPublic: fullSettings.isPublic ?? false,
    category: fullSettings.category ?? "GENERAL",
  };
}

function datetimeValue(value?: string | null) {
  return value ? dayjs(value).format("YYYY-MM-DDTHH:mm") : "";
}

export default function EventSettingsSection({ settings, actions }: Props) {
  const theme = useTheme();

  const [local, setLocal] = useState<FullSettingsPayload>(() => normalizeSettings(settings));
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setLocal(normalizeSettings(settings));
    setDirty(false);
  }, [settings]);

  const update = <K extends keyof FullSettingsPayload>(key: K, value: FullSettingsPayload[K]) => {
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
    };

    await actions.updateSettings(input);
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
            select
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
              fullWidth
              disabled={!local.allowPublicRsvpWebsite}
              label="Public RSVP Website"
              value={local.publicRsvpWebsite ?? ""}
              onChange={(e) => update("publicRsvpWebsite", e.target.value)}
              sx={inputSx}
            />
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
              fullWidth
              label="Rotate Seconds"
              type="number"
              value={local.rotateSeconds}
              onChange={(e) => update("rotateSeconds", Number(e.target.value))}
              sx={inputSx}
            />
            <TextField
              fullWidth
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
        </Stack>
      </Box>

      <Box sx={panelSx}>
        <Stack spacing={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Schedule
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Starts At"
              type="datetime-local"
              value={datetimeValue(local.startsAt)}
              onChange={(e) => update("startsAt", new Date(e.target.value).toISOString())}
              sx={inputSx}
            />
            <TextField
              fullWidth
              label="Ends At"
              type="datetime-local"
              value={datetimeValue(local.endsAt)}
              onChange={(e) => update("endsAt", new Date(e.target.value).toISOString())}
              sx={inputSx}
            />
          </Stack>
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
            multiline
            value={local.description ?? ""}
            onChange={(e) => update("description", e.target.value)}
            sx={inputSx}
          />
        </Stack>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          disabled={!dirty}
          onClick={handleSave}
          startIcon={<SaveIcon />}
          variant="contained"
        >
          Save Settings
        </Button>
      </Box>
    </Stack>
  );
}
