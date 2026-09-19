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
async function select(page: Page, id: string) {
  const start = await center(page, id);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x + 2, start.y, { steps: 2 });
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

test("dragging the resize handle shifts size fluidly, commits once and anchors the north-west corner", async ({
  page,
}) => {
  await select(page, "table-b");
  const before = await snapshot(page);
  const table = page.locator('[data-node-id="table-b"] button').first();
  const widthBefore = (await table.boundingBox())!.width;
  const handle = page.getByRole("button", { name: "Tisch Tisch 2 vergrößern" });
  const grip = await handle.boundingBox();
  const start = { x: grip!.x + grip!.width / 2, y: grip!.y + grip!.height / 2 };
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  const widths: number[] = [];
  for (let step = 1; step <= 6; step++) {
    await page.mouse.move(start.x + step * 18, start.y + step * 18, { steps: 3 });
    widths.push((await table.boundingBox())!.width);
  }
  expect(before.document!.nodes["table-b"]!.x).toBeCloseTo(340, 1);
  await page.mouse.up();
  await expect.poll(async () => (await snapshot(page)).resizeOps.length).toBe(1);
  const after = await snapshot(page);
  const grown = after.document!.nodes["table-b"]!;
  expect(grown.width).toBeGreaterThan(before.document!.nodes["table-b"]!.width);
  const nwBefore = before.document!.nodes["table-b"]!.x - before.document!.nodes["table-b"]!.width / 2;
  expect(grown.x - grown.width / 2).toBeCloseTo(nwBefore, 1);
  for (let i = 1; i < widths.length; i++) expect(widths[i]!).toBeGreaterThan(widths[i - 1]!);
  expect(widths[widths.length - 1]).toBeGreaterThan(widthBefore);
});

test("keyboard resize on the focused handle commits stepped changes", async ({ page }) => {
  await select(page, "table-b");
  const handle = page.getByRole("button", { name: "Tisch Tisch 2 vergrößern" });
  await handle.focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Shift+ArrowDown");
  await expect.poll(async () => (await snapshot(page)).resizeOps.length).toBe(2);
  const after = await snapshot(page);
  expect(after.document!.nodes["table-b"]).toMatchObject({ width: 160, height: 160 });
});

test("dragging the rotate handle turns the table and swings its seats around the centre", async ({
  page,
}) => {
  await select(page, "table-a");
  const before = await snapshot(page);
  const view = await camera(page);
  const table = before.document!.nodes["table-a"]!;
  const seatA = before.document!.nodes["seat-a"]!;
  const radius = Math.hypot(seatA.x - table.x, seatA.y - table.y);
  const handle = page.getByRole("button", { name: "Tisch Tisch 1 drehen" });
  const grip = await handle.boundingBox();
  const start = { x: grip!.x + grip!.width / 2, y: grip!.y + grip!.height / 2 };
  const target = {
    x: view.x + (table.x + 70 * Math.cos(-Math.PI / 4)) * view.scale,
    y: view.y + (table.y + 70 * Math.sin(-Math.PI / 4)) * view.scale,
  };
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(target.x, target.y, { steps: 8 });
  await page.mouse.up();
  await expect.poll(async () => (await snapshot(page)).rotateOps.length).toBe(1);
  const after = await snapshot(page);
  const turned = after.document!.nodes["table-a"]!;
  expect(Math.abs(turned.rotation - 90)).toBeGreaterThan(60);
  for (const id of ["seat-a", "seat-b"]) {
    const seat = after.document!.nodes[id]!;
    expect(Math.hypot(seat.x - turned.x, seat.y - turned.y)).toBeCloseTo(radius, 1);
  }
});

test("keyboard rotation on the focused handle steps in 5° increments and orbits seats", async ({
  page,
}) => {
  await select(page, "table-a");
  const before = await snapshot(page);
  const handle = page.getByRole("button", { name: "Tisch Tisch 1 drehen" });
  await handle.focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await expect.poll(async () => (await snapshot(page)).rotateOps.length).toBe(2);
  const after = await snapshot(page);
  const table = before.document!.nodes["table-a"]!;
  expect(after.document!.nodes["table-a"]!.rotation).toBe(100);
  const seat = after.document!.nodes["seat-a"]!;
  const beforeSeat = before.document!.nodes["seat-a"]!;
  expect(
    Math.hypot(seat.x - table.x, seat.y - table.y),
  ).toBeCloseTo(Math.hypot(beforeSeat.x - table.x, beforeSeat.y - table.y), 1);
});