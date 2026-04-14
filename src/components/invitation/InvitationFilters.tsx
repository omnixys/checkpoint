"use client";

import React, { useMemo } from "react";
import {
  Box,
  Stack,
  TextField,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

type InvitationEventFilterOption = {
  id: string;
  label: string;
};

type InvitationFiltersLogic = {
  search: string;
  setSearch: (value: string) => void;

  statusFilter: string | null;
  setStatusFilter: (value: string | null) => void;

  typeFilter: string | null;
  setTypeFilter: (value: string | null) => void;

  /**
   * null = all events in current tree
   * rootEventId = only root event
   * childEventId = only that child event
   */
  eventFilter: string | null;
  setEventFilter: (value: string | null) => void;

  rootEventId: string;
  rootEventName: string;
  childEvents: Array<{
    id: string;
    name: string;
  }>;
};

export default function InvitationFilters({ logic }: { logic: InvitationFiltersLogic }) {
  const statuses = ["PENDING", "APPROVED", "REJECTED", "DECLINED", "ACCEPTED"];

  const children = logic.childEvents.filter((child) => logic.rootEventId !== child.id);
  const eventOptions = useMemo<InvitationEventFilterOption[]>(() => {
    return [
      {
        id: "__ALL__",
        label: "Alle",
      },
      {
        id: logic.rootEventId,
        label: `${logic.rootEventName} (Hauptevent)`,
      },
      ...children.map((event) => ({
        id: event.id,
        label: event.name,
      })),
    ];
  }, [logic.childEvents, logic.rootEventId, logic.rootEventName]);

  return (
    <Stack spacing={2}>
      <TextField
        fullWidth
        placeholder="Suchen nach Name, E-Mail oder Telefonnummer..."
        value={logic.search}
        onChange={(e) => logic.setSearch(e.target.value)}
      />

      <Box>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          Event
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1.2,
            overflowX: "auto",
            py: 0.5,
            mt: 0.5,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {eventOptions.map((event) => {
            const active =
              event.id === "__ALL__" ? logic.eventFilter === null : logic.eventFilter === event.id;

            return (
              <Chip
                key={event.id}
                label={event.label}
                onClick={() => {
                  if (event.id === "__ALL__") {
                    logic.setEventFilter(null);
                    return;
                  }

                  logic.setEventFilter(logic.eventFilter === event.id ? null : event.id);
                }}
                variant={active ? "filled" : "outlined"}
                color={active ? "primary" : "default"}
                sx={{
                  borderRadius: "12px",
                  whiteSpace: "nowrap",
                  px: 1.8,
                  fontWeight: 500,
                }}
              />
            );
          })}
        </Box>
      </Box>

      <Box>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          Typ
        </Typography>

        <ToggleButtonGroup
          value={logic.typeFilter ?? "ALL"}
          exclusive
          onChange={(_, value) => {
            if (!value || value === "ALL") {
              logic.setTypeFilter(null);
              return;
            }

            logic.setTypeFilter(value);
          }}
          size="small"
          sx={{ gap: 1, mt: 0.5, flexWrap: "wrap" }}
        >
          <ToggleButton value="ALL">Alle</ToggleButton>
          <ToggleButton value="PRIVATE">Private</ToggleButton>
          <ToggleButton value="PUBLIC">Public</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          Status
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1.2,
            overflowX: "auto",
            py: 0.5,
            mt: 0.5,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {statuses.map((status) => {
            const active = logic.statusFilter === status;

            return (
              <Chip
                key={status}
                label={status}
                onClick={() => logic.setStatusFilter(active ? null : status)}
                variant={active ? "filled" : "outlined"}
                color={active ? "primary" : "default"}
                sx={{
                  borderRadius: "12px",
                  whiteSpace: "nowrap",
                  px: 1.8,
                  fontWeight: 500,
                }}
              />
            );
          })}
        </Box>
      </Box>
    </Stack>
  );
}
