import { expect, test } from "@playwright/test";

import type { RecognitionResult } from "../../src/components/seat/seatMapCanvas/import/contract";
import type {} from "./import-main";

for (const fallback of [false, true])
  test(`real image analysis → review → local drag (${fallback ? "history fallback" : "Navigation API"})`, async ({
    page,
    request,
  }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    if (fallback) {
      await page.addInitScript(() =>
        Object.defineProperty(window, "navigation", { configurable: true, value: undefined }),
      );
      await page.goto("/");
    }
    await page.goto("/import.html");
    await expect(
      page.getByRole("button", { name: "Sitzplan erstellen", exact: true }),
    ).toBeVisible();
    const initial = await page.evaluate(() => window.importHarness.snapshot().document!);
    await page.getByRole("button", { name: "Sitzplan erstellen", exact: true }).click();
    await page.getByRole("tab", { name: "Bild", exact: true }).click();
    const fixtureResponse = await request.get("http://127.0.0.1:5191/fixture/three-tables.png");
    expect(fixtureResponse.ok()).toBe(true);
    const file = await fixtureResponse.body();
    await page
      .locator('input[type="file"]')
      .setInputFiles({ name: "three-tables.png", mimeType: "image/png", buffer: file });
    await page.getByRole("button", { name: "Vorschau vorbereiten" }).click();
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/layout-import/") && response.request().method() === "POST",
    );
    await page.getByRole("button", { name: "Plan analysieren", exact: true }).click();
    const response = await responsePromise;
    expect(response.status()).toBe(200);
    const result: RecognitionResult = await response.json();
    expect(result.recognizer).toBe("geometry-v1");
    expect(result.elements.filter((e) => e.kind === "SEAT")).toHaveLength(30);
    const table = result.elements.find((e) => e.kind === "TABLE")!;
    const review = page.getByRole("dialog");
    await expect(review.getByAltText("Temporäre Planvorlage")).toBeVisible();
    await review.locator(`[data-node-id="${table.id}"] button`).click();
    await review.getByLabel("Label / Name").fill("Geprüfter Tisch");
    await review.getByRole("button", { name: "Vorschlag bestätigen", exact: true }).click();
    await review.getByLabel("Hinweise und Grenzen der Erkennung geprüft").check();
    await expect(
      review.getByRole("button", { name: "Als lokalen Entwurf übernehmen" }),
    ).toBeEnabled();
    await page.screenshot({ path: testInfo.outputPath("import-review.png"), fullPage: true });
    await review.getByRole("button", { name: "Als lokalen Entwurf übernehmen" }).click();
    await expect(review).not.toBeVisible();
    await expect(
      page.getByText("Lokaler Entwurf – nicht gespeichert", { exact: true }),
    ).toBeVisible();
    const accepted = await page.evaluate(() => window.importHarness.snapshot());
    expect(accepted.isLocal).toBe(true);
    expect(accepted.requests).toBe(0);
    for (const id of initial.order) expect(accepted.document!.nodes[id]).toEqual(initial.nodes[id]);
    const newSeats = Object.values(accepted.document!.nodes).filter(
      (n) => n.kind === "SEAT" && !initial.nodes[n.id],
    );
    expect(newSeats).toHaveLength(30);
    const corrected = Object.values(accepted.document!.nodes).find(
      (n) => n.kind === "TABLE" && n.name === "Geprüfter Tisch",
    )!;
    // Acceptance preserves the existing camera; fit is an explicit user operation.
    await page.getByRole("button", { name: "Fit to screen" }).click();
    const body = page.locator(`[data-node-id="${corrected.id}"] button`),
      box = (await body.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 40, box.y + box.height / 2 + 20, { steps: 4 });
    await page.mouse.up();
    await expect
      .poll(async () =>
        page.evaluate((id) => window.importHarness.snapshot().document!.nodes[id]!.x, corrected.id),
      )
      .not.toBe(corrected.x);
    expect((await page.evaluate(() => window.importHarness.snapshot())).requests).toBe(0);
    const moved = await page.evaluate(() => window.importHarness.snapshot().document);
    await page.evaluate(() => window.importHarness.refetch());
    expect(await page.evaluate(() => window.importHarness.snapshot().document)).toEqual(moved);
    await page.screenshot({ path: testInfo.outputPath("import-local-drag.png"), fullPage: true });
    page.once("dialog", (dialog) => dialog.dismiss());
    await page.getByRole("link", { name: "Andere Ansicht" }).click();
    await expect(page).toHaveURL(/import.html/);
    if (fallback) {
      const cancelled = page.waitForEvent("dialog");
      await page.evaluate(() => history.back());
      await (await cancelled).dismiss();
      await page.waitForFunction(() => Boolean(history.state?.__checkpointLayoutDraftGuard));
      expect((await page.evaluate(() => window.importHarness.snapshot())).isLocal).toBe(true);
      const confirmed = page.waitForEvent("dialog");
      await page.evaluate(() => history.back());
      await (await confirmed).accept();
      await expect(page).toHaveURL("http://127.0.0.1:5178/");
    }
    expect(errors).toEqual([]);
  });
