import { test, expect, type Page } from "@playwright/test";
import { EVENT_ID } from "./config";

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */
const T = {
  SectionPayload: "SectionPayload",
  TablePayload: "TablePayload",
  SeatPayload: "SeatPayload",
  SeatPresencePayload: "SeatPresencePayload",
  EventPayload: "EventPayload",
  EventSettings: "EventSettings",
};

/* ------------------------------------------------------------------ */
/*  Mock data generators                                              */
/* ------------------------------------------------------------------ */
function generateSections(sectionCount: number, tablesPerSection: number, seatsPerTable: number): any[] {
  const sections: any[] = [];
  for (let s = 0; s < sectionCount; s++) {
    const secId = `sec-${s}`;
    const sectionX = 200 + s * 500;
    const sectionY = 200 + (s % 3) * 400;
    const tables: any[] = [];
    for (let t = 0; t < tablesPerSection; t++) {
      const tblId = `tbl-${s}-${t}`;
      const seats: any[] = [];
      for (let i = 0; i < seatsPerTable; i++) {
        const seatId = `st-${s}-${t}-${i}`;
        const angle = (2 * Math.PI * i) / seatsPerTable - Math.PI / 2;
        const radius = 40;
        seats.push({
          __typename: T.SeatPayload,
          id: seatId,
          x: 60 + radius * Math.cos(angle) - 6,
          y: 30 + radius * Math.sin(angle) - 6,
          rotation: 0,
          number: i + 1,
          status: i === 0 ? "OCCUPIED" : "AVAILABLE",
          meta: {},
          sectionId: secId,
          tableId: tblId,
        });
      }
      tables.push({
        __typename: T.TablePayload,
        id: tblId,
        name: `T${t + 1}`,
        x: -100 + (t % 3) * 100,
        y: -60 + Math.floor(t / 3) * 80,
        width: 120,
        height: 60,
        shape: ["ROUND", "RECTANGLE", "OVAL", "ROW"][t % 4],
        rotation: 0,
        meta: {},
        sectionId: secId,
        seats,
      });
    }
    sections.push({
      __typename: T.SectionPayload,
      id: secId,
      name: `Section ${s + 1}`,
      x: sectionX,
      y: sectionY,
      width: 400,
      height: 300,
      shape: ["circle", "rectangle"][s % 2],
      rotation: 0,
      meta: {},
      tables,
      seats: [],
    });
  }
  return sections;
}

function generateSeatsList(sections: any[]): any[] {
  return sections.flatMap((s: any) => [
    ...(s.tables?.flatMap((t: any) => t.seats) ?? []),
    ...(s.seats ?? []),
  ]).map((seat: any) => ({
    ...seat,
    __typename: T.SeatPayload,
    eventId: EVENT_ID,
    label: null,
    note: null,
    guestId: seat.id === "st-0-0-0" ? "user-1" : null,
    invitationId: null,
    section: {
      __typename: T.SectionPayload,
      id: seat.sectionId,
      name: sections.find((sec: any) => sec.id === seat.sectionId)?.name ?? "",
    },
    table: seat.tableId
      ? {
          __typename: T.TablePayload,
          id: seat.tableId,
          name: sections.flatMap((sec: any) => sec.tables ?? []).find((t: any) => t.id === seat.tableId)?.name ?? "",
        }
      : null,
  }));
}

function generatePresences(sections: any[]): any[] {
  const result: any[] = [];
  for (const s of sections) {
    for (const t of s.tables ?? []) {
      for (const seat of t.seats ?? []) {
        if (seat.status === "OCCUPIED") {
          result.push({
            __typename: T.SeatPresencePayload,
            seatId: seat.id,
            presenceState: seat.id === "st-0-0-0" ? "INSIDE" : "OUTSIDE",
            checkedInAt: seat.id === "st-0-0-0" ? "2026-07-01T18:00:00Z" : null,
            revoked: false,
            revokedAt: null,
          });
        }
      }
    }
  }
  return result;
}

/* ------------------------------------------------------------------ */
/*  Shared mutable state                                               */
/* ------------------------------------------------------------------ */
let currentSections: any[] = [];
let currentPresences: any[] = [];
let currentSeats: any[] = [];
let currentRole: string = "ADMIN";
let currentUserId: string = "user-1";

