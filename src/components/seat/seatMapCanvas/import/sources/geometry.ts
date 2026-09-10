export type SourcePoint = Readonly<{ x: number; y: number }>;
/** Clockwise, starting at top left. Coordinates refer to the oriented source pixels. */
export type Quad = readonly [SourcePoint, SourcePoint, SourcePoint, SourcePoint];
export type Homography = readonly number[];

export function imageQuad(width: number, height: number): Quad {
  return [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height },
  ];
}

export function validateQuad(quad: Quad, width: number, height: number): void {
  if (![width, height].every((n) => Number.isFinite(n) && n > 0)) {
    throw new Error("Ungültige Bildabmessungen.");
  }
  for (let i = 0; i < 4; i++) {
    const a = quad[i]!;
    const b = quad[(i + 1) % 4]!;
    const c = quad[(i + 2) % 4]!;
    if (![a.x, a.y].every(Number.isFinite) || a.x < 0 || a.y < 0 || a.x > width || a.y > height) {
      throw new Error("Alle Planecken müssen innerhalb des Bildes liegen.");
    }
    const cross = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
    if (cross <= 1e-6) {
      throw new Error("Die Planecken müssen ein ungekreuztes Viereck im Uhrzeigersinn bilden.");
    }
  }
  const area =
    quad.reduce((sum, p, i) => {
      const next = quad[(i + 1) % 4]!;
      return sum + p.x * next.y - next.x * p.y;
    }, 0) / 2;
  if (area < 4) throw new Error("Der gewählte Ausschnitt ist zu klein.");
}

/** Solves the eight projective coefficients using partial-pivot Gaussian elimination. */
export function homography(from: Quad, to: Quad): Homography {
  const rows: number[][] = [];
  from.forEach(({ x, y }, i) => {
    const target = to[i]!;
    if (![x, y, target.x, target.y].every(Number.isFinite)) throw new Error("Ungültige Planecken.");
    rows.push([x, y, 1, 0, 0, 0, -target.x * x, -target.x * y, target.x]);
    rows.push([0, 0, 0, x, y, 1, -target.y * x, -target.y * y, target.y]);
  });
  for (let col = 0; col < 8; col++) {
    let pivot = col;
    for (let row = col + 1; row < 8; row++) {
      if (Math.abs(rows[row]![col]!) > Math.abs(rows[pivot]![col]!)) pivot = row;
    }
    [rows[col], rows[pivot]] = [rows[pivot]!, rows[col]!];
    const divisor = rows[col]![col]!;
    if (Math.abs(divisor) < 1e-10) throw new Error("Die Perspektive lässt sich nicht berechnen.");
    for (let j = col; j <= 8; j++) rows[col]![j] = rows[col]![j]! / divisor;
    for (let row = 0; row < 8; row++) {
      if (row === col) continue;
      const factor = rows[row]![col]!;
      for (let j = col; j <= 8; j++) rows[row]![j] = rows[row]![j]! - factor * rows[col]![j]!;
    }
  }
  return [...rows.map((row) => row[8]!), 1];
}

export function project(matrix: Homography, { x, y }: SourcePoint): SourcePoint {
  const w = matrix[6]! * x + matrix[7]! * y + matrix[8]!;
  if (!Number.isFinite(w) || Math.abs(w) < 1e-10)
    throw new Error("Ungültige Perspektivtransformation.");
  const result = {
    x: (matrix[0]! * x + matrix[1]! * y + matrix[2]!) / w,
    y: (matrix[3]! * x + matrix[4]! * y + matrix[5]!) / w,
  };
  if (![result.x, result.y].every(Number.isFinite))
    throw new Error("Ungültige Perspektivtransformation.");
  return result;
}

export function outputSize(quad: Quad, longestEdge = 2048) {
  const distance = (a: SourcePoint, b: SourcePoint) => Math.hypot(a.x - b.x, a.y - b.y);
  const width = (distance(quad[0], quad[1]) + distance(quad[3], quad[2])) / 2;
  const height = (distance(quad[0], quad[3]) + distance(quad[1], quad[2])) / 2;
  const scale = Math.min(1, longestEdge / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}
