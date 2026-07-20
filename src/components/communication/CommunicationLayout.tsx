"use client";

import { alpha, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { ReactNode } from "react";

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "100%",
  borderRadius: 16,
  overflow: "hidden",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? alpha("#FFFFFF", 0.08)
      : alpha("#000000", 0.08)
  }`,
  background:
    theme.palette.mode === "dark"
      ? alpha("#000000", 0.2)
      : alpha("#FFFFFF", 0.5),
  backdropFilter: "blur(20px)",
}));

const Panel = styled(Box)<{ width?: number; hidden?: boolean }>(
  ({ theme, width = 320, hidden }) => ({
    display: hidden ? "none" : "flex",
    flexDirection: "column",
    width,
    flexShrink: 0,
    borderRight: `1px solid ${
      theme.palette.mode === "dark"
        ? alpha("#FFFFFF", 0.06)
        : alpha("#000000", 0.06)
    }`,
    overflow: "hidden",
    [theme.breakpoints.down("md")]: {
      width: hidden ? 0 : "100%",
      position: "absolute",
      inset: 0,
      zIndex: 10,
      background: theme.palette.background.default,
    },
  }),
);

const MainPanel = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  minWidth: 0,
});

interface Props {
  leftPanel: ReactNode;
  leftWidth?: number;
  leftHidden?: boolean;
  centerPanel?: ReactNode;
  centerWidth?: number;
  centerHidden?: boolean;
  rightPanel?: ReactNode;
}

export function CommunicationLayout({
  leftPanel,
  leftWidth = 320,
  leftHidden = false,
  centerPanel,
  centerWidth = 340,
  centerHidden = false,
  rightPanel,
}: Props) {
  return (
    <Container>
      <Panel width={leftWidth} hidden={leftHidden}>
        {leftPanel}
      </Panel>
      {centerPanel && (
        <Panel width={centerWidth} hidden={centerHidden}>
          {centerPanel}
        </Panel>
      )}
      <MainPanel>{rightPanel}</MainPanel>
    </Container>
  );
}
