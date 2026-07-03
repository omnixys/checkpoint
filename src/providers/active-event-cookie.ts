export const ACTIVE_EVENT_COOKIE_NAME = "activeEvent";

function cookieSuffix() {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";

  return `; Path=/; SameSite=Lax${secure}`;
}

export function serializeActiveEventCookie(eventId: string) {
  return `${ACTIVE_EVENT_COOKIE_NAME}=${encodeURIComponent(JSON.stringify({ id: eventId }))}${cookieSuffix()}`;
}

export function serializeActiveEventCookieClear() {
  return `${ACTIVE_EVENT_COOKIE_NAME}=; Max-Age=0${cookieSuffix()}`;
}

export function writeActiveEventCookie(eventId: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = serializeActiveEventCookie(eventId);
}

export function clearActiveEventCookie() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = serializeActiveEventCookieClear();
}
