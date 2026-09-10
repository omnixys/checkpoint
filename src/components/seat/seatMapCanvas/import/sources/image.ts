import { homography, imageQuad, outputSize, project, type Quad, validateQuad } from "./geometry";
import {
  imageDimensions,
  imageMime,
  MAX_PREPARED_BYTES,
  validateDimensions,
  validateFileSize,
} from "./validation";

export function canvas(width: number, height: number): HTMLCanvasElement {
  const element = document.createElement("canvas");
  element.width = width;
  element.height = height;
  return element;
}

export function context(element: HTMLCanvasElement): CanvasRenderingContext2D {
  const value = element.getContext("2d", { willReadFrequently: true });
  if (!value) throw new Error("Der Browser unterstützt keine Bildverarbeitung.");
  return value;
}

export async function canvasPng(element: HTMLCanvasElement): Promise<Blob> {
  const blob = await new Promise<Blob | null>((resolve) => element.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Die Bildvorschau konnte nicht erstellt werden.");
  return blob;
}

export async function decodeImage(file: Blob, signal: AbortSignal): Promise<HTMLCanvasElement> {
  validateFileSize(file);
  const bytes = new Uint8Array(await file.arrayBuffer());
  signal.throwIfAborted();
  const mime = imageMime(bytes);
  if (file.type && file.type !== mime)
    throw new Error("Dateityp und Bildinhalt stimmen nicht überein.");
  imageDimensions(bytes, mime);
  let bitmap: ImageBitmap;
  try {
    // The decoder applies embedded EXIF orientation exactly once.
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("Das Bild ist beschädigt oder kann nicht dekodiert werden.");
  }
  try {
    signal.throwIfAborted();
    validateDimensions(bitmap.width, bitmap.height);
    const result = canvas(bitmap.width, bitmap.height);
    const ctx = context(result);
    ctx.fillStyle = "white"; // Image preprocessing background, independent of the UI theme.
    ctx.fillRect(0, 0, result.width, result.height);
    ctx.drawImage(bitmap, 0, 0);
    return result;
  } finally {
    bitmap.close();
  }
}

export function rotateSource(
  source: HTMLCanvasElement,
  clockwiseQuarterTurns: number,
): HTMLCanvasElement {
  const turns = ((clockwiseQuarterTurns % 4) + 4) % 4;
  const result = canvas(
    turns % 2 ? source.height : source.width,
    turns % 2 ? source.width : source.height,
  );
  const ctx = context(result);
  ctx.translate(result.width / 2, result.height / 2);
  ctx.rotate((turns * Math.PI) / 2);
  ctx.drawImage(source, -source.width / 2, -source.height / 2);
  return result;
}

export async function prepareImage(source: HTMLCanvasElement, quad: Quad, signal: AbortSignal) {
  validateQuad(quad, source.width, source.height);
  const { width, height } = outputSize(quad);
  const matrix = homography(imageQuad(width, height), quad);
  const result = canvas(width, height);
  const ctx = context(result);
  const input = context(source).getImageData(0, 0, source.width, source.height);
  const output = ctx.createImageData(width, height);
  for (let y = 0; y < height; y++) {
    if (y % 32 === 0) {
      signal.throwIfAborted();
      // Yield between bounded rows so cancel/source changes can interrupt processing.
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    }
    for (let x = 0; x < width; x++) {
      const point = project(matrix, { x: x + 0.5, y: y + 0.5 });
      const sx = Math.max(0, Math.min(source.width - 1, point.x - 0.5));
      const sy = Math.max(0, Math.min(source.height - 1, point.y - 0.5));
      const left = Math.floor(sx);
      const top = Math.floor(sy);
      const right = Math.min(source.width - 1, left + 1);
      const bottom = Math.min(source.height - 1, top + 1);
      const dx = sx - left;
      const dy = sy - top;
      const outputIndex = (y * width + x) * 4;
      for (let channel = 0; channel < 3; channel++) {
        const pixel = (px: number, py: number) =>
          input.data[(py * source.width + px) * 4 + channel]!;
        output.data[outputIndex + channel] =
          pixel(left, top) * (1 - dx) * (1 - dy) +
          pixel(right, top) * dx * (1 - dy) +
          pixel(left, bottom) * (1 - dx) * dy +
          pixel(right, bottom) * dx * dy;
      }
      output.data[outputIndex + 3] = 255;
    }
  }
  signal.throwIfAborted();
  ctx.putImageData(output, 0, 0);
  const png = await canvasPng(result);
  signal.throwIfAborted();
  if (png.size > MAX_PREPARED_BYTES)
    throw new Error(
      "Die vorbereitete Vorschau überschreitet 8 MiB. Bitte einen kleineren Ausschnitt wählen.",
    );
  return { png, width, height };
}
