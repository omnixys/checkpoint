"use client";

import { autoSave } from "@/app/checkpoint/event/[id]/block3/components/edit/autoSave";
import { useLayoutActions } from "@/app/checkpoint/event/[id]/block3/components/edit/layoutActions2";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef } from "react";
import { Circle, Group, Rect, Text } from "react-konva";
import SeatLayer from "./SeatLayer";
import { enablePulseAnimation } from "./utils/pulse";
import { glowColor } from "./utils/themeGlow";

export default function TableLayer({
  section,
  table,
  send,
  selected,
  selection,
}) {
  const theme = useTheme();
  const glow = glowColor(theme);
  const layoutActions = useLayoutActions();

  const shape = table.meta?.shape ?? "circle";
  const cap = table.capacity ?? 8;

  const outlineRef = useRef(null);
  const groupRef = useRef(null);
  const textRef = useRef(null);

  const isSelected =
    (selected.type === "table" && selected.id === table.id) ||
    selection.tableId == table.id;

  function highlight(type) {
    const node = outlineRef.current;
    const text = textRef.current;
    if (!node || !text) return;

    if (type === "selected") {
      node.stroke("#3B82F6");
      node.strokeWidth(5);
      node.shadowColor("#3B82F6");
      node.shadowBlur(60);
      node.shadowOpacity(0.5);
      enablePulseAnimation(node, 0.08);
    } else if (type === "hover") {
      node.stroke(glow);
      node.strokeWidth(4);
      node.shadowBlur(40);
      node.shadowOpacity(0.5);
      enablePulseAnimation(node, 0.07);

      text.shadowColor(glow);
      text.shadowBlur(20);
      text.fill(theme.palette.primary.light);
      enablePulseAnimation(text, 0.07);
    } else {
      node.stroke(theme.palette.apple.separator);
      node.strokeWidth(2);
      node.shadowBlur(0);
      node.shadowOpacity(0);
      enablePulseAnimation(node, 0.0);

      text.shadowBlur(0);
      text.shadowOpacity(0);
      text.fill(theme.palette.text.primary);
      enablePulseAnimation(text, 0.0);
    }

    node.getLayer().batchDraw();
  }

  // DYNAMIC SIZE BASED ON CAPACITY
  const circleRadius = 50 + cap * 1.5;
  const gridWidth = Math.ceil(Math.sqrt(cap)) * 38 + 40;
  const gridHeight = Math.ceil(cap / Math.ceil(Math.sqrt(cap))) * 38 + 40;
  const rowWidth = cap * 44 + 40;
  const rowHeight = 50;

  const relX = table.x - section.x;
  const relY = table.y - section.y;

  function renderShape() {
    switch (shape) {
      case "grid":
        return (
          <Rect
            ref={outlineRef}
            width={gridWidth}
            height={gridHeight / 2}
            offsetX={gridWidth / 2 + 20}
            offsetY={gridHeight / 2 - 40}
            fill={theme.palette.background.paper}
            stroke={theme.palette.apple.separator}
            strokeWidth={2}
            cornerRadius={10}
          />
        );

      case "row":
        return (
          <Rect
            ref={outlineRef}
            width={rowWidth - 50}
            height={rowHeight}
            offsetX={rowWidth / 2}
            offsetY={rowHeight / 2}
            fill={theme.palette.background.paper}
            stroke={theme.palette.apple.separator}
            cornerRadius={6}
          />
        );

      case "circle":
      default:
        return (
          <Circle
            ref={outlineRef}
            radius={circleRadius ?? 50}
            fill={theme.palette.background.paper}
            stroke={theme.palette.apple.separator}
            strokeWidth={2}
          />
        );
    }
  }

  useEffect(() => {
    const stage = outlineRef.current.getStage();

    stage.on("hover:section", (evt) => {
      if (!isSelected && evt.sectionId === table.sectionId) {
        highlight("hover");
      }
    });

    stage.on("hover:table", (evt) => {
      if (!isSelected && evt.tableId === table.id) {
        highlight("hover");
      }
    });

    // When a seat is hovered → only highlight table if seat belongs to this table
    stage.on("hover:seat", (evt) => {
      if (!isSelected && evt.tableId === table.id) {
        highlight("hover");
      }
    });

    stage.on("hover:none", () => {
      if (!isSelected) {
        highlight(false);
      }
    });

    stage.on("click:table", (evt) => {
      if (evt.tableId === table.id) highlight("selected");
    });
  }, [isSelected]);

  useEffect(() => {
    if (isSelected) highlight("selected");
    else highlight("off");
  }, [isSelected]);

  return (
    <Group
      ref={groupRef}
      x={relX}
      y={relY}
      draggable
      onClick={(e) => {
        e.cancelBubble = true;
        send("click:table", { tableId: table.id, sectionId: table.sectionId });
      }}
      onMouseEnter={() => {
        send("hover:table", { tableId: table.id, sectionId: table.sectionId });
      }}
      onMouseLeave={() => send("hover:none")}
      onDragMove={(e) => {
        const x = e.target.x();
        const y = e.target.y();

        send("edit:move:table", {
          tableId: table.id,
          x,
          y,
        });

        autoSave(() => layoutActions.moveTable(table.id, x, y));
      }}
    >
      {/* Shape */}
      {renderShape()}

      {/* <Text
        text={table.name}
        fontSize={14}
        offsetX={40}
        offsetY={8}
        fill={theme.palette.text.primary}
      /> */}

      <Text
        ref={textRef}
        text={table.name}
        fontSize={16}
        fill={theme.palette.text.primary}
        align="center"
        verticalAlign="middle"
        shadowBlur={0}
        shadowOpacity={0}
        offsetX={0}
        offsetY={0}
        width={
          shape === "circle"
            ? circleRadius * 2
            : shape === "row"
              ? rowWidth - 50
              : gridWidth
        }
        height={
          shape === "circle"
            ? circleRadius * 2
            : shape === "row"
              ? rowHeight
              : gridHeight / 2
        }
        x={
          shape === "circle"
            ? -circleRadius
            : shape === "row"
              ? -(rowWidth - 50) / 2
              : -gridWidth / 2
        }
        y={
          shape === "circle"
            ? -circleRadius
            : shape === "row"
              ? -rowHeight / 2
              : -(gridHeight / 2) / 2
        }
      />

      {/* Seats */}
      {(table.seats ?? []).map((seat) => (
        <SeatLayer
          key={seat.id}
          seat={seat}
          table={table}
          send={send}
          selected={selected}
          selection={selection}
        />
      ))}
    </Group>
  );
}
