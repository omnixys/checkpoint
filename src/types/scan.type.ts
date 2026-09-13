import type {
  GetFullSeatInfoQuery,
  GetUserNameQuery,
  PlusOneAgeCategory,
  TicketPayload,
} from "@/checkpoint/generated/graphql";

/**
 * Result returned by /api/scan
 * - Optimized for security scanning & UI rendering
 */
export interface ScanResult {
  status: "SUCCESS" | "ERROR" | "WARNING";

  /**
   * Human readable message for UI
   */
  message: string;
  deviceMatched: boolean;
  valid: boolean;

  /**
   * Machine readable reason for UI / logs / automation
   */
  reason?:
    | "INVALID_QR"
    | "TICKET_REVOKED"
    | "WRONG_EVENT"
    | "ALREADY_INSIDE"
    | "NOT_INSIDE"
    | "EXPIRED_EVENT"
    | "DEVICE_MISMATCH"
    | "OK"
    | undefined;

  /**
   * Age category of a plus-one (present only for ENTRY scans of plus-one tickets)
   */
  plusOneAgeCategory?: PlusOneAgeCategory | null | undefined;

  /**
   * Device binding (present only if ticket is known)
   */
  device?: {
    hash: string;
    publicKey: string;
    activatedAt: string;
    activationIP: string;
  };

  ticket?: TicketPayload;

  guest?: GetUserNameQuery["getUserList"][number] | undefined;

  seat?: GetFullSeatInfoQuery["seat"] | undefined;
}
