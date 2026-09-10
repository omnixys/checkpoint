import { describe, expect, it } from "vitest";
import { homography, imageQuad, outputSize, project, type Quad, validateQuad } from "./geometry";

describe("source perspective geometry", () => {
  it("maps all four plane corners exactly and has an inverse", () => {
    const source = imageQuad(1000, 800);
    const target: Quad = [
      { x: 80, y: 40 },
      { x: 870, y: 100 },
      { x: 940, y: 750 },
      { x: 30, y: 650 },
    ];
    validateQuad(target, 1000, 800);
    const transform = homography(source, target);
    const inverse = homography(target, source);
    source.forEach((corner, index) => {
      const actual = project(transform, corner);
      expect(actual.x).toBeCloseTo(target[index]!.x, 7);
      expect(actual.y).toBeCloseTo(target[index]!.y, 7);
    });
    const restored = project(inverse, project(transform, { x: 421, y: 339 }));
    expect(restored.x).toBeCloseTo(421, 7);
    expect(restored.y).toBeCloseTo(339, 7);
  });

  it("preserves crop aspect ratio while limiting the output edge", () => {
    expect(outputSize(imageQuad(6000, 3000))).toEqual({ width: 2048, height: 1024 });
    expect(outputSize(imageQuad(120, 400))).toEqual({ width: 120, height: 400 });
  });

  it.each([
    [
      { x: 0, y: 0 },
      { x: 100, y: 100 },
      { x: 100, y: 0 },
      { x: 0, y: 100 },
    ],
    [
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 100, y: 0 },
      { x: 0, y: 100 },
    ],
    [
      { x: -1, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
    ],
    [
      { x: Number.NaN, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
    ],
    [
      { x: 0, y: 0 },
      { x: Infinity, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
    ],
  ])("rejects crossed, degenerate and invalid corners", (...points) => {
    expect(() => validateQuad(points as unknown as Quad, 100, 100)).toThrow();
  });

  it("rejects a singular homography instead of returning non-finite coordinates", () => {
    const line: Quad = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ];
    expect(() => homography(line, imageQuad(100, 100))).toThrow();
  });
});
