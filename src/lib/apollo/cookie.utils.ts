"use client";
/**
 * Client-side access token provider.
 *
 * IMPORTANT:
 * - Must be synchronous
 * - Used inside Apollo Link
 */
export function getAccessTokenClient(): string | null {
  return getCookie("access_token");
}


/**
 * Cookie helper
 */

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));

  return match ? (match[1] ? decodeURIComponent(match[1]) : null) : null;
}