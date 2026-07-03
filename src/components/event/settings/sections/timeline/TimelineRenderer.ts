"use client";

import dayjs from "dayjs";
import QrCode from "qrcode";
import type { TimelineItem } from "../TimelineSection";

export type TimelineDesign =
  | "vip"
  | "clean"
  | "luxury"
  | "minimal"
  | "birthday"
  | "newyear"
  | "christmas"
  | "easter"
  | "party";

export async function generateTimelineHtmlAdvanced(
  items: TimelineItem[],
  design: TimelineDesign,
  title?: string,
  qrValue?: string,
): Promise<string> {
  const sorted = [...items].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  const qr = qrValue ? await QrCode.toDataURL(qrValue) : null;

  const rows = sorted
    .map(
      (i) => `
      <div class="item">
        <div class="left">
          <span class="icon">${getIcon(i.type)}</span>
          ${i.label}
        </div>
        <div class="time">${dayjs(i.timestamp).format("HH:mm")}</div>
      </div>
    `,
    )
    .join("");

  return `
  <html>
    <head>
      <style>
        body {
          font-family: ${getFont(design)};
          padding: 40px;
          background: ${getBackground(design)};
          color: ${getColor(design)};
        }

        .title {
          text-align: center;
          font-size: 28px;
          margin-bottom: 30px;
        }

        .item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }

        .left {
          display: flex;
          gap: 10px;
        }

        .icon {
          width: 24px;
        }

        .time {
          font-weight: bold;
        }

        .qr {
          margin-top: 40px;
          text-align: center;
        }
      </style>
    </head>

    <body>
      <div class="title">${title || "Event Timeline"}</div>

      ${rows}

      ${qr ? `<div class="qr"><img src="${qr}" width="120"/></div>` : ""}
    </body>
  </html>
  `;
}

/* ---------------- DESIGN SYSTEM ---------------- */

function getBackground(design: TimelineDesign) {
  switch (design) {
    case "birthday":
      return "linear-gradient(135deg,#ff9a9e,#fad0c4)";
    case "newyear":
      return "black";
    case "christmas":
      return "#0b3d2e";
    case "easter":
      return "#fef6e4";
    case "party":
      return "#111";
    default:
      return "#fff";
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
      return "#111";
  }
}

function getFont(design: TimelineDesign) {
  switch (design) {
    case "luxury":
      return "Georgia, serif";
    case "party":
      return "monospace";
    default:
      return "-apple-system";
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
