"use client";

import {
  InvitationStatus,
  RsvpChoice,
} from "@/types/invitation/invitation-enum.type";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import { Chip } from "@mui/material";
import React from "react";

/* ---------------------------------------------------------------------------
 * VisionOS-inspired Status Chip
 * ------------------------------------------------------------------------- */
export default function InvitationStatusChip({
  status,
  rsvp,
}: {
  status: InvitationStatus;
  rsvp: RsvpChoice | undefined;
}) {
  let config: {
    label: string;
    icon: React.ReactElement | undefined;
    color: "default" | "success" | "warning" | "error" | "info";
    bg: string;
    border: string;
  } = {
    label: status,
    icon: undefined,
    color: "default",
    bg: "rgba(255,255,255,0.4)",
    border: "1px solid rgba(255,255,255,0.35)",
  };

  switch (status) {
    case "APPROVED":
      config = {
        label: "Approved",
        icon: <VerifiedRoundedIcon />,
        color: "success",
        bg: "rgba(0,220,120,0.22)",
        border: "1.5px solid rgba(0,220,120,0.55)",
      };
      break;

    case "ACCEPTED":
      config = {
        label: "Accepted",
        icon: <CheckRoundedIcon />,
        color: "success",
        bg: "rgba(0,180,0,0.12)",
        border: "1px solid rgba(0,180,0,0.25)",
      };
      break;

    case "PENDING":
      config = {
        label: "Pending",
        icon: <HourglassEmptyRoundedIcon />,
        color: "warning",
        bg: "rgba(255,200,0,0.2)",
        border: "1px solid rgba(255,200,0,0.4)",
      };
      break;

    case "DECLINED":
    case "REJECTED":
      config = {
        label: "Declined",
        icon: <BlockRoundedIcon />,
        color: "error",
        bg: "rgba(255,0,0,0.15)",
        border: "1px solid rgba(255,0,0,0.32)",
      };
      break;

    case "CANCELED":
      config = {
        label: "Canceled",
        icon: <RemoveCircleOutlineRoundedIcon />,
        color: "default",
        bg: "rgba(180,180,180,0.15)",
        border: "1px solid rgba(180,180,180,0.35)",
      };
      break;

    case "EXPIRED":
      config = {
        label: "Expired",
        icon: <AccessTimeRoundedIcon />,
        color: "default",
        bg: "rgba(150,150,150,0.15)",
        border: "1px solid rgba(150,150,150,0.35)",
      };
      break;

    default:
      config = {
        label: status,
        icon: <ErrorOutlineRoundedIcon />,
        color: "default",
        bg: "rgba(200,200,200,0.2)",
        border: "1px solid rgba(200,200,200,0.3)",
      };
      break;
  }

  if (rsvp == RsvpChoice.MAYBE) {
    const maybeConfig = {
      label: "Maybe",
      icon: <HelpOutlineRoundedIcon />,
      color: "info",
      bg: "rgba(0,150,255,0.15)",
      border: "1px solid rgba(0,150,255,0.4)",
    };

    return (
      <Chip
        label={maybeConfig.label}
        icon={maybeConfig.icon}
        sx={{
          pl: 1,
          pr: 1.4,
          height: 30,
          borderRadius: "12px",
          fontWeight: 600,
          background: maybeConfig.bg,
          border: maybeConfig.border,
          backdropFilter: "blur(8px)",
        }}
      />
    );
  }

  return (
    <Chip
      label={config.label}
      icon={config.icon}
      sx={{
        pl: 1,
        pr: 1.4,
        height: 30,
        borderRadius: "12px",
        fontWeight: 600,
        background: config.bg,
        border: config.border,
        backdropFilter: "blur(8px)",
      }}
    />
  );
}
