import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const legacyProduct = ["post", "hog"].join("");
const removedVercelPackage = ["@vercel", "analytics"].join("/");

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? sourceFiles(path) : [path];
  });
}

describe("product analytics migration", () => {
  it("contains no legacy analytics dependency, adapter, provider, or flag usage", () => {
    const manifests = ["package.json", "pnpm-lock.yaml"]
      .map((path) => readFileSync(path, "utf8"))
      .join("\n");
    const application = sourceFiles("src")
      .filter((path) => !path.endsWith("product-analytics-migration.test.ts"))
      .map((path) => readFileSync(path, "utf8"))
      .join("\n");

    expect(manifests.toLowerCase()).not.toContain(legacyProduct);
    expect(application.toLowerCase()).not.toContain(legacyProduct);
    expect(manifests).not.toContain(removedVercelPackage);
    expect(application).not.toContain(removedVercelPackage);
    expect(manifests).toContain("@vercel/speed-insights");
  });
});
