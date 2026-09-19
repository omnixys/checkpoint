import { Alert, Box, Button, CssBaseline, Stack, ThemeProvider, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import SeatMapCanvas from "../../src/components/seat/seatMapCanvas/SeatMapCanvas";
import { exportMove, type SourceLayout } from "../../src/components/seat/seatMapCanvas/core/adapter";
import { type LayoutOperation } from "../../src/components/seat/seatMapCanvas/core/document";
import {
  type PersistLayoutOperation,
  useLayoutDocument,
} from "../../src/components/seat/seatMapCanvas/useLayoutDocument";
import { createAppTheme } from "../../src/themes/createAppTheme";
import type { HarnessSnapshot } from "./contract";
import SourceFixture from "./SourceFixture";

const fixture: SourceLayout = [
  {
    id: "section-a",
    name: "Hauptsaal",
    x: 500,
    y: 400,
    width: 640,
    height: 380,
    rotation: 0,
    shape: "RECTANGLE",
    meta: null,
    tables: [
      {
        id: "table-a",
        sectionId: "section-a",
        name: "Tisch 1",
        x: 100,
        y: -50,
        width: 120,
        height: 120,
        rotation: 90,
        shape: "ROUND",
        meta: null,
        seats: [
          {
            id: "seat-a",
            sectionId: "section-a",
            tableId: "table-a",
            number: 1,
            x: 0,
            y: -90,
            width: 28,
            height: 28,
            rotation: 0,
            shape: "CIRCLE",
            meta: null,
          },
          {
            id: "seat-b",
            sectionId: "section-a",
            tableId: "table-a",
            number: 2,
            x: 90,
            y: 0,
            width: 28,
            height: 28,
            rotation: 90,
            shape: "CIRCLE",
            meta: null,
          },
        ],
      },
      {
        id: "table-b",
        sectionId: "section-a",
        name: "Tisch 2",
        x: -160,
        y: 50,
        width: 140,
        height: 80,
        rotation: 0,
        shape: "RECTANGLE",
        meta: null,
        seats: [],
      },
    ],
    seats: [
      {
        id: "seat-free",
        sectionId: "section-a",
        tableId: null,
        number: 3,
        x: -220,
        y: -130,
        width: 28,
        height: 28,
        rotation: 0,
        shape: "SQUARE",
        meta: null,
      },
    ],
  },
];
const theme = createAppTheme("light", "original");

function Harness() {
  const [eventId, setEventId] = useState("event-a");
  const [editing, setEditing] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [source, setSource] = useState(fixture);
  const [requests, setRequests] = useState<HarnessSnapshot["requests"]>([]);
  const [resizeOps, setResizeOps] = useState<LayoutOperation[]>([]);
  const [rotateOps, setRotateOps] = useState<LayoutOperation[]>([]);
  const outcome = useRef<"success" | "failure" | "defer">("success");
  const settlement = useRef<{ resolve(): void; reject(error: Error): void } | null>(null);
  const persist = useCallback<PersistLayoutOperation>(async (operation) => {
    const node = operation.after.nodes[operation.nodeId];
    if (node)
      setRequests((previous) => [
        ...previous,
        { kind: node.kind, input: exportMove(operation.after, operation.nodeId) },
      ]);
    if (outcome.current === "failure") throw new Error("Kontrollierter Speicherfehler");
    if (outcome.current === "defer")
      await new Promise<void>((resolve, reject) => {
        settlement.current = { resolve, reject };
      });
  }, []);
  const layout = useLayoutDocument(eventId, source, persist);
  useEffect(() => {
    window.seatHarness = {
      snapshot: () => ({
        document: layout.document,
        selectedIds,
        pending: layout.pending,
        error: layout.error,
        requests,
        resizeOps,
        rotateOps,
      }),
      setEvent: setEventId,
      setEditing,
      setOutcome: (next) => {
        outcome.current = next;
      },
      settle: (fail = false) => {
        if (fail) settlement.current?.reject(new Error("Kontrollierter Speicherfehler"));
        else settlement.current?.resolve();
        settlement.current = null;
      },
      refetch: () => setSource(structuredClone(fixture)),
    };
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box component="main" sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 2 }}>
          <Typography variant="h4">Sitzplan · Komponentenprüfung</Typography>
          <Button onClick={() => setEditing((value) => !value)}>
            {editing ? "Ansicht" : "Bearbeiten"}
          </Button>
          <Typography variant="body2" color="text.secondary">
            {eventId} · {requests.length} Speicheraufrufe
          </Typography>
        </Stack>
        {layout.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {layout.error}
          </Alert>
        )}
        <Box
          sx={{
            display: "flex",
            width: "min(900px, 100%)",
            height: 550,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          {layout.document && (
            <SeatMapCanvas
              document={layout.document}
              presenceMap={new Map()}
              colorGroups={new Map()}
              seats={[]}
              getSeatHolderLabel={() => ""}
              role="ADMIN"
              isEditing={editing}
              selectedIds={selectedIds}
              onSelect={setSelectedIds}
              onMove={layout.move}
              onResize={(operation) => {
                setResizeOps((previous) => [...previous, operation]);
                void layout.resize(operation);
              }}
              onRotate={(operation) => {
                setRotateOps((previous) => [...previous, operation]);
                void layout.move(operation);
              }}
              pending={layout.pending}
            />
          )}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
          Kontrollierte Daten und Speicherung. Originaler Renderer und Pointer-Interaktion.
        </Typography>
      </Box>
    </ThemeProvider>
  );
}
createRoot(document.getElementById("root")!).render(
  new URLSearchParams(window.location.search).get("fixture") === "sources" ? (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SourceFixture />
    </ThemeProvider>
  ) : (
    <Harness />
  ),
);
