import { useDevice } from "@/checkpoint/providers/DeviceProvider";
import { SeatListType } from "@/checkpoint/types/seat.type";

export type PolarPoint = { left: number; top: number };

/** Pure computation — no hook dependency, testable directly */
export function computeCircularPositions(
  count: number,
  containerPx: number,
  tableDiameterPx: number,
  adjustedContainerRadius: number,
  adjustedTableXCoordinate: number,
): PolarPoint[] {
  if (count <= 0) return [];
  const radius = (containerPx - tableDiameterPx) / 2 + adjustedContainerRadius;
  const center = containerPx / 2;
  return Array.from({ length: count }).map((_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    const x = center + radius * Math.cos(angle) + adjustedTableXCoordinate;
    const y = center + radius * Math.sin(angle);
    return { left: x, top: y };
  });
}

/** Gleichmäßig verteilte Stuhl-Positionen um runden Tisch */
export function computeChairPositions(
  count: number,
  containerPx: number,
  tableDiameterPx: number,
): PolarPoint[] {
  const { isMobile, isTablet } = useDevice();
  const adjustedContainerRadius = isMobile || isTablet ? 9 : 20;
  const adjustedTableXCoordinate = isMobile || isTablet ? -7 : -35;
  return computeCircularPositions(
    count,
    containerPx,
    tableDiameterPx,
    adjustedContainerRadius,
    adjustedTableXCoordinate,
  );
}

/** Label-Logik für einen Sitz: bevorzugt number */
export function seatLabel(seat: SeatListType): string {
  const n = seat.number?.toString();
  return n && n.length > 0 ? n : "•";
}
