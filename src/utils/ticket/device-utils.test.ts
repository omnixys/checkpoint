import { beforeEach, describe, expect, it } from "vitest";
import {
  CHECKPOINT_BINDING_META_PREFIX,
  CHECKPOINT_PRIVATE_KEY,
  CHECKPOINT_PRIVATE_KEY_SLOT_PREFIX,
} from "@/checkpoint/constants/device";
import {
  bindingMetaSlotKey,
  type DeviceBindingMeta,
  hasDeviceBinding,
  loadDeviceBindingMeta,
  loadDevicePrivateKey,
  privateKeySlotKey,
  saveDeviceBindingMeta,
  saveDevicePrivateKey,
} from "@/checkpoint/utils/ticket/device-utils";

const TICKET_A = "ticket-a";
const TICKET_B = "ticket-b";

const PKCS8_FIXTURE =
  "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgaFAUvls1KNCh92ibLIhB0h0/xHv33EBgZwagLnEXFdGhRANCAATFna/72TYIHw7NYnPS0WrNcw3fOJoNbpkJD1OO8kOBSzpLjwdF+0BGLcgdLCnEpAIEzz4HYhSiWbSUmvgdpv46";
const SPKI_FIXTURE =
  "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAExZ2v+9k2CB8OzWJz0tFqzXMN3ziaDW6ZCQ9TjvJDgUs6S48HRftARi3IHSwpxKQCBM8+B2IUolm0lJr4Hab+Og==";
const PKCS8_OTHER =
  "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgs5Ezicjezj7u8nZug1bvb7ZT32l0rAlUiSBIayfWQlyhRANCAATTym8KSTNjE+T0HNk0JwMU7WKXsDPpGDmBa/28H15LczWSSgxesbzunjctJf+Woy/ROctZ6PV/NsqT48LKStsP";

async function importFixture(base64: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "pkcs8",
    Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)),
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign"],
  );
}

const META_A: DeviceBindingMeta = {
  ticketId: TICKET_A,
  eventId: "event-1",
  eventName: "Test Event",
  deviceId: "device-1",
  boundAt: "2026-09-16T12:00:00.000Z",
};

class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.store.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

beforeEach(() => {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: new MemoryStorage(),
  });
});

describe("device key slots", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("scopes key and meta slots per ticket", () => {
    expect(privateKeySlotKey(TICKET_A)).toBe(CHECKPOINT_PRIVATE_KEY_SLOT_PREFIX + TICKET_A);
    expect(privateKeySlotKey(TICKET_A)).not.toBe(privateKeySlotKey(TICKET_B));
    expect(bindingMetaSlotKey(TICKET_A)).toBe(CHECKPOINT_BINDING_META_PREFIX + TICKET_A);
  });

  it("stores each ticket key in its own slot without touching the legacy slot", async () => {
    const keyA = await importFixture(PKCS8_FIXTURE);
    const keyB = await importFixture(PKCS8_OTHER);

    await saveDevicePrivateKey(TICKET_A, keyA);
    await saveDevicePrivateKey(TICKET_B, keyB);

    expect(localStorage.getItem(privateKeySlotKey(TICKET_A))).toBe(PKCS8_FIXTURE);
    expect(localStorage.getItem(privateKeySlotKey(TICKET_B))).toBe(PKCS8_OTHER);
    expect(localStorage.getItem(CHECKPOINT_PRIVATE_KEY)).toBeNull();
  });

  it("returns the key only when its public key matches the bound ticket", async () => {
    await saveDevicePrivateKey(TICKET_A, await importFixture(PKCS8_FIXTURE));

    await expect(loadDevicePrivateKey(TICKET_A, SPKI_FIXTURE)).resolves.not.toBeNull();
    await expect(loadDevicePrivateKey(TICKET_A, "different-spki")).resolves.toBeNull();
    await expect(loadDevicePrivateKey(TICKET_B, SPKI_FIXTURE)).resolves.toBeNull();
  });

  it("adopts the legacy single key into the ticket slot when it matches the bound public key", async () => {
    localStorage.setItem(CHECKPOINT_PRIVATE_KEY, PKCS8_FIXTURE);

    const key = await loadDevicePrivateKey(TICKET_A, SPKI_FIXTURE);

    expect(key).not.toBeNull();
    expect(localStorage.getItem(privateKeySlotKey(TICKET_A))).toBe(PKCS8_FIXTURE);
  });

  it("rejects a legacy key whose public key does not match the ticket and does not adopt it", async () => {
    localStorage.setItem(CHECKPOINT_PRIVATE_KEY, PKCS8_FIXTURE);

    await expect(
      loadDevicePrivateKey(TICKET_A, SPKI_FIXTURE.replace("A", "B")),
    ).resolves.toBeNull();
    expect(localStorage.getItem(privateKeySlotKey(TICKET_A))).toBeNull();
  });

  it("returns null when no key exists", async () => {
    await expect(loadDevicePrivateKey(TICKET_A, SPKI_FIXTURE)).resolves.toBeNull();
  });
});

describe("device binding meta slots", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists and loads binding meta per ticket", () => {
    saveDeviceBindingMeta(TICKET_A, META_A);

    expect(loadDeviceBindingMeta(TICKET_A)).toEqual(META_A);
    expect(loadDeviceBindingMeta(TICKET_B)).toBeNull();
    expect(hasDeviceBinding(TICKET_A)).toBe(true);
    expect(hasDeviceBinding(TICKET_B)).toBe(false);
  });

  it("treats corrupt meta slot content as not bound", () => {
    localStorage.setItem(bindingMetaSlotKey(TICKET_A), "{not json");

    expect(loadDeviceBindingMeta(TICKET_A)).toBeNull();
    expect(hasDeviceBinding(TICKET_A)).toBe(false);
  });
});
