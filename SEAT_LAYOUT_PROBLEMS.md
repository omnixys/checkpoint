# Seat Layout — belegte Ursachen

Stand: Ausgangscode 2026-09-09. Statische Befunde, keine behaupteten Browser-Messungen. F = `projects/checkpoint/src`, B = `services/seat/src`. Symbole sind zusätzlich angegeben, damit Referenzen nach Änderungen auffindbar bleiben.

| Problem | Konkrete Ursache / Quelle | Reproduktion bzw. Folge |
| --- | --- | --- |
| Koordinatenversatz | F/components/seat/seatMapCanvas/SeatMapCanvas.tsx: Section links = center − halfSize; Table links = relativeCenter − halfSize, aber kein Ausgleich für Section-Halbdimension | Section (500,400), 400×300, Table (0,0) landet bei (300,250) statt (500,400). Seats verlieren zusätzlich die halben Tischdimensionen. |
| Debug widerspricht Darstellung | SeatMapDebugOverlay.tsx `findTableAtPoint` addiert Section+Table korrekt, Canvas tut dies nicht | Debug und sichtbarer Tisch zeigen unterschiedliche Positionen. |
| Rotation | SeatMapCanvas.tsx Table/Section-SX liest rotation nicht | gespeicherte Table-/Section-Rotation wird ignoriert; SeatNode rotiert nur seinen eigenen Button. |
| Bounds/Fit | SeatMapCanvas.tsx `bounds`, `fitToScreen`, Fit-Effekt | Seats und Rotation fehlen; bei vorhandenen Section-Dimensionen werden Kind-Extents ignoriert. Scale wird geclamped, Translation aber mit ungeclampter Scale berechnet. Jede Layoutänderung löst erneut Fit aus. |
| Drag-Performance | SeatMapCanvas.tsx `handleMouseMove` → setDragOffset; außerhalb Drag immer setMouseCanvasPos | gesamter Section/Table/Seat-Baum wird bei jedem Event durchlaufen, auch bei ausgeschaltetem Debug. Keine Laufzeit-FPS-Messung durchgeführt. |
| Drag-Abschluss | `onItemMouseDown`, `handleMouseUp`, `onMouseLeave` | kein Distanzschwellwert, kein Pointer Capture, keine Cancel-Semantik; einfacher Click kann persistieren, Verlassen beendet Drag. Keine Backend-Requests pro dragmove: dies ist bereits korrekt. |
| Selection | `handleItemClick` und `handleMouseDown` getrennt | Auswahl erst nach Drag; leere Canvas leert Auswahl nicht; Maus auf Control kann Pan auslösen. |
| Multi-Selection | zentraler SelectedItem[]-State; Ctrl/Cmd-Toggle vorhanden | Shift/Marquee fehlen; DragState hält genau eine ID; kein Multi-Drag, kein gemeinsamer Transform. |
| Duplicate-Funktionalität | SeatMapClientPage.tsx `handleDuplicateTable`, `handleCloneSection`; Toolbar Single-Guards | nur genau ein Tisch oder eine Section; Seats/Mixed Selection unsupported; Klon wird nicht ausgewählt. |
| Duplicate-Drift | B/layout/services/layout-write.service.ts `duplicateTable`, `cloneSection` | gleicher Offset an Parent und relativen Kindern: Tisch-Seats wandern doppelt, Section-Table-Seats dreifach. |
| Duplicate-Datenverlust | dieselben Methoden | Shape/Dimensionen/Rotation fehlen teils; freie Section-Seats werden nicht geladen; `_copy` verletzt bei Wiederholung Unique-Name-Constraint; mehrere Writes ohne gemeinsame Transaktion. |
| Undo | LayoutWriteService `undo`, `moveSeat/moveTable/moveSection` | ohne Cursor immer derselbe Vorgänger der höchsten Version; Moves erzeugen keine Version; Create/Delete ebenfalls nur Logs. |
| Redo | LayoutWriteService `redo` | sucht version > höchste Version; kann unter stabiler DB keinen Nachfolger finden. |
| Restore | LayoutWriteService `restoreVersion` | Delete/Recreate ohne explizite IDs: Identität geht verloren; guestId/invitationId fehlen; freie Seats werden wegen fehlendem Table-Mapping verworfen. |
| Snapshot | B/layout/utils/snapshot-serializer.ts | Table-Dimensionen/Shape/Rotation und weitere Felder fehlen. seatType wird gegen SeatStatus geprüft; nullable tableId wird in erfundene cuid2-ID umgewandelt. UUID-DB-Contract und cuid2-Fallback widersprechen einander. |
| Shape Change/Transform | Frontend Canvas/Toolbar/Route | keine Properties, Resize-/Rotationsinteraktion oder Change-Shape-Operation implementiert. Es gibt keine Konva-Scales zu normalisieren. |
| Generator-Shape | B/layout/utils/geometry-engine.ts `getTablePositions`, `generateSeats`, `generateTables` | Switches erwarten lowercase grid/circle/u/etc.; DTOs liefern uppercase Enums. Seat-Anordnung wird aus SeatShape statt TableShape gewählt. Rechteck/Oval fallen auf Kreis zurück. |
| Generator-Anzahl | LayoutWriteService `autoGenerateSeatMap` | ceil(seatCount/tableCount) pro Tisch produziert zu viele Plätze, z.B. 10/3 → 12. tableCount=0 wird im Input nicht validiert. spacing wird ignoriert. |
| Generator-Persistenz | LayoutWriteService `autoGenerate`, `writeGeometry` | Löschen außerhalb Write-Transaktion; Geometry-Fehler kann leeres Layout hinterlassen. Table-Mapping sucht Name global statt innerhalb Section; Shape/Dimensionen fehlen in Writes. |
| Generator-Bounds | GeometryEngine `computeSectionBounds` | berücksichtigt nur Tischkörper, keine Seats; asymmetrische Extents werden um falschen Mittelpunkt gepackt. |
| Weitere Generatoren | B/layout/utils/shape/{gala,horseshoe,u,spiral,vip}.shape.ts | Gala/Horseshoe teilen bei count=1 durch 0; U kann Ecken doppelt belegen/Count unterschreiten; Spiral-Rotation in Radiant statt Grad; VIP liefert bei count=0 einen Seat. Diese Pfade derzeit nicht aktiv. |
| Load-Dimensionen | B/table/models/mappers/table.mapper.ts `toPayload` | width/height fehlen trotz DB-Feldern und GraphQL-Payload; gespeicherte Größen kommen im Query nicht an. |
| Mutation-Contract | B/layout/resolvers/layout-mutation.resolver.ts `moveTable`, `moveSection` | Return-Dekorator SeatPayload statt TablePayload/SectionPayload; falsches __typename verhindert korrekte Apollo-Normalisierung. |
| Viewer-Status | F/components/seat/seatMapCanvas/SeatNode.tsx | status aus Query wird nicht übergeben/ausgewertet; RESERVED/BLOCKED können als frei aussehen. Farbgruppen haben Priorität vor Presence; Status darf nicht nur durch Farbe vermittelt werden. SOLD fehlt fachlich. |
| UI/UX | SeatMapClientPage.tsx Rückgabe; SeatMapEditorToolbar.tsx; DebugOverlay | absolute überlagernde Controls, keine Layers/Properties, 9px Auswahltext; Blur widerspricht DESIGN.md; dichte Header-Inhalte ohne passende mobile Umordnung. |
| Fehler/Save | SeatMapClientPage.tsx alle Action-Catches | Fehler werden verschluckt; kein Speichern-/Dirty-/Konfliktzustand; Multi-Delete kann teilweise erfolgreich sein. |
| API-Performance | B/layout/services/layout-read.service.ts + Section/Table-Mapper und FieldsResolver | Relations eager geladen, im Mapper verworfen und erneut per Resolver gelesen. Kein DataLoader im Layoutpfad. |

