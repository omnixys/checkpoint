import { expect, test, type Page } from "@playwright/test";

interface Viewport {
  width: number;
  height: number;
  label: string;
}

const MOBILE_VIEWPORTS: Viewport[] = [
  { width: 390, height: 844, label: "390x844" },
  { width: 440, height: 956, label: "440x956" },
];

function attachErrorCollector(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

for (const viewport of MOBILE_VIEWPORTS) {
  test(`/me/support is full-bleed at ${viewport.label}`, async ({ page }) => {
    const errors = attachErrorCollector(page);
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");

    const box = page.getByTestId("support-chat-page");
    await expect(box).toBeVisible();

    await expect
      .poll(async () => (await box.boundingBox())?.width)
      .toBeCloseTo(viewport.width, 0);

    const rect = (await box.boundingBox())!;
    expect(rect.x).toBeCloseTo(0, 0);
    expect(rect.x + rect.width).toBeLessThanOrEqual(viewport.width + 1);

    const section = page.getByTestId("support-chat-section");
    const sectionRadius = await section.evaluate(
      (element) => getComputedStyle(element).borderRadius,
    );
    expect(sectionRadius).toBe("0px");

    const composer = page.getByPlaceholder("Type your message...");
    await expect(composer).toBeVisible();
    const composerRect = (await composer.boundingBox())!;
    expect(composerRect.y + composerRect.height).toBeLessThanOrEqual(viewport.height - 60);

    await expect(page.getByText("Support", { exact: true })).toBeVisible();
    await expect(page.getByText("Checkpoint Support · Offline")).toBeVisible();

    await page.screenshot({ path: test.info().outputPath(`support-${viewport.label}.png`) });
    expect(errors).toEqual([]);
  });
}

test("desktop renders a ~900px centred chat card, not a phone card", async ({ page }) => {
  const errors = attachErrorCollector(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const section = page.getByTestId("support-chat-section");
  await expect(section).toBeVisible();

  await expect.poll(async () => (await section.boundingBox())?.width).toBeGreaterThan(800);

  const rect = (await section.boundingBox())!;
  expect(Math.abs(rect.width - 900)).toBeLessThanOrEqual(4);

  const radius = await section.evaluate((element) => getComputedStyle(element).borderRadius);
  expect(radius).toBe("16px");

  const pageBox = page.getByTestId("support-chat-page");
  const pageRect = (await pageBox.boundingBox())!;
  const leftGap = rect.x - pageRect.x;
  const rightGap = pageRect.x + pageRect.width - (rect.x + rect.width);
  expect(Math.abs(leftGap - rightGap)).toBeLessThanOrEqual(4);

  await expect(page.getByText("Checkpoint Support · Offline")).toBeVisible();
  await page.screenshot({ path: test.info().outputPath("support-1440x900.png") });
  expect(errors).toEqual([]);
});
