"use client";

import { useMutation } from "@apollo/client/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Box,
  Button,
  Chip,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React from "react";

import SeatRenameConflictDialog from "@/components/seatList/dialogs/SeatRenameConflictDialog";
import { useSeats } from "@/components/seatList/useSeats";

import {
  BULK_RENAME_SECTIONS,
  BULK_RENAME_TABLES,
} from "@/graphql/seat/seat-mutation.graphql";

import {
  BulkRenameSectionsRequest,
  BulkRenameSectionsResult,
  BulkRenameTablesRequest,
  BulkRenameTablesResult,
} from "@/types/seat/seat-mutation-graphql.type";

import {
  RenameSectionInput,
  RenameTableInput,
} from "@/types/seat/seat-input.type";
import { RenameConflict } from "@/types/seat/seat.type";

/* ---------------------------------------------
 * TYPES
 * --------------------------------------------- */
type StructureDraft = Record<
  string, // sectionId
  {
    originalName: string;
    name: string;
    tables: Record<
      string, // tableId
      {
        originalName: string;
        name: string;
      }
    >;
  }
>;

/* ---------------------------------------------
 * PAGE
 * --------------------------------------------- */
export default function SeatingStructurePage() {
  const { id } = useParams();
  const router = useRouter();
  const theme = useTheme();
  const eventId = id as string;

  const { seats, seatsLoading } = useSeats(eventId);

  const [conflicts, setConflicts] = React.useState<RenameConflict[] | null>(
    null
  );
  const [query, setQuery] = React.useState("");

  /* ---------------------------------------------
   * INITIAL DRAFT (ID-BASED, STABLE)
   * --------------------------------------------- */
  const initialDraft = React.useMemo<StructureDraft>(() => {
    const result: StructureDraft = {};
    if (!seats) return result;

    for (const s of seats) {
      const sectionId = s.section.id;
      const tableId = s.table.id;

      if (!result[sectionId]) {
        result[sectionId] = {
          originalName: s.section.name,
          name: s.section.name,
          tables: {},
        };
      }

      if (!result[sectionId].tables[tableId]) {
        result[sectionId].tables[tableId] = {
          originalName: s.table.name,
          name: s.table.name,
        };
      }
    }

    return result;
  }, [seats]);

  const [draft, setDraft] = React.useState<StructureDraft>({});

  React.useEffect(() => {
    setDraft(initialDraft);
  }, [initialDraft]);

  /* ---------------------------------------------
   * MUTATIONS
   * --------------------------------------------- */
  const [bulkRenameSections] = useMutation<
    BulkRenameSectionsResult,
    BulkRenameSectionsRequest
  >(BULK_RENAME_SECTIONS);

  const [bulkRenameTables] = useMutation<
    BulkRenameTablesResult,
    BulkRenameTablesRequest
  >(BULK_RENAME_TABLES);

  /* ---------------------------------------------
   * UPDATE HANDLERS (NO REORDER)
   * --------------------------------------------- */
  const renameSection = (sectionId: string, value: string) => {
    setDraft((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        name: value,
      },
    }));
  };

  const renameTable = (sectionId: string, tableId: string, value: string) => {
    setDraft((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        tables: {
          ...prev[sectionId].tables,
          [tableId]: {
            ...prev[sectionId].tables[tableId],
            name: value,
          },
        },
      },
    }));
  };

  /* ---------------------------------------------
   * APPLY BULK RENAME (ONLY REAL CHANGES)
   * --------------------------------------------- */
  const applyBulkRename = async () => {
    const sectionInput: RenameSectionInput[] = [];
    const tableInput: RenameTableInput[] = [];

    for (const [sectionId, section] of Object.entries(draft)) {
      if (section.name.trim() && section.name !== section.originalName) {
        sectionInput.push({
          sectionId,
          newName: section.name.trim(),
        });
      }

      for (const [tableId, table] of Object.entries(section.tables)) {
        if (table.name.trim() && table.name !== table.originalName) {
          tableInput.push({
            tableId,
            newName: table.name.trim(),
          });
        }
      }
    }

    const allConflicts: RenameConflict[] = [];

    if (sectionInput.length > 0) {
      const res = await bulkRenameSections({
        variables: { input: sectionInput },
      });
      allConflicts.push(...(res.data?.bulkRenameSections.conflicts ?? []));
    }

    if (tableInput.length > 0) {
      const res = await bulkRenameTables({
        variables: { input: tableInput },
      });
      allConflicts.push(...(res.data?.bulkRenameTables.conflicts ?? []));
    }

    if (allConflicts.length > 0) {
      setConflicts(allConflicts);
      return;
    }

    router.back();
  };

  /* ---------------------------------------------
   * FILTER
   * --------------------------------------------- */
  const normalizedQuery = query.trim().toLowerCase();

  const filteredDraft = React.useMemo(() => {
    if (!normalizedQuery) return draft;

    const result: StructureDraft = {};

    for (const [sectionId, section] of Object.entries(draft)) {
      const sectionMatch = section.name.toLowerCase().includes(normalizedQuery);

      const matchingTables = Object.entries(section.tables).filter(
        ([, table]) => table.name.toLowerCase().includes(normalizedQuery)
      );

      if (sectionMatch || matchingTables.length > 0) {
        result[sectionId] = {
          ...section,
          tables: sectionMatch
            ? section.tables
            : Object.fromEntries(matchingTables),
        };
      }
    }

    return result;
  }, [draft, normalizedQuery]);

  /* ---------------------------------------------
   * LOADING
   * --------------------------------------------- */
  if (seatsLoading) {
    return (
      <Box sx={{ px: 3, py: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  /* ---------------------------------------------
   * RENDER
   * --------------------------------------------- */
  return (
    <Stack spacing={3} sx={{ px: 3, py: 2 }}>
      {/* VisionOS Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(20px)",
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          py: 2,
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Box>
              <Typography variant="h5" fontWeight={800}>
                Sitzstruktur bearbeiten
              </Typography>
              <Typography variant="body2" color="text.secondary">
                VisionOS-Style · Bulk Rename
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button onClick={() => router.back()}>Zurück</Button>
              <Button variant="contained" onClick={applyBulkRename}>
                Übernehmen
              </Button>
            </Stack>
          </Stack>

          <TextField
            size="small"
            placeholder="Section oder Tisch suchen…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Box>

      {/* CONTENT */}
      {Object.entries(filteredDraft).map(([sectionId, section]) => (
        <Accordion key={sectionId} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ width: "100%" }}
            >
              <TextField
                label="Section"
                value={section.name}
                onChange={(e) => renameSection(sectionId, e.target.value)}
                sx={{ minWidth: 260 }}
              />
              <Chip
                size="small"
                label={`${Object.keys(section.tables).length} Tische`}
                sx={{ ml: "auto" }}
              />
            </Stack>
          </AccordionSummary>

          <AccordionDetails>
            <Stack spacing={1}>
              {Object.entries(section.tables).map(([tableId, table]) => (
                <TextField
                  key={tableId}
                  size="small"
                  label="Tisch"
                  value={table.name}
                  onChange={(e) =>
                    renameTable(sectionId, tableId, e.target.value)
                  }
                />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}

      {Object.keys(filteredDraft).length === 0 && (
        <Typography align="center" color="text.secondary">
          Keine Treffer gefunden
        </Typography>
      )}

      <SeatRenameConflictDialog
        open={Boolean(conflicts)}
        conflicts={conflicts ?? []}
        onClose={() => setConflicts(null)}
      />
    </Stack>
  );
}
