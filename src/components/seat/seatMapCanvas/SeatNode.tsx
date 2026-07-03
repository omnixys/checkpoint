"use client";

import { Box, Chip, Popover, Typography, useTheme } from "@mui/material";
import React from "react";
import type { PresenceState } from "@/checkpoint/generated/schema";

interface Props {
  seatId: string;
  seatNumber: number | null;
  x: number | null;
  y: number | null;
  rotation: number | null;
  presence?: {
    presenceState: PresenceState;
    checkedInAt?: string | null;
    revoked?: boolean;
    revokedAt?: string | null;
  } | null;
  isOccupied: boolean;
  occupantName?: string | undefined;
  isOwnSeat?: boolean | undefined;
  highlighted?: boolean | undefined;
  role?: string | undefined;

  // Editor props
  isEditing?: boolean;
  isSelected?: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
}

export default function SeatNode({
  seatId,
  seatNumber,
  x,
  y,
  rotation,
  presence,
  isOccupied,
  occupantName,
  isOwnSeat,
  highlighted,
  role,
  isEditing = false,
  isSelected = false,
  onMouseDown,
  onClick,
}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const isFilterActive = highlighted !== undefined;

  const theme = useTheme();

  const backgroundColor = React.useMemo(() => {
    if (presence?.revoked) {
      return theme.palette.warning.dark;
    }
    if (presence?.presenceState === "INSIDE") {
      return theme.palette.info.main;
    }
    if (isOwnSeat) {
      return theme.palette.primary.main;
    }
    if (isOccupied) {
      return theme.palette.error.main;
    }
    return theme.palette.grey[900];
  }, [theme, presence, isOccupied, isOwnSeat]);

  const label = seatNumber?.toString() ?? "?";

  const statusLabel = presence?.revoked
    ? "storniert"
    : presence?.presenceState === ("INSIDE" as PresenceState)
      ? "eingecheckt"
      : isOccupied
        ? "belegt"
        : "frei";

  const presenceChipColor = presence?.revoked
    ? ("warning" as const)
    : presence?.presenceState === ("INSIDE" as PresenceState)
      ? ("info" as const)
      : isOwnSeat
        ? ("primary" as const)
        : isOccupied
          ? ("error" as const)
          : ("default" as const);

  const handleClick = (e: React.MouseEvent) => {
    if (isEditing) {
      onClick?.(e);
      return;
    }
    setAnchorEl(e.currentTarget as unknown as HTMLElement);
  };

  return (
    <>
      <Box
        component="button"
        onClick={handleClick}
        onMouseDown={isEditing ? onMouseDown : undefined}
        sx={{
          position: "absolute",
          left: x ?? 0,
          top: y ?? 0,
          transform: rotation
            ? `translate(-50%, -50%) rotate(${rotation}deg)`
            : "translate(-50%, -50%)",
          width: 28,
          height: 28,
          borderRadius: "50%",
          bgcolor: backgroundColor,
          color: (t) =>
            t.palette.getContrastText(
              t.palette.mode === "dark" ? backgroundColor : backgroundColor,
            ),
          border: "2px solid",
          borderColor: isSelected
            ? "primary.main"
            : isOwnSeat
              ? "primary.main"
              : isFilterActive && !highlighted
                ? "transparent"
                : "background.paper",
          boxShadow: isOwnSeat
            ? (t) => `0 0 0 2px ${t.palette.primary.main}`
            : isFilterActive && !highlighted
              ? 0
              : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          fontWeight: 700,
          cursor: isEditing ? "move" : "pointer",
          transition: "opacity 0.2s, transform 0.15s, box-shadow 0.15s",
          opacity: isFilterActive ? (highlighted ? 1 : 0.15) : 1,
          "&:hover": {
            transform: rotation
              ? `translate(-50%, -50%) rotate(${rotation}deg) scale(1.3)`
              : "translate(-50%, -50%) scale(1.3)",
            boxShadow: 4,
            zIndex: 100,
          },
          "&:focus-visible": {
            outline: (t) => `2px solid ${t.palette.primary.main}`,
          },
          zIndex: isSelected ? 20 : presence?.revoked ? 5 : isOwnSeat ? 10 : 2,
          textDecoration: presence?.revoked ? "line-through" : "none",
        }}
        aria-label={`Sitz ${label}${occupantName ? ` – ${occupantName}` : ""}`}
      >
        {label}
      </Box>

      <Popover
        open={Boolean(anchorEl) && !isEditing}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "center", horizontal: "left" }}
        transformOrigin={{ vertical: "center", horizontal: "right" }}
        slotProps={{ paper: { sx: { p: 1.5, maxWidth: 240 } } }}
      >
        <Typography variant="caption" sx={{ fontWeight: 700 }}>
          {`Sitz ${label}`}
        </Typography>
        {occupantName && (
          <Typography variant="caption" sx={{ display: "block" }}>
            {`Gast: ${occupantName}`}
          </Typography>
        )}
        {isOwnSeat && role === "GUEST" && (
          <Typography variant="caption" sx={{ display: "block", color: "primary.main" }}>
            Ihr Sitz
          </Typography>
        )}
        <Box sx={{ mt: 0.5 }}>
          <Chip label={statusLabel} size="small" color={presenceChipColor} />
        </Box>
        {presence?.checkedInAt && (
          <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
            {`Check-in: ${new Date(presence.checkedInAt).toLocaleString("de-DE")}`}
          </Typography>
        )}
        {role === "ADMIN" && occupantName && (
          <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: "text.secondary" }}>
            {`ID: ${seatId}`}
          </Typography>
        )}
      </Popover>
    </>
  );
}
