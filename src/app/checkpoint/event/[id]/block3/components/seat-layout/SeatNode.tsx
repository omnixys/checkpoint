"use client";

import { Group, Circle, Text } from "react-konva";
import { useTheme } from "@mui/material/styles";

export default function SeatNode({ seat }) {
  const theme = useTheme();
  const isSelected = false; // kommt in Block 2

  return (
    <Group x={seat.x} y={seat.y} rotation={seat.rotation}>
      <Circle
        radius={16}
        fill={
          isSelected
            ? theme.palette.primary.main
            : theme.palette.background.paper
        }
        stroke={theme.palette.apple.separator}
        strokeWidth={isSelected ? 3 : 2}
        shadowBlur={isSelected ? 10 : 0}
        shadowColor={theme.palette.primary.main}
      />

      <Text
        text={String(seat.number)}
        fontSize={12}
        fill={theme.palette.text.primary}
        offsetX={4}
        offsetY={6}
      />
    </Group>
  );
}
