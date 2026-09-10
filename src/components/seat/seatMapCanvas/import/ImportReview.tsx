"use client";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import SeatMapCanvas from "../SeatMapCanvas";
import type { DraftElement, LayoutImportDraft } from "./contract";
import {
  addDraftElement,
  draftDocument,
  draftIssues,
  IMPORT_WIDTH,
  moveDraft,
  regenerateDraftSeats,
} from "./domain";

const shapeOptions: Record<string, string[]> = {
  SECTION: ["RECTANGLE", "CIRCLE", "POLYGON"],
  TABLE: ["ROUND", "RECTANGLE", "OVAL", "ROW"],
  SEAT: ["CIRCLE", "SQUARE", "RECTANGLE"],
};
const labels: Record<string, string> = {
  SECTION: "Bereich",
  TABLE: "Tisch",
  SEAT: "Sitz",
  STAGE: "Bühne",
  AISLE: "Gang",
  LABEL: "Beschriftung",
  UNKNOWN: "Unbekannt",
};
const warningLabels = {
  GEOMETRY_ONLY:
    "Geometrische Vorschläge: Namen, Sitznummern und Belegung werden nicht erkannt. Bitte den Plan vor der Übernahme prüfen.",
  UNKNOWN_OBJECT:
    "Einige Formen sind unklar. Bitte umklassifizieren oder ausdrücklich ausschließen.",
  AMBIGUOUS_PARENT: "Einige Zuordnungen sind mehrdeutig. Bitte Bereich oder Tisch bestätigen.",
  NO_OBJECTS:
    "Keine eindeutigen Objekte erkannt. Sie können Bereiche, Tische und Sitze auf der Vorlage hinzufügen.",
};
export function ImportReview({
  draft,
  onChange,
  previewUrl,
}: {
  draft: LayoutImportDraft;
  onChange: (draft: LayoutImportDraft) => void;
  previewUrl: string;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]),
    [visible, setVisible] = useState(true),
    [objects, setObjects] = useState(true),
    [opacity, setOpacity] = useState(0.55),
    [count, setCount] = useState(""),
    [error, setError] = useState<string | null>(null);
  const document = useMemo(() => draftDocument(draft), [draft]);
  const selected = draft.elements.find((e) => e.id === selectedIds[0]);
  const issues = draftIssues(draft);
  const update = (change: Partial<DraftElement>) => {
    if (selected)
      onChange({
        ...draft,
        elements: draft.elements.map((e) => (e.id === selected.id ? { ...e, ...change } : e)),
      });
  };
  const run = (work: () => LayoutImportDraft) => {
    try {
      onChange(work());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Änderung fehlgeschlagen.");
    }
  };
  const exclude = () => {
    if (!selected) return;
    const ids = new Set([selected.id]);
    for (const e of draft.elements) if (e.parentId === selected.id) ids.add(e.id);
    for (const e of draft.elements) if (e.parentId && ids.has(e.parentId)) ids.add(e.id);
    onChange({
      ...draft,
      elements: draft.elements.map((e) => (ids.has(e.id) ? { ...e, excluded: true } : e)),
    });
    setSelectedIds([]);
  };
  return (
    <Stack spacing={1.5}>
      <Typography variant="body2">
        Positionen und Zuordnungen prüfen. Die Vorlage bleibt temporär; der übernommene Plan wird
        als lokaler Entwurf geöffnet.
      </Typography>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
        <FormControlLabel
          control={<Checkbox checked={visible} onChange={(_, value) => setVisible(value)} />}
          label="Vorlage"
        />
        <FormControlLabel
          control={<Checkbox checked={objects} onChange={(_, value) => setObjects(value)} />}
          label="Objekte"
        />
        <Box sx={{ width: 160 }}>
          <Typography variant="caption" id="source-opacity">
            Deckkraft
          </Typography>
          <Slider
            aria-labelledby="source-opacity"
            min={0}
            max={1}
            step={0.05}
            value={opacity}
            onChange={(_, value) => setOpacity(value as number)}
          />
        </Box>
        {(["SECTION", "TABLE", "SEAT"] as const).map((kind) => (
          <Button key={kind} onClick={() => run(() => addDraftElement(draft, kind))}>
            {labels[kind]} hinzufügen
          </Button>
        ))}
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Box
          sx={{
            height: { xs: "50dvh", md: "60dvh" },
            minHeight: 240,
            display: "flex",
            flex: 1,
            minWidth: 0,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          {/* biome-ignore lint/a11y/useValidAriaRole: role is the existing business-role prop of the shared renderer, not a DOM role. */}
          <SeatMapCanvas
            document={document}
            presenceMap={new Map()}
            colorGroups={new Map()}
            seats={[]}
            getSeatHolderLabel={() => ""}
            role="ADMIN"
            isEditing
            selectedIds={selectedIds}
            onSelect={(ids) => {
              setSelectedIds(ids);
              setCount("");
            }}
            onMove={(operation) => onChange(moveDraft(draft, operation))}
            pending={false}
            worldBackground={{
              url: previewUrl,
              width: IMPORT_WIDTH,
              height: (IMPORT_WIDTH * draft.source.height) / draft.source.width,
              opacity,
              visible,
            }}
            showObjects={objects}
          />
        </Box>
        <Stack
          spacing={1.5}
          sx={{ width: { xs: "100%", md: 280 }, maxHeight: { md: "60dvh" }, overflow: "auto" }}
        >
          <TextField
            select
            slotProps={{ select: { native: true } }}
            size="small"
            label="Vorschlag auswählen"
            value={selected?.id ?? ""}
            onChange={(e) => {
              setSelectedIds(e.target.value ? [e.target.value] : []);
              setCount("");
            }}
          >
            <option value="">Keine Auswahl</option>
            {draft.elements.map((e, index) => (
              <option key={e.id} value={e.id}>
                {e.label || `${labels[e.kind]} ${index + 1}`}
                {e.excluded ? " (ausgeschlossen)" : e.needsReview && !e.reviewed ? " – prüfen" : ""}
              </option>
            ))}
          </TextField>
          {selected && (
            <>
              <TextField
                select
                size="small"
                label="Typ"
                value={selected.kind}
                onChange={(e) => {
                  const kind = e.target.value as DraftElement["kind"];
                  update({
                    kind,
                    shape: shapeOptions[kind]?.[0] ?? "",
                    parentId: null,
                    needsReview: true,
                    reviewed: false,
                  });
                }}
              >
                {Object.entries(labels).map(([kind, label]) => (
                  <MenuItem key={kind} value={kind}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
              {shapeOptions[selected.kind] && (
                <TextField
                  select
                  size="small"
                  label="Form"
                  value={
                    shapeOptions[selected.kind]!.includes(selected.shape) ? selected.shape : ""
                  }
                  onChange={(e) => update({ shape: e.target.value })}
                >
                  <MenuItem value="">Form bestätigen</MenuItem>
                  {shapeOptions[selected.kind]!.map((shape) => (
                    <MenuItem key={shape} value={shape}>
                      {shape}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              <TextField
                size="small"
                label="Label / Name"
                value={selected.label}
                onChange={(e) => update({ label: e.target.value })}
              />
              {selected.kind !== "SECTION" && (
                <TextField
                  select
                  slotProps={{ select: { native: true } }}
                  size="small"
                  label="Zuordnung"
                  value={selected.parentId ?? ""}
                  onChange={(e) => update({ parentId: e.target.value || null })}
                >
                  <option value="">Neuer Importbereich</option>
                  {draft.elements
                    .filter(
                      (e) =>
                        !e.excluded &&
                        e.id !== selected.id &&
                        (e.kind === "SECTION" || (selected.kind === "SEAT" && e.kind === "TABLE")),
                    )
                    .map((e, index) => (
                      <option key={e.id} value={e.id}>
                        {e.label || `${labels[e.kind]} ${index + 1}`}
                      </option>
                    ))}
                </TextField>
              )}
              <Typography variant="caption">
                Qualität (Heuristik):{" "}
                {selected.confidence?.geometry === undefined
                  ? "unbekannt"
                  : `${Math.round(selected.confidence.geometry * 100)} / 100`}
              </Typography>
              {selected.kind === "TABLE" && (
                <>
                  <TextField
                    size="small"
                    type="number"
                    label="Sitzanzahl"
                    value={
                      count ||
                      String(
                        draft.elements.filter(
                          (e) => !e.excluded && e.kind === "SEAT" && e.parentId === selected.id,
                        ).length,
                      )
                    }
                    onChange={(e) => setCount(e.target.value)}
                    slotProps={{ htmlInput: { min: 0, max: 10000, step: 1 } }}
                  />
                  <Button
                    onClick={() =>
                      run(() =>
                        regenerateDraftSeats(
                          draft,
                          selected.id,
                          Number(
                            count ||
                              draft.elements.filter(
                                (e) =>
                                  !e.excluded && e.kind === "SEAT" && e.parentId === selected.id,
                              ).length,
                          ),
                        ),
                      )
                    }
                  >
                    Form und Sitzanzahl anwenden
                  </Button>
                </>
              )}
              {selected.kind === "SEAT" && (
                <TextField
                  size="small"
                  type="number"
                  label="Sitznummer (leer: automatisch)"
                  value={selected.number ?? ""}
                  onChange={(e) =>
                    update({
                      number: e.target.value ? Number(e.target.value) : null,
                      numberConfirmed: e.target.value !== "",
                    })
                  }
                  slotProps={{ htmlInput: { min: 1, step: 1 } }}
                />
              )}
              <Button
                variant="outlined"
                onClick={() => update({ reviewed: true, excluded: false })}
              >
                Vorschlag bestätigen
              </Button>
              <Button color="warning" onClick={exclude}>
                Vorschlag mit Nachfahren ausschließen
              </Button>
              <Button
                color="error"
                onClick={() => {
                  onChange({
                    ...draft,
                    elements: draft.elements.filter((e) => e.id !== selected.id),
                  });
                  setSelectedIds([]);
                }}
              >
                Vorschlag löschen
              </Button>
            </>
          )}
        </Stack>
      </Stack>
      {error && <Alert severity="error">{error}</Alert>}
      {draft.warnings.map((warning) => (
        <Alert
          severity="warning"
          key={`${warning.code}:${warning.elementIds?.join(",") ?? warning.message}`}
        >
          {warningLabels[warning.code]}
        </Alert>
      ))}
      {draft.warnings.length > 0 && (
        <FormControlLabel
          control={
            <Checkbox
              checked={draft.warningsConfirmed}
              onChange={(_, checked) => onChange({ ...draft, warningsConfirmed: checked })}
            />
          }
          label="Hinweise und Grenzen der Erkennung geprüft"
        />
      )}
      {issues.length > 0 && (
        <Alert severity="info">
          Noch zu prüfen: {issues.length}. {issues[0]}
        </Alert>
      )}
    </Stack>
  );
}
