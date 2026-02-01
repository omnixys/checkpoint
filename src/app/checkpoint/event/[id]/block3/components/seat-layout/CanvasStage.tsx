"use client";

import { canvasStore } from "@/app/checkpoint/event/[id]/block3/components/edit/canvasStore";
import InspectorPanel from "@/app/checkpoint/event/[id]/block3/components/edit/InspectorPanel";
import { useLayoutActions } from "@/app/checkpoint/event/[id]/block3/components/edit/layoutActions2";
import { applyDiffToState } from "@/app/checkpoint/event/[id]/block3/components/edit/patchEngine";
import { useLayoutDiff } from "@/app/checkpoint/event/[id]/block3/components/edit/useLayoutDiff";
import RedoIcon from "@mui/icons-material/Redo";
import UndoIcon from "@mui/icons-material/Undo";
import { IconButton, Stack } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import SectionLayer from "./SectionLayer";

export default function CanvasStage({ sections: initialSections }) {
  const stageRef = useRef(null);
  const { id: eventId } = useParams();
  const layoutActions = useLayoutActions();

  // INITIAL LOAD
  useEffect(() => {
    canvasStore.layout = initialSections;
  }, [initialSections]);

  // LIVE SYNC – Apply Backend Diffs
  useLayoutDiff(eventId, (diff) => {
    canvasStore.layout = applyDiffToState(canvasStore.layout, diff);
  });

  // Canvas data is editable → store in React state
  const [sections, setSections] = useState(initialSections);
  // global hover state
  const [hover, setHover] = useState({
    sectionId: null,
    tableId: null,
    seatId: null,
  });

  const [selected, setSelected] = useState({
    type: null,
    id: null,
  });

  const [selection, setSelection] = useState({
    sectionId: null,
    tableId: null,
    seatId: null,
  });

  // DRAGGING INTERNAL STATE
  const [dragInfo, setDragInfo] = useState({
    type: null,
    id: null,
    startX: 0,
    startY: 0,
  });

  const [editState, setEditState] = useState({
    selectedSeat: null,
    selectedTable: null,
    selectedSection: null,
    mode: "idle", // move, rotate, edit
    drag: null,
  });

  function send(event, payload) {
    stageRef.current?.fire(event, payload);

    if (event.startsWith("hover"))
      setHover(payload ?? { sectionId: null, tableId: null, seatId: null });
    if (event.startsWith("click")) setSelection(payload ?? {});
  }

  /** Apply changes from Inspector Panel */
  function updateData(update) {
    setSections((prev) => {
      const copy = structuredClone(prev);

      if (update.type === "section") {
        const s = copy.find((v) => v.id === update.id);
        if (!s) return copy;
        Object.assign(s, update.patch);
      }

      if (update.type === "table") {
        const s = copy.find((v) => v.id === update.sectionId);
        if (!s) return copy;
        const t = s.tables.find((v) => v.id === update.id);
        if (!t) return copy;
        Object.assign(t, update.patch);
      }

      if (update.type === "seat") {
        const s = copy.find((v) => v.id === update.sectionId);
        if (!s) return copy;
        const t = s.tables.find((v) => v.id === update.tableId);
        if (!t) return copy;
        const seat = t.seats.find((v) => v.id === update.id);
        if (!seat) return copy;
        Object.assign(seat, update.patch);
      }

      return copy;
    });
  }
  /* ---------------------------------------------------------
   * Smooth Zoom
   * ------------------------------------------------------- */
  function handleWheel(e) {
    e.evt.preventDefault();
    const stage = stageRef.current;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const scaleBy = 1.05;

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    stage.scale({ x: newScale, y: newScale });

    stage.position({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });

    stage.batchDraw();
  }

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <Stack direction="row" spacing={2}>
        <IconButton onClick={() => layoutActions.undo(eventId)}>
          <UndoIcon />
        </IconButton>

        <IconButton onClick={() => layoutActions.redo(eventId)}>
          <RedoIcon />
        </IconButton>
      </Stack>

      <Stage
        ref={stageRef}
        width={typeof window !== "undefined" ? window.innerWidth : 1200}
        height={typeof window !== "undefined" ? window.innerHeight : 800}
        draggable
        onWheel={handleWheel}
      >
        <Layer listening={true}>
          {sections.map((sec) => (
            <SectionLayer
              key={sec.id}
              section={sec}
              send={send}
              selected={selected}
              selection={selection}
            />
          ))}
        </Layer>
      </Stage>

      {/* Inspector Panel */}
      <InspectorPanel
        selection={selection}
        data={sections}
        onUpdate={updateData}
      />
    </div>
  );
}
