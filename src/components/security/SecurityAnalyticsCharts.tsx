"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* -------------------------------------------------------------------
 * SecurityAnalyticsCharts
 * - Minimalistic VisionOS-like charts
 * - Scans over time, Warnings over time
 * ------------------------------------------------------------------- */
export default function SecurityAnalyticsCharts({
  scans,
  warnings,
}: {
  scans: { time: string; value: number }[];
  warnings: { time: string; value: number }[];
}) {
  return (
    <Box
      sx={{
        px: 2.5,
        py: 2.5,
        borderRadius: "24px",
        backdropFilter: "blur(16px)",
        background: "rgba(255,255,255,0.18)",
      }}
    >
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Analytics
      </Typography>

      <Typography sx={{ opacity: 0.7, mb: 0.5 }}>Scans per minute</Typography>
      <ChartBlock data={scans} color="#007AFF" />

      <Typography sx={{ opacity: 0.7, mt: 3, mb: 0.5 }}>Warnings</Typography>
      <ChartBlock data={warnings} color="#ff3b30" />
    </Box>
  );
}

function ChartBlock({
  data,
  color,
}: {
  data: { time: string; value: number }[];
  color: string;
}) {
  return (
    <Box sx={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            dot={false}
          />
          <XAxis dataKey="time" hide />
          <YAxis hide />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
