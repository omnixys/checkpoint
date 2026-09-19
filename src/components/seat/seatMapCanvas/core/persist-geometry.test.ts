import { describe, expect, it } from "vitest";
import { importLayout } from "./adapter";
import { moveNode, resizeNode, rotateNode, setNodeShape } from "./document";
import { type GeometryWrite, planGeometryWrite } from "./persist-geometry";
import { source } from "./test-fixture";

const flat = (write: GeometryWrite): FlatInput => write.variables.input as unknown as FlatInput;

interface FlatInput {
  readonly id: string;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly shape?: string | null;
  readonly rotation?: number;
}

function expectClose(value: number | undefined, expected: number) {
  expect(value).toBeCloseTo(expected, 9);
}

const operation = (
  nodeId: string,
  before: ReturnType<typeof importLayout>,
  after: typeof before,
) => ({
  nodeId,
  before,
  after,
});

describe("planGeometryWrite", () => {
  it("returns no writes for an unchanged document", () => {
    const doc = importLayout("event", source);
    expect(planGeometryWrite(operation("table", doc, doc))).toEqual([]);
  });

  it("persists a pure table move through moveTable without touching seats", () => {
    const before = importLayout("event", source);
    const plan = planGeometryWrite(
      operation("table", before, moveNode(before, "table", { x: 100, y: 0 })),
    );
    expect(plan).toHaveLength(1);
    expect(plan[0]).toMatchObject({
      type: "moveTable",
      variables: { input: { id: "table", x: 200, y: -50 } },
    });
  });

  it("persists a pure section move through moveSection without touching descendants", () => {
    const before = importLayout("event", source);
    const plan = planGeometryWrite(
      operation("section", before, moveNode(before, "section", { x: 100, y: -40 })),
    );
    expect(plan).toHaveLength(1);
    expect(plan[0]).toMatchObject({
      type: "moveSection",
      variables: { input: { id: "section", x: 600, y: 360 } },
    });
  });

  it("persists a pure seat move through moveSeat", () => {
    const before = importLayout("event", source);
    const plan = planGeometryWrite(
      operation("seat", before, moveNode(before, "seat", { x: 100, y: 0 })),
    );
    expect(plan).toHaveLength(1);
    expect(plan[0]).toMatchObject({
      type: "moveSeat",
      variables: { input: { id: "seat", x: 110, y: 20 } },
    });
  });

  it("persists a table resize through updateTable, keeping seats stable", () => {
    const before = importLayout("event", source);
    const plan = planGeometryWrite(
      operation("table", before, resizeNode(before, "table", 200, 120)),
    );
    expect(plan).toHaveLength(1);
    expect(plan[0]!.type).toBe("updateTable");
    expectClose(flat(plan[0]!).x, 130);
    expectClose(flat(plan[0]!).y, -30);
    const resizeInput = flat(plan[0]!);
    expectClose(resizeInput.width, 200);
    expectClose(resizeInput.height, 120);
  });

  it("persists a seat resize through updateSeat", () => {
    const before = importLayout("event", source);
    const plan = planGeometryWrite(operation("seat", before, resizeNode(before, "seat", 60, 40)));
    expect(plan).toHaveLength(1);
    expect(plan[0]).toMatchObject({ type: "updateSeat" });
    expectClose(flat(plan[0]!).width, 60);
    expectClose(flat(plan[0]!).height, 40);
  });

  it("persists a table shape change together with its implied size", () => {
    const before = importLayout("event", source);
    const plan = planGeometryWrite(
      operation("table", before, setNodeShape(before, "table", "ROUND")),
    );
    expect(plan).toHaveLength(1);
    expect(plan[0]).toMatchObject({
      type: "updateTable",
      variables: { input: { id: "table", shape: "ROUND" } },
    });
    expectClose(flat(plan[0]!).height, 140);
  });

  it("persists a seat shape change together with its implied size", () => {
    const before = importLayout("event", source);
    const plan = planGeometryWrite(
      operation("seat", before, setNodeShape(before, "seat", "RECTANGLE")),
    );
    expect(plan).toHaveLength(1);
    expect(plan[0]).toMatchObject({
      type: "updateSeat",
      variables: { input: { id: "seat", shape: "RECTANGLE", width: 56 } },
    });
  });

  it("persists a table rotation and the orbit of every contained seat", () => {
    const before = importLayout("event", source);
    const plan = planGeometryWrite(operation("table", before, rotateNode(before, "table", 270)));
    expect(plan.map((write) => write.type)).toEqual(["updateTable", "updateSeat"]);
    const tableWrite = flat(plan[0]!);
    expect(tableWrite).toMatchObject({ id: "table" });
    expectClose(tableWrite.rotation, 270);
    const seatWrite = flat(plan[1]!);
    expect(seatWrite).toMatchObject({ id: "seat" });
    expectClose(seatWrite.x, -20);
    expectClose(seatWrite.y, 10);
    expectClose(seatWrite.rotation, 90);
  });

  it("persists a section rotation including tables, table seats and free seats", () => {
    const before = importLayout("event", source);
    const plan = planGeometryWrite(
      operation("section", before, rotateNode(before, "section", 180)),
    );
    expect(plan.map((write) => write.type)).toEqual([
      "updateSection",
      "updateTable",
      "updateSeat",
      "updateSeat",
    ]);
    const sectionWrite = flat(plan[0]!);
    expect(sectionWrite).toMatchObject({ id: "section" });
    expectClose(sectionWrite.rotation, 180);
    const tableWrite = flat(plan[1]!);
    expect(tableWrite).toMatchObject({ id: "table" });
    expectClose(tableWrite.x, 50);
    expectClose(tableWrite.y, 100);
    expectClose(tableWrite.rotation, 270);
    const seatWrite = flat(plan[2]!);
    expect(seatWrite).toMatchObject({ id: "seat" });
    expectClose(seatWrite.rotation, 90);
    const freeWrite = flat(plan[3]!);
    expect(freeWrite).toMatchObject({ id: "free" });
    expectClose(freeWrite.x, -100);
    expectClose(freeWrite.y, -40);
    expectClose(freeWrite.rotation, 180);
  });
});
