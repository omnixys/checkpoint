import { act, cleanup, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { importLayout } from "./core/adapter";
import { type MoveOperation, moveNode } from "./core/document";
import { source } from "./core/test-fixture";
import SeatMapCanvas from "./SeatMapCanvas";
import { useLayoutDocument } from "./useLayoutDocument";

class TestPointerEvent extends MouseEvent {
  pointerId: number;
  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init);
    this.pointerId = init.pointerId ?? 1;
  }
}
beforeEach(() => {
  vi.stubGlobal("PointerEvent", TestPointerEvent);
  let captured: number | null = null;
  HTMLElement.prototype.setPointerCapture = vi.fn((id: number) => {
    captured = id;
  });
  HTMLElement.prototype.hasPointerCapture = vi.fn((id: number) => captured === id);
  HTMLElement.prototype.releasePointerCapture = vi.fn(() => {
    captured = null;
  });
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(1000);
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(800);
  vi.stubGlobal("requestAnimationFrame", (fn: FrameRequestCallback) => {
    fn(0);
    return 1;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
const doc = importLayout("event", source);
function canvas(onMove = vi.fn(), onSelect = vi.fn()) {
  const props = {
    document: doc,
    presenceMap: new Map(),
    colorGroups: new Map(),
    seats: [],
    getSeatHolderLabel: () => "",
    role: "ADMIN",
    isEditing: true,
    selectedIds: [],
    onMove,
    onSelect,
    pending: false,
  };
  const view = render(<SeatMapCanvas {...props} />);
  return {
    ...view,
    props,
    onMove,
    onSelect,
    root: screen.getByTestId("seatmap-canvas"),
    table: screen.getByTestId("table-table"),
  };
}
function down(target: HTMLElement, x = 200, y = 200) {
  fireEvent.pointerDown(target, { pointerId: 1, button: 0, clientX: x, clientY: y });
}
function move(target: HTMLElement, x: number, y = 200) {
  fireEvent.pointerMove(target, { pointerId: 1, clientX: x, clientY: y });
}
function up(target: HTMLElement, x: number, y = 200) {
  fireEvent.pointerUp(target, { pointerId: 1, clientX: x, clientY: y });
}
describe("flat renderer and pointer lifecycle", () => {
  it("renders world siblings and actual centered table dimensions", () => {
    const { table } = canvas();
    expect(table.parentElement).toBe(screen.getByTestId("section-section").parentElement);
    expect(screen.getByTestId("seat-seat").parentElement).toBe(table.parentElement);
    expect(table).toHaveStyle({ transform: "translate(600px, 350px) rotate(180deg)" });
    expect(screen.getByRole("button", { name: "Tisch T" })).toHaveStyle({
      width: "140px",
      height: "80px",
      left: "-70px",
      top: "-40px",
    });
  });
  it("selects one ID, clears empty clicks, captures pointer and suppresses subthreshold moves", () => {
    const { table, root, onMove, onSelect } = canvas();
    down(table);
    move(root, 202.9);
    up(root, 202.9);
    expect(onSelect).toHaveBeenLastCalledWith(["table"]);
    expect(onMove).not.toHaveBeenCalled();
    expect(root.setPointerCapture).toHaveBeenCalledWith(1);
    down(root);
    up(root, 200);
    expect(onSelect).toHaveBeenLastCalledWith([]);
  });
  it("previews only DOM, commits once outside canvas and preserves camera after document change", () => {
    const { table, root, onMove, rerender, props } = canvas();
    const camera = screen.getByTestId("seatmap-world").style.transform;
    down(table);
    move(root, 2200);
    expect(doc.nodes.table?.x).toBe(600);
    expect(onMove).not.toHaveBeenCalled();
    expect(table.style.transform).not.toBe("translate(600px, 350px) rotate(180deg)");
    up(root, 2200);
    up(root, 2200);
    expect(onMove).toHaveBeenCalledTimes(1);
    const operation = onMove.mock.calls[0]![0] as MoveOperation;
    expect(operation.after.nodes.seat!.x - doc.nodes.seat!.x).toBeCloseTo(
      operation.after.nodes.table!.x - 600,
    );
    rerender(<SeatMapCanvas {...props} document={operation.after} />);
    expect(screen.getByTestId("seatmap-world").style.transform).toBe(camera);
  });
  it.each(["cancel", "escape", "capture", "mode"])("discards preview on %s", (reason) => {
    const { table, root, onMove, rerender, props } = canvas();
    down(table);
    move(root, 300);
    if (reason === "cancel") fireEvent.pointerCancel(root, { pointerId: 1 });
    if (reason === "escape") fireEvent.keyDown(window, { key: "Escape" });
    if (reason === "capture") fireEvent.lostPointerCapture(root, { pointerId: 1 });
    if (reason === "mode") rerender(<SeatMapCanvas {...props} isEditing={false} />);
    expect(table).toHaveStyle({ transform: "translate(600px, 350px) rotate(180deg)" });
    up(root, 300);
    expect(onMove).not.toHaveBeenCalled();
  });
});
describe("move persistence", () => {
  it("locks during one request and rolls back failure while leaving caller selection and camera independent", async () => {
    let reject!: (error: Error) => void;
    const persist = vi.fn(
      () =>
        new Promise<void>((_, r) => {
          reject = r;
        }),
    );
    const { result } = renderHook(() => useLayoutDocument("event", source, persist));
    const before = result.current.document!;
    const operation = {
      nodeId: "table",
      before,
      after: moveNode(before, "table", { x: 100, y: 0 }),
    };
    let flight!: Promise<void>;
    act(() => {
      flight = result.current.move(operation);
      void result.current.move(operation);
    });
    expect(result.current.pending).toBe(true);
    expect(result.current.document?.nodes.table?.x).toBe(700);
    expect(persist).toHaveBeenCalledExactlyOnceWith("TABLE", { id: "table", x: 200, y: -50 });
    await act(async () => {
      reject(new Error("Speichern fehlgeschlagen"));
      await flight;
    });
    expect(result.current.document).toBe(before);
    expect(result.current.pending).toBe(false);
    expect(result.current.error).toBe("Speichern fehlgeschlagen");
  });
  it("keeps the successful result stable through a mutation cache update and follows later refetches", async () => {
    let resolve!: () => void;
    const persist = vi.fn(
      () =>
        new Promise<void>((r) => {
          resolve = r;
        }),
    );
    const { result, rerender } = renderHook(
      ({ payload }) => useLayoutDocument("event", payload, persist),
      { initialProps: { payload: source } },
    );
    const before = result.current.document!;
    let flight!: Promise<void>;
    act(() => {
      flight = result.current.move({
        nodeId: "table",
        before,
        after: moveNode(before, "table", { x: 100, y: 0 }),
      });
    });
    rerender({ payload: [...source] });
    expect(result.current.document?.nodes.table?.x).toBe(700);
    await act(async () => {
      resolve();
      await flight;
    });
    expect(result.current.document?.nodes.table?.x).toBe(700);
    rerender({ payload: [...source] });
    expect(result.current.document?.nodes.table?.x).toBe(600);
  });
});
