"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Stack,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { glassInputSx } from "@/checkpoint/themes/styles/glassInput";
import { alpha, useTheme } from "@mui/material/styles";
import { TimelineImportExport } from "@/checkpoint/components/event/settings/sections/timeline/TimelineImportExport";
import TimelineTicketPreview from "@/checkpoint/components/event/settings/sections/timeline/TimelineTicketPreview";
import TimelineActionsToolbar from "@/checkpoint/components/event/settings/sections/timeline/TimelineActionsToolbar";
import { TimelineDesign } from "@/checkpoint/components/event/settings/sections/timeline/TimelineRenderer";

export type TimelineItem = {
  id: string;
  type: string;
  label: string;
  timestamp: string;
};

type Props = {
  eventName: string;
  timeline: TimelineItem[];
  actions: {
    addTimeline: (items: TimelineItem[]) => Promise<unknown>;
    updateTimeline: (items: TimelineItem[]) => Promise<unknown>;
    removeTimeline: (ids: string[]) => Promise<unknown>;
  };
};

type DraftTimelineItem = {
  id: string;
  label: string;
  type: string;
  timestamp: string;
};

const DEFAULT_TIME = "18:00";
const DEFAULT_TYPE = "INFO";

const TIMELINE_TYPE_OPTIONS = ["INFO", "PROGRAM", "CHECKIN", "CHECKOUT", "CUSTOM"] as const;

const TICKET_DESIGN_OPTIONS: ReadonlyArray<{
  value: TimelineDesign;
  label: string;
}> = [
  { value: "vip", label: "VIP" },
  { value: "birthday", label: "Birthday" },
  { value: "newyear", label: "New Year" },
  { value: "christmas", label: "Christmas" },
  { value: "party", label: "Party" },
  { value: "luxury", label: "Luxury" },
  { value: "minimal", label: "Minimal" },
];

/**
 * TimelineSection
 *
 * Responsibilities:
 * - Display timeline entries
 * - Allow local editing before save
 * - Allow add/remove actions
 * - Persist changes only when the user explicitly saves
 *
 * Notes:
 * - This component intentionally buffers local changes
 * - Requests are not sent automatically
 * - Add / Update / Remove are persisted via dedicated save buttons
 */
