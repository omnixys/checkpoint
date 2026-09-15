import { Preferences } from "@capacitor/preferences";
import {
  CHECKPOINT_BINDING_META_PREFIX,
  CHECKPOINT_DEVICE_KEY,
  CHECKPOINT_PRIVATE_KEY,
  CHECKPOINT_PRIVATE_KEY_SLOT_PREFIX,
} from "@/checkpoint/constants/device";

export interface DeviceBindingMeta {
  ticketId: string;
  eventId: string;
  eventName: string;
  deviceId: string;
  boundAt: string;
}

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

/**
 * Per-ticket private key slots.
 *
 * Tickets are bound per (event, device). Every activation stores its key under
 * a ticket-scoped slot so multiple events can coexist on one device without
 * clobbering each other (the old single `device-private-key` slot caused the
 * "Signature Changed" mismatch after a second activation).
 */
export function privateKeySlotKey(ticketId: string): string {
  return `${CHECKPOINT_PRIVATE_KEY_SLOT_PREFIX}${ticketId}`;
}

export function bindingMetaSlotKey(ticketId: string): string {
  return `${CHECKPOINT_BINDING_META_PREFIX}${ticketId}`;
}

function pkcs8ToBase64(key: CryptoKey): Promise<string> {
  return crypto.subtle.exportKey("pkcs8", key).then((pkcs8) => {
    const bytes = new Uint8Array(pkcs8);
    let binary = "";
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }
    return btoa(binary);
  });
}

function base64ToPkcs8(base64: string) {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

function importPrivateKey(base64: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "pkcs8",
    base64ToPkcs8(base64),
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign"],
  );
}

/**
 * Exports the SPKI base64 public key that belongs to a private key.
 * Compare it against the bound `devicePublicKey` of a ticket to verify that
 * the locally stored key is the one the server accepts.
 */
export async function publicKeyOfPrivateKey(key: CryptoKey): Promise<string> {
  const jwk = (await crypto.subtle.exportKey(
    "jwk" as unknown as Parameters<typeof crypto.subtle.exportKey>[0],
    key,
  )) as unknown as { kty: string; crv: string; x: string; y: string };
  if (jwk.kty !== "EC" || !jwk.x || !jwk.y) {
    throw new Error("Expected an EC private key with public point");
  }
  const publicKey = await crypto.subtle.importKey(
    "jwk",
    { kty: jwk.kty, crv: jwk.crv, x: jwk.x, y: jwk.y },
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    [],
  );
  const spki = await crypto.subtle.exportKey("spki", publicKey);
  const bytes = new Uint8Array(spki);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

export async function saveDevicePrivateKey(ticketId: string, key: CryptoKey): Promise<void> {
  const base64 = await pkcs8ToBase64(key);
  localStorage.setItem(privateKeySlotKey(ticketId), base64);
}

/**
 * Loads the private key bound to a ticket.
 *
 * When `expectedPublicKey` is provided, the key is only returned (and any
 * legacy slot key only adopted) if its SPKI public key matches, so a stale key
 * from the old single-slot storage can never be used to sign another ticket's
 * QR code.
 */
export async function loadDevicePrivateKey(
  ticketId: string,
  expectedPublicKey?: string | null,
): Promise<CryptoKey | null> {
  let base64 = localStorage.getItem(privateKeySlotKey(ticketId));

  if (!base64) {
    const legacy = localStorage.getItem(CHECKPOINT_PRIVATE_KEY);
    if (legacy) {
      const key = await importPrivateKey(legacy);
      const spki = await publicKeyOfPrivateKey(key);
      if (expectedPublicKey && spki !== expectedPublicKey) {
        return null;
      }
      localStorage.setItem(privateKeySlotKey(ticketId), legacy);
      base64 = legacy;
    }
  }

  if (!base64) {
    return null;
  }

  const key = await importPrivateKey(base64);

  if (expectedPublicKey) {
    const spki = await publicKeyOfPrivateKey(key);
    if (spki !== expectedPublicKey) {
      return null;
    }
  }

  return key;
}

export function saveDeviceBindingMeta(ticketId: string, meta: DeviceBindingMeta): void {
  localStorage.setItem(bindingMetaSlotKey(ticketId), JSON.stringify(meta));
}

export function loadDeviceBindingMeta(ticketId: string): DeviceBindingMeta | null {
  const raw = localStorage.getItem(bindingMetaSlotKey(ticketId));
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as DeviceBindingMeta;
  } catch {
    return null;
  }
}

export function hasDeviceBinding(ticketId: string): boolean {
  return loadDeviceBindingMeta(ticketId) !== null;
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
