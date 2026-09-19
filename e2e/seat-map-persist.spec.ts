import { expect, test, type Page } from "@playwright/test";
import { loginAndGoToSeatMap } from "./auth";
import { BACKEND_URL, EVENT_ID, SEAT_MAP_URL } from "./config";

/**
 * E2E: geometry edits on the seat map editor persist through the GraphQL write
 * path and are picked up by a fresh session (DB refetch; no snap-back).
 *
 * Infrastructure-dependent: needs seat service, GraphQL gateway and the seeded
 * event (see AGENTS.md). Mirrors e2e/seat-layout-harness gesture helpers.
 * Fixture ids/names are discovered at runtime so a re-seeded database does not
 * invalidate the spec.
 */

const UPDATE_OPERATIONS = ["UpdateSection", "UpdateTable", "UpdateSeat"];

type Geometry = { x?: number; y?: number; rotation?: number };

interface Fixture {
  sectionId: string;
  tableId: string;
  seatId: string;
  sectionLabel: string;
  tableLabel: string;
  radius: number;
}

interface LayoutView {
  sectionRotation(id: string): number | undefined;
  geometry(id: string): Geometry | undefined;
}

const DISCOVER_QUERY = `query Discover($eventId: ID!) {
  seatLayout(eventId: $eventId) {
    id
    name
    x
    y
    rotation
    tables {
      id
      name
      x
      y
      rotation
      seats { id x y rotation }
    }
  }
}`;

const layouts = new WeakMap<Page, LayoutView>();
const mutationCounts = new WeakMap<Page, number>();
const seatLayoutCounts = new WeakMap<Page, number>();

async function fixtureFor(page: Page): Promise<Fixture> {
  const layout = await page.evaluate(
    async ({ url, eventId, query, operationName }) => {
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationName, query, variables: { eventId } }),
      });
      const json = (await res.json()) as { data?: { seatLayout?: unknown[] } };
      return json?.data?.seatLayout ?? [];
    },
    { url: BACKEND_URL, eventId: EVENT_ID, query: DISCOVER_QUERY, operationName: "Discover" },
  );
  const section = layout[0] as
    | { id?: string; name?: string; tables?: { id?: string; name?: string; seats?: { id?: string; x?: number | null; y?: number | null }[] }[]; seats?: { id?: string; x?: number | null; y?: number | null }[] }
    | undefined;
  const table = section?.tables?.[0];
  const seat = (table?.seats ?? section?.seats ?? [])[0];
  expect(section, "fixture section").toBeDefined();
  expect(table, "fixture table").toBeDefined();
  expect(seat, "fixture seat").toBeDefined();
  return {
    sectionId: section!.id!,
    tableId: table!.id!,
    seatId: seat!.id!,
    sectionLabel: `Bereich ${section!.name} drehen`,
    tableLabel: `Tisch ${table!.name} drehen`,
    radius: Math.hypot(seat!.x ?? 0, seat!.y ?? 0) || 60,
  };
}

function installCapture(page: Page): void {
  const captures: unknown[][] = [];
  mutationCounts.set(page, 0);
  seatLayoutCounts.set(page, 0);
  page.on("response", (response) => {
    if (!response.url().includes("/graphql")) return;
    response
      .json()
      .then((json) => {
        const layout = json?.data?.seatLayout;
        if (Array.isArray(layout)) {
          captures.push(layout);
          seatLayoutCounts.set(page, (seatLayoutCounts.get(page) ?? 0) + 1);
        }
      })
      .catch(() => {});
  });
  page.on("response", (response) => {
    if (!response.url().includes("/graphql")) return;
    try {
      const operationName = response.request().postDataJSON()?.operationName;
      if (UPDATE_OPERATIONS.includes(operationName)) {
        mutationCounts.set(page, (mutationCounts.get(page) ?? 0) + 1);
      }
    } catch {}
  });

  const findNode = (
    layout: unknown[],
    id: string,
  ): { id?: string; x?: number; y?: number; rotation?: number } | undefined => {
    type Node = { id?: string; x?: number; y?: number; rotation?: number };
    type Section = Node & { tables?: Node[]; seats?: Node[] };
    type Table = Node & { seats?: Node[] };
    for (const entry of layout as Section[]) {
      if (entry?.id === id) return entry;
      for (const seat of entry?.seats ?? []) {
        if (seat?.id === id) return seat;
      }
      for (const table of entry?.tables ?? []) {
        if (table?.id === id) return table;
        for (const seat of (table as Table)?.seats ?? []) {
          if (seat?.id === id) return seat;
        }
      }
    }
    return undefined;
  };
  const geometryOf = (layout: unknown[], id: string): Geometry | undefined => {
    const entry = findNode(layout, id);
    if (!entry) return undefined;
    return {
      x: (entry as { x?: number }).x,
      y: (entry as { y?: number }).y,
      rotation: (entry as { rotation?: number }).rotation,
    };
  };

  layouts.set(page, {
    sectionRotation(id) {
      const layout = captures.at(-1) as { id?: string; rotation?: number }[] | undefined;
      return layout?.find((section) => section?.id === id)?.rotation;
    },
    geometry(id) {
      return geometryOf(captures.at(-1) ?? [], id);
    },
  });
}

