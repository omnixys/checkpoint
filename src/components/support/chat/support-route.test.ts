import { describe, expect, it } from "vitest";
import { isGuestSupportChatRoute } from "./support-route";

describe("isGuestSupportChatRoute", () => {
  it("matches the exact guest support route", () => {
    expect(isGuestSupportChatRoute("/me/support")).toBe(true);
  });

  it("matches nested routes under the guest support route", () => {
    expect(isGuestSupportChatRoute("/me/support/123")).toBe(true);
  });

  it("does not match unrelated or staff routes", () => {
    expect(isGuestSupportChatRoute("/me")).toBe(false);
    expect(isGuestSupportChatRoute("/me/supporters")).toBe(false);
    expect(isGuestSupportChatRoute("/event/abc123/support")).toBe(false);
    expect(isGuestSupportChatRoute("/rsvp/some-token/support")).toBe(false);
  });

  it("does not re-apply a base path that usePathname already stripped", () => {
    expect(isGuestSupportChatRoute("/me/support", "/cp")).toBe(false);
    expect(isGuestSupportChatRoute("/cp/me/support", "/cp")).toBe(true);
  });

  it("respects a configured base path", () => {
    expect(isGuestSupportChatRoute("/cp/me/support", "/cp")).toBe(true);
    expect(isGuestSupportChatRoute("/cp/event/abc123/support", "/cp")).toBe(false);
    expect(isGuestSupportChatRoute("/cp/", "/cp/")).toBe(false);
  });
});
