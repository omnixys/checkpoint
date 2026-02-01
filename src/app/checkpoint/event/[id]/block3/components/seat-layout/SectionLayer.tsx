"use client";

import { autoSave } from "@/app/checkpoint/event/[id]/block3/components/edit/autoSave";
import { useLayoutActions } from "@/app/checkpoint/event/[id]/block3/components/edit/layoutActions2";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef } from "react";
import { Circle, Group, Text } from "react-konva";
import TableLayer from "./TableLayer";
import { enablePulseAnimation } from "./utils/pulse";
import { glowColor } from "./utils/themeGlow";

export default function SectionLayer({ section, send, selected, selection }) {
  const theme = useTheme();
  const glow = glowColor(theme);
  const layoutActions = useLayoutActions();

  const groupRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);

  const isSelected =
    (selected.type === "section" && selected.id === section.id) ||
    selection.sectionId == section.id;

  const r = section.meta?.radius ?? 300;

  function highlight(type) {
    const node = circleRef.current;
    const text = textRef.current;
    if (!node || !text) return;

    if (type === "selected") {
      node.stroke("#3B82F6"); // blue-500
      node.strokeWidth(6);
      node.shadowColor("#3B82F6");
      node.shadowBlur(80);
      node.shadowOpacity(0.6);
      enablePulseAnimation(node, 0.09);
    } else if (type === "hover") {
      node.stroke(glow);
      node.strokeWidth(4);
      node.shadowBlur(60);
      node.shadowOpacity(0.6);
      enablePulseAnimation(node, 0.06);

      text.shadowColor(glow);
      text.shadowBlur(20);
      text.fill(theme.palette.primary.light);
      enablePulseAnimation(text, 0.05);
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

  useEffect(() => {
    const stage = circleRef.current.getStage();

    stage.on("hover:section", (evt) => {
      if (!isSelected && evt.sectionId === section.id) {
        highlight("hover");
      }
    });

    // Prevent section from highlighting when table or seat hover their own zone
    stage.on("hover:table", (evt) => {
      if (!isSelected && evt.sectionId === section.id) {
        highlight("hover");
      }
    });

    stage.on("hover:seat", (evt) => {
      if (!isSelected && evt.sectionId === section.id) {
        highlight("hover");
      }
    });

    stage.on("hover:none", () => {
      if (!isSelected) {
        highlight(false);
      }
    });

    stage.on("click:section", (evt) => {
      if (evt.sectionId === section.id) highlight("selected");
    });
  }, [isSelected]);

  useEffect(() => {
    if (isSelected) highlight("selected");
    else highlight("off");
  }, [isSelected]);

  return (
    <Group
      ref={groupRef}
      x={section.x}
      y={section.y}
      draggable
      onClick={() => send("click:section", { sectionId: section.id })}
      onMouseEnter={() => {
        send("hover:section", { sectionId: section.id });
      }}
      onMouseLeave={() => {
        send("hover:none");
      }}
      onDragMove={(e) => {
        const x = e.target.x();
        const y = e.target.y();

        send("edit:section-local", { sectionId: section.id, x, y });

        autoSave(() => layoutActions.moveSection(section.id, x, y));
      }}
    >
      <Circle
        ref={circleRef}
        radius={r}
        stroke={theme.palette.apple.separator}
        strokeWidth={2}
        dash={[12, 10]}
        opacity={0.25}
      />

      <Text
        ref={textRef}
        shadowBlur={0}
        shadowOpacity={0}
        text={section.name}
        fontSize={28}
        fill={theme.palette.text.primary}
        offsetX={r / 2.5}
        offsetY={-4}
      />

      {(section.tables ?? []).map((table) => (
        <TableLayer
          key={table.id}
          table={table}
          section={table}
          send={send}
          selected={selected}
          selection={selection}
        />
      ))}
    </Group>
  );
}