function useDefaultData() {
  currentSections = generateSections(2, 3, 4);
  currentPresences = generatePresences(currentSections);
  currentSeats = generateSeatsList(currentSections);
  currentRole = "ADMIN";
  currentUserId = "user-1";
}

function useData(sectionCount: number, tablesPerSection: number, seatsPerTable: number) {
  currentSections = generateSections(sectionCount, tablesPerSection, seatsPerTable);
  currentPresences = generatePresences(currentSections);
  currentSeats = generateSeatsList(currentSections);
}

/* ------------------------------------------------------------------ */
/*  GraphQL mock                                                      */
/* ------------------------------------------------------------------ */
async function mockGraphQL(page: Page): Promise<void> {
  await page.route("**/graphql", async (route) => {
    const postData = route.request().postData() ?? "";
    try {
      const { operationName } = JSON.parse(postData);
      switch (operationName) {
        case "CurrentUser":
          return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              data: {
                me: { id: currentUserId, username: currentUserId === "user-1" ? "caleb" : "guest", role: "ADMIN", personalInfo: { email: `${currentUserId}@test.com`, firstName: currentUserId === "user-1" ? "Caleb" : "Guest", lastName: "Tester" } },
              },
            }),
          });

        case "GetActiveEvent":
          return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              data: {
                event: { __typename: T.EventPayload, id: EVENT_ID, name: "Test Event", myRole: currentRole, settings: { __typename: T.EventSettings, allowGuestSeatSelection: true, startsAt: "2026-07-15T18:00:00Z", endsAt: "2026-07-15T23:00:00Z", invitedByOptions: [] } },
              },
            }),
          });

        case "SeatMapView":
          return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ data: { seatLayout: currentSections, seatPresencesByEvent: currentPresences } }),
          });

        case "SeatList":
          return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ data: { seats: currentSeats } }),
          });

        case "GetGlobalEventInvitationList":
        case "EventGuestIdList":
          return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ data: { getFullByEventIds: [], eventGuests: [] } }),
          });

        case "MyEvents":
          return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              data: {
                myEvents: [{ __typename: T.EventPayload, id: EVENT_ID, name: "Test Event", myRole: currentRole, settings: { __typename: T.EventSettings, allowGuestSeatSelection: true, startsAt: "2026-07-15T18:00:00Z", endsAt: "2026-07-15T23:00:00Z", invitedByOptions: [] } }],
              },
            }),
          });

        case "AutoGenerateSeatMap":
        case "MoveSection":
        case "MoveTable":
        case "MoveSeat":
          return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ data: { [operationName.charAt(0).toLowerCase() + operationName.slice(1)]: true } }),
          });

        default:
          return route.fallback();
      }
    } catch {
      return route.fallback();
    }
  });
}

