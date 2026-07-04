"use client";
// TODO optimieren mit InvitationFilters

import {
  alpha,
  Box,
  Button,
  Chip,
  Drawer,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import type { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

type StatusType = "PENDING" | "APPROVED" | "REJECTED" | "DECLINED" | "ACCEPTED";

export default function InvitationFiltersMobile({ logic }: { logic: InvitationLogic }) {
  const theme = useTheme();
  const tInvitation = useTypedTranslations("invitation");
  const tCommon = useTypedTranslations("common");

  const [open, setOpen] = useState(false);

  const statuses: StatusType[] = ["PENDING", "APPROVED", "REJECTED", "DECLINED", "ACCEPTED"];

  const subEvents = logic.subEvents?.filter((child) => logic.rootEventId !== child.id);

  const eventOptions = useMemo(
    () => [
      { id: "__ALL__", label: tCommon("all") },
      {
        id: logic.rootEventId,
        label: tInvitation("mainEvent", { name: logic.rootEventName }),
      },
      ...(subEvents?.map((e) => ({ id: e.id, label: e.name })) ?? []),
    ],
    [logic.rootEventId, logic.rootEventName, tInvitation, tCommon, subEvents?.map],
  );

  return (
    <>
      {/* 🔥 TRIGGER BUTTON */}
      <Box sx={{ px: 2, pb: 1, background: theme.palette.background.paper }}>
        <Button
          fullWidth={true}
          variant="outlined"
          onClick={() => setOpen(true)}
          sx={{
            borderRadius: "14px",
            border: theme.palette.divider,
            justifyContent: "center",
            alignItems: "center",
            letterSpacing: 2,
            mt: 1,
          }}
        >
          {tInvitation("filters.title")}
        </Button>
      </Box>

      {/* 🔥 BOTTOM SHEET */}
      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            sx: {
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              p: 2,
              backdropFilter: "blur(20px)",
              background: alpha(theme.palette.background.paper, 0.9),
            },
          },
        }}
      >
        <Stack spacing={2}>
          {/* SEARCH */}
          <TextField
            fullWidth={true}
            placeholder={tInvitation("searchPlaceholder")}
            value={logic.search}
            onChange={(e) => logic.setSearch(e.target.value)}
          />

          {/* EVENT */}
          <Box>
            <Typography variant="caption">{tInvitation("event")}</Typography>

            <Stack
              direction="row"
              sx={{
                flexWrap: "wrap",
                mt: 1,
                gap: 1,
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
                    color={active ? "primary" : "default"}
                    onClick={() => {
                      if (event.id === "__ALL__") {
                        logic.setEventFilter(null);
                        return;
                      }
                      logic.setEventFilter(event.id);
                    }}
                  />
                );
              })}
            </Stack>
          </Box>

          {/* SELECTED INVITED BY */}
          {logic.selectedInvitedByOptions.length > 0 && (
            <Box>
              <Typography variant="caption">{tInvitation("detail.selectedInvitedBy")}</Typography>

              <Stack direction="row" sx={{ flexWrap: "wrap", mt: 1, gap: 1 }}>
                <Chip
                  label={tCommon("all")}
                  color={logic.selectedInvitedByFilter === null ? "primary" : "default"}
                  onClick={() => logic.setSelectedInvitedByFilter(null)}
                />

                {logic.selectedInvitedByOptions.map((option) => {
                  const active = logic.selectedInvitedByFilter === option;

                  return (
                    <Chip
                      key={option}
                      label={option}
                      color={active ? "primary" : "default"}
                      onClick={() => logic.setSelectedInvitedByFilter(active ? null : option)}
                    />
                  );
                })}
              </Stack>
            </Box>
          )}

          {/* TYPE */}
          <Box>
            <Typography variant="caption">{tInvitation("type")}</Typography>

            <ToggleButtonGroup
              fullWidth={true}
              value={logic.typeFilter ?? "ALL"}
              exclusive={true}
              onChange={(_, value) => {
                if (!value || value === "ALL") {
                  logic.setTypeFilter(null);
                } else {
                  logic.setTypeFilter(value);
                }
              }}
              sx={{ mt: 1 }}
            >
              <ToggleButton value="ALL">{tCommon("all")}</ToggleButton>
              <ToggleButton value="PRIVATE">{tInvitation("typePrivate")}</ToggleButton>
              <ToggleButton value="PUBLIC">{tInvitation("typePublic")}</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* STATUS */}
          <Box>
            <Typography variant="caption">{tInvitation("status")}</Typography>

            <Stack
              direction="row"
              sx={{
                flexWrap: "wrap",
                mt: 1,
                gap: 1,
              }}
            >
              {statuses.map((status) => {
                const active = logic.statusFilter === status;

                return (
                  <Chip
                    key={status}
                    label={tInvitation(`statusType.${status}`)}
                    color={active ? "primary" : "default"}
                    onClick={() => logic.setStatusFilter(active ? null : status)}
                  />
                );
              })}
            </Stack>
          </Box>

          {/* CLOSE */}
          <Button
            fullWidth={true}
            variant="contained"
            onClick={() => setOpen(false)}
            sx={{ mt: 1 }}
          >
            {tCommon("done")}
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}
