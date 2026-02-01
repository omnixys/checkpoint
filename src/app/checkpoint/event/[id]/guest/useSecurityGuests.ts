// app/security/guests/useSecurityGuests.ts
"use client";

import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { SeatVM, SecurityGuestVM } from "./types";

import { GET_TICKETS_BY_EVENT } from "@/graphql/ticket/ticket.query";
import { GET_USER_LIST } from "@/graphql/user/user-query.graphql";
import { GET_SEAT_LIST } from "@/graphql/seat/seat-query.graphql";
import { Ticket } from "@/types/ticket/ticket.type";

export function useSecurityGuests(eventId: string) {
  // 1️⃣ Tickets
  const {
    data: ticketData,
    loading: ticketsLoading,
    refetch: refetchTickets,
  } = useQuery(GET_TICKETS_BY_EVENT, { variables: { eventId } });

  const tickets =
    ticketData?.ticketsByEvent.filter((t: Ticket) => !t.revoked) ?? [];

  // 2️⃣ Guest IDs (deduped)
  const guestIds = useMemo(
    () => [
      ...new Set(tickets.map((t: any) => t.guestProfileId).filter(Boolean)),
    ],
    [tickets]
  );

  const { data: userData } = useQuery(GET_USER_LIST, {
    variables: { guesIdList: guestIds },
    skip: guestIds.length === 0,
  });

  const userMap = useMemo(() => {
    const map = new Map<string, string>();
    userData?.getUserList?.forEach((u: any) => {
      map.set(u.id, `${u.firstName} ${u.lastName}`);
    });
    return map;
  }, [userData]);

  // 3️⃣ Seat IDs (deduped)
  const seatIds = useMemo(
    () => [...new Set(tickets.map((t: any) => t.seatId).filter(Boolean))],
    [tickets]
  );

  // 4️⃣ Seats (Batch-Query – korrekt, deklarativ)
  const { data: seatData } = useQuery(GET_SEAT_LIST, {
    variables: { seatIdList: seatIds },
    skip: seatIds.length === 0,
  });

  const seatMap = useMemo(() => {
    const map = new Map<string, SeatVM>();

    seatData?.getSeatList?.forEach((seat: any) => {
      map.set(seat.id, {
        section: seat.section?.name,
        table: seat.table?.name,
        number: seat.label ?? seat.number ?? undefined,
      });
    });


    return map;
  }, [seatData]);

  // 5️⃣ Aggregation → ViewModel
  const guests: SecurityGuestVM[] = useMemo(() => {
    return tickets.map((ticket: any) => ({
      ticketId: ticket.id,
      guestId: ticket.guestProfileId,

      name: userMap.get(ticket.guestProfileId) ?? "Unbekannter Gast",

      seat: seatMap.get(ticket.seatId) ?? undefined,

      status: ticket.checkedInAt ? "CHECKED_IN" : "NOT_ARRIVED",
      presence: ticket.currentState,
      checkedInAt: ticket.checkedInAt ?? undefined,
    }));
  }, [tickets, userMap, seatMap]);

  return {
    guests,
    loading: ticketsLoading,
    reload: async () => {
      await refetchTickets();
    },
  };
}
