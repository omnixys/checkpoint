import { ScanVerdict } from "@/checkpoint/generated/graphql";
import type { ScanResult } from "@/checkpoint/types/scan.type";

/**
 * Verdicts that describe a valid holder at the wrong gate or time. They are
 * shown as warnings (not errors) so security staff can route the guest to the
 * correct gate instead of assuming a forged ticket.
 */
export const POLICY_VERDICTS: ReadonlySet<ScanVerdict> = new Set<ScanVerdict>([
  ScanVerdict.ALREADY_INSIDE,
  ScanVerdict.NOT_INSIDE,
  ScanVerdict.EXPIRED_EVENT,
]);

export function scanStatus(verdict: ScanVerdict): ScanResult["status"] {
  if (verdict === "OK") {
    return "SUCCESS";
  }

  if (POLICY_VERDICTS.has(verdict)) {
    return "WARNING";
  }

  return "ERROR";
}

export function scanReason(verdict: ScanVerdict): NonNullable<ScanResult["reason"]> {
  switch (verdict) {
    case "OK":
      return "OK";
    case "REVOKED":
      return "TICKET_REVOKED";
    case "DEVICE_MISMATCH":
      return "DEVICE_MISMATCH";
    case "ALREADY_INSIDE":
      return "ALREADY_INSIDE";
    case "NOT_INSIDE":
      return "NOT_INSIDE";
    case "EXPIRED_EVENT":
      return "EXPIRED_EVENT";
    default:
      return "INVALID_QR";
  }
}
