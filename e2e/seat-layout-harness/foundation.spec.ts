import { expect, type Page, test } from "@playwright/test";
import "./contract";

const snapshot = (page: Page) => page.evaluate(() => window.seatHarness.snapshot());
const browserErrors = new WeakMap<Page, string[]>();
const camera = (page: Page) =>
  page.getByTestId("seatmap-world").evaluate((element) => {
    const matrix = new DOMMatrix(getComputedStyle(element).transform);
    return { x: matrix.e, y: matrix.f, scale: matrix.a };
  });
async function center(page: Page, id: string) {
  const box = await page.locator(`[data-node-id="${id}"] button`).first().boundingBox();
  if (!box) throw new Error(`Missing node ${id}`);
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}
async function drag(page: Page, id: string, dx: number, dy = 0) {
  const start = await center(page, id);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x + dx, start.y + dy, { steps: 4 });
  await page.mouse.up();
}
test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  browserErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await expect(page.getByTestId("seatmap-canvas")).toBeVisible();
  await page.waitForFunction(() => Boolean(window.seatHarness?.snapshot().document));
  await expect.poll(async () => (await camera(page)).scale).toBeGreaterThan(1);
});
test.afterEach(async ({ page }) => {
  expect(browserErrors.get(page)).toEqual([]);
});

test("single-select, subthreshold click and clear cause no persistence", async ({ page }) => {
  await drag(page, "table-a", 2);
  expect((await snapshot(page)).selectedIds).toEqual(["table-a"]);
  expect((await snapshot(page)).requests).toHaveLength(0);
  const canvas = await page.getByTestId("seatmap-canvas").boundingBox();
  await page.mouse.click(canvas!.x + 8, canvas!.y + canvas!.height - 8);
  expect((await snapshot(page)).selectedIds).toEqual([]);
  expect((await snapshot(page)).requests).toHaveLength(0);
});

test("table preview moves descendants only in DOM, commits once and keeps camera", async ({
  page,
}) => {
  const before = await snapshot(page);
  const view = await camera(page);
  const start = await center(page, "table-a");
  const seatStart = await center(page, "seat-a");
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x + view.scale * 100, start.y, { steps: 6 });
  await expect
    .poll(async () => (await center(page, "seat-a")).x)
    .toBeCloseTo(seatStart.x + view.scale * 100, 1);
  expect((await snapshot(page)).document).toEqual(before.document);
  expect((await snapshot(page)).requests).toHaveLength(0);
  await page.mouse.up();
  await expect.poll(async () => (await snapshot(page)).requests.length).toBe(1);
  const after = await snapshot(page);
  expect(after.document!.nodes["table-a"]!.x).toBeCloseTo(700, 1);
  expect(after.document!.nodes["seat-a"]!.x).toBeCloseTo(700, 1);
  expect(after.document!.nodes["seat-free"]!.x).toBe(280);
  expect(after.requests[0]!.input.x).toBeCloseTo(200, 1);
  await expect
    .poll(async () => (await center(page, "table-a")).x)
    .toBeCloseTo(start.x + view.scale * 100, 1);
  await expect
    .poll(async () => (await center(page, "seat-a")).x)
    .toBeCloseTo(seatStart.x + view.scale * 100, 1);
  expect(await camera(page)).toEqual(view);
  await page.screenshot({ path: "test-results/seat-layout-harness/table-drag.png" });
});

test("committed pan keeps its final DOM transform after the pointer is released", async ({
  page,
}) => {
  const view = await camera(page);
  const canvas = await page.getByTestId("seatmap-canvas").boundingBox();
  const start = { x: canvas!.x + 8, y: canvas!.y + canvas!.height - 8 };
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x + 80, start.y - 40, { steps: 4 });
  await page.mouse.up();
  await expect.poll(async () => (await camera(page)).x).toBeCloseTo(view.x + 80, 1);
  await expect.poll(async () => (await camera(page)).y).toBeCloseTo(view.y - 40, 1);
  expect((await snapshot(page)).requests).toHaveLength(0);
});