## Grenzen der Aussagen

Keine nachgewiesene doppelte Sitzdarstellung im GraphQL-Viewer: SectionFieldsResolver filtert freie Seats explizit. Keine behaupteten Konva-/Fabric-Probleme: beide Libraries fehlen. Keine bestehenden Snap Guides oder Transformer. Keine Behauptung, Kamera werde direkt in DB-Koordinaten geschrieben: Hauptfehler ist der falsche Parent-Ursprung. Keine Performancezahlen ohne Browserprofil.

## Regressionen, die vor Abschluss nachzuweisen sind

- Mittelpunkt bei verschachtelten Sections/Tables/Seats, Rotation und asymmetrische Bounds.
- World-Bewegung +100 bei Scale 0.5/1/2 und positiver/negativer Translation.
- Eine History-Operation pro Geste, keine Mutation während Pointermove, Cancel ohne Dokumentänderung.
- Gemischte Parent/Child-Auswahl bewegt/dupliziert jedes Element genau einmal.
- Wiederholtes Duplicate: eindeutige IDs/Namen, remappte Parents, freie Seats, kein kopierter Inhaber.
- Undo/Redo mit Branch nach Undo, erhaltene Sitz-IDs und Zuordnungen beim Save.
- Kreis/Rechteck/Dreieck/Oval, 0/1/viele Seats, exakte Gesamtzahl, gültige endliche Geometrie.
- Roundtrip, atomarer Save, Konflikte, falsche Event-IDs, fremde IDs, Assignments während Save.
- Viewer RESERVED/ASSIGNED/BLOCKED, Presence und Farbgruppen; responsive Browseransicht.

## Implementierte Phasen 1–3 (2026-09-09)

Die vorausgehende Analyse beschreibt den Ausgangszustand. Der Frontend-Adapter normalisiert nun Section-, Table- und Seat-Mittelpunkte in ein ID-Record-World-Dokument. Editor und Viewer rendern flach. Die Route hält ausschließlich ausgewählte IDs; vorhandene Aktionen bleiben angebunden. Kamera-Fit wird nach initialem Laden nicht durch Bewegungen oder Refetch ausgelöst. Die Move-Persistenz sperrt parallele Dokumentänderungen und setzt lokale Geometrie bei Fehler zurück.

Rotation: Grad um den eigenen Mittelpunkt, positive Winkel im Bildschirmkoordinatensystem im Uhrzeigersinn. Parent-Rotation wird bei Bestandsdaten weder auf Kindpositionen noch auf Kindwinkel vererbt. Parent-Bewegung verschiebt Nachfahren einmal und erhält Backend-Offsets.

Die erweiterten Transform-, History-, Duplicate- und Atomic-Save-Vorschläge sind spätere Phasen. Wiederherstellbare Sicherung: `../../work-in-progress/seat-layout-later-phases-20260909`.
