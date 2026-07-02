import { describe, it, expect } from "vitest";
import {
  toRect,
  isWithin,
  rectsOverlap,
  isSeatWithinTable,
  validateTablesInSection,
  validateSeatsInTable,
  findOverlappingTables,
  findOverlappingSeats,
} from "./validation";

describe("toRect", () => {
  it("converts center coords to top-left rect", () => {
    const r = toRect(100, 200, 80, 40);
    expect(r).toEqual({ x: 60, y: 180, width: 80, height: 40 });
  });

  it("defaults null width/height to 120×60", () => {
    const r = toRect(0, 0, null, null);
    expect(r.width).toBe(120);
    expect(r.height).toBe(60);
  });
});

describe("isWithin", () => {
  it("returns true when inner is fully inside outer", () => {
    expect(isWithin({ x: 10, y: 10, width: 80, height: 60 }, { x: 0, y: 0, width: 500, height: 400 })).toBe(true);
  });

  it("returns false when inner exceeds right edge", () => {
    expect(isWithin({ x: 450, y: 10, width: 80, height: 60 }, { x: 0, y: 0, width: 500, height: 400 })).toBe(false);
  });
});

describe("rectsOverlap", () => {
  it("detects overlapping rects", () => {
    expect(rectsOverlap({ x: 0, y: 0, width: 100, height: 100 }, { x: 50, y: 50, width: 100, height: 100 })).toBe(true);
  });

  it("detects non-overlapping rects", () => {
    expect(rectsOverlap({ x: 0, y: 0, width: 100, height: 100 }, { x: 200, y: 200, width: 100, height: 100 })).toBe(false);
  });
});

describe("isSeatWithinTable", () => {
  it("returns true for seat centered in table", () => {
    expect(isSeatWithinTable(50, 25, 120, 60)).toBe(true);
  });

  it("returns true for seat at table edge within tolerance", () => {
    expect(isSeatWithinTable(-4, 25, 120, 60)).toBe(true);
  });

  it("returns false for seat far outside", () => {
    expect(isSeatWithinTable(200, 200, 120, 60)).toBe(false);
  });
});

describe("validateTablesInSection", () => {
  it("marks tables outside section bounds", () => {
    const results = validateTablesInSection(300, 200, 500, 400, [
      { id: "t1", x: 300, y: 200, width: 120, height: 60 },
      { id: "t2", x: 600, y: 500, width: 120, height: 60 },
    ]);
    expect(results).toEqual([{ tableId: "t1", outside: false }, { tableId: "t2", outside: true }]);
  });
});

describe("validateSeatsInTable", () => {
  it("marks seats outside table", () => {
    const results = validateSeatsInTable(120, 60, [
      { id: "st1", x: 10, y: 10 },
      { id: "st2", x: 200, y: 200 },
    ]);
    expect(results).toEqual([{ seatId: "st1", outside: false }, { seatId: "st2", outside: true }]);
  });
});

describe("findOverlappingTables", () => {
  it("finds overlapping table pairs", () => {
    const overlaps = findOverlappingTables([
      { id: "t1", x: 100, y: 100, width: 120, height: 60 },
      { id: "t2", x: 150, y: 120, width: 120, height: 60 },
      { id: "t3", x: 500, y: 500, width: 120, height: 60 },
    ]);
    expect(overlaps).toEqual([["t1", "t2"]]);
  });
});

describe("findOverlappingSeats", () => {
  it("finds overlapping seat pairs", () => {
    const overlaps = findOverlappingSeats([
      { id: "st1", x: 0, y: 0 },
      { id: "st2", x: 5, y: 5 },
      { id: "st3", x: 100, y: 100 },
    ]);
    expect(overlaps).toEqual([["st1", "st2"]]);
  });
});
