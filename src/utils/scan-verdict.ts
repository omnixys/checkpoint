import { ScanVerdict } from "@/checkpoint/generated/graphql";
import type { ScanResult } from "@/checkpoint/types/scan.type";

export type ScanFailureReason = Extract<
  NonNullable<ScanResult["reason"]>,
  | "EMPTY_RESPONSE"
  | "NETWORK_ERROR"
  | "UNEXPECTED_ERROR"
  | "CAMERA_PERMISSION_DENIED"
  | "CAMERA_UNAVAILABLE"
  | "CAMERA_IN_USE"
  | "CAMERA_INSECURE"
>;

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

export function scanRequestFailureReason(error: unknown): ScanFailureReason {
  if (error instanceof TypeError) {
    return "NETWORK_ERROR";
  }

  if (error instanceof Error && /network|connection|fetch|offline|timeout/i.test(error.message)) {
    return "NETWORK_ERROR";
  }

  return "UNEXPECTED_ERROR";
}

export function cameraFailureReason(error: unknown): ScanFailureReason {
  if (error instanceof DOMException) {
    switch (error.name) {
      case "NotAllowedError":
      case "SecurityError":
        return "CAMERA_PERMISSION_DENIED";
      case "NotFoundError":
      case "OverconstrainedError":
        return "CAMERA_UNAVAILABLE";
      case "NotReadableError":
      case "TrackStartError":
        return "CAMERA_IN_USE";
      default:
        return "UNEXPECTED_ERROR";
    }
  }

  if (typeof window !== "undefined" && !window.isSecureContext) {
    return "CAMERA_INSECURE";
  }

  return "UNEXPECTED_ERROR";
}
