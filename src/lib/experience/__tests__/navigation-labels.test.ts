import { describe, expect, it } from "vitest";
import type { NamespaceKeys } from "@/checkpoint/i18n/typed";
import deLayout from "../../../../messages/de/layout.json";
import enLayout from "../../../../messages/en/layout.json";
import { getFeatures } from "../feature-registry";
import { NAVIGATION_GROUPS } from "../groups";

function lookup(messages: Record<string, unknown>, key: string): string | undefined {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, messages) as string | undefined;
}

const labelKeys = (): NamespaceKeys<"layout">[] => [
  ...getFeatures()
    .map((feature) => feature.labelKey)
    .filter((key): key is NamespaceKeys<"layout"> => key !== undefined),
  ...Object.values(NAVIGATION_GROUPS)
    .map((group) => group.labelKey)
    .filter((key): key is NamespaceKeys<"layout"> => key !== undefined),
];

describe("navigation label keys are covered by every served locale", () => {
  it("every feature and group labelKey resolves in messages/en/layout.json", () => {
    for (const key of labelKeys()) {
      expect(lookup(enLayout, key), `missing en key ${key}`).toBeDefined();
      expect(lookup(enLayout, key)?.trim().length, `empty en key ${key}`).toBeGreaterThan(0);
    }
  });

  it("every feature and group labelKey resolves in messages/de/layout.json", () => {
    for (const key of labelKeys()) {
      expect(lookup(deLayout, key), `missing de key ${key}`).toBeDefined();
      expect(lookup(deLayout, key)?.trim().length, `empty de key ${key}`).toBeGreaterThan(0);
    }
  });
});
