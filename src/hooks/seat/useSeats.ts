"use client";

import {
  SeatsQuery,
  SeatsQueryVariables,
  SeatsDocument,
  SeatPayload,
  AssignSeatMutation,
  AssignSeatMutationVariables,
  AssignSeatDocument,
  EventInvitationQuery,
  EventInvitationQueryVariables,
  EventInvitationDocument,
  EventGuestsQuery,
  EventGuestsQueryVariables,
  EventGuestsDocument,
  GetUserListQuery,
  GetUserListQueryVariables,
  GetUserListDocument,
  InvitationPayload,
  UserPayload,
} from "@/checkpoint/generated/graphql";
import { Seat, SeatFilter } from "@/checkpoint/types/seat.type";
import { useMutation, useQuery } from "@apollo/client/react";
import React from "react";

export type QuerySeat = NonNullable<SeatsQuery["seats"]>[number];
export type QueryInvitation = NonNullable<
  EventInvitationQuery["eventInvitation"]
>[number];

export function useSeats(eventId: string) {
  const { data, loading, refetch } = useQuery<SeatsQuery, SeatsQueryVariables>(SeatsDocument, {
    variables: { id: eventId },
    fetchPolicy: "cache-and-network",
  });

  const [filter, setFilter] = React.useState<SeatFilter>({
    search: "",
    status: "all",
  });

  const seatsRaw: QuerySeat[] = data?.seats ?? [];

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
          (s.table?.name ?? "").toLowerCase().includes(txt) ||
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
    const sectionMap: Record<string, Record<string, QuerySeat[]>> = {};

    for (const s of seats) {
      const section = s.section.name ?? "—";
      const table = s.table?.name ?? "—";

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
    [seatsRaw],
  );


    function isSeatOccupied(seat: QuerySeat): boolean {
      return Boolean(seat.guestId) || Boolean(seat.invitationId);
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
  const seatLabel = (seat: QuerySeat) => seat.number?.toString() ?? "—";

  const [assignSeat] = useMutation<AssignSeatMutation, AssignSeatMutationVariables>(
    AssignSeatDocument,
  );

  const { data: invitationData } = useQuery<EventInvitationQuery, EventInvitationQueryVariables>(
    EventInvitationDocument,
    {
      variables: { eventId },
    },
  );

  const { data: guestIdsData } = useQuery<EventGuestsQuery, EventGuestsQueryVariables>(
    EventGuestsDocument,
    {
      variables: { id: eventId },
    },
  );

  const { data: guestData } = useQuery<GetUserListQuery, GetUserListQueryVariables>(
    GetUserListDocument,
    {
      variables: { guesIdList: guestIdsData?.eventGuests ?? [] },
      skip: !guestIdsData?.eventGuests?.length,
    },
  );

  const guestList = guestData?.getUserList ?? [];
  const invitationList = invitationData?.eventInvitation ?? [];

  const invitationMap = React.useMemo(() => {
    const map = new Map<string, QueryInvitation>();
    for (const inv of invitationList) {
      map.set(inv.id, inv);
    }
    return map;
  }, [invitationList]);

  const guestMap = React.useMemo(() => {
    const map = new Map<string, UserPayload>();
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
      return (
        `${guest.personalInfo?.firstName ?? ""} ${guest.personalInfo?.lastName ?? ""}`.trim() || "—"
      );
    }

    // 3️⃣ Fallback (sollte praktisch nie passieren)
    return "—";
  };

  const getSeatHolderLabel = (seat: QuerySeat) =>
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
