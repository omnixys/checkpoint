"use client";
import { useRef } from "react";
import Konva from "konva";

export function useSeatCanvas() {
  const stageRef = useRef<Konva.Stage>(null);

  const handleWheel = (e: any) => {
    e.evt.preventDefault();

    const stage = stageRef.current!;
    const oldScale = stage.scaleX();
    const scaleBy = 1.06;

    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = oldScale * (direction > 0 ? scaleBy : 1 / scaleBy);

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);
    stage.batchDraw(); // 🔥 verhindert LAG
  };

  const handleDragMove = (e: any) => {
    const stage = stageRef.current!;
    stage.position(e.target.position());
    stage.batchDraw();
  };

  return {
    stageRef,
    handleWheel,
    handleDragMove,
  };
}
