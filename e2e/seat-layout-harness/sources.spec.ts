import { expect, type Page, test } from "@playwright/test";
import { jsPDF } from "jspdf";

async function uploadPng(page: Page) {
  const base64 = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 800, 600);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";
    ctx.strokeRect(280, 240, 240, 120);
    return canvas.toDataURL("image/png").split(",")[1]!;
  });
  await page.locator('input[type="file"]').setInputFiles({
    name: "layout.png",
    mimeType: "image/png",
    buffer: Buffer.from(base64, "base64"),
  });
  await expect(page.getByAltText("Originalvorlage mit korrigierbaren Planecken")).toBeVisible();
}

const errors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const captured: string[] = [];
  errors.set(page, captured);
  page.on("pageerror", (error) => captured.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") captured.push(message.text());
  });
  await page.goto("/?fixture=sources");
  await expect(page.getByRole("heading", { name: "Importquelle prüfen" })).toBeVisible();
});
test.afterEach(async ({ page }) => {
  expect(errors.get(page)).toEqual([]);
});

test("actual PNG decoder, numeric crop, rotation and perspective produce a bounded preview", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") requests.push(request.url());
  });
  await uploadPng(page);
  await expect(page.getByTestId("prepared-source")).toHaveText("Keine vorbereitete Quelle");
  await page.getByLabel("1. Oben links X").fill("100");
  await page.getByLabel("2. Oben rechts X").fill("700");
  await page.getByLabel("3. Unten rechts X").fill("700");
  await page.getByLabel("4. Unten links X").fill("100");
  await page.getByRole("button", { name: "Vorschau vorbereiten" }).click();
  await expect(page.getByTestId("prepared-source")).toContainText('"width":600,"height":600');
  await page.getByRole("button", { name: "90° im Uhrzeigersinn" }).click();
  await expect(page.getByTestId("prepared-source")).toHaveText("Keine vorbereitete Quelle");
  await page.getByRole("button", { name: "Vorschau vorbereiten" }).click();
  await expect(page.getByTestId("prepared-source")).toContainText('"width":600,"height":800');
  expect(requests).toEqual([]);
  await page.screenshot({
    path: "test-results/seat-layout-harness/source-image.png",
    fullPage: true,
  });
});

test("actual PDF.js worker renders the selected page only after explicit confirmation", async ({
  page,
}) => {
  await page.getByRole("button", { name: "PDF", exact: true }).click();
  const pdf = new jsPDF();
  pdf.text("Erste Seite", 20, 20);
  pdf.addPage();
  pdf.rect(30, 60, 90, 40);
  await page.locator('input[type="file"]').setInputFiles({
    name: "layout.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from(pdf.output("arraybuffer")),
  });
  await expect(page.getByLabel("PDF-Seite (1–2)")).toBeVisible();
  await expect(page.getByRole("button", { name: "Vorschau vorbereiten" })).toBeDisabled();
  await page.getByRole("button", { name: "Diese Seite bestätigen" }).click();
  await expect(page.getByRole("button", { name: "Vorschau vorbereiten" })).toBeEnabled();
  await page.getByLabel("PDF-Seite (1–2)").fill("2");
  await expect(page.getByRole("button", { name: "Vorschau vorbereiten" })).toBeDisabled();
  await page.getByRole("button", { name: "Diese Seite bestätigen" }).click();
  await page.getByRole("button", { name: "Vorschau vorbereiten" }).click();
  await expect(page.getByTestId("prepared-source")).toContainText('"pageNumber":2');
  await page.screenshot({
    path: "test-results/seat-layout-harness/source-pdf.png",
    fullPage: true,
  });
});

test("invalid and encrypted PDFs produce visible errors with the real parser", async ({ page }) => {
  await page.getByRole("button", { name: "PDF", exact: true }).click();
  await page.locator('input[type="file"]').setInputFiles({
    name: "broken.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.7\nnot a document"),
  });
  await expect(page.getByRole("alert")).toContainText("beschädigt");
  const encrypted = new jsPDF({
    encryption: { userPassword: "fixture-password", ownerPassword: "fixture-owner" },
  });
  encrypted.text("Protected", 20, 20);
  await page.locator('input[type="file"]').setInputFiles({
    name: "locked.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from(encrypted.output("arraybuffer")),
  });
  await expect(page.getByRole("alert")).toContainText("Verschlüsselte PDFs");
});

test("camera permission is user-triggered and a stream arriving after close is released", async ({
  page,
}) => {
  // Only MediaDevices is replaced; production camera lifecycle handles the pending grant.
  await page.evaluate(() => {
    const state = { requests: 0, stopped: 0, grant: () => {} };
    Object.assign(window, { sourceCameraFixture: state });
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: () => {
          state.requests++;
          return new Promise((resolve) => {
            state.grant = () =>
              resolve({
                getTracks: () => [
                  {
                    stop: () => {
                      state.stopped++;
                    },
                  },
                ],
              });
          });
        },
      },
    });
  });
  await page.getByRole("button", { name: "CAMERA", exact: true }).click();
  const snapshot = () =>
    page.evaluate(() => {
      const state = (
        window as unknown as { sourceCameraFixture: { requests: number; stopped: number } }
      ).sourceCameraFixture;
      return { requests: state.requests, stopped: state.stopped };
    });
  expect(await snapshot()).toEqual({ requests: 0, stopped: 0 });
  await page.getByRole("button", { name: "Kamera starten" }).click();
  await page.getByRole("button", { name: "Quelle schließen" }).click();
  await page.evaluate(() =>
    (
      window as unknown as { sourceCameraFixture: { grant: () => void } }
    ).sourceCameraFixture.grant(),
  );
  await expect.poll(snapshot).toEqual({ requests: 1, stopped: 1 });
});

test("actual JPEG EXIF orientation and WebP decoding preserve oriented dimensions", async ({
  page,
}) => {
  for (const mime of ["image/jpeg", "image/webp"]) {
    const base64 = await page.evaluate((type) => {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 600;
      const context = canvas.getContext("2d")!;
      context.fillStyle = "white";
      context.fillRect(0, 0, 800, 600);
      context.fillStyle = "black";
      context.fillRect(200, 100, 120, 60);
      return canvas.toDataURL(type).split(",")[1]!;
    }, mime);
    let buffer = Buffer.from(base64, "base64");
    if (mime === "image/jpeg") {
      // A single EXIF orientation=6 entry; the browser must apply this clockwise quarter turn once.
      const exif = Buffer.from([
        255, 225, 0, 34, 69, 120, 105, 102, 0, 0, 73, 73, 42, 0, 8, 0, 0, 0, 1, 0, 18, 1, 3, 0, 1,
        0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0,
      ]);
      buffer = Buffer.concat([buffer.subarray(0, 2), exif, buffer.subarray(2)]);
    }
    await page.locator('input[type="file"]').setInputFiles({
      name: mime === "image/jpeg" ? "oriented.jpg" : "layout.webp",
      mimeType: mime,
      buffer,
    });
    await expect(page.getByAltText("Originalvorlage mit korrigierbaren Planecken")).toHaveAttribute(
      "width",
      mime === "image/jpeg" ? "600" : "800",
    );
    await page.getByRole("button", { name: "Vorschau vorbereiten" }).click();
    await expect(page.getByTestId("prepared-source")).toContainText(
      mime === "image/jpeg" ? '"width":600,"height":800' : '"width":800,"height":600',
    );
  }
});
