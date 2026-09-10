import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PdfSource } from "./pdf";

const mocks = vi.hoisted(() => ({ getDocument: vi.fn() }));
vi.mock("pdfjs-dist", () => ({ getDocument: mocks.getDocument, GlobalWorkerOptions: {} }));

function pdfFile(content = "%PDF-1.7\n") {
  return {
    type: "application/pdf",
    size: content.length,
    arrayBuffer: async () => new TextEncoder().encode(content).buffer,
  } as File;
}

function fakePdf(count: number) {
  const cleanup = vi.fn();
  const cancel = vi.fn();
  const render = vi.fn(() => ({ promise: Promise.resolve(), cancel }));
  const getPage = vi.fn(async () => ({
    getViewport: ({ scale }: { scale: number }) => ({ width: 800 * scale, height: 600 * scale }),
    render,
    cleanup,
  }));
  const value = { numPages: count, getPage, getPermissions: vi.fn(async () => null) };
  const destroy = vi.fn(async () => undefined);
  mocks.getDocument.mockReturnValue({ promise: Promise.resolve(value), destroy });
  return { value, destroy, render, cancel, cleanup };
}

beforeEach(() => {
  mocks.getDocument.mockReset();
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("PDF source lifecycle (PDF.js test double)", () => {
  it("accepts one or multiple pages and renders only a requested page", async () => {
    for (const count of [1, 7]) {
      const mock = fakePdf(count);
      const source = new PdfSource();
      const signal = new AbortController().signal;
      expect(await source.open(pdfFile(), signal)).toBe(count);
      expect(mock.value.getPage).not.toHaveBeenCalled();
      const page = await source.page(count, signal);
      expect(page.width).toBe(1600);
      expect(page.height).toBe(1200);
      expect(mock.value.getPage).toHaveBeenCalledWith(count);
      expect(mock.cleanup).toHaveBeenCalledOnce();
      source.dispose();
      source.dispose();
      expect(mock.destroy).toHaveBeenCalledOnce();
    }
  });

  it("rejects invalid page indices before rendering", async () => {
    const mock = fakePdf(2);
    const source = new PdfSource();
    const signal = new AbortController().signal;
    await source.open(pdfFile(), signal);
    await expect(source.page(3, signal)).rejects.toThrow("vorhandene PDF-Seite");
    expect(mock.value.getPage).not.toHaveBeenCalled();
    source.dispose();
  });

  it("rejects over-limit PDFs and releases the parser", async () => {
    const mock = fakePdf(101);
    await expect(new PdfSource().open(pdfFile(), new AbortController().signal)).rejects.toThrow(
      "100 Seiten",
    );
    expect(mock.destroy).toHaveBeenCalledOnce();
  });

  it("rejects signatures, corrupt documents and encrypted PDFs with useful errors", async () => {
    await expect(
      new PdfSource().open(pdfFile("not PDF"), new AbortController().signal),
    ).rejects.toThrow("gültiges PDF");
    for (const name of ["InvalidPDFException", "PasswordException"]) {
      mocks.getDocument.mockReturnValue({
        promise: Promise.reject(Object.assign(new Error("parser detail"), { name })),
        destroy: vi.fn(async () => undefined),
      });
      await expect(new PdfSource().open(pdfFile(), new AbortController().signal)).rejects.toThrow(
        name === "PasswordException" ? "Verschlüsselte PDFs" : "beschädigt",
      );
    }
    const encrypted = fakePdf(1);
    encrypted.value.getPermissions.mockResolvedValue([] as unknown as null);
    await expect(new PdfSource().open(pdfFile(), new AbortController().signal)).rejects.toThrow(
      "Verschlüsselte PDFs",
    );
  });

  it("cancels a pending page render on close", async () => {
    const mock = fakePdf(1);
    let finish: () => void = () => undefined;
    mock.render.mockReturnValue({
      promise: new Promise<void>((resolve) => {
        finish = resolve;
      }),
      cancel: mock.cancel,
    });
    const source = new PdfSource();
    const controller = new AbortController();
    await source.open(pdfFile(), controller.signal);
    const rendering = source.page(1, controller.signal);
    await Promise.resolve();
    controller.abort();
    source.dispose();
    finish();
    await expect(rendering).rejects.toThrow();
    expect(mock.cancel).toHaveBeenCalled();
    expect(mock.destroy).toHaveBeenCalledOnce();
  });
});
