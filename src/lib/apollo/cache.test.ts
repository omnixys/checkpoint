import { describe, expect, it } from "vitest";
import { typePolicies } from "./cache";

describe("Apollo cache policies", () => {
  it("uses the actual eventInvitation GraphQL field name", () => {
    const fields = typePolicies.Query?.fields ?? {};

    expect(fields).toHaveProperty("eventInvitation");
    expect(fields).not.toHaveProperty("eventInvitations");
  });
});
