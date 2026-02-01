import { EventRole } from "../../event/event-enum.type";
import { PresenceState } from "../../ticket/ticket-enum.type";

/**
 * Result returned by /api/scan
 * - Optimized for security scanning & UI rendering
 */
export type ScanResult = {
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
    | "DEVICE_MISMATCH"
    | "OK";

  /**
   * Device binding (present only if ticket is known)
   */
  device?: {
    hash: string;
    publicKey: string;
    activatedAt: string;
    activationIP: string;
  };

  ticket?: {
    id: string;
    invitationId: string;
    currentState: PresenceState;
    revoked: boolean;
  };

  guest?: {
    firstName?: string;
    lastName?: string;
    roles?: EventRole[];
  };

  seat?: {
    label?: string;
    number?: number;
    sectionName?: string;
    tableName?: string;
  };
};
