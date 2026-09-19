"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { Alert, Box, Button, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import React from "react";
import RouteGuard from "@/checkpoint/components/guard/RouteGuard";
import { exportMove } from "@/checkpoint/components/seat/seatMapCanvas/core/adapter";
import { setNodeShape } from "@/checkpoint/components/seat/seatMapCanvas/core/document";
import { SeatMapCreateDialog } from "@/checkpoint/components/seat/seatMapCanvas/import/SeatMapCreateDialog";
import { useDraftLossWarning } from "@/checkpoint/components/seat/seatMapCanvas/import/useDraftLossWarning";
import { useLocalLayoutDraft } from "@/checkpoint/components/seat/seatMapCanvas/import/useLocalLayoutDraft";
import SeatColorLegend from "@/checkpoint/components/seat/seatMapCanvas/SeatColorLegend";
import SeatMapAddSeatsDialog from "@/checkpoint/components/seat/seatMapCanvas/SeatMapAddSeatsDialog";
import SeatMapCanvas from "@/checkpoint/components/seat/seatMapCanvas/SeatMapCanvas";
import SeatMapEditorToolbar, {
  type EditorMode,
  type SelectedItem,
} from "@/checkpoint/components/seat/seatMapCanvas/SeatMapEditorToolbar";
import SeatMapRenameDialog from "@/checkpoint/components/seat/seatMapCanvas/SeatMapRenameDialog";
import SeatMapSearch, {
  type SeatMapFilters,
} from "@/checkpoint/components/seat/seatMapCanvas/SeatMapSearch";
import {
  type PersistLayoutOperation,
  useLayoutDocument,
} from "@/checkpoint/components/seat/seatMapCanvas/useLayoutDocument";
import { BackToEventDetailButton } from "@/checkpoint/components/utils/back-to-event-detail-button";
import {
  AppendTableSeatsDocument,
  AutoGenerateSeatMapDocument,
  CloneSectionDocument,
  CreateSectionDocument,
  CreateTableDocument,
  DeleteSeatDocument,
  DeleteSectionDocument,
  DeleteTableDocument,
  DuplicateTableDocument,
  MoveSeatDocument,
  MoveSectionDocument,
  MoveTableDocument,
  RedoLayoutDocument,
  RenameSectionDocument,
  RenameTableDocument,
  SeatMapViewDocument,
  type SeatMapViewQuery,
  type SectionShape,
  type TableShape,
  UndoLayoutDocument,
  UpdateSectionDocument,
} from "@/checkpoint/generated/graphql";
import useEventTreeQuery from "@/checkpoint/hooks/events/useEventTreeQuery";
import useSeatListQuery from "@/checkpoint/hooks/seat/useSeatListQuery";
import { useSeats } from "@/checkpoint/hooks/seat/useSeats";
import { EventPermissionKey } from "@/checkpoint/lib/rbac/event-permissions";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useAuth } from "@/checkpoint/providers/AuthProvider";

function createDefaultSectionName(sections: SeatMapViewQuery["seatLayout"]): string {
  const existing = new Set(sections.map((s) => s.name));
  for (let i = 1; i <= 100; i++) {
    const name = `Section ${i}`;
    if (!existing.has(name)) {
      return name;
    }
  }
  return `Section ${sections.length + 1}`;
}

function createDefaultTableName(tables: { name: string }[]): string {
  const existing = new Set(tables.map((t) => t.name));
  for (let i = 1; i <= 100; i++) {
    const name = `${i}`;
    if (!existing.has(name)) {
      return name;
    }
  }
  return `${tables.length + 1}`;
}

function findFreeTablePosition(
  section: { id: string; width: number | null; height: number | null },
  document: NonNullable<ReturnType<typeof useLayoutDocument>>["document"],
) {
  const width = section.width ?? 400;
  const height = section.height ?? 300;
  const tableWidth = 100;
  const tableHeight = 60;
  const nodes = document ? Object.values(document.nodes) : [];
  for (let y = -height / 2 + 50; y <= height / 2 - 50; y += 100) {
    for (let x = -width / 2 + 70; x <= width / 2 - 70; x += 140) {
      const worldX = (nodes.find((node) => node.id === section.id)?.x ?? 0) + x;
      const worldY = (nodes.find((node) => node.id === section.id)?.y ?? 0) + y;
      const collides = nodes.some(
        (node) =>
          node.kind === "TABLE" &&
          node.sectionId === section.id &&
          Math.abs(node.x - worldX) < (node.width + tableWidth) / 2 + 16 &&
          Math.abs(node.y - worldY) < (node.height + tableHeight) / 2 + 16,
      );
      if (!collides) return { x, y };
    }
  }
  return null;
}

