export const MAX_ORIGINAL_BYTES = 20 * 1024 * 1024;
export const MAX_IMAGE_PIXELS = 24_000_000;
export const MAX_PREPARED_BYTES = 8 * 1024 * 1024;
export const MAX_PDF_PAGES = 100;

export function validateFileSize(file: Pick<Blob, "size">) {
  if (file.size <= 0 || file.size > MAX_ORIGINAL_BYTES) {
    throw new Error("Bitte eine nicht leere Datei mit höchstens 20 MiB auswählen.");
  }
}

export function validateDimensions(width: number, height: number) {
  if (
    ![width, height].every((n) => Number.isSafeInteger(n) && n > 0) ||
    width * height > MAX_IMAGE_PIXELS
  ) {
    throw new Error("Bilder dürfen höchstens 24 Megapixel enthalten.");
  }
}

export function imageMime(bytes: Uint8Array): "image/png" | "image/jpeg" | "image/webp" {
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((n, i) => bytes[i] === n)) return "image/png";
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  const ascii = (offset: number, value: string) =>
    [...value].every((c, i) => bytes[offset + i] === c.charCodeAt(0));
  if (ascii(0, "RIFF") && ascii(8, "WEBP")) return "image/webp";
  throw new Error("Die Datei ist kein unterstütztes PNG-, JPEG- oder WebP-Bild.");
}

/** Header dimensions are checked before handing compressed pixels to the browser decoder. */
export function imageDimensions(bytes: Uint8Array, mime = imageMime(bytes)) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let width = 0;
  let height = 0;
  if (mime === "image/png" && bytes.length >= 24) {
    width = view.getUint32(16);
    height = view.getUint32(20);
  } else if (mime === "image/jpeg") {
    for (let offset = 2; offset + 4 <= bytes.length; ) {
      if (bytes[offset] !== 0xff) break;
      const marker = bytes[offset + 1]!;
      if (marker === 0xda || marker === 0xd9) break;
      if (marker === 0xff) {
        offset++;
        continue;
      }
      const length = view.getUint16(offset + 2);
      if (length < 2 || offset + length + 2 > bytes.length) break;
      if (
        [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(
          marker,
        ) &&
        length >= 7
      ) {
        height = view.getUint16(offset + 5);
        width = view.getUint16(offset + 7);
        break;
      }
      offset += length + 2;
    }
  } else if (mime === "image/webp" && bytes.length >= 30) {
    const chunk = String.fromCharCode(...bytes.subarray(12, 16));
    if (chunk === "VP8X") {
      width = 1 + bytes[24]! + (bytes[25]! << 8) + (bytes[26]! << 16);
      height = 1 + bytes[27]! + (bytes[28]! << 8) + (bytes[29]! << 16);
    } else if (chunk === "VP8 ") {
      if (bytes[23] === 0x9d && bytes[24] === 1 && bytes[25] === 0x2a) {
        width = view.getUint16(26, true) & 0x3fff;
        height = view.getUint16(28, true) & 0x3fff;
      }
    } else if (chunk === "VP8L" && bytes[20] === 0x2f) {
      const bits = view.getUint32(21, true);
      width = (bits & 0x3fff) + 1;
      height = ((bits >>> 14) & 0x3fff) + 1;
    }
  }
  validateDimensions(width, height);
  return { width, height };
}

export function validatePdfPage(page: number, count: number) {
  if (!Number.isInteger(count) || count < 1 || count > MAX_PDF_PAGES) {
    throw new Error("PDFs müssen 1 bis 100 Seiten enthalten.");
  }
  if (!Number.isInteger(page) || page < 1 || page > count) {
    throw new Error("Bitte eine vorhandene PDF-Seite auswählen.");
  }
}