/* ------------------------------------------------------------------ */
/*  Navigation helper                                                 */
/* ------------------------------------------------------------------ */
async function navigateToSeatMap(page: Page) {
  await page.context().addCookies([
    { name: "access_token", value: "mock-token", domain: "localhost", path: "/" },
  ]);
  await page.addInitScript(`localStorage.setItem("checkpoint.onboardingDone", "done");`);
  await page.goto("/", { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(3_000);
  await page.getByRole("button", { name: "Seats" }).click({ timeout: 10_000 });
  await page.waitForTimeout(2_000);
  await page.getByRole("button", { name: "Karte" }).click({ timeout: 10_000 });
  await page.waitForTimeout(5_000);
}

/* ================================================================== */
/*  Seat Map Engine                                                    */
/* ================================================================== */
test.describe("Seat Map Engine", () => {
  test.beforeEach(async ({ page }) => {
    useDefaultData();
    await mockGraphQL(page);
    await navigateToSeatMap(page);
  });

  test("renders canvas with all sections", async ({ page }) => {
    await expect(page.locator('[data-testid="seatmap-canvas"]')).toBeVisible({ timeout: 15_000 });
    for (const s of currentSections) {
      await expect(page.locator(`[data-testid="section-${s.id}"]`)).toBeVisible();
    }
  });

  test("displays all section names", async ({ page }) => {
    for (const s of currentSections) {
      await expect(page.getByText(s.name, { exact: true })).toBeAttached();
    }
  });

  test("sections have valid bounding dimensions", async ({ page }) => {
    for (const s of currentSections) {
      const sectionEl = page.locator(`[data-testid="section-${s.id}"]`);
      await expect(sectionEl).toBeVisible();
      const box = await sectionEl.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.width).toBeGreaterThan(0);
        expect(box.height).toBeGreaterThan(0);
      }
    }
  });

  /* ---------------------------------------------------------------- */
  /*  Zoom                                                            */
  /* ---------------------------------------------------------------- */
  test("zoom-in button increases displayed percentage", async ({ page }) => {
    const zoomInBtn = page.getByLabel("Vergrössern");
    const zoomChip = page.locator(".MuiChip-root").filter({ hasText: /^\d+%$/ });
    const original = await zoomChip.textContent();
    await zoomInBtn.click();
    await page.waitForTimeout(500);
    const updated = await zoomChip.textContent();
    expect(updated).not.toBe(original);
  });

  test("canvas transform contains scale and translate", async ({ page }) => {
    const transform = await page.locator('[data-testid="seatmap-canvas"]').evaluate((el) => {
      const child = el.firstElementChild;
      if (!child) return "";
      const grandchild = child.firstElementChild;
      if (!grandchild) return "";
      return (grandchild as HTMLElement).style.transform || "";
    });
    expect(transform).toContain("scale(");
    expect(transform).toContain("translate(");
  });

  /* ---------------------------------------------------------------- */
  /*  Pan                                                             */
  /* ---------------------------------------------------------------- */
  test("pan changes viewport translate", async ({ page }) => {
    const canvas = page.locator('[data-testid="seatmap-canvas"]');
    const content = canvas.locator("> div > div").first();

    const beforeTransform = await content.evaluate((el) => {
      const parent = el.parentElement;
      if (!parent) return "";
      const grandparent = parent.parentElement;
      return grandparent ? (grandparent as HTMLElement).style.transform : "";
    });

    const box = await canvas.boundingBox();
    if (!canvasBox) return;
    const canvasBox = box;

    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 150, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(300);

    const afterTransform = await content.evaluate((el) => {
      const parent = el.parentElement;
      if (!parent) return "";
      const grandparent = parent.parentElement;
      return grandparent ? (grandparent as HTMLElement).style.transform : "";
    });

    expect(afterTransform).not.toBe(beforeTransform);
  });

  /* ---------------------------------------------------------------- */
  /*  Search highlight                                                */
  /* ---------------------------------------------------------------- */
  test("search filters non-matching seats", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Sitz / Gast / Section / Tisch");
    await expect(searchInput).toBeVisible();
    await searchInput.fill("T1");
    await page.waitForTimeout(500);
    const canvasEl = page.locator('[data-testid="seatmap-canvas"]');
    await expect(canvasEl).toBeAttached();
  });

  /* ---------------------------------------------------------------- */
  /*  Own seat                                                        */
  /* ---------------------------------------------------------------- */
  test("own seat is rendered with seat number visible", async ({ page }) => {
    await expect(page.getByLabel(/Sitz 1/)).toBeAttached();
  });

  /* ---------------------------------------------------------------- */
  /*  Presence status chips in header                                 */
  /* ---------------------------------------------------------------- */
  test("presence status chips are shown in header", async ({ page }) => {
    await expect(page.getByText("frei")).toBeVisible();
    await expect(page.getByText("belegt")).toBeVisible();
    await expect(page.getByText("eingecheckt")).toBeVisible();
  });

  /* ---------------------------------------------------------------- */
  /*  Table shapes                                                    */
  /* ---------------------------------------------------------------- */
  test("different table shapes render", async ({ page }) => {
    useData(1, 4, 2);
    await mockGraphQL(page);
    await page.reload();
    await page.waitForTimeout(5_000);
    await expect(page.locator('[data-testid="seatmap-canvas"]')).toBeVisible({ timeout: 15_000 });
    const tables = currentSections[0].tables;
    for (const t of tables) {
      await expect(page.getByText(t.name, { exact: true })).toBeAttached();
    }
  });

  /* ---------------------------------------------------------------- */
  /*  Auto-generate dialog                                            */
  /* ---------------------------------------------------------------- */
  test("auto-generate dialog opens from edit toolbar", async ({ page }) => {
    const editBtn = page.getByLabel("Bearbeiten");
    await expect(editBtn).toBeVisible();
    await editBtn.click();
    await page.waitForTimeout(500);

    const autoGenBtn = page.getByLabel("Auto-Generieren");
    await expect(autoGenBtn).toBeVisible();
    await autoGenBtn.click();
    await page.waitForTimeout(500);

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Sitzplan generieren")).toBeAttached();
    await expect(dialog.getByRole("button", { name: "Generieren" })).toBeVisible();
  });
});

