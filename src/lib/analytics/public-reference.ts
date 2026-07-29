export type PublicAnalyticsReference =
  | { type: "event"; id: string }
  | { type: "invitation"; id: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function publicAnalyticsReference(
  location: Pick<Location, "pathname" | "search"> | undefined,
): PublicAnalyticsReference | undefined {
  if (!location) return undefined;

  const invitationMatch = /^\/rsvp\/([^/]+)\/?$/.exec(location.pathname);
  const invitationId = invitationMatch?.[1] ? decodeURIComponent(invitationMatch[1]) : undefined;
  if (invitationId && UUID.test(invitationId)) {
    return { type: "invitation", id: invitationId };
  }

  if (location.pathname === "/rsvp" || location.pathname === "/rsvp/") {
    const eventId = new URLSearchParams(location.search).get("eventId");
    if (eventId && UUID.test(eventId)) {
      return { type: "event", id: eventId };
    }
  }
  return undefined;
}
