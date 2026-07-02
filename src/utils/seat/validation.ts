type Rect = { x: number; y: number; width: number; height: number };

const DEFAULT_TABLE_W = 120;
const DEFAULT_TABLE_H = 60;

/** Convert center-coordinate item to top-left Rect */
export function toRect(
  cx: number,
  cy: number,
  w: number | null | undefined,
  h: number | null | undefined,
): Rect {
  const width = w ?? DEFAULT_TABLE_W;
  const height = h ?? DEFAULT_TABLE_H;
  return { x: cx - width / 2, y: cy - height / 2, width, height };
}

/** Check if inner rect is fully inside outer rect (with optional margin) */
export function isWithin(inner: Rect, outer: Rect, margin = 2): boolean {
  return (
    inner.x - margin >= outer.x &&
    inner.y - margin >= outer.y &&
    inner.x + inner.width + margin <= outer.x + outer.width &&
    inner.y + inner.height + margin <= outer.y + outer.height
  );
}

/** Check if two rects overlap (with optional padding) */
export function rectsOverlap(a: Rect, b: Rect, padding = 2): boolean {
  return !(
    a.x + a.width + padding <= b.x - padding ||
    b.x + b.width + padding <= a.x - padding ||
    a.y + a.height + padding <= b.y - padding ||
    b.y + b.height + padding <= a.y - padding
  );
}

/** Check if a seat position is within a table's bounding box.
 *  Seat coordinates are relative to the table's top-left corner. */
export function isSeatWithinTable(
  sx: number | null | undefined,
  sy: number | null | undefined,
  tw: number | null | undefined,
  th: number | null | undefined,
): boolean {
  const x = sx ?? 0;
  const y = sy ?? 0;
  const w = tw ?? DEFAULT_TABLE_W;
  const h = th ?? DEFAULT_TABLE_H;
  return x >= -8 && x <= w + 8 && y >= -8 && y <= h + 8;
}

/** Validate that all tables are within their section */
export function validateTablesInSection(
  sectionCx: number,
  sectionCy: number,
  sectionW: number | null | undefined,
  sectionH: number | null | undefined,
  tables: { id: string; x: number | null | undefined; y: number | null | undefined; width?: number | null; height?: number | null }[],
): { tableId: string; outside: boolean }[] {
  const sBounds = toRect(sectionCx, sectionCy, sectionW, sectionH);
  return tables.map((t) => {
    const tBounds = toRect(t.x ?? 0, t.y ?? 0, t.width, t.height);
    return { tableId: t.id, outside: !isWithin(tBounds, sBounds) };
  });
}

/** Validate that all seats are within their table */
export function validateSeatsInTable(
  tableW: number | null | undefined,
  tableH: number | null | undefined,
  seats: { id: string; x: number | null | undefined; y: number | null | undefined }[],
): { seatId: string; outside: boolean }[] {
  return seats.map((s) => ({
    seatId: s.id,
    outside: !isSeatWithinTable(s.x, s.y, tableW, tableH),
  }));
}

/** Find overlapping pairs among items with rects */
export function findOverlaps<T extends { id: string }>(
  items: T[],
  getRect: (item: T) => Rect,
): [string, string][] {
  const result: [string, string][] = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (rectsOverlap(getRect(items[i]), getRect(items[j]))) {
        result.push([items[i].id, items[j].id]);
      }
    }
  }
  return result;
}

/** Find overlapping tables */
export function findOverlappingTables(
  tables: { id: string; x: number | null | undefined; y: number | null | undefined; width?: number | null; height?: number | null }[],
): [string, string][] {
  return findOverlaps(tables, (t) => toRect(t.x ?? 0, t.y ?? 0, t.width, t.height));
}

/** Find overlapping seats within the same table */
export function findOverlappingSeats(
  seats: { id: string; x: number | null | undefined; y: number | null | undefined }[],
): [string, string][] {
  return findOverlaps(seats, (s) => ({
    x: s.x ?? 0,
    y: s.y ?? 0,
    width: 12,
    height: 12,
  }));
}
