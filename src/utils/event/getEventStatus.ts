"use client";

/**
 * Shared logic for event status calculation.
 *
 * WHY:
 * - Eliminates duplication across EventCardCompact + EventCardPro
 */
export function getEventStatus(startAt: string, endAt: string) {
  const now = Date.now();
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();

  if (start <= now && end >= now) {
    return {
      label: "Läuft" as const,
      color: "success" as const,
    };
  }

  if (start > now) {
    return {
      label: "Kommend" as const,
      color: "warning" as const,
    };
  }

  return {
    label: "Vergangen" as const,
    color: "default" as const,
  };
}
