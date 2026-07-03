"use client";

// TODO i18N implementieren

import { useMemo } from "react";
import useSeatQuery from "@/checkpoint/hooks/seat/useSeatQuery";
import useTicketQuery from "@/checkpoint/hooks/ticket/useTicketQuery";
import useGuestQuery from "@/checkpoint/hooks/user/useGuestQuery";
import type { GuestDTO } from "../../components/guests/types";

export function useSecurityGuests(eventId: string) {
  const { securityTicketList, securityTicketListLoading, securityTicketListError } = useTicketQuery(
    {
      eventId,
      loadSecurityTicketPage: true,
    },
  );

  const { securityGuestMap } = useGuestQuery({
    loadSecurityGuestIdList: true,
    guestIdList: securityTicketList.map((ticket) => ticket.guestProfileId),
  });

  const { fullSeatMap } = useSeatQuery({
    loadFullSeatIdList: true,
    seatIdList: securityTicketList.map((ticket) => ticket.seatId),
  });

  // 5️⃣ Aggregation → ViewModel
  const guests: GuestDTO[] = useMemo(
    () =>
      securityTicketList.map((ticket) => {
        const checkedInAt = ticket.checkedInAt;

        return {
          ticketId: ticket.id,
          guestId: ticket.guestProfileId,

          name: securityGuestMap.get(ticket.guestProfileId) ?? "Unbekannter Gast",

          seat: fullSeatMap.get(ticket.seatId) ?? undefined,

          status: checkedInAt ? "CHECKED_IN" : "NOT_ARRIVED",
          presence: ticket.currentState,
          ...(checkedInAt ? { checkedInAt } : {}),
        };
      }),
    [securityTicketList, securityGuestMap, fullSeatMap],
  );

  return {
    guests,
    loading: securityTicketListLoading,
    reload: async () => {
      await securityTicketListError;
    },
  };
}
