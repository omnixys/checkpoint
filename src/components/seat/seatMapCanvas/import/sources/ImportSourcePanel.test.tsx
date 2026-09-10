import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ImportSourcePanel } from "./ImportSourcePanel";

const mocks = vi.hoisted(() => ({
  decode: vi.fn(),
  prepare: vi.fn(),
  page: vi.fn(),
  open: vi.fn(),
  dispose: vi.fn(),
}));
vi.mock("./image", () => ({
  decodeImage: mocks.decode,
  prepareImage: mocks.prepare,
  canvasPng: vi.fn(async () => new Blob(["preview"], { type: "image/png" })),
  rotateSource: (value: unknown) => value,
  canvas: (width: number, height: number) => ({ width, height }),
  context: () => ({ drawImage: vi.fn() }),
}));
vi.mock("./pdf", () => ({
  PdfSource: class {
    open = mocks.open;
    page = mocks.page;
    dispose = mocks.dispose;
  },
}));

beforeEach(() => {
  Object.defineProperty(navigator, "mediaDevices", { configurable: true, get: () => undefined });
  mocks.decode.mockResolvedValue({ width: 800, height: 600 });
  mocks.open.mockResolvedValue(3);
  mocks.page.mockResolvedValue({ width: 800, height: 600 });
  mocks.prepare.mockResolvedValue({
    png: new Blob(["prepared"], { type: "image/png" }),
    width: 800,
    height: 600,
  });
  let id = 0;
  vi.spyOn(URL, "createObjectURL").mockImplementation(() => `blob:source-${++id}`);
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function upload(file: File) {
  const input = document.querySelector<HTMLInputElement>('input[type="file"]')!;
  fireEvent.change(input, { target: { files: [file] } });
}

describe("import source acquisition (decoder and PDF test doubles)", () => {
  it("shows an image first and produces no analysis input until the user prepares it", async () => {
    const onPrepared = vi.fn();
    const view = render(<ImportSourcePanel kind="IMAGE" onPrepared={onPrepared} />);
    const original = new File(["image"], "plan.png", { type: "image/png" });
    upload(original);
    await screen.findByAltText("Originalvorlage mit korrigierbaren Planecken");
    expect(onPrepared.mock.calls.every(([value]) => value === null)).toBe(true);
    expect(mocks.prepare).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Vorschau vorbereiten" }));
    await screen.findByAltText("Vorbereitete, entzerrte Analysevorlage");
    const result = onPrepared.mock.calls.at(-1)?.[0];
    expect(result).toMatchObject({
      originalFile: original,
      metadata: { kind: "IMAGE", name: "plan.png", width: 800, height: 600 },
    });
    expect(result.png).toBeInstanceOf(Blob);
    fireEvent.change(screen.getByLabelText("1. Oben links X"), { target: { value: "12" } });
    expect(onPrepared).toHaveBeenLastCalledWith(null);
    expect(screen.queryByAltText("Vorbereitete, entzerrte Analysevorlage")).toBeNull();
    view.unmount();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(result.previewUrl);
  });

  it("requires explicit page confirmation even for PDF page one and clears it on page change", async () => {
    render(<ImportSourcePanel kind="PDF" onPrepared={vi.fn()} />);
    upload(new File(["pdf"], "plan.pdf", { type: "application/pdf" }));
    await screen.findByAltText("Originalvorlage mit korrigierbaren Planecken");
    expect(screen.getByRole("button", { name: "Vorschau vorbereiten" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Diese Seite bestätigen" }));
    expect(screen.getByRole("button", { name: "Vorschau vorbereiten" })).toBeEnabled();
    fireEvent.change(screen.getByLabelText("PDF-Seite (1–3)"), { target: { value: "2" } });
    await screen.findByAltText("Originalvorlage mit korrigierbaren Planecken");
    expect(screen.getByRole("button", { name: "Vorschau vorbereiten" })).toBeDisabled();
    expect(mocks.page.mock.calls.map(([number]) => number)).toEqual([1, 2]);
  });

  it("does not offer an old page as the newly selected page when rendering fails", async () => {
    render(<ImportSourcePanel kind="PDF" onPrepared={vi.fn()} />);
    upload(new File(["pdf"], "plan.pdf", { type: "application/pdf" }));
    await screen.findByAltText("Originalvorlage mit korrigierbaren Planecken");
    mocks.page.mockRejectedValueOnce(new Error("Seite beschädigt"));
    fireEvent.change(screen.getByLabelText("PDF-Seite (1–3)"), { target: { value: "2" } });
    await screen.findByText("Seite beschädigt");
    expect(screen.queryByAltText("Originalvorlage mit korrigierbaren Planecken")).toBeNull();
    expect(screen.getByRole("button", { name: "Diese Seite bestätigen" })).toBeDisabled();
  });

  it("requests camera access only on action and stops a late stream after unmount", async () => {
    let grant: (stream: MediaStream) => void = () => undefined;
    const access = vi.fn(
      () =>
        new Promise<MediaStream>((resolve) => {
          grant = resolve;
        }),
    );
    vi.spyOn(navigator, "mediaDevices", "get").mockReturnValue({
      getUserMedia: access,
    } as unknown as MediaDevices);
    const view = render(<ImportSourcePanel kind="CAMERA" onPrepared={vi.fn()} />);
    expect(access).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Kamera starten" }));
    expect(access).toHaveBeenCalledOnce();
    view.unmount();
    const stop = vi.fn();
    await act(async () => {
      grant({ getTracks: () => [{ stop }] } as unknown as MediaStream);
    });
    expect(stop).toHaveBeenCalledOnce();
  });

  it("keeps upload available after camera permission rejection", async () => {
    vi.spyOn(navigator, "mediaDevices", "get").mockReturnValue({
      getUserMedia: () => Promise.reject(new Error("Denied")),
    } as unknown as MediaDevices);
    render(<ImportSourcePanel kind="CAMERA" onPrepared={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Kamera starten" }));
    await screen.findByText(/Kein Kamerazugriff/);
    await waitFor(() =>
      expect(screen.getByText("Bild auswählen").closest("label")).not.toHaveAttribute(
        "aria-disabled",
        "true",
      ),
    );
  });
});
