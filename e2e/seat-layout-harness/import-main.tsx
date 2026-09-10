import { Alert, Box, Button, CssBaseline, Stack, ThemeProvider, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { importLayout } from "../../src/components/seat/seatMapCanvas/core/adapter";
import type { LayoutDocument } from "../../src/components/seat/seatMapCanvas/core/document";
import { source } from "../../src/components/seat/seatMapCanvas/core/test-fixture";
import { SeatMapCreateDialog } from "../../src/components/seat/seatMapCanvas/import/SeatMapCreateDialog";
import { useDraftLossWarning } from "../../src/components/seat/seatMapCanvas/import/useDraftLossWarning";
import { useLocalLayoutDraft } from "../../src/components/seat/seatMapCanvas/import/useLocalLayoutDraft";
import SeatMapCanvas from "../../src/components/seat/seatMapCanvas/SeatMapCanvas";
import { createAppTheme } from "../../src/themes/createAppTheme";

declare global {
  interface Window {
    importHarness: {
      snapshot: () => { document: LayoutDocument | null; requests: number; isLocal: boolean };
      refetch: () => void;
    };
  }
}
const theme = createAppTheme("light", "original"),
  eventId = "01990909-1234-7000-8000-000000000001";
const original = importLayout(eventId, source);
function ImportHarness() {
  const [open, setOpen] = useState(false),
    [selectedIds, setSelectedIds] = useState<string[]>([]),
    [requests, setRequests] = useState(0),
    [server, setServer] = useState(original);
  const persist = useCallback(async () => {
    setRequests((value) => value + 1);
  }, []);
  const layout = useLocalLayoutDraft(eventId, server, persist);
  useDraftLossWarning(layout.isLocal);
  useEffect(() => {
    window.importHarness = {
      snapshot: () => ({ document: layout.document, requests, isLocal: layout.isLocal }),
      refetch: () => setServer(structuredClone(original)),
    };
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack component="main" spacing={2} sx={{ p: 3 }}>
        <Typography variant="h4">Sitzplan · Importprüfung</Typography>
        <Typography variant="body2">
          Echte Erkennung über lokalen Analyse-Service. Domain-Speicherung ist als Testzähler
          angebunden.
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Sitzplan erstellen
          </Button>
          <Button onClick={() => layout.discard()}>Entwurf verwerfen</Button>
          <Button href="/">Andere Ansicht</Button>
        </Stack>
        {layout.isLocal && <Alert severity="warning">Lokaler Entwurf – nicht gespeichert</Alert>}
        <Box sx={{ display: "flex", height: 550, border: 1, borderColor: "divider" }}>
          <SeatMapCanvas
            document={layout.document!}
            presenceMap={new Map()}
            colorGroups={new Map()}
            seats={[]}
            getSeatHolderLabel={() => ""}
            role="ADMIN"
            isEditing
            selectedIds={selectedIds}
            onSelect={setSelectedIds}
            onMove={layout.move}
            pending={false}
          />
        </Box>
        <SeatMapCreateDialog
          open={open}
          onClose={() => setOpen(false)}
          eventId={eventId}
          document={layout.document!}
          onAccept={layout.accept}
          presetDisabled={layout.isLocal}
          onGenerate={() => setRequests((value) => value + 1)}
        />
      </Stack>
    </ThemeProvider>
  );
}
createRoot(document.getElementById("root")!).render(<ImportHarness />);
