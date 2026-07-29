import { describe, expect, it } from "vitest";
import { publicAnalyticsReference } from "./public-reference";

describe("publicAnalyticsReference", () => {
  it("resolves a public event without accepting a tenant from the URL", () => {
    expect(
      publicAnalyticsReference({
        pathname: "/rsvp",
        search: "?eventId=11111111-1111-4111-8111-111111111111&tenantId=attacker",
      } as Location),
    ).toEqual({
      type: "event",
      id: "11111111-1111-4111-8111-111111111111",
    });
  });

  it("resolves a private invitation path", () => {
    expect(
      publicAnalyticsReference({
        pathname: "/rsvp/22222222-2222-4222-8222-222222222222",
        search: "",
      } as Location),
    ).toEqual({
      type: "invitation",
      id: "22222222-2222-4222-8222-222222222222",
    });
  });

  it("rejects arbitrary RSVP references", () => {
    expect(
      publicAnalyticsReference({
        pathname: "/rsvp/not-a-uuid",
        search: "?eventId=also-not-a-uuid",
      } as Location),
    ).toBeUndefined();
  });
});
