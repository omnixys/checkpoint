import { describe, expect, it } from "vitest";
import { computeCircularPositions, type PolarPoint, seatLabel } from "./seating";

const ADJ_DESKTOP = { containerRadius: 20, xOffset: -35 };
const ADJ_MOBILE = { containerRadius: 9, xOffset: -7 };

describe("computeCircularPositions", () => {
  it("returns empty array for count ≤ 0", () => {
    expect(computeCircularPositions(0, 220, 104, 20, -35)).toEqual([]);
    expect(computeCircularPositions(-1, 220, 104, 20, -35)).toEqual([]);
  });

  it("returns correct number of positions", () => {
    const positions = computeCircularPositions(4, 220, 104, 20, -35);
    expect(positions).toHaveLength(4);
  });

  it("positions are within container bounds", () => {
    const container = 220;
    const tableDiam = 104;
    const positions = computeCircularPositions(
      6,
      container,
      tableDiam,
      ADJ_DESKTOP.containerRadius,
      ADJ_DESKTOP.xOffset,
    ) as PolarPoint[];
    for (const p of positions) {
      expect(p.left).toBeGreaterThanOrEqual(0);
      expect(p.left).toBeLessThanOrEqual(container);
      expect(p.top).toBeGreaterThanOrEqual(0);
      expect(p.top).toBeLessThanOrEqual(container);
    }
  });

  it("first seat starts at top (angle -π/2)", () => {
    const container = 220;
    const positions = computeCircularPositions(4, container, 104, 20, -35) as PolarPoint[];
    const radius = (container - 104) / 2 + 20;
    const center = container / 2;
    expect(positions[0]?.left).toBeCloseTo(center - 35, 0);
    expect(positions[0]?.top).toBeCloseTo(center - radius, 0);
  });

  it("distributes seats evenly", () => {
    const count = 8;
    const positions = computeCircularPositions(count, 320, 160, 20, -35) as PolarPoint[];
    const center = 320 / 2;
    for (let i = 0; i < count; i++) {
      const angle = (2 * Math.PI * i) / count - Math.PI / 2;
      const radius = (320 - 160) / 2 + 20;
      const expectedLeft = center + radius * Math.cos(angle) - 35;
      const expectedTop = center + radius * Math.sin(angle);
      expect(positions[i]?.left).toBeCloseTo(expectedLeft, 1);
      expect(positions[i]?.top).toBeCloseTo(expectedTop, 1);
    }
  });

  it("mobile adjustment uses smaller radius offset", () => {
    const count = 4;
    const desktop = computeCircularPositions(
      count,
      220,
      104,
      ADJ_DESKTOP.containerRadius,
      ADJ_DESKTOP.xOffset,
    ) as PolarPoint[];
    const mobile = computeCircularPositions(
      count,
      220,
      104,
      ADJ_MOBILE.containerRadius,
      ADJ_MOBILE.xOffset,
    ) as PolarPoint[];
    const center = 110;
    const desktopRadius = (220 - 104) / 2 + 20;
    const mobileRadius = (220 - 104) / 2 + 9;
    expect(desktop[0]?.top).toBeCloseTo(center - desktopRadius, 0);
    expect(mobile[0]?.top).toBeCloseTo(center - mobileRadius, 0);
    expect(Math.abs(mobile[0]?.top)).toBeGreaterThan(Math.abs(desktop[0]?.top));
  });

  it("single seat is centered at top", () => {
    const container = 220;
    const positions = computeCircularPositions(1, container, 104, 20, -35) as PolarPoint[];
    const radius = (container - 104) / 2 + 20;
    const center = container / 2;
    expect(positions[0]?.left).toBeCloseTo(center - 35, 0);
    expect(positions[0]?.top).toBeCloseTo(center - radius, 0);
  });
});

describe("seatLabel", () => {
  it("returns number as string when present", () => {
    expect(seatLabel({ number: 5 } as any)).toBe("5");
  });

  it("returns bullet when number is null", () => {
    expect(seatLabel({ number: null } as any)).toBe("•");
  });

  it("returns bullet when number is empty string", () => {
    expect(seatLabel({ number: "" } as any)).toBe("•");
  });
});
