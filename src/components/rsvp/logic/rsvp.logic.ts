/**
 * RSVP Logic Helpers
 * Pure TypeScript utilities shared across RSVP components.
 * No UI, no framework dependencies, fully reusable.
 */

/* ======================================================
 * 1. Invitation Validation
 * ====================================================== */

/**
 * Checks if an invitation is invalid or not viewable.
 * Used on first page load and for InvalidInvitationDialog.
 */
export function isInvitationInvalid(invitation: any): boolean {
  if (!invitation) return true;

  const invalidStatuses = ["DECLINED", "REJECTED", "CANCELED", "EXPIRED"];

  // If invitation has an invalid status
  if (invalidStatuses.includes(invitation.status)) return true;

  // If invitation requires approval but isn't approved yet
  if (invitation.approved === false) return true;

  // If invitedBy invitation exists and is not approved
  if (invitation.invitedByInvitationId && invitation.approved === false)
    return true;

  return false;
}

/* ======================================================
 * 2. WhatsApp Message Builder
 * ====================================================== */

/**
 * Build WhatsApp Message for sending PlusOne invitations.
 * Example message:
 *
 * "Hallo! 👋
 *  Ich möchte dich zu meinem Event einladen.
 *  • Einladung für Max Mustermann: https://...
 *  • Einladung für Leon Krämer: https://...
 *  Bitte bestätige deine Teilnahme im Browser."
 */
export function buildWhatsappMessage(
  plusOnes: any[],
  baseUrl: string,
  inviterName?: string,
  eventName?: string
): string {
  let msg = `Hallo! 👋\n`;

  if (inviterName) {
    msg += `${inviterName} möchte dich zu einem Event einladen.\n\n`;
  } else {
    msg += `Ich möchte dich zu meinem Event einladen.\n\n`;
  }

  if (eventName) {
    msg += `Event: ${eventName}\n\n`;
  }

  for (const p of plusOnes) {
    const link = `${baseUrl}/checkpoint/rsvp?inv=${p.id}`;
    msg += `• Einladung für ${p.firstName} ${p.lastName}: ${link}\n`;
  }

  msg += `\nBitte öffne den Link in deinem Browser und bestätige deine Teilnahme.`;

  return encodeURIComponent(msg);
}

/* ======================================================
 * 3. Copy Helper (Safari compat)
 * ====================================================== */

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for Safari iOS < 15
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);

    textarea.select();
    const result = document.execCommand("copy");

    document.body.removeChild(textarea);

    return result;
  }
}

/* ======================================================
 * 4. Name Helpers
 * ====================================================== */

export function formatFullName(firstName?: string, lastName?: string): string {
  return `${firstName ?? ""} ${lastName ?? ""}`.trim();
}

/* ======================================================
 * 5. PhoneNumber Helpers
 * ====================================================== */

export function normalizePhoneNumber(num: string): string {
  return num.replace(/[^0-9+]/g, "");
}

/**
 * Validate basic international phone number formatting
 */
export function isValidPhoneNumber(num: string): boolean {
  const normalized = normalizePhoneNumber(num);
  return normalized.length >= 5 && /^[0-9+]+$/.test(normalized);
}

/* ======================================================
 * 6. Build RSVP Link
 * ====================================================== */

export function buildInvitationLink(baseUrl: string, id: string): string {
  return `${baseUrl}/checkpoint/rsvp?inv=${id}`;
}