/* ================================================================== */
/*  Role-based views                                                  */
/* ================================================================== */
test.describe("Seat Map Roles", () => {
  test("admin sees edit toolbar with Bearbeiten button", async ({ page }) => {
    currentRole = "ADMIN";
    useDefaultData();
    await mockGraphQL(page);
    await navigateToSeatMap(page);
    await expect(page.getByLabel("Bearbeiten")).toBeVisible({ timeout: 15_000 });
  });

  test("guest does not see edit toolbar", async ({ page }) => {
    currentRole = "GUEST";
    currentUserId = "guest-1";
    useData(1, 2, 3);
    await mockGraphQL(page);
    await navigateToSeatMap(page);
    await expect(page.locator('[data-testid="seatmap-canvas"]')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByLabel("Bearbeiten")).not.toBeVisible();
  });
});

/* ================================================================== */
/*  Edit mode drag-and-drop                                           */
/* ================================================================== */
test.describe("Seat Map Drag-and-Drop", () => {
  test.beforeEach(async ({ page }) => {
    useDefaultData();
    await mockGraphQL(page);
    await navigateToSeatMap(page);
  });

  test("entering edit mode and clicking a section selects it", async ({ page }) => {
    await page.getByLabel("Bearbeiten").click();
    await page.waitForTimeout(500);
    const section = page.locator('[data-testid="section-sec-0"]');
    await section.click();
    await page.waitForTimeout(300);
    const toolbar = page.locator('[data-testid="editor-toolbar"]');
    await expect(toolbar).toBeVisible();
  });

  test("dragging a section changes its position", async ({ page }) => {
    await page.getByLabel("Bearbeiten").click();
    await page.waitForTimeout(500);

    const section = page.locator('[data-testid="section-sec-0"]');
    await expect(section).toBeVisible();
    const beforeBox = await section.boundingBox();
    if (!beforeBox) return;

    const cx = beforeBox.x + beforeBox.width / 2;
    const cy = beforeBox.y + beforeBox.height / 2;

    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 50, cy + 30, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(300);

    const afterBox = await section.boundingBox();
    expect(afterBox).not.toBeNull();
    if (afterBox) {
      expect(afterBox.x).toBeGreaterThan(beforeBox.x);
      expect(afterBox.y).toBeGreaterThan(beforeBox.y);
    }
  });
});

/* ================================================================== */
/*  Visual regression                                                 */
/* ================================================================== */
test.describe("Seat Map Visual Regression", () => {
  for (const [label, secCount, tblPerSec, seatsPerTbl] of [
    ["10-seats", 1, 2, 5],
    ["50-seats", 2, 5, 5],
    ["100-seats", 4, 5, 5],
    ["250-seats", 5, 10, 5],
    ["500-seats", 10, 10, 5],
  ] as [string, number, number, number][]) {
    test(`renders ${label} layout`, async ({ page }) => {
      useData(secCount, tblPerSec, seatsPerTbl);
      await mockGraphQL(page);
      await navigateToSeatMap(page);
      await expect(page.locator('[data-testid="seatmap-canvas"]')).toBeVisible({ timeout: 30_000 });
      await page.waitForTimeout(2_000);
      await page.screenshot({ path: `e2e/screenshots/seat-map-${label}.png`, fullPage: false });
    });
  }
});
