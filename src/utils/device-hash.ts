// src/utils/device-hash.ts
import { Preferences } from "@capacitor/preferences";

const KEY = "checkpoint.deviceHash";

/**
 * Returns a stable, device-bound identifier.
 * - Generated once
 * - Stored via Capacitor Preferences
 * - Browser + iOS + Android safe
 */
export async function getDeviceHash(): Promise<string> {
  const existing = await Preferences.get({ key: KEY });
  if (existing.value) {
    return existing.value;
  }

  const uuid = generateUUID();
  await Preferences.set({ key: KEY, value: uuid });
  return uuid;
}

/**
 * UUID v4 generator with proper fallbacks.
 */
function generateUUID(): string {
  // Preferred: modern browsers / Capacitor
  if (
    typeof globalThis !== "undefined" &&
    globalThis.crypto &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  // Fallback: RFC4122-compliant UUID v4
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
