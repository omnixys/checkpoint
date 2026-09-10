import { Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import {
  ImportSourcePanel,
  type ImportSourceKind,
  type PreparedImportSource,
} from "../../src/components/seat/seatMapCanvas/import/sources/ImportSourcePanel";

/** Browser fixture uses production acquisition/decoding; it performs no recognition requests. */
export default function SourceFixture() {
  const [kind, setKind] = useState<ImportSourceKind>("IMAGE");
  const [visible, setVisible] = useState(true);
  const [prepared, setPrepared] = useState<PreparedImportSource | null>(null);
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h4" component="h1">
        Importquelle prüfen
      </Typography>
      <Stack direction="row" sx={{ gap: 1, mb: 2 }}>
        {(["IMAGE", "PDF", "CAMERA"] as const).map((source) => (
          <Button
            key={source}
            onClick={() => {
              setKind(source);
              setVisible(true);
            }}
          >
            {source}
          </Button>
        ))}
        <Button onClick={() => setVisible(false)}>Quelle schließen</Button>
      </Stack>
      {visible && <ImportSourcePanel kind={kind} onPrepared={setPrepared} />}
      <Box component="output" data-testid="prepared-source" sx={{ display: "block", mt: 2 }}>
        {prepared ? JSON.stringify(prepared.metadata) : "Keine vorbereitete Quelle"}
      </Box>
    </Box>
  );
}
