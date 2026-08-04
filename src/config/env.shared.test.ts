import { describe, expect, it } from "vitest";
import { getEnv, minLength, toHttpUrl, toSampleRate, toUuidOrEmpty, toWsUrl } from "./env.shared";

describe("environment validation", () => {
  it("rejects missing required values", () => {
    expect(() => getEnv("REQUIRED", undefined, { required: true })).toThrow(
      "Missing required environment variable: REQUIRED",
    );
  });

  it("accepts valid URLs and optional UUIDs", () => {
    expect(getEnv("HTTP", "https://checkpoint.omnixys.com", { transform: toHttpUrl })).toBe(
      "https://checkpoint.omnixys.com",
    );
    expect(getEnv("WS", "wss://api.omnixys.com/ws", { transform: toWsUrl })).toBe(
      "wss://api.omnixys.com/ws",
    );
    expect(toUuidOrEmpty("")).toBe("");
  });

  it("rejects invalid rates and short secrets", () => {
    expect(() => getEnv("RATE", "1.5", { transform: toSampleRate })).toThrow();
    expect(() => getEnv("SECRET", "short", { transform: minLength(32) })).toThrow();
  });
});