test("section drag moves every descendant once and saves only the section", async ({ page }) => {
  const before = await snapshot(page);
  const view = await camera(page);
  const section = page.locator('[data-node-id="section-a"] button');
  const box = await section.boundingBox();
  await page.mouse.move(box!.x + 20, box!.y + box!.height - 20);
  await page.mouse.down();
  await page.mouse.move(box!.x + 20 + view.scale * 100, box!.y + box!.height - 20);
  await page.mouse.up();
  await expect.poll(async () => (await snapshot(page)).requests.length).toBe(1);
  const after = await snapshot(page);
  for (const id of before.document!.order)
    expect(after.document!.nodes[id]!.x - before.document!.nodes[id]!.x).toBeCloseTo(100, 1);
  expect(after.requests[0]!.kind).toBe("SECTION");
});

test("pointer capture preserves a drag after leaving the canvas", async ({ page }) => {
  const canvas = await page.getByTestId("seatmap-canvas").boundingBox();
  const start = await center(page, "table-a");
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(canvas!.x + canvas!.width + 45, start.y, { steps: 8 });
  await page.mouse.up();
  await expect.poll(async () => (await snapshot(page)).requests.length).toBe(1);
});

for (const cancel of ["escape", "pointercancel", "captureloss", "mode", "event"]) {
  test(`${cancel} cancels the drag preview without a mutation`, async ({ page }) => {
    const before = await snapshot(page);
    const start = await center(page, "table-a");
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(start.x + 80, start.y, { steps: 4 });
    if (cancel === "escape") await page.keyboard.press("Escape");
    if (cancel === "pointercancel")
      await page.getByTestId("seatmap-canvas").dispatchEvent("pointercancel", { pointerId: 1 });
    if (cancel === "captureloss")
      await page.getByTestId("seatmap-canvas").evaluate((element) => {
        if (element.hasPointerCapture(1)) element.releasePointerCapture(1);
      });
    if (cancel === "mode") await page.evaluate(() => window.seatHarness.setEditing(false));
    if (cancel === "event") await page.evaluate(() => window.seatHarness.setEvent("event-b"));
    await page.mouse.up();
    await expect.poll(async () => (await center(page, "table-a")).x).toBeCloseTo(start.x, 1);
    const after = await snapshot(page);
    expect(after.requests).toHaveLength(0);
    expect(after.document!.nodes).toEqual(before.document!.nodes);
  });
}

test("pending persistence blocks edits and rejected mutation rolls back with camera and selection intact", async ({
  page,
}) => {
  await page.evaluate(() => window.seatHarness.setOutcome("defer"));
  const before = await snapshot(page);
  const view = await camera(page);
  await drag(page, "table-a", 80);
  await expect(page.getByTestId("seatmap-canvas")).toHaveAttribute("aria-busy", "true");
  await drag(page, "table-b", 50);
  expect((await snapshot(page)).requests).toHaveLength(1);
  await page.evaluate(() => window.seatHarness.settle(true));
  await expect(page.getByRole("alert")).toContainText("Kontrollierter Speicherfehler");
  const after = await snapshot(page);
  expect(after.document).toEqual(before.document);
  expect(after.selectedIds).toEqual(["table-a"]);
  expect(await camera(page)).toEqual(view);
  await page.screenshot({ path: "test-results/seat-layout-harness/rollback.png" });
});

test("refetch keeps explicit zoom; viewer renders the same flat world", async ({ page }) => {
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  const view = await camera(page);
  await page.evaluate(() => window.seatHarness.refetch());
  expect(await camera(page)).toEqual(view);
  await page.evaluate(() => window.seatHarness.setEditing(false));
  await expect(page.getByRole("region", { name: "Sitzplan ansehen" })).toBeVisible();
  expect(await page.getByTestId("seatmap-world").locator(":scope > [data-node-id]").count()).toBe(
    6,
  );
  await page.screenshot({ path: "test-results/seat-layout-harness/viewer.png" });
});
