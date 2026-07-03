"use client";

import dayjs from "dayjs";
import type { TimelineDesign } from "@/checkpoint/components/event/settings/sections/timeline/TimelineRenderer";
import type { TimelineItem } from "../TimelineSection";

export function generateTimelineHtml(
  items: TimelineItem[],
  design: TimelineDesign = "clean",
  title?: string,
): string {
  const sorted = [...items].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  switch (design) {
    case "luxury":
      return luxuryTemplate(sorted, title);
    case "minimal":
      return minimalTemplate(sorted, title);
    default:
      return cleanTemplate(sorted, title);
  }
}

/* -------------------------------------------------- */
/* CLEAN (Business / Neutral)                         */
/* -------------------------------------------------- */

function cleanTemplate(items: TimelineItem[], title?: string): string {
  return `
  <html>
    <head>
      <style>
        body {
          font-family: -apple-system, sans-serif;
          padding: 40px;
        }

        .title {
          text-align: center;
          font-size: 26px;
          margin-bottom: 30px;
        }

        .item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
        }

        .time {
          font-weight: bold;
          color: #888;
        }
      </style>
    </head>

    <body>
        <div class="title">${title ?? "Event Timeline"}</div>

      ${items
        .map(
          (i) => `
        <div class="item">
          <div>${i.label}</div>
          <div class="time">${dayjs(i.timestamp).format("HH:mm")}</div>
        </div>
      `,
        )
        .join("")}
    </body>
  </html>
  `;
}

/* -------------------------------------------------- */
/* LUXURY (Wedding / Premium)                         */
/* -------------------------------------------------- */

function luxuryTemplate(items: TimelineItem[], title?: string): string {
  return `
  <html>
    <head>
      <style>
        body {
          font-family: "Georgia", serif;
          padding: 60px;
          background: #f9f6f1;
        }

        .card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
        }

        .title {
          text-align: center;
          font-size: 30px;
          margin-bottom: 40px;
          letter-spacing: 0.1em;
        }

        .item {
          display: flex;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid #eee;
        }

        .time {
          font-weight: bold;
          color: #c89b3c;
        }
      </style>
    </head>

    <body>
      <div class="card">
        <div class="title">${title ?? "Event Timeline"}</div>

        ${items
          .map(
            (i) => `
          <div class="item">
            <div>${i.label}</div>
            <div class="time">${dayjs(i.timestamp).format("HH:mm")}</div>
          </div>
        `,
          )
          .join("")}
      </div>
    </body>
  </html>
  `;
}

/* -------------------------------------------------- */
/* MINIMAL (Modern / Tech)                            */
/* -------------------------------------------------- */

function minimalTemplate(items: TimelineItem[], _title?: string): string {
  return `
  <html>
    <head>
      <style>
        body {
          font-family: monospace;
          padding: 40px;
          background: #0f0f0f;
          color: white;
        }

        .item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #333;
        }

        .time {
          color: #00ffcc;
        }
      </style>
    </head>

    <body>
      ${items
        .map(
          (i) => `
        <div class="item">
          <div>${i.label}</div>
          <div class="time">${dayjs(i.timestamp).format("HH:mm")}</div>
        </div>
      `,
        )
        .join("")}
    </body>
  </html>
  `;
}
