import { describe, expect, it } from "vitest";
import { exportLayout, exportMove, importLayout } from "./adapter";
import { moveNode, orderedNodes } from "./document";
import {
  clientToScreen,
  fitCamera,
  geometryBounds,
  screenToWorld,
  worldToScreen,
} from "./geometry";
import { beginDrag, finishDrag, updateDrag } from "./interaction";
import { source } from "./test-fixture";

describe("layout adapter", () => {
  it("uses world centers with independent rotations, preserves nulls and metadata", () => {
    const doc = importLayout("event", source);
    expect(doc.nodes.table).toMatchObject({
      x: 600,
      y: 350,
      rotation: 180,
      width: 140,
      height: 80,
    });
    expect(doc.nodes.seat).toMatchObject({ x: 610, y: 370, rotation: 0 });
    expect(doc.nodes.free).toMatchObject({ x: 460, y: 500, rotation: 90 });
    expect(exportLayout(doc, source)).toEqual(source);
  });
  it.each([0, 90, 180])("does not inherit section rotation %i", (rotation) => {
    const changed = [{ ...source[0]!, rotation }];
    expect(importLayout("e", changed).nodes.seat).toMatchObject({ x: 610, y: 370, rotation: 0 });
    expect(exportLayout(importLayout("e", changed), changed)).toEqual(changed);
  });
  it("moves descendants exactly once while preserving exported child offsets", () => {
    const before = importLayout("e", source),
      after = moveNode(before, "section", { x: 100, y: -40 });
    for (const id of before.order)
      expect(after.nodes[id]).toMatchObject({
        x: before.nodes[id]!.x + 100,
        y: before.nodes[id]!.y - 40,
      });
    const output = exportLayout(after, source);
    expect(output[0]!.tables).toEqual(source[0]!.tables);
    expect(output[0]!.seats).toEqual(source[0]!.seats);
    expect(exportMove(moveNode(before, "table", { x: 100, y: 0 }), "table")).toEqual({
      id: "table",
      x: 200,
      y: -50,
    });
  });
  it("rejects malformed numbers, duplicate IDs, contradictory parents", () => {
    expect(() => importLayout("e", [...source, ...source])).toThrow(/ID/);
    expect(() => importLayout("e", [{ ...source[0]!, x: NaN }])).toThrow(/X/);
    expect(() => importLayout("e", [{ ...source[0]!, width: Infinity }])).toThrow(/Breite/);
    expect(() =>
      importLayout("e", [
        { ...source[0]!, seats: [{ ...source[0]!.seats[0]!, tableId: "table" }] },
      ]),
    ).toThrow(/Zuordnung/);
  });
});
describe("camera and drag", () => {
  for (const scale of [0.5, 1, 2])
    for (const translation of [-100, 0, 100])
      it(`inverts client coordinates and moves 100 units at ${scale}/${translation}`, () => {
        const camera = { scale, x: translation, y: -translation },
          point = { x: 500, y: 400 },
          offset = { left: 123, top: 456 };
        const screen = worldToScreen(point, camera);
        const local = clientToScreen(
          { x: screen.x + offset.left, y: screen.y + offset.top },
          offset,
        );
        expect(screenToWorld(local, camera)).toEqual(point);
        const start = beginDrag(importLayout("e", source), "table", 1, local, camera);
        const operation = finishDrag(updateDrag(start, { x: local.x + 100 * scale, y: local.y }));
        expect(operation?.after.nodes.table?.x).toBe(700);
        expect(operation?.after.nodes.seat?.x).toBe(710);
        expect(operation?.after.nodes.free?.x).toBe(460);
      });
  it("requires three CSS pixels and suppresses unchanged end positions", () => {
    const start = beginDrag(
      importLayout("e", source),
      "table",
      1,
      { x: 0, y: 0 },
      { x: 0, y: 0, scale: 2 },
    );
    expect(finishDrag(updateDrag(start, { x: 2.99, y: 0 }))).toBeNull();
    expect(finishDrag(updateDrag(start, { x: 3, y: 0 }))?.after.nodes.table?.x).toBe(601.5);
    expect(finishDrag(updateDrag(updateDrag(start, { x: 5, y: 0 }), { x: 0, y: 0 }))).toBeNull();
  });
  it("fits rotated bodies and outside seats using the same clamped scale for translation", () => {
    const nodes = orderedNodes(importLayout("e", source));
    const bounds = geometryBounds(nodes)!;
    expect(bounds).toMatchObject({ x: 350, y: 200, width: 320, height: 400 });
    const outside = { x: 30000, y: -30000, width: 20, height: 10, rotation: 90 };
    const all = [...nodes, outside];
    const b = geometryBounds(all)!;
    expect(b.x + b.width).toBe(30005);
    expect(b.y).toBe(-30010);
    const camera = fitCamera(all, { width: 500, height: 400 });
    expect(camera.scale).toBe(0.1);
    expect(worldToScreen({ x: b.x + b.width / 2, y: b.y + b.height / 2 }, camera)).toEqual({
      x: 250,
      y: 200,
    });
  });
});
