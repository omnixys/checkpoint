import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { canvas } from "./image";
import { validateFileSize, validatePdfPage } from "./validation";

/** Keeps parsing and page rendering abortable without retaining PDF data in the draft. */
export class PdfSource {
  private loading: PDFDocumentLoadingTask | undefined;
  private document: PDFDocumentProxy | undefined;
  private rendering: RenderTask | undefined;
  private disposed = false;

  async open(file: File, signal: AbortSignal): Promise<number> {
    validateFileSize(file);
    const bytes = new Uint8Array(await file.arrayBuffer());
    signal.throwIfAborted();
    if (file.type && file.type !== "application/pdf")
      throw new Error("Bitte eine PDF-Datei auswählen.");
    if (String.fromCharCode(...bytes.subarray(0, 5)) !== "%PDF-")
      throw new Error("Die Datei enthält kein gültiges PDF.");
    const pdfjs = await import("pdfjs-dist");
    signal.throwIfAborted();
    if (this.disposed) throw new DOMException("Abgebrochen", "AbortError");
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();
    const loading = pdfjs.getDocument({ data: bytes, stopAtErrors: true });
    this.loading = loading;
    const cancel = () => this.dispose();
    signal.addEventListener("abort", cancel, { once: true });
    try {
      this.document = await loading.promise;
      signal.throwIfAborted();
      if (this.disposed) throw new DOMException("Abgebrochen", "AbortError");
      if ((await this.document.getPermissions()) !== null) {
        throw Object.assign(new Error("Verschlüsseltes PDF"), { name: "PasswordException" });
      }
      signal.throwIfAborted();
      validatePdfPage(1, this.document.numPages);
      return this.document.numPages;
    } catch (error) {
      this.dispose();
      if (signal.aborted) throw signal.reason;
      if (error instanceof Error && error.name === "PasswordException") {
        throw new Error(
          "Verschlüsselte PDFs werden noch nicht unterstützt. Bitte eine unverschlüsselte Kopie verwenden.",
        );
      }
      if (error instanceof Error && error.message.includes("100 Seiten")) throw error;
      throw new Error("Das PDF ist beschädigt oder kann nicht gelesen werden.");
    } finally {
      signal.removeEventListener("abort", cancel);
    }
  }

  async page(pageNumber: number, signal: AbortSignal): Promise<HTMLCanvasElement> {
    if (!this.document || this.disposed) throw new Error("Bitte zuerst eine PDF-Datei auswählen.");
    validatePdfPage(pageNumber, this.document.numPages);
    this.rendering?.cancel();
    const page = await this.document.getPage(pageNumber);
    signal.throwIfAborted();
    const initialViewport = page.getViewport({ scale: 1 });
    const scale = Math.min(2, 2048 / Math.max(initialViewport.width, initialViewport.height));
    const viewport = page.getViewport({ scale });
    const result = canvas(
      Math.max(1, Math.floor(viewport.width)),
      Math.max(1, Math.floor(viewport.height)),
    );
    const task = page.render({ canvas: result, viewport });
    this.rendering = task;
    const cancel = () => task.cancel();
    signal.addEventListener("abort", cancel, { once: true });
    try {
      await task.promise;
      signal.throwIfAborted();
      return result;
    } finally {
      signal.removeEventListener("abort", cancel);
      if (this.rendering === task) this.rendering = undefined;
      page.cleanup();
    }
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.rendering?.cancel();
    this.rendering = undefined;
    // PDF.js destroys both the loading task and its worker through this operation.
    void this.loading?.destroy().catch(() => undefined);
    this.loading = undefined;
    this.document = undefined;
  }
}
