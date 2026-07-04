"use client";

// TODO optimieren mit InvitationFiltersMobile

import {
  alpha,
  Box,
  Chip,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { useMemo } from "react";
import type { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

interface InvitationEventFilterOption {
  id: string;
  label: string;
}

type StatusType = "PENDING" | "APPROVED" | "REJECTED" | "DECLINED" | "ACCEPTED";

export default function InvitationFilters({ logic }: { logic: InvitationLogic }) {
  const theme = useTheme();
  const tInvitation = useTypedTranslations("invitation");
  const tCommon = useTypedTranslations("common");

  const statuses: StatusType[] = ["PENDING", "APPROVED", "REJECTED", "DECLINED", "ACCEPTED"];

  const subEvents = logic.subEvents?.filter((child) => logic.rootEventId !== child.id);

  const eventOptions = useMemo<InvitationEventFilterOption[]>(
    () => [
      {
        id: "__ALL__",
        label: tCommon("all"),
      },
      {
        id: logic.rootEventId,
        label: tInvitation("mainEvent", { name: logic.rootEventName }),
      },
      ...(subEvents?.map((event) => ({
        id: event.id,
        label: event.name,
      })) ?? []),
    ],
    [logic.rootEventId, logic.rootEventName, tInvitation, tCommon, subEvents?.map],
  );

  return (
    <Box
      sx={{
        position: "relative",
        px: { xs: 1.5, md: 3 },
        pb: 2,

        overflow: "hidden",

        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",

        background: theme.palette.background.paper,

        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",

        // ✅ GLOW LINE
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(
        to right,
        transparent,
        ${theme.palette.primary.main}88,
        transparent
      )`,
        },

        // ✅ GLASS BORDER (SEPARAT!)
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          border: "1px solid rgba(255,255,255,0.08)",
          pointerEvents: "none",
        },
      }}
    >
      <Stack spacing={1}>
        <TextField
          fullWidth={true}
          placeholder={tInvitation("searchPlaceholder")}
          value={logic.search}
          onChange={(e) => logic.setSearch(e.target.value)}
          sx={{
            pt: 0.75,
            "& .MuiInputBase-root": {
              borderRadius: "12px",
              background: alpha(theme.palette.background.paper, 0.6),
              backdropFilter: "blur(12px)",
            },
          }}
        />

        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={2}
          sx={{
            alignItems: { xs: "stretch", lg: "center" },
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {tInvitation("event")}
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
                  event.id === "__ALL__"
                    ? logic.eventFilter === null
                    : logic.eventFilter === event.id;

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

          {logic.selectedInvitedByOptions.length > 0 && (
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {tInvitation("detail.selectedInvitedBy")}
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
                <Chip
                  label={tCommon("all")}
                  onClick={() => logic.setSelectedInvitedByFilter(null)}
                  variant={logic.selectedInvitedByFilter === null ? "filled" : "outlined"}
                  color={logic.selectedInvitedByFilter === null ? "primary" : "default"}
                  sx={{ borderRadius: "12px", whiteSpace: "nowrap", px: 1.8, fontWeight: 500 }}
                />

                {logic.selectedInvitedByOptions.map((option) => {
                  const active = logic.selectedInvitedByFilter === option;

                  return (
                    <Chip
                      key={option}
                      label={option}
                      onClick={() => logic.setSelectedInvitedByFilter(active ? null : option)}
                      variant={active ? "filled" : "outlined"}
                      color={active ? "primary" : "default"}
                      sx={{ borderRadius: "12px", whiteSpace: "nowrap", px: 1.8, fontWeight: 500 }}
                    />
                  );
                })}
              </Box>
            </Box>
          )}

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {tInvitation("type")}
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
              <ToggleButtonGroup
                value={logic.typeFilter ?? "ALL"}
                exclusive={true}
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
                <ToggleButton value="ALL">{tCommon("all")}</ToggleButton>

                <ToggleButton value="PRIVATE">{tInvitation("typePrivate")}</ToggleButton>

                <ToggleButton value="PUBLIC">{tInvitation("typePublic")}</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {tInvitation("status")}
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
                    label={tInvitation(`statusType.${status}`)}
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
      </Stack>
    </Box>
  );
}
