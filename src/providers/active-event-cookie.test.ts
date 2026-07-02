import { beforeEach, describe, expect, it } from "vitest";
import {
  ACTIVE_EVENT_COOKIE_NAME,
  clearActiveEventCookie,
  serializeActiveEventCookie,
  writeActiveEventCookie,
} from "./active-event-cookie";

describe("active-event cookie", () => {
  beforeEach(() => {
    clearActiveEventCookie();
  });

  it("serializes the active event as encoded JSON", () => {
    expect(serializeActiveEventCookie("evt_123")).toContain(
      `${ACTIVE_EVENT_COOKIE_NAME}=%7B%22id%22%3A%22evt_123%22%7D`,
    );
  });

  it("writes, updates, and clears the browser cookie", () => {
    writeActiveEventCookie("evt_1");
    expect(document.cookie).toContain(`${ACTIVE_EVENT_COOKIE_NAME}=%7B%22id%22%3A%22evt_1%22%7D`);

    writeActiveEventCookie("evt_2");
    expect(document.cookie).toContain(`${ACTIVE_EVENT_COOKIE_NAME}=%7B%22id%22%3A%22evt_2%22%7D`);

    clearActiveEventCookie();
    expect(document.cookie).not.toContain(`${ACTIVE_EVENT_COOKIE_NAME}=`);
  });
});
