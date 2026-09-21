import { describe, expect, it } from "vitest";
import { EventPermissionKey } from "@/checkpoint/lib/rbac/event-permissions";
import {
  buildGroupedNavigation,
  buildNavigation,
  type NavLabelResolver,
} from "../navigation-builder";
import { resolveExperience } from "../resolver";

const allPermissions = Object.values(EventPermissionKey);

const german: Record<string, string> = {
  "sidebar.home": "Startseite",
  "sidebar.profile": "Profil",
  "sidebar.mySecurity": "Sicherheit",
  "sidebar.group.personal": "Konto",
  "sidebar.group.tools": "Werkzeuge",
  "sidebar.group.event": "Event",
  "sidebar.group.admin": "Verwaltung",
};

const tGerman: NavLabelResolver = (key) => german[key];

describe("navigation-builder labels", () => {
  it("falls back to the registry label when no resolver is provided", () => {
    const experience = resolveExperience(["GUEST"], []);
    const items = buildNavigation(experience, "event-1");

    expect(items.find((item) => item.label === "Home")).toBeDefined();
    expect(items.map((item) => item.label)).not.toContain("Startseite");
  });

  it("falls back to the registry label when the resolver returns undefined", () => {
    const experience = resolveExperience(["GUEST"], []);
    const items = buildNavigation(experience, "event-1", () => undefined);

    expect(items.find((item) => item.label === "Home")).toBeDefined();
  });

  it("translates item labels via the resolver and falls back for unknown keys", () => {
    const experience = resolveExperience(["GUEST"], []);
    const items = buildNavigation(experience, "event-1", tGerman);
    const labels = items.map((item) => item.label);

    expect(labels).toContain("Startseite");
    expect(labels).toContain("Profil");
    expect(labels).toContain("My Ticket");
    expect(labels).not.toContain("Home");
  });

  it("translates group headers via the resolver", () => {
    const experience = resolveExperience(["ADMIN"], allPermissions);
    const groups = buildGroupedNavigation(experience, "event-1", tGerman);

    expect(groups.find((g) => g.groupId === "personal")?.groupLabel).toBe("Konto");
    expect(groups.find((g) => g.groupId === "tools")?.groupLabel).toBe("Werkzeuge");
    expect(groups.find((g) => g.groupId === "event")?.groupLabel).toBe("Event");
    expect(groups.find((g) => g.groupId === "admin")?.groupLabel).toBe("Verwaltung");
  });

  it("keeps group headers in the registry language without a resolver", () => {
    const experience = resolveExperience(["ADMIN"], allPermissions);
    const groups = buildGroupedNavigation(experience, "event-1");

    expect(groups.find((g) => g.groupId === "personal")?.groupLabel).toBe("Account");
    expect(groups.find((g) => g.groupId === "admin")?.groupLabel).toBe("Administration");
  });

  it("resolves paths and disabled flags independent of the resolver", () => {
    const withEvent = buildNavigation(resolveExperience(["GUEST"], []), "event-1", tGerman);
    const withoutEvent = buildNavigation(resolveExperience(["GUEST"], []), undefined, tGerman);

    expect(withEvent.every((item) => !item.disabled)).toBe(true);
    expect(withoutEvent.map((item) => item.path)).toEqual(withEvent.map((item) => item.path));
  });
});
