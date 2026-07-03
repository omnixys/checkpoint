import { Preferences } from "@capacitor/preferences";
import { CHECKPOINT_DEVICE_KEY, CHECKPOINT_PRIVATE_KEY } from "@/checkpoint/constants/device";

/**
 * Returns a stable, device-bound identifier.
 * - Generated once
 * - Stored via Capacitor Preferences
 * - Browser + iOS + Android safe
 */
export async function getDeviceHash(): Promise<string> {
  const existing = await Preferences.get({ key: CHECKPOINT_DEVICE_KEY });
  if (existing.value) {
    return existing.value;
  }

  const uuid = generateUUID();
  await Preferences.set({ key: CHECKPOINT_DEVICE_KEY, value: uuid });
  return uuid;
}

/**
 * UUID v4 generator with proper fallbacks.
 */
export function generateUUID(): string {
  // Always prefer crypto
  if (typeof globalThis !== "undefined" && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  // Node.js fallback (important!)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { randomUUID } = require("node:crypto");
    return randomUUID();
  } catch {
    // Last resort fallback (still RFC-like)
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

export async function savePrivateKey(key: CryptoKey) {
  const pkcs8 = await crypto.subtle.exportKey("pkcs8", key);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(pkcs8)));

  localStorage.setItem(CHECKPOINT_PRIVATE_KEY, base64);
}

export async function loadPrivateKey(): Promise<CryptoKey | null> {
  const base64 = localStorage.getItem(CHECKPOINT_PRIVATE_KEY);
  if (!base64) {
    return null;
  }

  const buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

  return crypto.subtle.importKey("pkcs8", buffer, { name: "ECDSA", namedCurve: "P-256" }, false, [
    "sign",
  ]);
}

export async function createDeviceKeyPair(): Promise<{
  publicKey: string;
  privateKey: CryptoKey;
}> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["sign", "verify"],
  );

  const spki = await crypto.subtle.exportKey("spki", keyPair.publicKey);
  const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(spki)));

  return {
    publicKey: publicKeyBase64,
    privateKey: keyPair.privateKey,
  };
}
