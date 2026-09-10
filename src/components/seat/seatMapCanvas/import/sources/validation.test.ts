import { describe, expect, it } from "vitest";
import {
  imageDimensions,
  imageMime,
  validateDimensions,
  validateFileSize,
  validatePdfPage,
} from "./validation";

function png(width: number, height: number) {
  const data = new Uint8Array(24);
  data.set([137, 80, 78, 71, 13, 10, 26, 10]);
  new DataView(data.buffer).setUint32(16, width);
  new DataView(data.buffer).setUint32(20, height);
  return data;
}

describe("source file limits", () => {
  it("checks PNG dimensions before decoding and rejects oversized images", () => {
    expect(imageDimensions(png(6000, 4000))).toEqual({ width: 6000, height: 4000 });
    expect(() => imageDimensions(png(6001, 4000))).toThrow("24 Megapixel");
    expect(() => imageDimensions(png(0, 100))).toThrow();
  });

  it("reads JPEG dimensions from a frame after metadata", () => {
    const bytes = new Uint8Array([
      255, 216, 255, 224, 0, 4, 0, 0, 255, 192, 0, 8, 8, 1, 44, 2, 88, 0,
    ]);
    expect(imageMime(bytes)).toBe("image/jpeg");
    expect(imageDimensions(bytes)).toEqual({ width: 600, height: 300 });
  });

  it("reads extended WebP dimensions", () => {
    const bytes = new Uint8Array(30);
    bytes.set([..."RIFF"].map((c) => c.charCodeAt(0)));
    bytes.set(
      [..."WEBPVP8X"].map((c) => c.charCodeAt(0)),
      8,
    );
    bytes[24] = 99;
    bytes[27] = 199;
    expect(imageDimensions(bytes)).toEqual({ width: 100, height: 200 });
  });

  it("rejects unknown/corrupt signatures, byte limits and non-finite dimensions", () => {
    expect(() => imageMime(new Uint8Array([0, 1, 2]))).toThrow("unterstütztes");
    expect(() => imageDimensions(new Uint8Array([255, 216, 255]))).toThrow();
    expect(() => validateFileSize({ size: 20 * 1024 * 1024 + 1 })).toThrow("20 MiB");
    expect(() => validateFileSize({ size: 0 })).toThrow();
    expect(() => validateDimensions(Infinity, 100)).toThrow();
  });

  it("requires an existing page and limits PDF page count", () => {
    expect(() => validatePdfPage(1, 1)).not.toThrow();
    expect(() => validatePdfPage(100, 100)).not.toThrow();
    for (const [page, count] of [
      [0, 2],
      [3, 2],
      [1.5, 2],
      [1, 101],
      [1, 0],
      [NaN, 2],
    ]) {
      expect(() => validatePdfPage(page!, count!)).toThrow();
    }
  });
});
