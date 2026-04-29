import { useTour } from "@/checkpoint/providers/TourProvider";
import { useEffect, useRef } from "react";

export function useTourAnchor(id: string) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { register } = useTour();

  useEffect(() => {
    register(id, ref.current);
  }, [id, register]);

  return ref;
}
