import { describe, expect, it } from "vitest";
import { exportLayout, exportMove, importLayout, type SourceLayout } from "./adapter";
import {
  moveNode,
  orderedNodes,
  resizeNode,
  resizeSection,
  rotateNode,
  setNodeShape,
} from "./document";
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
describe("section resizing", () => {
  it("keeps the north-west edge stable and never clips children", () => {
    const before = importLayout("event", source);
    const section = before.nodes.section!;
    const enlarged = resizeSection(before, "section", section.width + 200, section.height + 100);
    expect(enlarged.nodes.section).toMatchObject({
      x: section.x + 100,
      y: section.y + 50,
      width: section.width + 200,
      height: section.height + 100,
    });
    const clamped = resizeSection(before, "section", 1, 1);
    expect(clamped.nodes.section!.width).toBeGreaterThanOrEqual(160);
    expect(clamped.nodes.section!.height).toBeGreaterThanOrEqual(120);
  });
});
describe("node resizing and shapes", () => {
  const farSeat: SourceLayout = [
    {
      id: "section",
      name: "S",
      x: 0,
      y: 0,
      width: 600,
      height: 500,
      rotation: 0,
      shape: "RECTANGLE",
      meta: null,
      tables: [
        {
          id: "table",
          name: "T",
          sectionId: "section",
          x: 0,
          y: 0,
          width: 100,
          height: 60,
          rotation: 0,
          shape: "ROUND",
          meta: null,
          seats: [
            {
              id: "seat",
              sectionId: "section",
              tableId: "table",
              x: 250,
              y: 150,
              rotation: 0,
              number: 1,
              meta: null,
            },
          ],
        },
      ],
      seats: [],
    },
  ];
  it("resizes tables keeping the north-west corner fixed and seats in place", () => {
    const before = importLayout("far", farSeat);
    const table = before.nodes.table!;
    const enlarged = resizeNode(before, "table", table.width + 200, table.height + 100);
    expect(enlarged.nodes.table).toMatchObject({
      x: 100,
      y: 50,
      width: 300,
      height: 160,
    });
    expect(enlarged.nodes.table).not.toBe(before.nodes.table);
    expect(enlarged.nodes.seat).toBe(before.nodes.seat);
  });
  it("grows a table only until it would cover a seated guest", () => {
    const perimeter: SourceLayout = [
      {
        id: "section",
        name: "S",
        x: 0,
        y: 0,
        width: 400,
        height: 300,
        rotation: 0,
        shape: "RECTANGLE",
        meta: null,
        tables: [
          {
            id: "table",
            name: "T",
            sectionId: "section",
            x: 0,
            y: 0,
            width: 100,
            height: 60,
            rotation: 0,
            shape: "ROUND",
            meta: null,
            seats: [
              {
                id: "seat",
                sectionId: "section",
                tableId: "table",
                x: 90,
                y: 80,
                rotation: 0,
                number: 1,
                meta: null,
              },
            ],
          },
        ],
        seats: [],
      },
    ];
    const grown = resizeNode(importLayout("e", perimeter), "table", 1000, 1000);
    expect(grown.nodes.table).toMatchObject({ width: 136, height: 116 });
    expect(grown.nodes.seat).toMatchObject({ x: 90, y: 80 });
  });
  it("never snaps a table smaller than its current size when a seat is inside", () => {
    const before = importLayout("event", source);
    const grown = resizeNode(before, "table", 1000, 1000);
    expect(grown.nodes.table!.width).toBeGreaterThan(before.nodes.table!.width);
  });
  it("clamps tables and seats to their minimum size", () => {
    const before = importLayout("event", source);
    expect(resizeNode(before, "table", 1, 1).nodes.table).toMatchObject({ width: 60, height: 40 });
    expect(resizeNode(before, "seat", 1, 1).nodes.seat).toMatchObject({ width: 24, height: 16 });
  });
  it("applies kind-specific default extents when switching shapes", () => {
    const before = importLayout("event", source);
    expect(setNodeShape(before, "seat", "RECTANGLE").nodes.seat).toMatchObject({
      shape: "RECTANGLE",
      width: 56,
      height: 28,
    });
    const square = setNodeShape(before, "seat", "SQUARE");
    expect(square.nodes.seat).toMatchObject({ shape: "SQUARE", width: 36, height: 36 });
    const round = setNodeShape(before, "table", "ROUND");
    expect(round.nodes.table).toMatchObject({ shape: "ROUND", width: 140, height: 140 });
    const oval = setNodeShape(round, "table", "OVAL");
    expect(oval.nodes.table!.width).toBeGreaterThan(oval.nodes.table!.height);
    const row = setNodeShape(round, "table", "ROW");
    expect(row.nodes.table).toMatchObject({ shape: "ROW", width: 420 });
  });
  it("makes a table an explicit square", () => {
    const before = importLayout("event", source);
    const table = before.nodes.table!;
    const size = Math.max(table.width, table.height);
    expect(setNodeShape(before, "table", "RECTANGLE", size, size).nodes.table).toMatchObject({
      shape: "RECTANGLE",
      width: 140,
      height: 140,
    });
  });
});
describe("rotation", () => {
  it("rotates a table around its center and orbits its seats at a stable distance", () => {
    const before = importLayout("event", source);
    const table = before.nodes.table!;
    const rotated = rotateNode(before, "table", table.rotation + 90);
    expect(rotated.nodes.table).toMatchObject({ x: 600, y: 350, rotation: 270 });
    expect(rotated.nodes.seat).toMatchObject({ rotation: 90, x: 580, y: 360 });
    expect(rotated.nodes.free).toBe(before.nodes.free);
    const radius = Math.hypot(before.nodes.seat!.x - table.x, before.nodes.seat!.y - table.y);
    expect(
      Math.hypot(rotated.nodes.seat!.x - table.x, rotated.nodes.seat!.y - table.y),
    ).toBeCloseTo(radius);
  });
  it("rotates a section and repositions its tables and free seats accordingly", () => {
    const before = importLayout("event", source);
    const rotated = rotateNode(before, "section", before.nodes.section!.rotation + 90);
    expect(rotated.nodes.section).toMatchObject({ x: 500, y: 400 });
    expect(rotated.nodes.table!.rotation).toBe(270);
    const radiusTable = Math.hypot(before.nodes.table!.x - 500, before.nodes.table!.y - 400);
    const radiusFree = Math.hypot(before.nodes.free!.x - 500, before.nodes.free!.y - 400);
    expect(Math.hypot(rotated.nodes.table!.x - 500, rotated.nodes.table!.y - 400)).toBeCloseTo(
      radiusTable,
    );
    expect(Math.hypot(rotated.nodes.free!.x - 500, rotated.nodes.free!.y - 400)).toBeCloseTo(
      radiusFree,
    );
  });
  it("keeps rotations normalized and ignores unchanged or invalid angles", () => {
    const before = importLayout("event", source);
    const wrapped = rotateNode(before, "table", 451);
    expect(wrapped.nodes.table!.rotation).toBe(91);
    expect(rotateNode(before, "table", before.nodes.table!.rotation)).toBe(before);
    expect(rotateNode(before, "table", Number.NaN)).toBe(before);
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
