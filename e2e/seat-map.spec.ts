import { test, expect, type Page } from "@playwright/test";
import { SEAT_MAP_URL, EVENT_ID } from "./config";

const TYPENAME = {
  SectionPayload: "SectionPayload" as const,
  TablePayload: "TablePayload" as const,
  SeatPayload: "SeatPayload" as const,
  SeatPresencePayload: "SeatPresencePayload" as const,
};

const MOCK_SECTIONS = [
  {
    __typename: TYPENAME.SectionPayload,
    id: "sec-1",
    name: "VIP",
    x: 400,
    y: 300,
    width: 500,
    height: 400,
    shape: "circle",
    rotation: 0,
    meta: { shape: "circle" },
    tables: [
      {
        __typename: TYPENAME.TablePayload,
        id: "tbl-1",
        name: "VIP-T1",
        x: -80,
        y: -60,
        width: 120,
        height: 60,
        shape: "ROUND",
        rotation: 0,
        meta: {},
        sectionId: "sec-1",
        seats: [
          { __typename: TYPENAME.SeatPayload, id: "st-1", x: 0, y: -30, rotation: 0, number: 1, status: "AVAILABLE", meta: {}, sectionId: "sec-1", tableId: "tbl-1" },
          { __typename: TYPENAME.SeatPayload, id: "st-2", x: 0, y: 30, rotation: 180, number: 2, status: "OCCUPIED", meta: {}, sectionId: "sec-1", tableId: "tbl-1" },
        ],
      },
      {
        __typename: TYPENAME.TablePayload,
        id: "tbl-2",
        name: "VIP-T2",
        x: 80,
        y: 60,
        width: 120,
        height: 60,
        shape: "ROUND",
        rotation: 0,
        meta: {},
        sectionId: "sec-1",
        seats: [
          { __typename: TYPENAME.SeatPayload, id: "st-3", x: 0, y: -30, rotation: 0, number: 3, status: "AVAILABLE", meta: {}, sectionId: "sec-1", tableId: "tbl-2" },
        ],
      },
    ],
    seats: [
      { __typename: TYPENAME.SeatPayload, id: "st-100", x: -150, y: 0, rotation: 0, number: 100, status: "AVAILABLE", meta: {}, sectionId: "sec-1", tableId: null },
    ],
  },
  {
    __typename: TYPENAME.SectionPayload,
    id: "sec-2",
    name: "General",
    x: 900,
    y: 300,
    width: 600,
    height: 500,
    shape: "grid",
    rotation: 0,
    meta: { shape: "grid" },
    tables: [
      {
        __typename: TYPENAME.TablePayload,
        id: "tbl-3",
        name: "General-T1",
        x: -100,
        y: -100,
        width: 120,
        height: 60,
        shape: "RECTANGLE",
        rotation: 0,
        meta: {},
        sectionId: "sec-2",
        seats: [],
      },
    ],
    seats: [],
  },
];

const MOCK_PRESENCES = [
  { __typename: TYPENAME.SeatPresencePayload, seatId: "st-2", presenceState: "INSIDE", checkedInAt: "2026-07-01T18:00:00Z", revoked: false, revokedAt: null },
];

const MOCK_SEATS = MOCK_SECTIONS.flatMap((s) => [
  ...(s.tables?.flatMap((t) => t.seats) ?? []),
  ...(s.seats ?? []),
]).map((seat) => ({
  ...seat,
  __typename: TYPENAME.SeatPayload,
  eventId: EVENT_ID,
  label: null,
  note: null,
  guestId: null,
  invitationId: null,
  section: { __typename: TYPENAME.SectionPayload, id: seat.sectionId, name: MOCK_SECTIONS.find((sec) => sec.id === seat.sectionId)?.name ?? "" },
  table: seat.tableId ? { __typename: TYPENAME.TablePayload, id: seat.tableId, name: MOCK_SECTIONS.flatMap((s) => s.tables ?? []).find((t) => t.id === seat.tableId)?.name ?? "" } : null,
}));

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
                me: {
                  id: "user-1",
                  username: "caleb",
                  role: "ADMIN",
                  personalInfo: { email: "caleb@test.com", firstName: "Caleb", lastName: "Tester" },
                },
              },
            }),
          });

        case "GetActiveEvent":
          return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              data: {
                event: {
                  id: EVENT_ID,
                  name: "Test Event",
                  myRole: "ADMIN",
                  settings: {
                    allowGuestSeatSelection: true,
                    startsAt: "2026-07-15T18:00:00Z",
                    endsAt: "2026-07-15T23:00:00Z",
                    invitedByOptions: [],
                  },
                },
              },
            }),
          });

        case "SeatMapView":
          return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              data: {
                seatLayout: MOCK_SECTIONS,
                seatPresencesByEvent: MOCK_PRESENCES,
              },
            }),
          });

        case "SeatList":
          return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              data: {
                seats: MOCK_SEATS,
              },
            }),
          });

        case "GetGlobalEventInvitationList":
          return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ data: { getFullByEventIds: [] } }),
          });

        case "EventGuestIdList":
          return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ data: { eventGuests: [] } }),
          });

        case "MyEvents":
          return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              data: {
                myEvents: [
                  {
                    id: EVENT_ID,
                    name: "Test Event",
                    myRole: "ADMIN",
                    settings: {
                      allowGuestSeatSelection: true,
                      startsAt: "2026-07-15T18:00:00Z",
                      endsAt: "2026-07-15T23:00:00Z",
                      invitedByOptions: [],
                    },
                  },
                ],
              },
            }),
          });

        default:
          return route.fallback();
      }
    } catch {
      return route.fallback();
    }
  });
}

test.describe("Seat Map (mocked)", () => {
  test.beforeEach(async ({ page }) => {
    await mockGraphQL(page);

    // Set a dummy access_token cookie to pass the edge proxy
    await page.context().addCookies([
      { name: "access_token", value: "mock-token", domain: "localhost", path: "/" },
    ]);

    // Suppress onboarding
    await page.addInitScript(`localStorage.setItem("checkpoint.onboardingDone", "done");`);

    // Start at the home page to let auth establish
    await page.goto("/", { waitUntil: "networkidle", timeout: 60_000 });
    await page.waitForTimeout(3_000);

    // Navigate to Seats page via sidebar button (client-side, preserves auth)
    await page.getByRole("button", { name: "Seats" }).click({ timeout: 10_000 });
    await page.waitForTimeout(2_000);

    // On the seat list page, click "Karte" (Map) button → /event/{id}/seat/map
    await page.getByRole("button", { name: "Karte" }).click({ timeout: 10_000 });
    await page.waitForTimeout(5_000);
  });

  test("canvas renders with mocked sections", async ({ page }) => {
    await expect(page.locator('[data-testid="seatmap-canvas"]')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('[data-testid="section-sec-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="section-sec-2"]')).toBeVisible();
  });

  test("section names are displayed", async ({ page }) => {
    // Section names are rendered inside the canvas. Check the DOM directly.
    await expect(page.getByText("VIP", { exact: true })).toBeAttached();
    await expect(page.getByText("General", { exact: true })).toBeAttached();
  });

  test("zoom controls are present and functional", async ({ page }) => {
    await expect(page.getByLabel("Vergrössern")).toBeVisible();
    await expect(page.getByLabel("Verkleinern")).toBeVisible();
    await expect(page.getByLabel("An Fenster anpassen")).toBeVisible();

    await page.getByLabel("Vergrössern").click();
    const zoomChip = page.locator(".MuiChip-root").filter({ hasText: /^\d+%$/ });
    await expect(zoomChip).not.toContainText("100%");
  });
});
