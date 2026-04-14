"use client";

import { TimelineDesign } from "@/checkpoint/components/event/settings/sections/timeline/TimelineRenderer";
import { Box, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

export type TimelineItem = {
  id: string;
  type: string;
  label: string;
  timestamp: string;
};

type Props = {
  items: TimelineItem[];
  title?: string | undefined;
  design?: TimelineDesign | undefined;
  qrValue?: string;
};

/**
 * TicketRenderer
 *
 * Renders a visual ticket card in the UI.
 * This is also used as the base for export/print HTML.
 */
export function TimelineTicketRenderer({ items, title, design = "vip", qrValue }: Props) {
  const [qr, setQr] = useState<string>();

  useEffect(() => {
    if (!qrValue) return;
    QRCode.toDataURL(qrValue).then(setQr);
  }, [qrValue]);

  const sorted = [...items].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return (
    <Box
      sx={{
        width: 380,
        borderRadius: "24px",
        overflow: "hidden",
        background: getBackground(design),
        color: getColor(design),
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 700,
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          {title || "EVENT TICKET"}
        </Typography>

        <Stack spacing={1}>
          {sorted.map((i) => (
            <Stack
              key={i.id}
              direction="row"
              sx={{
                justifyContent: "space-between",
              }}
            >
              <Stack direction="row" spacing={1}>
                <span>{getIcon(i.type)}</span>
                <Typography>{i.label}</Typography>
              </Stack>

              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                {dayjs(i.timestamp).format("HH:mm")}
              </Typography>
            </Stack>
          ))}
        </Stack>

        {qr && (
          <Box
            sx={{
              mt: 2,
              textAlign: "center",
            }}
          >
            <img src={qr} width={100} />
          </Box>
        )}
      </Stack>
    </Box>
  );
}

/* ---------------- DESIGN SYSTEM ---------------- */

function getBackground(design: TimelineDesign) {
  switch (design) {
    case "birthday":
      return "linear-gradient(135deg,#ff758c,#ff7eb3)";
    case "newyear":
      return "black";
    case "christmas":
      return "#0b3d2e";
    case "party":
      return "#111";
    default:
      return "linear-gradient(135deg,#1e1e2f,#3a3a6a)";
  }
}

function getColor(design: TimelineDesign) {
  switch (design) {
    case "newyear":
      return "#ffd700";
    case "christmas":
      return "#fff";
    case "party":
      return "#00ffcc";
    default:
      return "#fff";
  }
}

function getIcon(type: string) {
  switch (type) {
    case "CHECKIN":
      return "🎟";
    case "CHECKOUT":
      return "🚪";
    case "PROGRAM":
      return "🎤";
    default:
      return "•";
  }
}

/**
 * HTML Export Renderer (same style)
 */
export async function renderTicketToHtml(items: TimelineItem[], title?: string) {
  const sorted = [...items].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return `
    <html>
      <body style="font-family:sans-serif;padding:40px">
        <h2 style="text-align:center">${title || "Event Ticket"}</h2>

        ${sorted
          .map(
            (i) => `
          <div style="display:flex;justify-content:space-between;padding:10px 0">
            <div>${i.label}</div>
            <div>${dayjs(i.timestamp).format("HH:mm")}</div>
          </div>
        `,
          )
          .join("")}
      </body>
    </html>
  `;
}
