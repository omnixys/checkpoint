"use client";

// TODO i18N implementieren

import useSeatQuery from "@/checkpoint/hooks/seat/useSeatQuery";
import useTicketQuery from "@/checkpoint/hooks/ticket/useTicketQuery";
import useGuestQuery from "@/checkpoint/hooks/user/useGuestQuery";
import { useMemo } from "react";
import { GuestDTO } from "../../components/guests/types";

export function useSecurityGuests(eventId: string) {
  const {
    securityTicketMap,
    securityTicketList,
    securityTicketListLoading,
    securityTicketListError,
  } = useTicketQuery({
    eventId,
    loadSecurityTicketPage: true,
  });

  const { securityGuestMap } = useGuestQuery({
    loadSecurityGuestIdList: true,
    guestIdList: securityTicketList.map((ticket) => ticket.guestProfileId),
  });

  const { fullSeatMap } = useSeatQuery({
    loadFullSeatIdList: true,
    seatIdList: securityTicketList.map((ticket) => ticket.seatId),
  });

  // 5️⃣ Aggregation → ViewModel
  const guests: GuestDTO[] = useMemo(() => {
    return securityTicketList.map((ticket) => ({
      ticketId: ticket.id,
      guestId: ticket.guestProfileId,

      name: securityGuestMap.get(ticket.guestProfileId) ?? "Unbekannter Gast",

      seat: fullSeatMap.get(ticket.seatId) ?? undefined,

      status: ticket.checkedInAt ? "CHECKED_IN" : "NOT_ARRIVED",
      presence: ticket.currentState,
      checkedInAt: ticket.checkedInAt ?? undefined,
    }));
  }, [securityTicketList, securityGuestMap, fullSeatMap]);

  return {
    guests,
    loading: securityTicketListLoading,
    reload: async () => {
      await securityTicketListError;
    },
  };
}
