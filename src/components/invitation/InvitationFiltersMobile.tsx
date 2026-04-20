"use client";

import {
  Box,
  Button,
  Chip,
  Drawer,
  Stack,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha,
} from "@mui/material";
import { useState, useMemo } from "react";
import { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

type StatusType = "PENDING" | "APPROVED" | "REJECTED" | "DECLINED" | "ACCEPTED";

export default function InvitationFiltersMobile({
  logic,
}: {
  logic: InvitationLogic;
}) {
  const theme = useTheme();
  const tInvitation = useTypedTranslations("invitation");
  const tCommon = useTypedTranslations("common");

  const [open, setOpen] = useState(false);

  const statuses: StatusType[] = [
    "PENDING",
    "APPROVED",
    "REJECTED",
    "DECLINED",
    "ACCEPTED",
  ];

  const children = logic.childEvents.filter(
    (child) => logic.rootEventId !== child.id,
  );

  const eventOptions = useMemo(() => {
    return [
      { id: "__ALL__", label: tCommon("all") },
      {
        id: logic.rootEventId,
        label: tInvitation("mainEvent", { name: logic.rootEventName }),
      },
      ...children.map((e) => ({ id: e.id, label: e.name })),
    ];
  }, [logic.childEvents, logic.rootEventId, logic.rootEventName]);

  return (
    <>
      {/* 🔥 TRIGGER BUTTON */}
      <Box sx={{ px: 2, pb: 1, background: theme.palette.background.paper }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => setOpen(true)}
          sx={{
            borderRadius: "14px",
            border: theme.palette.divider,
            justifyContent: 'center',
            alignItems: 'center',
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
            fullWidth
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

          {/* TYPE */}
          <Box>
            <Typography variant="caption">{tInvitation("type")}</Typography>

            <ToggleButtonGroup
              fullWidth
              value={logic.typeFilter ?? "ALL"}
              exclusive
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
              <ToggleButton value="PRIVATE">
                {tInvitation("typePrivate")}
              </ToggleButton>
              <ToggleButton value="PUBLIC">
                {tInvitation("typePublic")}
              </ToggleButton>
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
                    onClick={() =>
                      logic.setStatusFilter(active ? null : status)
                    }
                  />
                );
              })}
            </Stack>
          </Box>

          {/* CLOSE */}
          <Button
            fullWidth
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
