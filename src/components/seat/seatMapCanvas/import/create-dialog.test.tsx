import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { importLayout } from "../core/adapter";
import { SeatMapCreateDialog } from "./SeatMapCreateDialog";
import { analyzeLayoutSource } from "./transport";

vi.mock("./transport", () => ({ analyzeLayoutSource: vi.fn() }));
vi.mock("./sources/ImportSourcePanel", () => ({
  ImportSourcePanel: ({ onPrepared }: { onPrepared: (source: unknown) => void }) => (
    <button
      type="button"
      onClick={() =>
        onPrepared({
          png: new Blob(),
          originalFile: new File([], "fixture.png"),
          previewUrl: "blob:fixture",
          metadata: { kind: "IMAGE", name: "test", width: 100, height: 100 },
        })
      }
    >
      Mockquelle vorbereiten
    </button>
  ),
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
const document = importLayout("event", []);
const defaults = {
  open: true,
  onClose: vi.fn(),
  eventId: "event",
  document,
  onAccept: vi.fn(),
  presetDisabled: false,
  onGenerate: vi.fn(),
};
async function prepare() {
  fireEvent.click(screen.getByRole("tab", { name: "Bild" }));
  fireEvent.click(screen.getByRole("button", { name: "Mockquelle vorbereiten" }));
}
describe("import dialog (explicit source/recognizer mocks)", () => {
  it("blocks presets and tab changes during existing writes", () => {
    render(<SeatMapCreateDialog {...defaults} pending />);
    expect(screen.getByRole("button", { name: "Generieren" })).toBeDisabled();
    expect(screen.getByRole("tab", { name: "Bild" })).toBeDisabled();
  });
  it("allows manual draft construction after a genuinely empty result contract", async () => {
    vi.mocked(analyzeLayoutSource).mockResolvedValue({
      recognizer: "geometry-v1",
      elements: [],
      warnings: [],
      analysis: { width: 100, height: 100, threshold: null },
    });
    render(<SeatMapCreateDialog {...defaults} />);
    await prepare();
    fireEvent.click(screen.getByRole("button", { name: "Plan analysieren" }));
    await screen.findByRole("button", { name: "Tisch hinzufügen" });
    expect(screen.getByRole("button", { name: "Als lokalen Entwurf übernehmen" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Tisch hinzufügen" }));
    fireEvent.click(screen.getByRole("button", { name: "Als lokalen Entwurf übernehmen" }));
    expect(defaults.onAccept).toHaveBeenCalledTimes(1);
    const operation = defaults.onAccept.mock.calls[0]![0];
    expect(
      Object.values(operation.after.nodes)
        .map((node: unknown) => (node as { kind: string }).kind)
        .sort(),
    ).toEqual(["SECTION", "TABLE"]);
    expect(defaults.onGenerate).not.toHaveBeenCalled();
  });
  it("aborts in-flight analysis when closed and ignores late results", async () => {
    let signal: AbortSignal | undefined;
    vi.mocked(analyzeLayoutSource).mockImplementation(async (_event, _source, currentSignal) => {
      signal = currentSignal;
      return await new Promise((_resolve, reject) =>
        currentSignal.addEventListener("abort", () =>
          reject(new DOMException("Aborted", "AbortError")),
        ),
      );
    });
    const view = render(<SeatMapCreateDialog {...defaults} />);
    await prepare();
    fireEvent.click(screen.getByRole("button", { name: "Plan analysieren" }));
    await waitFor(() => expect(signal).toBeDefined());
    view.unmount();
    expect(signal!.aborted).toBe(true);
    expect(defaults.onAccept).not.toHaveBeenCalled();
  });
});
