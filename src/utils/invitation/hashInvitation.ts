import crypto from "crypto";

/**
 * Creates a deterministic hash for an invitation row.
 *
 * WHY:
 * - Name alone is not unique
 * - Phone/email improve uniqueness
 * - Hash allows backend/frontend consistency
 */
export function hashInvitation(row: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}): string {
  const normalize = (v?: string) => v?.toLowerCase().trim().replace(/\s+/g, "") ?? "";

  const base = [
    normalize(row.firstName),
    normalize(row.lastName),
    normalize(row.phone),
    normalize(row.email),
  ].join("|");

  return crypto.createHash("sha256").update(base).digest("hex");
}
