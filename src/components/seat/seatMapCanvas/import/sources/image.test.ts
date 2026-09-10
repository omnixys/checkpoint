import { afterEach, describe, expect, it, vi } from "vitest";
import { decodeImage } from "./image";

function png(width = 600, height = 400, type = "image/png") {
  const bytes = new Uint8Array(24);
  bytes.set([137, 80, 78, 71, 13, 10, 26, 10]);
  const view = new DataView(bytes.buffer);
  view.setUint32(16, width);
  view.setUint32(20, height);
  return { size: bytes.length, type, arrayBuffer: async () => bytes.buffer } as Blob;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("browser image decoder boundary", () => {
  it("uses decoder orientation once and releases the decoded bitmap", async () => {
    const close = vi.fn();
    const decode = vi.fn(async () => ({ width: 400, height: 600, close }));
    vi.stubGlobal("createImageBitmap", decode);
    const drawImage = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      fillRect: vi.fn(),
      drawImage,
    } as unknown as CanvasRenderingContext2D);
    const file = png();
    const result = await decodeImage(file, new AbortController().signal);
    expect([result.width, result.height]).toEqual([400, 600]);
    expect(decode).toHaveBeenCalledWith(file, { imageOrientation: "from-image" });
    expect(drawImage).toHaveBeenCalledOnce();
    expect(close).toHaveBeenCalledOnce();
  });

  it("rejects MIME mismatch and header pixel overflow before decoding", async () => {
    const decode = vi.fn();
    vi.stubGlobal("createImageBitmap", decode);
    await expect(
      decodeImage(png(100, 100, "image/jpeg"), new AbortController().signal),
    ).rejects.toThrow("Dateityp");
    await expect(decodeImage(png(6001, 4000), new AbortController().signal)).rejects.toThrow(
      "24 Megapixel",
    );
    expect(decode).not.toHaveBeenCalled();
  });

  it("does not accept a valid header when actual decoding fails", async () => {
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn(async () => {
        throw new Error("decoder failed");
      }),
    );
    await expect(decodeImage(png(), new AbortController().signal)).rejects.toThrow("beschädigt");
  });

  it("closes a bitmap returned after cancellation", async () => {
    const controller = new AbortController();
    const close = vi.fn();
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn(async () => {
        controller.abort();
        return { width: 600, height: 400, close };
      }),
    );
    await expect(decodeImage(png(), controller.signal)).rejects.toThrow();
    expect(close).toHaveBeenCalledOnce();
  });
});
