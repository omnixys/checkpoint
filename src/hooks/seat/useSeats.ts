"use client";
import { useMutation } from "@apollo/client/react";
import React from "react";
// TODO kein any
import {
  AssignSeatDocument,
  type AssignSeatMutation,
  type AssignSeatMutationVariables,
  type EventInvitationQuery,
  type SeatListQuery,
} from "@/checkpoint/generated/graphql";
import useInvitationListQuery from "@/checkpoint/hooks/invitation/useInvitationListQuery";
import useSeatListQuery from "@/checkpoint/hooks/seat/useSeatListQuery";
import useGuestQuery from "@/checkpoint/hooks/user/useGuestQuery";
import type { SeatFilter } from "@/checkpoint/types/seat.type";

export type QueryInvitation = NonNullable<EventInvitationQuery["eventInvitation"]>[number];

function isSeatOccupied(seat: SeatListQuery["seats"][number]): boolean {
  return Boolean(seat.guestId) || Boolean(seat.invitationId);
}

export function useSeats(eventId: string) {
  const { seatList, seatListLoading, seatListRefetch } = useSeatListQuery({
    eventId,
    loadSeatList: true,
  });

  const [filter, setFilter] = React.useState<SeatFilter>({
    search: "",
    status: "all",
  });

  const [assignSeat] = useMutation<AssignSeatMutation, AssignSeatMutationVariables>(
    AssignSeatDocument,
  );

  const { globalEventInvitationList, invitationMap } = useInvitationListQuery({
    loadGlobalEventInvitationList: true,
    eventIds: [eventId],
  });
  const { guestList, guestMap } = useGuestQuery({
    eventId,
    loadGuestIdList: true,
  });

  const getSeatHolderName = React.useCallback(
    (id?: string | null): string => {
      if (!id) {
        return "—";
      }

      // 1️⃣ Invitation
      const inv = invitationMap.get(id);
      if (inv) {
        return `${inv.firstName ?? ""} ${inv.lastName ?? ""}`.trim() || "—";
      }

      // 2️⃣ Guest/User
      const guest = guestMap.get(id);
      if (guest) {
        return (
          `${guest.personalInfo?.firstName ?? ""} ${guest.personalInfo?.lastName ?? ""}`.trim() ||
          "—"
        );
      }

      // 3️⃣ Fallback (sollte praktisch nie passieren)
      return "—";
    },
    [guestMap, invitationMap],
  );

  // -------------------------------------------
  // SEARCH + STATUS FILTER
  // -------------------------------------------
  const seats = React.useMemo(() => {
    let result = [...(seatList ?? [])];

    // SEARCH
    if (filter.search.trim().length > 0) {
      const txt = filter.search.toLowerCase();

      result = result.filter((s) => {
        const holderName = getSeatHolderName(s.guestId ?? s.invitationId);

        return (
          `${s.number}`.toLowerCase().includes(txt) ||
          (s.section.name ?? "").toLowerCase().includes(txt) ||
          (s.table?.name ?? "").toLowerCase().includes(txt) ||
          (s.note ?? "").toLowerCase().includes(txt) ||
          (s.label ?? "").toLowerCase().includes(txt) ||
          holderName.toLowerCase().includes(txt)
        );
      });
    }

    // STATUS
    if (filter.status !== "all") {
      result = result.filter((s) => s.status === filter.status);
    }

    return result;
  }, [seatList, filter, getSeatHolderName]);

  // -------------------------------------------
  // GROUPED (Section -> Table)
  // -------------------------------------------
  const grouped = React.useMemo(() => {
    const sectionMap: Record<string, Record<string, SeatListQuery["seats"]>> = {};

    for (const s of seats) {
      const section = s.section.name ?? "—";
      const table = s.table?.name ?? "—";

      if (!sectionMap[section]) {
        sectionMap[section] = {};
      }
      if (!sectionMap[section][table]) {
        sectionMap[section][table] = [];
      }

      sectionMap[section][table].push(s);
    }

    return sectionMap;
  }, [seats]);

  // -------------------------------------------
  // OCCUPIED IDS
  // -------------------------------------------
  const occupiedSeatIds = React.useMemo(
    () => new Set(seatList?.filter(isSeatOccupied).map((s) => s.id)),
    [seatList],
  );

  // -------------------------------------------
  // GUEST MAP
  // -------------------------------------------
  const seatGuestMap = React.useMemo(() => {
    const map = new Map<string, string>();
    if (!seatList) {
      return map;
    }

    for (const s of seatList) {
      if (s.guestId) {
        map.set(s.id, s.guestId);
      }
    }
    return map;
  }, [seatList]);

  // -------------------------------------------
  // SEAT LABEL
  // -------------------------------------------
  const seatLabel = (seat: SeatListQuery["seats"][number]) => seat.number?.toString() ?? "—";

  const getSeatHolderLabel = (seat: SeatListQuery["seats"][number]) =>
    getSeatHolderName(seat.guestId ?? seat.invitationId);

  return {
    seats,
    seatListLoading,
    grouped,
    occupiedSeatIds,
    seatGuestMap,
    seatLabel,
    filter,
    setFilter,
    seatListRefetch,
    getSeatHolderLabel,
    getSeatHolderName,
    assignSeat,
    guestList,
    invitationList: globalEventInvitationList,
  };
}