const EMPTY_LAYOUT: SeatMapViewQuery["seatLayout"] = [];
export default function SeatMapClientPage() {
  const { id } = useParams();
  return <SeatMapEvent key={id as string} eventId={id as string} />;
}
function SeatMapEvent({ eventId }: { eventId: string }) {
  const { currentUser } = useAuth();
  const { activeRole, can } = useActiveEvent();

  const { fullEventTree } = useEventTreeQuery({
    eventId,
    loadFullEventTreeInfo: true,
  });

  const seatColorGroups = React.useMemo(
    () => fullEventTree?.rootEvent?.settings?.seatColorGroups ?? [],
    [fullEventTree],
  );

  const { seatList } = useSeatListQuery({
    eventId,
    loadSeatList: true,
  });

  const { seats, getSeatHolderLabel, getSeatHolderName } = useSeats(eventId);

  const {
    data: mapData,
    loading: mapLoading,
    error: queryError,
    refetch: refetchMap,
  } = useQuery<SeatMapViewQuery>(SeatMapViewDocument, {
    variables: { eventId },
    fetchPolicy: "cache-and-network",
  });

  const [createSection] = useMutation(CreateSectionDocument);
  const [createTable] = useMutation(CreateTableDocument);
  const [appendTableSeats] = useMutation(AppendTableSeatsDocument);
  const [updateSection] = useMutation(UpdateSectionDocument);
  const [deleteSection] = useMutation(DeleteSectionDocument);
  const [deleteTable] = useMutation(DeleteTableDocument);
  const [deleteSeat] = useMutation(DeleteSeatDocument);
  const [duplicateTable] = useMutation(DuplicateTableDocument);
  const [cloneSection] = useMutation(CloneSectionDocument);
  const [moveSeat] = useMutation(MoveSeatDocument);
  const [moveTable] = useMutation(MoveTableDocument);
  const [moveSection] = useMutation(MoveSectionDocument);
  const [autoGenerate] = useMutation(AutoGenerateSeatMapDocument);
  const [undoLayout] = useMutation(UndoLayoutDocument);
  const [redoLayout] = useMutation(RedoLayoutDocument);
  const [renameSection] = useMutation(RenameSectionDocument);
  const [renameTable] = useMutation(RenameTableDocument);

  const [editorMode, setEditorMode] = React.useState<EditorMode>("view");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const persistLayout = React.useCallback<PersistLayoutOperation>(
    async (operation) => {
      const node = operation.after.nodes[operation.nodeId];
      const before = operation.before.nodes[operation.nodeId];
      if (!node || !before) return;
      if (
        node.kind === "SECTION" &&
        before.kind === "SECTION" &&
        (node.width !== before.width || node.height !== before.height)
      ) {
        await updateSection({
          variables: {
            input: {
              id: node.id,
              x: node.x,
              y: node.y,
              width: node.width,
              height: node.height,
              capacity: null,
              meta: null,
              name: null,
              order: null,
              shape: null,
            },
          },
        });
        return;
      }
      const input = exportMove(operation.after, node.id);
      if (node.kind === "SECTION") await moveSection({ variables: { input } });
      else if (node.kind === "TABLE") await moveTable({ variables: { input } });
      else await moveSeat({ variables: { input: { ...input, rotation: null } } });
    },
    [moveSection, moveTable, moveSeat, updateSection],
  );
  const layout = useLayoutDocument(eventId, mapData?.seatLayout ?? EMPTY_LAYOUT, persistLayout);
  const draftLayout = useLocalLayoutDraft(eventId, layout.document, layout.move);
  useDraftLossWarning(draftLayout.isLocal);
  const selectedItems = React.useMemo<SelectedItem[]>(
    () =>
      selectedIds.flatMap((id): SelectedItem[] => {
        const node = draftLayout.document?.nodes[id];
        if (!node) return [];
        if (node.kind === "SECTION") return [{ type: "section", id, name: node.name }];
        if (node.kind === "TABLE")
          return [{ type: "table", id, name: node.name, sectionId: node.sectionId }];
        return [{ type: "seat", id, label: String(node.number ?? "") }];
      }),
    [selectedIds, draftLayout.document],
  );
  const selectedSingleNode = React.useMemo(() => {
    const only = selectedItems[0];
    if (selectedItems.length !== 1 || !only) return null;
    return draftLayout.document?.nodes[only.id] ?? null;
  }, [selectedItems, draftLayout.document]);
  const colorGroups = React.useMemo(
    () =>
      new Map(
        (mapData?.seatLayout ?? [])
          .flatMap((section) => [
            ...section.seats,
            ...section.tables.flatMap((table) => table.seats),
          ])
          .map((seat) => [seat.id, seat.colorGroup]),
      ),
    [mapData],
  );
  const [actionPending, setActionPending] = React.useState(false);
  const actionFlight = React.useRef(false);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const blocked = layout.pending || actionPending;
  const runAction = async (action: () => Promise<void>) => {
    if (blocked || draftLayout.isLocal || actionFlight.current) return;
    actionFlight.current = true;
    setActionPending(true);
    setActionError(null);
    try {
      await action();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Aktion fehlgeschlagen.");
    } finally {
      actionFlight.current = false;
      setActionPending(false);
    }
  };
  const handleSetShape = (shape: string) => {
    const node = selectedSingleNode;
    if (!node || !draftLayout.document || actionFlight.current) return;
    const after = setNodeShape(draftLayout.document, node.id, shape);
    if (after !== draftLayout.document)
      draftLayout.localApply({ nodeId: node.id, before: draftLayout.document, after });
  };
  const handleMakeTableSquare = () => {
    const node = selectedSingleNode;
    if (!node?.kind || node.kind !== "TABLE" || !draftLayout.document || actionFlight.current)
      return;
    const size = Math.max(node.width, node.height);
    const after = setNodeShape(draftLayout.document, node.id, "RECTANGLE", size, size);
    if (after !== draftLayout.document)
      draftLayout.localApply({ nodeId: node.id, before: draftLayout.document, after });
  };
  const [autoGenerateOpen, setAutoGenerateOpen] = React.useState(false);
  const [addSeatsOpen, setAddSeatsOpen] = React.useState(false);
  const [renameOpen, setRenameOpen] = React.useState(false);

  const [filters, setFilters] = React.useState<SeatMapFilters>({
    search: "",
    presence: "all",
  });

  const presenceMap = React.useMemo(() => {
    const map = new Map<string, NonNullable<SeatMapViewQuery["seatPresencesByEvent"]>[number]>();
    if (!mapData?.seatPresencesByEvent) {
      return map;
    }
    for (const p of mapData.seatPresencesByEvent) {
      map.set(p.seatId, p);
    }
    return map;
  }, [mapData]);

  const highlightedSeatIds = React.useMemo(() => {
    const searchTerm = filters.search.toLowerCase().trim();
    const hasSearch = searchTerm.length > 0;
    const hasPresenceFilter = filters.presence !== "all";

    if (!hasSearch && !hasPresenceFilter) {
      return undefined;
    }

    const result = new Set<string>();

    for (const s of seatList ?? []) {
      let match = true;

      if (hasSearch) {
        const holderName = getSeatHolderName(s.guestId ?? s.invitationId).toLowerCase();
        match =
          (s.number?.toString() ?? "").includes(searchTerm) ||
          (s.section.name ?? "").toLowerCase().includes(searchTerm) ||
          (s.table?.name ?? "").toLowerCase().includes(searchTerm) ||
          (s.label ?? "").toLowerCase().includes(searchTerm) ||
          holderName.includes(searchTerm);
      }

      if (match && hasPresenceFilter) {
        const p = presenceMap.get(s.id);
        switch (filters.presence) {
          case "free":
            match = !p && !s.guestId && !s.invitationId;
            break;
          case "occupied":
            match = Boolean(s.guestId) || Boolean(s.invitationId);
            break;
          case "INSIDE":
            match = p?.presenceState === ("INSIDE" as NonNullable<typeof p>["presenceState"]);
            break;
          case "revoked":
            match = p?.revoked === true;
            break;
        }
      }

      if (match) {
        result.add(s.id);
      }
    }

    return result;
  }, [filters, seatList, getSeatHolderName, presenceMap]);

  const ownSeatIds = React.useMemo(() => {
    if (!currentUser?.id || !seatList) {
      return new Set<string>();
    }
    return new Set(
      seatList
        .filter((s): s is typeof s & { guestId: string } => s.guestId === currentUser.id)
        .map((s) => s.id),
    );
  }, [currentUser, seatList]);

  // ── Editor Actions ──

  const isAdmin = can(EventPermissionKey.ManageSeats);

  const handleModeToggle = () => {
    const next = editorMode === "view" ? "edit" : ("view" as EditorMode);
    setEditorMode(next);
    if (next === "view") {
      setSelectedIds([]);
    }
  };

  const handleAddSection = async () => {
    if (!mapData) {
      return;
    }
    const name = createDefaultSectionName(mapData.seatLayout);
    await createSection({
      variables: {
        input: {
          eventId,
          name,
          x: 50,
          y: 50,
          capacity: null,
          height: null,
          width: null,
          meta: null,
          order: null,
        },
      },
    });
    await refetchMap();
    setSelectedIds([]);
  };

  const handleAddTable = async () => {
    if (!mapData) {
      return;
    }
    const sections = mapData.seatLayout;
    if (sections.length === 0) {
      await handleAddSection();
      return;
    }
    const sectionSelection = selectedItems.find((s) => s.type === "section");
    const targetSectionId = sectionSelection?.id;
    if (!targetSectionId) {
      return;
    }
    const section = sections.find((s) => s.id === targetSectionId);
    if (!section) return;
    const position = findFreeTablePosition(section, draftLayout.document);
    if (!position)
      throw new Error("Kein freier Platz in dieser Section. Bitte vergrößern Sie die Section.");
    const tableName = createDefaultTableName(section?.tables ?? []);
    await createTable({
      variables: {
        input: {
          eventId,
          sectionId: targetSectionId,
          name: tableName,
          x: position.x,
          y: position.y,
          width: 100,
          height: 60,
          capacity: null,
          meta: null,
          order: null,
          rotation: null,
          shape: null,
        },
      },
    });
    await refetchMap();
    setSelectedIds([]);
  };

  const handleDelete = async () => {
    if (selectedItems.length === 0) {
      return;
    }
    for (const item of selectedItems) {
      if (item.type === "section") {
        await deleteSection({ variables: { sectionId: item.id } });
      } else if (item.type === "table") {
        await deleteTable({ variables: { tableId: item.id } });
      } else if (item.type === "seat") {
        await deleteSeat({ variables: { seatId: item.id } });
      }
    }
    await refetchMap();
    setSelectedIds([]);
  };

  const handleDuplicateTable = async () => {
    const table = selectedItems.find((s) => s.type === "table");
    if (!table || selectedItems.length !== 1) {
      return;
    }
    await duplicateTable({
      variables: {
        input: { tableId: table.id, offsetX: 60, offsetY: 60 },
      },
    });
    await refetchMap();
  };

  const handleCloneSection = async () => {
    const section = selectedItems.find((s) => s.type === "section");
    if (!section || selectedItems.length !== 1) {
      return;
    }
    await cloneSection({
      variables: {
        input: { sectionId: section.id, offsetX: 100, offsetY: 100 },
      },
    });
    await refetchMap();
  };
  const selectedTable = React.useMemo(() => {
    const selection = selectedItems.length === 1 ? selectedItems[0] : null;
    if (selection?.type !== "table") return null;
    for (const section of mapData?.seatLayout ?? []) {
      const table = section.tables.find((candidate) => candidate.id === selection.id);
      if (table) return { ...table, seatCount: table.seats.length };
    }
    return null;
  }, [mapData, selectedItems]);
  const handleAddSeats = async (count: number) => {
    if (!selectedTable) return;
    await appendTableSeats({ variables: { input: { tableId: selectedTable.id, count } } });
    await refetchMap();
    setAddSeatsOpen(false);
  };

  const handleAutoGenerate = async (input: {
    sectionName: string;
    seatCount: number;
    tableCount: number;
    tableShape: TableShape;
    sectionLayout: SectionShape;
    spacing: number;
  }) => {
    await autoGenerate({ variables: { input: { eventId, ...input } } });
    await refetchMap();
    setAutoGenerateOpen(false);
  };

  const handleUndo = async () => {
    await undoLayout({ variables: { eventId } });
    await refetchMap();
  };

  const handleRedo = async () => {
    await redoLayout({ variables: { eventId } });
    await refetchMap();
  };

  const handleRename = async (
    updates: { id: string; type: SelectedItem["type"]; newName: string }[],
  ) => {
    for (const u of updates) {
      if (u.type === "section") {
        await renameSection({ variables: { input: { sectionId: u.id, newName: u.newName } } });
      } else if (u.type === "table") {
        await renameTable({ variables: { input: { tableId: u.id, newName: u.newName } } });
      }
    }
    await refetchMap();
  };

  return (
    <RouteGuard featureId="seat-map">
      <Stack spacing={1} sx={{ height: "100dvh", overflow: "hidden", position: "relative" }}>
        <Box
          sx={{
            position: "relative",
            zIndex: 50,
            px: { xs: 1.5, md: 3 },
            py: 1,
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <BackToEventDetailButton />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, flexGrow: 1 }}>
              Sitzplan
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
              <Chip size="small" label="frei" sx={{ bgcolor: "grey.900", color: "grey.100" }} />
              <Chip size="small" label="belegt" color="error" />
              <Chip size="small" label="eingecheckt" color="info" />
              <SeatColorLegend colorGroups={seatColorGroups} />
            </Stack>
          </Box>

          <SeatMapSearch
            filters={filters}
            onChange={(v) => setFilters(v)}
            {...(highlightedSeatIds ? { resultCount: highlightedSeatIds.size } : {})}
          />
        </Box>

        {isAdmin && (
          <SeatMapEditorToolbar
            disabled={blocked || draftLayout.isLocal}
            importDisabled={blocked}
            mode={editorMode}
            onModeToggle={handleModeToggle}
            selectedItems={selectedItems}
            onAddSection={() => void runAction(handleAddSection)}
            onAddTable={() => void runAction(handleAddTable)}
            onAddSeats={() => setAddSeatsOpen(true)}
            onDelete={() => void runAction(handleDelete)}
            onDuplicateTable={() => void runAction(handleDuplicateTable)}
            onCloneSection={() => void runAction(handleCloneSection)}
            onAutoGenerate={() => setAutoGenerateOpen(true)}
            onRename={() => setRenameOpen(true)}
            onUndo={() => void runAction(handleUndo)}
            onRedo={() => void runAction(handleRedo)}
            selectedShape={selectedSingleNode?.shape ?? null}
            onSetShape={handleSetShape}
            onMakeTableSquare={handleMakeTableSquare}
            geometryDisabled={blocked}
          />
        )}

        {draftLayout.isLocal && (
          <Alert
            severity="warning"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  if (
                    window.confirm(
                      "Lokalen Entwurf verwerfen? Alle nicht gespeicherten Änderungen gehen verloren.",
                    )
                  ) {
                    draftLayout.discard();
                    setSelectedIds([]);
                  }
                }}
              >
                Verwerfen
              </Button>
            }
          >
            Lokaler Entwurf – nicht gespeichert
          </Alert>
        )}
        {(queryError || layout.error || actionError) && (
          <Alert severity="error">{queryError?.message ?? layout.error ?? actionError}</Alert>
        )}
        {!mapData && mapLoading ? (
          <CircularProgress aria-label="Sitzplan laden" />
        ) : (
          draftLayout.document && (
            <SeatMapCanvas
              document={draftLayout.document!}
              presenceMap={presenceMap}
              colorGroups={colorGroups}
              seats={seats}
              getSeatHolderLabel={getSeatHolderLabel}
              role={activeRole ?? "GUEST"}
              highlightedSeatIds={highlightedSeatIds}
              ownSeatIds={ownSeatIds}
              isEditing={editorMode === "edit" && isAdmin}
              selectedIds={selectedIds}
              onSelect={setSelectedIds}
              onMove={(operation) => {
                if (!actionFlight.current) void draftLayout.move(operation);
              }}
              onResize={(operation) => {
                if (actionFlight.current) return;
                const kind = operation.after.nodes[operation.nodeId]?.kind;
                if (kind === "SECTION") void draftLayout.resize(operation);
                else if (kind) draftLayout.localApply(operation);
              }}
              onRotate={(operation) => {
                if (!actionFlight.current) draftLayout.localApply(operation);
              }}
              pending={blocked}
            />
          )
        )}

        {draftLayout.document && (
          <SeatMapCreateDialog
            open={autoGenerateOpen}
            onClose={() => setAutoGenerateOpen(false)}
            eventId={eventId}
            document={draftLayout.document}
            onAccept={(operation) => {
              if (actionFlight.current || layout.pending)
                throw new Error("Bitte die laufende Speicherung abwarten.");
              draftLayout.accept(operation);
              setSelectedIds([]);
            }}
            pending={blocked}
            presetDisabled={draftLayout.isLocal}
            onGenerate={(input) => void runAction(() => handleAutoGenerate(input))}
          />
        )}

        <SeatMapRenameDialog
          open={renameOpen}
          selectedItems={selectedItems}
          onClose={() => setRenameOpen(false)}
          onRename={(updates) => runAction(() => handleRename(updates))}
        />
        <SeatMapAddSeatsDialog
          open={addSeatsOpen && Boolean(selectedTable)}
          tableName={selectedTable?.name ?? ""}
          currentCount={selectedTable?.seatCount ?? 0}
          pending={blocked}
          onClose={() => setAddSeatsOpen(false)}
          onConfirm={(count) => runAction(() => handleAddSeats(count))}
        />
      </Stack>
    </RouteGuard>
  );
}
