import type { SourceLayout } from "./adapter";

export const source: SourceLayout = [
  {
    id: "section",
    name: "S",
    x: 500,
    y: 400,
    width: 400,
    height: 300,
    rotation: 90,
    shape: "RECTANGLE",
    meta: { keep: null },
    tables: [
      {
        id: "table",
        name: "T",
        sectionId: "section",
        x: 100,
        y: -50,
        width: 140,
        height: 80,
        rotation: 180,
        shape: "OVAL",
        meta: null,
        seats: [
          {
            id: "seat",
            sectionId: "section",
            tableId: "table",
            x: 10,
            y: 20,
            width: null,
            height: null,
            rotation: null,
            number: 1,
            meta: { nested: [null, "keep"] },
          },
        ],
      },
    ],
    seats: [
      {
        id: "free",
        sectionId: "section",
        tableId: null,
        x: -40,
        y: 100,
        width: 20,
        height: 30,
        rotation: 90,
        number: null,
        meta: null,
      },
    ],
  },
];