export default function TimelineSection({ timeline, actions, eventName }: Props) {
  const theme = useTheme();

  const [local, setLocal] = useState<TimelineItem[]>(timeline);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [dirtyUpdates, setDirtyUpdates] = useState(false);
  const [dirtyAdds, setDirtyAdds] = useState(false);
  const [dirtyRemovals, setDirtyRemovals] = useState(false);
  const [design, setDesign] = useState<TimelineDesign>("vip");

  const [draft, setDraft] = useState<DraftTimelineItem>({
    id: "",
    label: "",
    type: DEFAULT_TYPE,
    timestamp: buildTimestampFromTime(DEFAULT_TIME),
  });

  useEffect(() => {
    setLocal(timeline);
    setRemovedIds([]);
    setDirtyUpdates(false);
    setDirtyAdds(false);
    setDirtyRemovals(false);
  }, [timeline]);

  /**
   * Tracks items that do not yet exist on the server.
   * These are created locally first and persisted only when the user clicks save.
   */
  const newItems = useMemo(() => {
    const existingIds = new Set(timeline.map((item) => item.id));
    return local.filter((item) => !existingIds.has(item.id));
  }, [local, timeline]);

  /**
   * Tracks existing server items that were edited locally.
   */
  const updatedItems = useMemo(() => {
    const originalMap = new Map(timeline.map((item) => [item.id, item]));

    return local.filter((item) => {
      const original = originalMap.get(item.id);

      if (!original) {
        return false;
      }

      return (
        original.label !== item.label ||
        original.type !== item.type ||
        original.timestamp !== item.timestamp
      );
    });
  }, [local, timeline]);

  /**
   * Updates a single timeline item in local state.
   */
  const updateItem = (id: string, patch: Partial<TimelineItem>) => {
    setLocal((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    setDirtyUpdates(true);
  };

  /**
   * Adds a new local timeline item.
   * The item is only persisted when the user clicks "Save New Entries".
   */
  const handleAddLocal = () => {
    const trimmedLabel = draft.label.trim();
    const trimmedType = draft.type.trim();

    if (!trimmedLabel || !trimmedType) {
      return;
    }

    const newItem: TimelineItem = {
      id: crypto.randomUUID(),
      label: trimmedLabel,
      type: trimmedType,
      timestamp: draft.timestamp,
    };

    setLocal((prev) => [...prev, newItem]);
    setDirtyAdds(true);

    setDraft({
      id: "",
      label: "",
      type: DEFAULT_TYPE,
      timestamp: buildTimestampFromTime(DEFAULT_TIME),
    });
  };

  /**
   * Removes a timeline item locally.
   * Existing server items are tracked separately for removal persistence.
   */
  const handleRemoveLocal = (id: string) => {
    const existsOnServer = timeline.some((item) => item.id === id);

    if (existsOnServer) {
      setRemovedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      setDirtyRemovals(true);
    }

    setLocal((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   * Persists newly created items.
   */
  const handleSaveAdds = async () => {
    if (newItems.length === 0) {
      return;
    }

    validateTimelineItems(newItems);
    await actions.addTimeline(newItems);
    setDirtyAdds(false);
  };

  /**
   * Persists modified items.
   */
  const handleSaveUpdates = async () => {
    if (updatedItems.length === 0) {
      return;
    }

    validateTimelineItems(updatedItems);
    await actions.updateTimeline(updatedItems);
    setDirtyUpdates(false);
  };

  /**
   * Persists removed item ids.
   */
  const handleSaveRemovals = async () => {
    if (removedIds.length === 0) {
      return;
    }

    await actions.removeTimeline(removedIds);
    setRemovedIds([]);
    setDirtyRemovals(false);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h6">Timeline</Typography>

      <Box
        sx={{
          p: 3,
          borderRadius: 4,
          backdropFilter: "blur(20px)",
          background: `linear-gradient(135deg,
            ${alpha(theme.palette.primary.main, 0.08)},
            ${alpha(theme.palette.secondary.main, 0.05)}
          )`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
        }}
      >
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Stack spacing={0.5}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                Timeline Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Importiere, prüfe und exportiere deine Event Timeline.
              </Typography>
            </Stack>

            <TextField
              select
              label="Ticket Design"
              value={design}
              onChange={(e) => setDesign(e.target.value as TimelineDesign)}
              sx={{
                minWidth: { xs: "100%", sm: 220 },
                ...glassInputSx(theme),
              }}
            >
              {TICKET_DESIGN_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <TimelineImportExport
            onImport={(items) => {
              setLocal((prev) => [...prev, ...items]);
              setDirtyAdds(true);
            }}
          />

          <TimelineActionsToolbar items={local} title={eventName} design={design} />
        </Stack>
      </Box>

      <Divider />

      <TimelineTicketPreview items={local} title={eventName} design="vip" />

      <Divider />
      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          backdropFilter: "blur(10px)",
          backgroundColor:
            theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
        }}
      >
        <Stack spacing={2}>
          <Typography variant="subtitle1">Add Entry</Typography>

          <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
            <TextField
              label="Label"
              value={draft.label}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  label: e.target.value,
                }))
              }
              fullWidth
              sx={glassInputSx(theme)}
            />

            <TextField
              select
              label="Type"
              value={draft.type}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  type: e.target.value,
                }))
              }
              sx={{ minWidth: 160, ...glassInputSx(theme) }}
            >
              <MenuItem value="INFO">INFO</MenuItem>
              <MenuItem value="PROGRAM">PROGRAM</MenuItem>
              <MenuItem value="CHECKIN">CHECKIN</MenuItem>
              <MenuItem value="CHECKOUT">CHECKOUT</MenuItem>
              <MenuItem value="CUSTOM">CUSTOM</MenuItem>
            </TextField>

            <TextField
              label="Time"
              type="time"
              value={dayjs(draft.timestamp).format("HH:mm")}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  timestamp: buildTimestampFromTime(e.target.value, prev.timestamp),
                }))
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
                htmlInput: {
                  step: 60,
                },
              }}
              sx={{ minWidth: 140, ...glassInputSx(theme) }}
            />

            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddLocal}>
              Add
            </Button>
          </Stack>

          <Button
            variant="contained"
            disabled={!dirtyAdds || newItems.length === 0}
            onClick={handleSaveAdds}
          >
            Save New Entries
          </Button>
        </Stack>
      </Box>

      <Divider />

      <Stack spacing={2}>
        {local.map((item) => (
          <Box
            key={item.id}
            sx={{
              p: 2,
              borderRadius: 3,
              backdropFilter: "blur(10px)",
              backgroundColor:
                theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1}
              sx={{
                alignItems: "center",
              }}
            >
              <TextField
                label="Label"
                value={item.label}
                onChange={(e) =>
                  updateItem(item.id, {
                    label: e.target.value,
                  })
                }
                fullWidth
                sx={glassInputSx(theme)}
              />

              <TextField
                select
                label="Type"
                value={item.type}
                onChange={(e) =>
                  updateItem(item.id, {
                    type: e.target.value,
                  })
                }
                sx={{ minWidth: 160, ...glassInputSx(theme) }}
              >
                <MenuItem value="INFO">INFO</MenuItem>
                <MenuItem value="PROGRAM">PROGRAM</MenuItem>
                <MenuItem value="CHECKIN">CHECKIN</MenuItem>
                <MenuItem value="CHECKOUT">CHECKOUT</MenuItem>
                <MenuItem value="CUSTOM">CUSTOM</MenuItem>
              </TextField>

              <TextField
                label="Time"
                type="time"
                value={dayjs(item.timestamp).format("HH:mm")}
                onChange={(e) =>
                  updateItem(item.id, {
                    timestamp: buildTimestampFromTime(e.target.value, item.timestamp),
                  })
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                  htmlInput: {
                    step: 60,
                  },
                }}
                sx={{ minWidth: 140, ...glassInputSx(theme) }}
              />

              <IconButton onClick={() => handleRemoveLocal(item.id)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Box>
        ))}
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
        <Button
          variant="contained"
          disabled={!dirtyUpdates || updatedItems.length === 0}
          onClick={handleSaveUpdates}
        >
          Save Changes
        </Button>

        <Button
          variant="outlined"
          color="error"
          disabled={!dirtyRemovals || removedIds.length === 0}
          onClick={handleSaveRemovals}
        >
          Save Removals
        </Button>
      </Stack>
    </Stack>
  );
}

/**
 * Builds a stable ISO timestamp using HH:mm input.
 * If a base timestamp exists, its date is preserved.
 * Otherwise, today's date is used.
 */
function buildTimestampFromTime(time: string, baseTimestamp?: string): string {
  const [hourString, minuteString] = time.split(":");
  const hour = Number(hourString);
  const minute = Number(minuteString);

  const base = baseTimestamp ? dayjs(baseTimestamp) : dayjs();

  return base.hour(hour).minute(minute).second(0).millisecond(0).toISOString();
}

/**
 * Validates timeline items before sending them to the API.
 * This prevents invalid GraphQL payloads for required fields.
 */
function validateTimelineItems(items: TimelineItem[]): void {
  for (const item of items) {
    if (!item.id) {
      throw new Error("Timeline item is missing id.");
    }

    if (!item.label.trim()) {
      throw new Error("Timeline item is missing label.");
    }

    if (!item.type.trim()) {
      throw new Error("Timeline item is missing type.");
    }

    if (!item.timestamp) {
      throw new Error("Timeline item is missing timestamp.");
    }

    if (Number.isNaN(new Date(item.timestamp).getTime())) {
      throw new Error("Timeline item has an invalid timestamp.");
    }
  }
}
