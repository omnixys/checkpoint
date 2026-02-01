"use client";

import { autoSave } from "@/app/checkpoint/event/[id]/block3/components/edit/autoSave";
import { useLayoutActions } from "@/app/checkpoint/event/[id]/block3/components/edit/layoutActions2";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef } from "react";
import { Circle, Group, Rect, Text } from "react-konva";
import { enablePulseAnimation } from "./utils/pulse";
import { glowColor } from "./utils/themeGlow";

export default function SeatLayer({ seat, table, send, selected, selection }) {
  const theme = useTheme();
  const glow = glowColor(theme);
  const layoutActions = useLayoutActions();

  const shape = seat.meta?.shape ?? "circle";
  const circleRef = useRef(null);
  const groupRef = useRef(null);

  const isSelected =
    (selected.type === "seat" && selected.id === seat.id) ||
    selection.seatId == seat.id;

  function highlight(type) {
    const node = circleRef.current;
    if (!node) return;

    if (type === "selected") {
      node.stroke("#3B82F6");
      node.strokeWidth(5);
      node.shadowColor("#3B82F6");
      node.shadowBlur(50);
      node.shadowOpacity(0.6);
      enablePulseAnimation(node, 0.1);
    } else if (type === "hover") {
      node.stroke(glow);
      node.strokeWidth(4);
      node.shadowColor(glow);
      node.shadowBlur(25);
      node.shadowOpacity(0.5);
      enablePulseAnimation(node, 0.08);
    } else {
      node.stroke(theme.palette.apple.separator);
      node.strokeWidth(2);
      node.shadowBlur(0);
      node.shadowOpacity(0);
      enablePulseAnimation(node, 0.0);
    }

    node.getLayer().batchDraw();
  }

  useEffect(() => {
    if (isSelected) highlight("selected");
    else highlight("off");
  }, [isSelected]);

  const relX = seat.x - table.x;
  const relY = seat.y - table.y;

  function renderShape() {
    switch (shape) {
      case "grid":
        return (
          <Rect
            ref={circleRef}
            width={28}
            height={28}
            offsetX={14}
            offsetY={14}
            fill={theme.palette.background.paper}
            stroke={theme.palette.apple.separator}
          />
        );

      case "row":
        return (
          <Group>
            <Rect
              ref={circleRef}
              width={34}
              height={28}
              offsetX={17}
              offsetY={14}
              fill={theme.palette.background.paper}
              stroke={theme.palette.apple.separator}
            />
            <Rect
              width={34}
              height={6}
              offsetX={17}
              offsetY={28}
              fill={theme.palette.apple.separator}
              opacity={0.6}
            />
          </Group>
        );

      case "circle":
      default:
        return (
          <Circle
            ref={circleRef}
            radius={16}
            fill="white"
            stroke={theme.palette.apple.separator}
            strokeWidth={2}
          />
        );
    }
  }

  useEffect(() => {
    const stage = circleRef.current.getStage();

    stage.on("hover:seat", (evt) => {
      if (!isSelected && evt.seatId === seat.id) highlight("hover");
    });

    stage.on("hover:table", (evt) => {
      if (!isSelected && evt.tableId === seat.tableId) highlight("hover");
    });

    stage.on("hover:section", (evt) => {
      if (!isSelected && evt.sectionId === seat.sectionId) highlight("hover");
    });

    stage.on("hover:none", () => {
      if (!isSelected) highlight("off");
    });

    stage.on("click:seat", (evt) => {
      if (evt.seatId === seat.id) highlight("selected");
    });
  }, [isSelected]);

  return (
    <Group
      ref={groupRef}
      x={relX}
      y={relY}
      draggable
      rotation={seat.rotation}
      onMouseEnter={() =>
        send("hover:seat", {
          seatId: seat.id,
          tableId: table.id,
          sectionId: table.sectionId,
        })
      }
      onMouseLeave={() => send("hover:none")}
      onDragMove={(e) => {
        const newX = e.target.absolutePosition().x;
        const newY = e.target.absolutePosition().y;

        send("edit:move:seat", {
          seatId: seat.id,
          x: newX,
          y: newY,
        });

        autoSave(() =>
          layoutActions.moveSeat(seat.id, newX, newY, seat.rotation),
        );
      }}
      onClick={(e) => {
        e.cancelBubble = true;
        send("click:seat", {
          seatId: seat.id,
          tableId: seat.tableId,
          sectionId: seat.sectionId,
        });
      }}
    >
      {renderShape()}

      <Text text={String(seat.number)} fontSize={12} offsetX={4} offsetY={6} />
    </Group>
  );
}