async function login(page: Page): Promise<void> {
  expect(await loginAndGoToSeatMap(page), "authenticated session").toBe(true);
}

async function openEditor(page: Page, fx: Fixture): Promise<void> {
  const editing = page.getByLabel("Sitzplan bearbeiten");
  if (await editing.isVisible().catch(() => false)) return;
  if (!page.url().includes("/seat/map")) {
    await page.goto(SEAT_MAP_URL, { waitUntil: "networkidle", timeout: 30_000 });
  }
  for (let i = 0; i < 8; i++) {
    if (!(await page.getByText("Willkommen zu Checkpoint").isVisible().catch(() => false))) break;
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
  }
  await expect(page.getByTestId("seatmap-canvas")).toBeVisible({ timeout: 30_000 });
  const edit = page.getByRole("button", { name: "Edit" });
  await expect(edit).toBeVisible({ timeout: 20_000 });
  await edit.focus();
  await edit.press("Enter");
  await expect(editing).toBeVisible({ timeout: 10_000 });
  await expect(page.locator(`[data-node-id="${fx.sectionId}"]`)).toBeAttached();
}

async function select(page: Page, id: string): Promise<void> {
  const button = page.locator(`[data-node-id="${id}"] button`).first();
  await expect(button).toBeVisible();
  await button.focus();
  await button.press("Enter");
}

async function installBusyTrace(page: Page): Promise<void> {
  await page.evaluate(() => {
    const element = document.querySelector('[data-testid="seatmap-canvas"]');
    const win = window as unknown as { __busyTrace: string[]; __busyObserver?: MutationObserver };
    if (!element) return;
    win.__busyTrace = [element.getAttribute("aria-busy") ?? "false"];
    win.__busyObserver?.disconnect();
    win.__busyObserver = new MutationObserver(() => {
      win.__busyTrace.push(element.getAttribute("aria-busy") ?? "false");
    });
    win.__busyObserver.observe(element, { attributes: true, attributeFilter: ["aria-busy"] });
  });
}

const roundTripDone = () => {
  const win = window as unknown as { __busyTrace?: string[] };
  const trace = win.__busyTrace;
  if (!trace) return false;
  const lastTrue = trace.lastIndexOf("true");
  return lastTrue !== -1 && trace.slice(lastTrue).includes("false");
};

const baselines = new WeakMap<Page, number>();

async function rotate(page: Page, label: string, direction: "right" | "left"): Promise<void> {
  const handle = page.getByRole("button", { name: label });
  await expect(handle).toBeVisible({ timeout: 10_000 });
  await handle.focus();
  baselines.set(page, mutationCounts.get(page) ?? 0);
  await installBusyTrace(page);
  await handle.press(direction === "right" ? "ArrowRight" : "ArrowLeft");
}

async function awaitPersist(page: Page, minMutations: number): Promise<void> {
  await page.waitForFunction(roundTripDone, undefined, { timeout: 60_000 });
  const baseline = baselines.get(page) ?? 0;
  await expect
    .poll(
      () => (mutationCounts.get(page) ?? 0) - baseline,
      { timeout: 30_000, message: "expected write count" },
    )
    .toBeGreaterThanOrEqual(minMutations);
  await page.waitForTimeout(1_500);
}

