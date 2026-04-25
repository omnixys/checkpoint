"use client";

import { ChipProps } from "@mui/material";
import { useMemo } from "react";

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
  const roleChipColor: ChipProps["color"] = useMemo(() => {
    switch (ev.myRole) {
      case "ADMIN":
        return "primary";
      case "SECURITY":
        return "success";
      default:
        return "default";
    }
  }, [ev.myRole]);

  /**
   * Date formatting (centralized)
   */
  const startFormatted = useMemo(() => {
    return new Date(ev.settings.startsAt).toLocaleString("de-DE", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }, [ev.settings.startsAt]);

  const endFormatted = useMemo(() => {
    return new Date(ev.settings.endsAt).toLocaleString("de-DE", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }, [ev.settings.endsAt]);

  /**
   * Hero image fallback logic
   */
  const heroImage = useMemo(() => {
    return (
      (ev as unknown as { imageUrl?: string }).imageUrl ||
      "/event/event-default.png"
    );
  }, [ev]);

  return {
    roleChipColor,
    startFormatted,
    endFormatted,
    heroImage,
  };
}
