/** Pure table geometry, parent-relative centers and degrees. */
export function tablePerimeter(
  shape: string,
  width: number,
  height: number,
  count: number,
  spacing = 28,
): { x: number; y: number; rotation: number }[] {
  if (
    !Number.isInteger(count) ||
    count < 0 ||
    count > 10000 ||
    ![width, height, spacing].every(Number.isFinite) ||
    width <= 0 ||
    height <= 0 ||
    spacing < 0
  )
    throw new RangeError("Invalid geometry");
  if (!["ROUND", "CIRCLE", "RECTANGLE", "OVAL", "ROW"].includes(shape))
    throw new RangeError("Unbekannte Tischform");
  if ((shape === "ROUND" || shape === "CIRCLE") && width !== height)
    throw new RangeError("Kreise benötigen gleiche Breite und Höhe");
  const w = width / 2 + spacing,
    h = height / 2 + spacing;
  let points: { x: number; y: number }[];
  if (shape === "ROUND" || shape === "CIRCLE")
    points = Array.from({ length: count }, (_, i) => ({
      x: Math.cos((i * 2 * Math.PI) / count - Math.PI / 2) * w,
      y: Math.sin((i * 2 * Math.PI) / count - Math.PI / 2) * w,
    }));
  else if (shape === "ROW")
    points = Array.from({ length: count }, (_, i) => ({
      x: ((i - (count - 1) / 2) * width) / Math.max(1, count),
      y: h,
    }));
  else {
    const path =
      shape === "OVAL"
        ? Array.from({ length: 720 }, (_, i) => ({
            x: Math.cos((i * Math.PI) / 360 - Math.PI / 2) * w,
            y: Math.sin((i * Math.PI) / 360 - Math.PI / 2) * h,
          }))
        : shape === "TRIANGLE"
          ? [
              { x: 0, y: -h },
              { x: w, y: h },
              { x: -w, y: h },
            ]
          : [
              { x: -w, y: -h },
              { x: w, y: -h },
              { x: w, y: h },
              { x: -w, y: h },
            ];
    const lengths = path.map((p, i) =>
      Math.hypot(p.x - path[(i + 1) % path.length]!.x, p.y - path[(i + 1) % path.length]!.y),
    );
    const total = lengths.reduce((a, b) => a + b, 0);
    points = Array.from({ length: count }, (_, i) => {
      let distance = (i * total) / count,
        edge = 0;
      while (edge < lengths.length - 1 && distance >= lengths[edge]!) distance -= lengths[edge++]!;
      const a = path[edge]!,
        b = path[(edge + 1) % path.length]!,
        t = distance / lengths[edge]!;
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    });
  }
  return points.map((p) => ({ ...p, rotation: (Math.atan2(p.y, p.x) * 180) / Math.PI + 90 }));
}
