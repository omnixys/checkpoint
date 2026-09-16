/**
 * seatColorGroup.mapper.ts
 *
 * Maps frontend seat color group objects to the clean `SeatColorGroupInput`
 * GraphQL input type.  Strips read-only fields (isOrphaned, __typename) and
 * null-unsafe style fields that cause gateway VALIDATION_ERROR 400s.
 */

import type { SeatColorGroupInput, SeatColorGroupMatchType } from "@/checkpoint/generated/graphql";

interface StyleLike {
  background?: string | null;
  foreground?: string | null;
  border?: string | null;
  legendIcon?: string | null;
}

export interface SeatColorGroupLike {
  id?: string | null;
  name: string;
  matchType: SeatColorGroupMatchType;
  invitedByValues?: string[] | null;
  priority: number;
  order?: number;
  style?: StyleLike | null;
}

const DEFAULT_STYLE = {
  background: "#E53935",
  foreground: "#FFFFFF",
  border: "#C62828",
  legendIcon: "#E53935",
};

/**
 * Converts a frontend seat color group into a safe GraphQL input payload.
 */
export function toSeatColorGroupInput(group: SeatColorGroupLike): SeatColorGroupInput {
  const s = group.style;

  return {
    id: group.id || null,
    name: group.name,
    matchType: group.matchType,
    invitedByValues: group.invitedByValues ?? [],
    priority: group.priority,
    order: group.order ?? 0,
    style: {
      background: s?.background || DEFAULT_STYLE.background,
      foreground: s?.foreground || DEFAULT_STYLE.foreground,
      border: s?.border || DEFAULT_STYLE.border,
      legendIcon: s?.legendIcon || DEFAULT_STYLE.legendIcon,
    },
  };
}
