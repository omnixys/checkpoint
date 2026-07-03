"use client";

import type { ChipProps } from "@mui/material";

export interface EventFormatterProps {
  roleChipColor: string;
  startFormatted: string;
  endFormatted: string;
  heroImage: string;
}

/**
 * Centralized formatting + mapping logic for events.
 *
 * WHY:
 * - Removes duplication across ALL header variants
 * - Ensures consistent formatting everywhere
 * - Single source of truth
 */
export function eventFormatter(ev: any): EventFormatterProps {
  /**
   * Role → Chip color mapping
   */
  let roleChipColor: ChipProps["color"] = "default";
  switch (ev.myRole) {
    case "ADMIN":
      roleChipColor = "primary";
      break;
    case "SECURITY":
      roleChipColor = "success";
      break;
  }

  /**
   * Date formatting (centralized)
   */
  const startFormatted = new Date(ev.settings.startsAt).toLocaleString("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const endFormatted = new Date(ev.settings.endsAt).toLocaleString("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  /**
   * Hero image fallback logic
   */
  const heroImage = (ev as unknown as { imageUrl?: string }).imageUrl || "/event/event-default.png";

  return {
    roleChipColor,
    startFormatted,
    endFormatted,
    heroImage,
  };
}
