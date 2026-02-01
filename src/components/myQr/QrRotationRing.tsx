"use client";

import { Ticket } from "@/types/ticket/ticket.type";
import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

type Props = {
  ticket: Ticket;
  size?: number;
  strokeWidth?: number;
};

export default function QrRotationRing({
  ticket,
  size = 56,
  strokeWidth = 5,
}: Props) {
  const totalMs = ticket.rotationSeconds * 1000;

  const expiresAt = useMemo(() => {
    return new Date(ticket.lastRotatedAt).getTime() + totalMs;
  }, [ticket.lastRotatedAt, totalMs]);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
    }, 250);
    return () => clearInterval(id);
  }, []);

  const remainingMs = Math.max(0, expiresAt - now);
  const progress = Math.min(1, remainingMs / totalMs);
  const secondsLeft = Math.ceil(remainingMs / 1000);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const color =
    secondsLeft <= 5
      ? "#d32f2f" // rot
      : secondsLeft <= 10
      ? "#f9a825" // gelb
      : "#2e7d32"; // grün

  return (
    <Box sx={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" fontWeight={700} color={color}>
          {secondsLeft}s
        </Typography>
      </Box>
    </Box>
  );
}
