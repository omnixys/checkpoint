import { useDevice } from "@/providers/DeviceProvider";
import type { Seat } from "@/types/seat/seat.type";

export type PolarPoint = { left: number; top: number };

/** Gleichmäßig verteilte Stuhl-Positionen um runden Tisch */
export function computeChairPositions(
  count: number,
  containerPx: number,
  tableDiameterPx: number
): PolarPoint[] {
  const { isMobile, isTablet } = useDevice();

  const adjustedContainerRadius = isMobile || isTablet ? 9 : 20;
  const adjustedTableXCoordinate = isMobile || isTablet ? -7 : -35;

  if (count <= 0) return [];
  const radius = (containerPx - tableDiameterPx) / 2 + adjustedContainerRadius;
  const center = containerPx / 2;

  return Array.from({ length: count }).map((_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2; // Start oben
    const x = center + radius * Math.cos(angle) + adjustedTableXCoordinate;
    const y = center + radius * Math.sin(angle);
    return { left: x, top: y };
  });
}

/** Label-Logik für einen Sitz: bevorzugt number */
export function seatLabel(seat: Seat): string {
  const n = seat.number?.toString();
  return n && n.length > 0 ? n : "•";
}
