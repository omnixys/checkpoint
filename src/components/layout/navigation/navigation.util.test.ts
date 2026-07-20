import { describe, expect, it } from "vitest";
import { getActiveNavPath, isActiveNavItem, normalizeNavPath } from "./navigation.util";
import { resolveExperience } from "@/checkpoint/lib/experience/resolver";
import { buildNavigation } from "@/checkpoint/lib/experience/navigation-builder";
import { permissionsForLegacyRole } from "@/checkpoint/lib/rbac/event-permissions";

const adminPaths = [
  "/",
  "/event/event-1",
  "/event/event-1/invitation",
  "/event/event-1/seat",
  "/event/event-1/ticket",
  "/scan",
  "/me",
];

const guestPaths = ["/", "/me/my-qr", "/me/my-seat", "/me/my-plus-ones", "/me"];

describe("navigation active path matching", () => {
  it("normalizes absolute, relative, duplicate, and trailing slashes", () => {
    expect(normalizeNavPath("scan/")).toBe("/scan");
    expect(normalizeNavPath("/scan/")).toBe("/scan");
    expect(normalizeNavPath("//event//event-1//seat/")).toBe("/event/event-1/seat");
    expect(normalizeNavPath("/")).toBe("/");
  });

  it("matches the root item only on the root path", () => {
    expect(getActiveNavPath("/", adminPaths)).toBe("/");
    expect(getActiveNavPath("/scan", adminPaths)).toBe("/scan");
    expect(isActiveNavItem("/scan", "/", adminPaths)).toBe(false);
  });

  it("uses longest prefix matching for nested event routes", () => {
    expect(getActiveNavPath("/event/event-1", adminPaths)).toBe("/event/event-1");
    expect(getActiveNavPath("/event/event-1/seat/map", adminPaths)).toBe("/event/event-1/seat");
    expect(getActiveNavPath("/event/event-1/ticket/history", adminPaths)).toBe(
      "/event/event-1/ticket",
    );
  });

  it("does not match unrelated event routes", () => {
    expect(getActiveNavPath("/event/new", adminPaths)).toBeUndefined();
    expect(getActiveNavPath("/event/event-10", adminPaths)).toBeUndefined();
  });

  it("prefers guest child routes over the profile parent route", () => {
    expect(getActiveNavPath("/me/my-qr", guestPaths)).toBe("/me/my-qr");
    expect(getActiveNavPath("/me/my-seat/", guestPaths)).toBe("/me/my-seat");
    expect(getActiveNavPath("/me/my-plus-ones/edit", guestPaths)).toBe("/me/my-plus-ones");
    expect(getActiveNavPath("/me/profile", guestPaths)).toBe("/me");
  });

  it("returns the original configured item path", () => {
    expect(getActiveNavPath("/scan/history", ["scan", "me"])).toBe("scan");
  });

  it("keeps guest navigation to self-service routes only", () => {
    const guestPerms = permissionsForLegacyRole("GUEST");
    const experience = resolveExperience(["GUEST"], guestPerms);
    const items = buildNavigation(experience, "event-1");
    const paths = items.map((item) => item.path);

    expect(paths.some((path) => path.endsWith("/me/my-qr"))).toBe(true);
    expect(paths.some((path) => path.endsWith("/me/my-seat"))).toBe(true);
    expect(paths.some((path) => path.endsWith("/me/my-plus-ones"))).toBe(true);
    expect(paths.some((path) => path.endsWith("/event/event-1/ticket"))).toBe(false);
    expect(paths.some((path) => path.endsWith("/event/event-1/seat"))).toBe(false);
    expect(paths.some((path) => path.endsWith("/event/event-1/guest"))).toBe(false);
  });
});
