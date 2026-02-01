"use client";

import { MY_GUESTS_IDS } from "@/graphql/event/event-query.graphql";
import { GET_INVITATION_BY_EVENT } from "@/graphql/invitation/invitation.query";
import { ASSIGN_SEAT } from "@/graphql/seat/seat-mutation.graphql";
import { GET_SEATS_BY_EVENT } from "@/graphql/seat/seat-query.graphql";
import { GET_USER_LIST } from "@/graphql/user/user-query.graphql";
import {
  GetMyGuestIdsRequest,
  GetMyGuestIdsResult,
} from "@/types/event/event-query-graphql.type";
import {
  GetInvitationByEventRequest,
  GetInvitationByEventResult,
} from "@/types/invitation/invitation-query.graphql.type";
import { Invitation } from "@/types/invitation/invitation.type";
import {
  AssignSeatRequest,
  AssignSeatResult,
} from "@/types/seat/seat-mutation-graphql.type";
import {
  GetSeatsByEventRequest,
  GetSeatsByEventResult,
} from "@/types/seat/seat-query-graphql.type";
import { Seat, SeatFilter } from "@/types/seat/seat.type";
import {
  GetUserListRequest,
  GetUserListResult,
} from "@/types/user/user-graphql.type";
import { User } from "@/types/user/user.type";
import { useMutation, useQuery } from "@apollo/client/react";
import React from "react";
import { SeatStatus } from "../../../types/seat/seat-enum.type";

export function useSeats(eventId: string) {
  const { data, loading, refetch } = useQuery<
    GetSeatsByEventResult,
    GetSeatsByEventRequest
  >(GET_SEATS_BY_EVENT, {
    variables: { eventId },
    fetchPolicy: "cache-and-network",
  });

  const [filter, setFilter] = React.useState<SeatFilter>({
    search: "",
    status: "all",
  });

  const seatsRaw: Seat[] = data?.seats ?? [];
  const seatsLoading = loading;

  // -------------------------------------------
  // SEARCH + STATUS FILTER
  // -------------------------------------------
  const seats = React.useMemo(() => {
    let result = [...seatsRaw];

    // SEARCH
    if (filter.search.trim().length > 0) {
      const txt = filter.search.toLowerCase();

      result = result.filter((s) => {
        return (
          (s.number + "").toLowerCase().includes(txt) ||
          (s.section.name ?? "").toLowerCase().includes(txt) ||
          (s.table.name ?? "").toLowerCase().includes(txt) ||
          (s.note ?? "").toLowerCase().includes(txt)
        );
      });
    }

    // STATUS
    if (filter.status !== "all") {
      result = result.filter((s) => s.status === filter.status);
    }

    return result;
  }, [seatsRaw, filter]);

  // -------------------------------------------
  // GROUPED (Section -> Table)
  // -------------------------------------------
  const grouped = React.useMemo(() => {
    const sectionMap: Record<string, Record<string, Seat[]>> = {};

    for (const s of seats) {
      const section = s.section.name ?? "—";
      const table = s.table.name ?? "—";

      if (!sectionMap[section]) sectionMap[section] = {};
      if (!sectionMap[section][table]) sectionMap[section][table] = [];

      sectionMap[section][table].push(s);
    }

    return sectionMap;
  }, [seats]);

  // -------------------------------------------
  // OCCUPIED IDS
  // -------------------------------------------
  const occupiedSeatIds = React.useMemo(
    () => new Set(seatsRaw.filter(isSeatOccupied).map((s) => s.id)),
    [seatsRaw]
  );

  function isSeatOccupied(seat: Seat): boolean {
    return !!seat.guestId || !!seat.invitationId;
  }

  // -------------------------------------------
  // GUEST MAP
  // -------------------------------------------
  const seatGuestMap = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const s of seatsRaw) {
      if (s.guestId) map.set(s.id, s.guestId);
    }
    return map;
  }, [seatsRaw]);

  // -------------------------------------------
  // SEAT LABEL
  // -------------------------------------------
  const seatLabel = (seat: Seat) => seat.number?.toString() ?? "—";

  const [assignSeat] = useMutation<AssignSeatResult, AssignSeatRequest>(
    ASSIGN_SEAT
  );

  const { data: invitationData } = useQuery<
    GetInvitationByEventResult,
    GetInvitationByEventRequest
  >(GET_INVITATION_BY_EVENT, {
    variables: { eventId },
  });

  const { data: guestIdsData } = useQuery<
    GetMyGuestIdsResult,
    GetMyGuestIdsRequest
  >(MY_GUESTS_IDS, {
    variables: { eventId },
  });

  const { data: guestData } = useQuery<GetUserListResult, GetUserListRequest>(
    GET_USER_LIST,
    {
      variables: { guesIdList: guestIdsData?.myGuests ?? [] },
      skip: !guestIdsData?.myGuests?.length,
    }
  );

  const guestList = guestData?.getUserList ?? [];
  const invitationList = invitationData?.eventInvitation ?? [];

  const invitationMap = React.useMemo(() => {
    const map = new Map<string, Invitation>();
    for (const inv of invitationList) {
      map.set(inv.id, inv);
    }
    return map;
  }, [invitationList]);

  const guestMap = React.useMemo(() => {
    const map = new Map<string, User>();
    for (const g of guestList) {
      map.set(g.id, g);
    }
    return map;
  }, [guestList]);

  const getSeatHolderName = (id?: string | null): string => {
    if (!id) return "—";

    // 1️⃣ Invitation
    const inv = invitationMap.get(id);
    if (inv) {
      return `${inv.firstName ?? ""} ${inv.lastName ?? ""}`.trim() || "—";
    }

    // 2️⃣ Guest/User
    const guest = guestMap.get(id);
    if (guest) {
      return `${guest.firstName ?? ""} ${guest.lastName ?? ""}`.trim() || "—";
    }

    // 3️⃣ Fallback (sollte praktisch nie passieren)
    return "—";
  };

  const getSeatHolderLabel = (seat: Seat) =>
    getSeatHolderName(seat.guestId ?? seat.invitationId);

  return {
    seats,
    seatsLoading,
    grouped,
    occupiedSeatIds,
    seatGuestMap,
    seatLabel,
    filter,
    setFilter,
    refetch,
    getSeatHolderLabel,
    getSeatHolderName,
    assignSeat,
    guestList,
    invitationList,
  };
}
