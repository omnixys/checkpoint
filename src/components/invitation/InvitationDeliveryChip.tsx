"use client";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { Chip } from "@mui/material";
import type React from "react";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

/* ---------------------------------------------------------------------------
 * Additional delivery info shown alongside the invitation status chip
 * - accepted / sent / not sent
 * ------------------------------------------------------------------------- */
export default function InvitationDeliveryChip({
  guestProfileId,
  confirmationSentAt,
}: {
  guestProfileId?: string | null;
  confirmationSentAt?: string | null;
}) {
  const t = useTypedTranslations("invitation");

  let config: {
    label: string;
    icon: React.ReactElement;
    color: "default" | "success" | "info";
    bg: string;
    border: string;
  } = {
    label: t("delivery.notSent"),
    icon: <CircleOutlinedIcon />,
    color: "default",
    bg: "rgba(255,255,255,0.3)",
    border: "1px solid rgba(255,255,255,0.25)",
  };

  if (guestProfileId) {
    config = {
      label: t("delivery.accepted"),
      icon: <CheckRoundedIcon />,
      color: "success",
      bg: "rgba(0,220,120,0.18)",
      border: "1px solid rgba(0,220,120,0.45)",
    };
  } else if (confirmationSentAt) {
    config = {
      label: t("delivery.sent"),
      icon: <SendRoundedIcon />,
      color: "info",
      bg: "rgba(0,150,255,0.16)",
      border: "1px solid rgba(0,150,255,0.42)",
    };
  }

  return (
    <Chip
      label={config.label}
      icon={config.icon}
      color={config.color}
      sx={{
        pl: 1,
        pr: 1.3,
        height: 26,
        borderRadius: "10px",
        fontWeight: 600,
        fontSize: 12,
        background: config.bg,
        border: config.border,
        backdropFilter: "blur(8px)",
      }}
    />
  );
}
