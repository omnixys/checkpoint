import {
  ScanTokenMutation,
  ScanTokenMutationVariables,
  ScanTokenDocument,
  ScanPayload,
} from "@/checkpoint/generated/graphql";
import useSeatQuery from "@/checkpoint/hooks/seat/useSeatQuery";
import useUserQuery from "@/checkpoint/hooks/user/useUserQuery";
import { ScanResult } from "@/checkpoint/types/scan.type";
import { useMutation } from "@apollo/client/react";

/**
 * Parses QR payload safely
 */
function parseQrPayload(qr: string): {
  token: string;
  signature: string;
  deviceId: string;
} | null {
  try {
    const parsed = JSON.parse(qr);

    if (
      typeof parsed.token === "string" &&
      typeof parsed.signature === "string" &&
      typeof parsed.deviceId === "string"
    ) {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

export function useScanTicket() {
  const [scanMutation] = useMutation<ScanTokenMutation, ScanTokenMutationVariables>(
    ScanTokenDocument,
  );

  return async (qr: string): Promise<ScanResult> => {
    /* ---------------------------------------------
     * 1) Parse QR
     * ------------------------------------------- */

    const parsed = parseQrPayload(qr);

    if (!parsed) {
      return {
        status: "ERROR",
        message: "Ungültiger QR-Code",
        valid: false,
        deviceMatched: false,
        reason: "INVALID_QR",
      };
    }

    /* ---------------------------------------------
     * 2) Send FULL payload
     * ------------------------------------------- */

    const { data } = await scanMutation({
      variables: {
        input: {
          token: parsed.token,
          signature: parsed.signature,
          deviceId: parsed.deviceId,
          gate: "MAIN_GATE",
        },
      },
    });

    if (!data?.scanToken) {
      return {
        status: "ERROR",
        message: "Scan fehlgeschlagen",
        valid: false,
        deviceMatched: false,
        reason: "INVALID_QR",
      };
    }

    const res: ScanPayload = data.scanToken;

    const { fullSeatInfo } = useSeatQuery({
      seatId: res.ticket.seatId,
      loadFullSeatInfo: true,
    });
    const { userInfo } = useUserQuery({
      userId: res.ticket.guestProfileId,
      loadUserName: true,
    });

    return {
      status: res.verdict === "OK" ? "SUCCESS" : "ERROR",
      message: res.message,
      valid: res.verdict === "OK",
      deviceMatched: res.verdict !== "DEVICE_MISMATCH",
      reason: mapReason(res.verdict),
      ticket: res.ticket,
      guest: userInfo,
      seat: fullSeatInfo,
    };
  };
}

/**
 * Maps backend verdict → UI reason
 */
function mapReason(verdict: string): ScanResult["reason"] {
  switch (verdict) {
    case "OK":
      return "OK";
    case "ALREADY_INSIDE":
      return "ALREADY_INSIDE";
    case "REVOKED":
      return "TICKET_REVOKED";
    case "DEVICE_MISMATCH":
      return "DEVICE_MISMATCH";
    default:
      return "INVALID_QR";
  }
}
