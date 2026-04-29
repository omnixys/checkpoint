"use client";

import { SeatPayload } from "@/checkpoint/generated/graphql";
import { SeatListType } from "@/checkpoint/types/seat.type";
import React from "react";

/**
 * Drawer controller for seat details and seat assignment.
 * Mode:
 *  - "occupied": seat has a guest assigned
 *  - "assign": seat is empty → pick a guest
 *  - undefined: drawer closed
 *
 * On mobile devices the drawer will open from the bottom,
 * on desktop/tablet it opens from the right.
 */
export function useSeatDetailDrawer() {
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [seatId, setSeatId] = React.useState<string | null>(null);

  return {
    open,
    editing,
    seatId,

    show: (seat: SeatListType) => {
      setSeatId(seat.id);
      setOpen(true);
    },

    close: () => {
      setOpen(false);
      setSeatId(null);
    },

    edit: () => setEditing(true),
    stopEditing: () => setEditing(false),
  };
}
