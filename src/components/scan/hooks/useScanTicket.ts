import { SCAN_TICKET } from "@/components/../graphql/ticket/ticket.mutation";
import {
  ScanTicketRequest,
  ScanTicketResult,
} from "@/components/../types/ticket/ticket-graphql-mutation.type";
import { useLazyQuery, useMutation } from "@apollo/client/react";

import { GET_USER_BY_ID } from "@/components/../graphql/user/user-query.graphql";
import {
  GetUserByIdRequest,
  GetUserByIdResult,
} from "@/components/../types/user/user-graphql.type";

import { GET_SEAT_BY_ID } from "@/components/../graphql/seat/seat-query.graphql";
import {
  GetSeatByIdRequest,
  GetSeatByIdResult,
} from "@/components/../types/seat/seat-query-graphql.type";

import { ScanResult } from "@/components/../types/scan/scan.type";
import { ScanVerdict } from "@/components/../types/ticket/ticket-enum.type";

export function useScanTicket() {
  /* ---------------------------------------------
   * Mutations & Lazy Queries
   * ------------------------------------------- */

  const [verifyTokenMutation] = useMutation<
    ScanTicketResult,
    ScanTicketRequest
  >(SCAN_TICKET);

  const [loadUser] = useLazyQuery<GetUserByIdResult, GetUserByIdRequest>(
    GET_USER_BY_ID,
  );

  const [loadSeat] = useLazyQuery<GetSeatByIdResult, GetSeatByIdRequest>(
    GET_SEAT_BY_ID,
  );

  /* ---------------------------------------------
   * Public API
   * ------------------------------------------- */

  return async (token: string): Promise<ScanResult> => {
    /* -----------------------------
     * 1) Verify token
     * --------------------------- */

    const { data } = await verifyTokenMutation({
      variables: {
        input: { token },
      },
    });

    if (!data?.verifyToken) {
      return {
        status: "ERROR",
        message: "Scan fehlgeschlagen",
        valid: false,
        deviceMatched: false,
        reason: "INVALID_QR",
      };
    }

    const v = data.verifyToken;

    /* -----------------------------
     * 2) Load optional relations
     * --------------------------- */

    const [userRes, seatRes] = await Promise.all([
      v.ticket?.guestProfileId
        ? loadUser({ variables: { userId: v.ticket.guestProfileId } })
        : Promise.resolve(null),

      v.ticket?.seatId
        ? loadSeat({ variables: { seatId: v.ticket.seatId } })
        : Promise.resolve(null),
    ]);

    const user = userRes?.data?.user;
    const seat = seatRes?.data?.seat;

    /* -----------------------------
     * 3) Map verdict → status
     * --------------------------- */

    const status: ScanResult["status"] = v.valid ? "SUCCESS" : "ERROR";

    /* -----------------------------
     * 4) Build ScanResult DTO
     * --------------------------- */

    return {
      status,
      message: verdictToMessage(v.verdict),
      valid: v.valid,
      deviceMatched: v.deviceMatched,
      reason: verdictToReason(v.verdict),

      device: v.ticket
        ? {
            hash: v.ticket.deviceHash,
            publicKey: v.ticket.devicePublicKey,
            activatedAt: v.ticket.deviceActivationAt,
            activationIP: v.ticket.deviceActivationIP,
          }
        : undefined,

      ticket: v.ticket
        ? {
            id: v.ticket.id,
            invitationId: v.ticket.invitationId,
            currentState: v.ticket.currentState,
            revoked: v.ticket.revoked,
          }
        : undefined,

      guest: user
        ? {
            firstName: user?.personalInfo.firstName,
            lastName: user?.personalInfo.lastName,
            //roles: user.roles ?? [],
          }
        : undefined,

      seat: seat
        ? {
            label: seat.label,
            number: seat.number,
            sectionName: seat.section?.name,
            tableName: seat.table?.name,
          }
        : undefined,
    };
  };
}

/* ---------------------------------------------
 * Helpers
 * ------------------------------------------- */

function verdictToMessage(verdict: ScanVerdict): string {
  switch (verdict) {
    case ScanVerdict.OK:
      return "Zutritt erlaubt";
    case ScanVerdict.ALREADY_INSIDE:
      return "Gast ist bereits im Event";
    case ScanVerdict.REVOKED:
      return "Ticket gesperrt";
    case ScanVerdict.BLOCKED:
      return "Ticket blockiert";
    default:
      return "Scan abgelehnt";
  }
}

function verdictToReason(verdict: ScanVerdict): ScanResult["reason"] {
  switch (verdict) {
    case ScanVerdict.OK:
      return "OK";
    case ScanVerdict.ALREADY_INSIDE:
      return "ALREADY_INSIDE";
    case ScanVerdict.REVOKED:
      return "TICKET_REVOKED";
    case ScanVerdict.BLOCKED:
      return "DEVICE_MISMATCH";
    default:
      return "INVALID_QR";
  }
}