async function freshSessionView(page: Page, fx: Fixture): Promise<void> {
  const before = seatLayoutCounts.get(page) ?? 0;
  const retries = [0, 12_000, 26_000, 45_000];
  for (let i = 0; i < retries.length; i++) {
    if (retries[i]) await page.waitForTimeout(retries[i]);
    expect(await loginAndGoToSeatMap(page), "fresh session lands on seat map").toBe(true);
    await expect(page.getByTestId("seatmap-canvas")).toBeVisible({ timeout: 30_000 });
    const attached = await page
      .locator(`[data-node-id="${fx.sectionId}"]`)
      .waitFor({ state: "attached", timeout: 30_000 })
      .then(() => true)
      .catch(() => false);
    if (attached) {
      const fresh = await expect
        .poll(
          () => seatLayoutCounts.get(page) ?? 0,
          { timeout: 30_000, message: "layout captured for assertions" },
        )
        .toBeGreaterThan(before)
        .then(() => true)
        .catch(() => false);
      expect(fresh, "fresh layout captured").toBe(true);
      return;
    }
  }
  throw new Error("seat layout never rendered under a fresh session");
}

test("table rotation and its seat orbit persist across reload", async ({ page }) => {
  test.setTimeout(180_000);
  installCapture(page);
  await login(page);
  const fx = await fixtureFor(page);
  await openEditor(page, fx);

  const before = layouts.get(page)!.geometry(fx.tableId);
  const beforeSeat = layouts.get(page)!.geometry(fx.seatId);
  expect(before, "table captured").toBeDefined();
  expect(beforeSeat, "seat captured").toBeDefined();

  await select(page, fx.tableId);
  await rotate(page, fx.tableLabel, "right");
  await awaitPersist(page, 5);

  await freshSessionView(page, fx);
  const after = layouts.get(page)!.geometry(fx.tableId);
  const afterSeat = layouts.get(page)!.geometry(fx.seatId);
  expect(after, "table captured after reload").toBeDefined();
  expect(afterSeat, "seat captured after reload").toBeDefined();

  expect(after!.rotation).toBeCloseTo((before!.rotation ?? 0) + 5, 3);
  expect(after!.x).toBeCloseTo(before!.x!, 3);
  expect(after!.y).toBeCloseTo(before!.y!, 3);
  const chord = Math.hypot(afterSeat!.x! - beforeSeat!.x!, afterSeat!.y! - beforeSeat!.y!);
  expect(chord).toBeCloseTo(2 * fx.radius * Math.sin((5 / 2) * (Math.PI / 180)), 1);

  await openEditor(page, fx);
  await select(page, fx.tableId);
  await rotate(page, fx.tableLabel, "left");
  await awaitPersist(page, 5);
  await freshSessionView(page, fx);
  expect(layouts.get(page)!.geometry(fx.tableId)!.rotation).toBeCloseTo(before!.rotation ?? 0, 3);
});

test("section rotation and descendant orbits persist across reload", async ({ page }) => {
  test.setTimeout(300_000);
  installCapture(page);
  await login(page);
  const fx = await fixtureFor(page);
  await openEditor(page, fx);

  const before = layouts.get(page)!.sectionRotation(fx.sectionId);
  const beforeTable = layouts.get(page)!.geometry(fx.tableId);
  expect(before, "section rotation captured").toBeDefined();
  expect(beforeTable, "table captured").toBeDefined();

  await select(page, fx.sectionId);
  await rotate(page, fx.sectionLabel, "right");
  await awaitPersist(page, 2);

  await freshSessionView(page, fx);
  const rotated = layouts.get(page)!.sectionRotation(fx.sectionId);
  const rotatedTable = layouts.get(page)!.geometry(fx.tableId);
  expect(rotated, "section rotation captured").toBeDefined();
  expect(rotated!).toBeCloseTo((before ?? 0) + 5, 3);
  const delta = Math.hypot(
    rotatedTable!.x! - beforeTable!.x!,
    rotatedTable!.y! - beforeTable!.y!,
  );
  expect(delta, "child table orbit persisted").toBeGreaterThan(4);

  await openEditor(page, fx);
  await select(page, fx.sectionId);
  await rotate(page, fx.sectionLabel, "left");
  await awaitPersist(page, 2);
  await freshSessionView(page, fx);
  expect(layouts.get(page)!.sectionRotation(fx.sectionId)).toBeCloseTo(before ?? 0, 3);
  const restored = layouts.get(page)!.geometry(fx.tableId);
  expect(
    Math.hypot(restored!.x! - beforeTable!.x!, restored!.y! - beforeTable!.y!),
  ).toBeLessThan(1);
});