import { describe, expect, it } from "vitest";
import { resolveExperience } from "../resolver";
import { EventPermissionKey } from "@/checkpoint/lib/rbac/event-permissions";
import { getFeatures } from "../feature-registry";
import { ROLE_PROFILES } from "../experience-profiles";

const allPermissions = Object.values(EventPermissionKey);

describe("resolveExperience", () => {
  describe("built-in role profiles", () => {
    it("returns all features for ADMIN", () => {
      const result = resolveExperience(["ADMIN"], allPermissions);
      expect(result.primaryRole).toBe("ADMIN");
      expect(result.allowedFeatureIds).toEqual(
        ROLE_PROFILES["ADMIN"]!.allowedFeatureIds,
      );
      expect(result.features.length).toBe(
        ROLE_PROFILES["ADMIN"]!.allowedFeatureIds.length,
      );
      expect(result.navigationGroupOrder).toEqual(["main", "event", "tools", "personal", "admin"]);
    });

    it("returns only self-service features for GUEST", () => {
      const result = resolveExperience(["GUEST"], []);
      const profile = ROLE_PROFILES["GUEST"]!;
      expect(result.primaryRole).toBe("GUEST");
      expect(result.allowedFeatureIds).toEqual(profile.allowedFeatureIds);
      expect(result.features.every((f) => f.category === "personal")).toBe(true);
      expect(result.navigationGroupOrder).toEqual(["personal"]);
    });

    it("returns security-relevant features for SECURITY", () => {
      const result = resolveExperience(["SECURITY"], allPermissions);
      const profile = ROLE_PROFILES["SECURITY"]!;
      expect(result.primaryRole).toBe("SECURITY");
      expect(result.allowedFeatureIds).toEqual(profile.allowedFeatureIds);
      expect(result.allowedFeatureIds).toContain("scanner");
      expect(result.allowedFeatureIds).toContain("scans");
      expect(result.allowedFeatureIds).toContain("security");
      expect(result.allowedFeatureIds).not.toContain("invitations");
      expect(result.allowedFeatureIds).not.toContain("tickets");
    });

    it("returns support and notification features for SUPPORT", () => {
      const result = resolveExperience(["SUPPORT"], allPermissions);
      const profile = ROLE_PROFILES["SUPPORT"]!;
      expect(result.primaryRole).toBe("SUPPORT");
      expect(result.allowedFeatureIds).toEqual(profile.allowedFeatureIds);
      expect(result.allowedFeatureIds).toContain("support");
      expect(result.allowedFeatureIds).toContain("notifications");
      expect(result.allowedFeatureIds).not.toContain("guests");
      expect(result.allowedFeatureIds).not.toContain("tickets");
    });
  });

  describe("multi-role resolution", () => {
    it("uses highest priority profile when user has multiple roles", () => {
      const result = resolveExperience(["GUEST", "SECURITY", "ADMIN"], allPermissions);
      expect(result.primaryRole).toBe("ADMIN");
      expect(result.allowedFeatureIds).toContain("admin-console");
    });

    it("SECURITY profile wins over GUEST", () => {
      const result = resolveExperience(["GUEST", "SECURITY"], allPermissions);
      expect(result.primaryRole).toBe("SECURITY");
      expect(result.allowedFeatureIds).toContain("scanner");
      expect(result.allowedFeatureIds).not.toContain("my-ticket");
    });

    it("SUPPORT profile wins over GUEST", () => {
      const result = resolveExperience(["GUEST", "SUPPORT"], allPermissions);
      expect(result.primaryRole).toBe("SUPPORT");
      expect(result.allowedFeatureIds).toContain("support");
    });
  });

  describe("custom role fallback", () => {
    it("infers features from permissions when no profile matches", () => {
      const result = resolveExperience(
        ["CUSTOM_ROLE"],
        [EventPermissionKey.ScanTickets, EventPermissionKey.ViewGuests],
      );
      expect(result.primaryRole).toBe("CUSTOM_ROLE");
      expect(result.allowedFeatureIds).toContain("scanner");
      expect(result.allowedFeatureIds).toContain("scan-history");
      expect(result.allowedFeatureIds).toContain("guests");
      expect(result.allowedFeatureIds).toContain("security");
      expect(result.allowedFeatureIds).not.toContain("support");
      expect(result.allowedFeatureIds).not.toContain("invitations");
    });

    it("returns minimal personal features when no profile or permissions exist", () => {
      const result = resolveExperience(["CUSTOM_ROLE"], []);
      expect(result.primaryRole).toBe("CUSTOM_ROLE");
      expect(result.allowedFeatureIds).toEqual([
        "my-dashboard",
        "my-profile",
        "my-security",
      ]);
    });
  });

  describe("minimal fallback", () => {
    it("returns only basic personal features when no profile or permissions exist", () => {
      const result = resolveExperience([], []);
      expect(result.primaryRole).toBe("UNKNOWN");
      expect(result.allowedFeatureIds).toEqual([
        "my-dashboard",
        "my-profile",
        "my-security",
      ]);
      expect(result.navigationGroupOrder).toEqual(["personal"]);
    });
  });

  describe("ResolvedExperience structure", () => {
    it("always returns default empty arrays for optional fields", () => {
      const guest = resolveExperience(["GUEST"], []);
      expect(guest.dashboardWidgetIds).toEqual(["ticket-qr", "quick-actions"]);
      expect(guest.quickActionIds).toEqual([]);

      const admin = resolveExperience(["ADMIN"], allPermissions);
      expect(admin.dashboardWidgetIds).toEqual([
        "guest-stats",
        "scanner-quick",
        "security-status",
        "support-queue",
        "quick-actions",
        "event-meta",
        "scan-activity",
      ]);
      expect(admin.quickActionIds).toEqual([]);

      const unknown = resolveExperience(["UNKNOWN"], []);
      expect(unknown.dashboardWidgetIds).toEqual([]);
    });

    it("returns all known features for ADMIN", () => {
      const result = resolveExperience(["ADMIN"], allPermissions);
      const allFeatures = getFeatures();
      expect(result.features.length).toBe(allFeatures.length);
    });
  });
});
