# Seat Layout — Ziel und Migration

Status: Architekturentscheidung vor Implementierung, kein Fertigstellungsnachweis.

## Entscheidungen

| Bestehender Bereich | Entscheidung | Begründung |
| --- | --- | --- |
| Next/React/MUI/Apollo und Checkpoint Theme | KEEP | Vorhandenes Setup genügt. Keine zusätzliche State-/Canvas-/UI-Library. |
| SeatMap-Route, Filter, Presence, Inhaber, Farbgruppen | REFACTOR | Fachliche Datenbeschaffung erhalten; Editor-Aktionen an lokalen Core anbinden. |
| SeatNode und gemeinsamer Editor/Viewer-Renderer | REFACTOR | World-Positionen, Status, Auswahl, Interaktionsadapter; ein Renderer. |
| Canvas-Interaktionskern | REPLACE (begrenzt) | Mousedown/Click/State-Kopplung verhindert kohärente Multi-Gesten; Pointer-Transaktionen separat. |
| Toolbar und Inspector/Layers | REFACTOR/ADD | Kompakte Theme-basierte Werkzeugleiste, kontextabhängige Properties und einklappbare Hierarchie. |
| LayoutWriteService als Sitzzuweisungs-Abhängigkeit | KEEP | Fachliche Seat-Zuordnung und Kafka-Integration bleiben intakt. |
| Frontend-Aufrufe historischer Server-Undo/Redo | REPLACE | Lokale Document-History mit einer Operation pro Aktion. Server-Versionen sind Save-Historie. |
| Relative Datenbankkoordinaten | KEEP über Adapter | Bestehende Daten und andere Verbraucher nicht stillschweigend umdeuten. |
| Aktiver Generator | REFACTOR | Reine Geometrie, exakte Counts, Formnormalisierung, Grenzen/Spacing. |
| Inaktive Sondergeneratoren | KEEP vorerst | Nicht ohne Verbraucheranalyse entfernen; Default-Generatoren nicht daran koppeln. |
| Schematische Zuweisungs-/Listenansicht | KEEP | Eigener fachlicher Zweck; nicht als geometrischen Venue-Viewer verkaufen. |

## Document Model

Normalisiertes immutable LayoutDocument mit Schema-Version, Nodes nach ID und deterministischer Reihenfolge. Ein Node enthält UUID, kind (section/table/seat), name/number, sectionId/tableId, x/y, width/height, rotation und Shape. Metadaten bleiben erhalten. Fachliche Belegung/Presence wird separat eingeblendet und nie durch Duplicate kopiert. Keine Apollo-/DOM-Objekte im Dokument.

World Space ist kanonisch im Editor: x/y immer Mittelpunkt. Fachliche Parent-IDs erzwingen keine Canvas-Verschachtelung. Parent-Bewegungen verschieben Nachfahren explizit genau einmal. Für Bestandsdaten werden Parent-Rotationen nicht auf Kindpositionen oder Kindwinkel vererbt. Winkel sind Grad, positiv im Bildschirmkoordinatensystem im Uhrzeigersinn, um den eigenen Mittelpunkt. Explizite Gruppenrotation bleibt einer späteren Phase vorbehalten.

## Koordinatenadapter

Current: relative DB-Mittelpunkte → fehlerhafte DOM-Offsets.
Migration: relative DB-Mittelpunkte → expliziter Importadapter → World-Dokument → flacher Renderer.
Target: World-Dokument → inverser Exportadapter → kompatible relative DB-Mittelpunkte.

Bestehende Winkelkonvention muss beim Import explizit festgelegt werden. Bisher waren Parent-Winkel visuell wirkungslos: nicht ohne dokumentierten Migrationstest alte Kindpositionen umdeuten. Eine alternative endgültige World-Persistenz benötigt eine markierte Contract-/Datenmigration; keine globale Neuinterpretation von x/y.

CameraState = {x,y,scale}. screenToWorld = (screen − camera.translation)/scale; worldToScreen invers. Client-Koordinaten werden genau einmal um containerRect bereinigt. Zoom behält den World-Punkt unter dem Pointer bzw. Viewport-Mittelpunkt bei. Fit berechnet Bounds einschließlich Rotation/Seats und nutzt denselben geclampten Scale-Wert für Translation. Initial-Fit einmal pro geladenem Event; danach nur explizit oder passend bei initialem Resize.

## State-Grenzen

- LayoutDocument: serialisierbare Geometry/Identitäten/Metadaten.
- EditorState: selectedIds, hover, tool/mode, offene Panels.
- InteractionState: Refs für Pointer-ID, Startkamera, Startpunkte, originale Nodes, aktuelle Vorschau und Marquee.
- CameraState: separate Kamera, außerhalb der History.
- HistoryState: past/present/future; begrenzte immutable Snapshots, strukturelles Teilen unveränderter Nodes.
- PersistenceState: geladene Revision/Baseline, Dirty, Saving, Fehler/Konflikt.

## Commands und Gesten

MOVE_NODES, CREATE_NODES, DELETE_NODES, DUPLICATE_NODES, TRANSFORM_NODES, CHANGE_SHAPE, GENERATE_SEATS. Canvas, Keyboard, Toolbar, Layers und Inspector nutzen dieselbe Command-Funktion. No-op erzeugt keine History. Undo entfernt genau die letzte Dokumentaktion; Redo stellt sie wieder her. Neue Aktion nach Undo leert Future. Selection wird auf existierende IDs bereinigt und erzeugt selbst keine History.

Pointerdown merkt unveränderte Startpositionen. Pointermove aktualisiert nur visuelle Nodes über Registry/Refs, bei Bedarf requestAnimationFrame; kein Layout-State/GraphQL pro Event. Pointerup committed genau einen Command. Pointercancel/Escape stellt Originale her. Pointer Capture erhält die Geste außerhalb der Canvas. Delta immer relativ zum Start, nie kumulativ. Scale/Rotation normalisieren auf Dimensionen/Grad; keine transienten Scales speichern.

Click: Single; Ctrl/Cmd: Toggle; Shift: additive Auswahl; leere Fläche: Clear; Marquee: Multi. Leertaste oder Pan-Tool: Pan. Tastatur nur innerhalb des Editors und nicht in Texteingaben: Undo/Redo, Duplicate, Delete, Escape, Pfeile. Gleichwertige Buttons und numerischer Inspector.

## Duplicate, Shapes und Generatoren

UUIDs einmalig im Command erzeugen. Transitive ausgewählte Subtrees vereinigen; vollständige ID-Map zuerst aufbauen; Parents remappen; jeden World-Punkt einmal versetzen. Namen im jeweiligen Parent-Scope eindeutig halten. Seat-Inhaber/Presence nicht kopieren; Klone auswählen.

Generatoren sind reine Funktionen: Input-Geometry → Punkte in lokalen Generator-Koordinaten → Rotation/Translation nach World → Nodes. Kreis gleichmäßige Winkel, Oval gleichmäßige Bogenlänge, generischer Polygon-Perimeter für Rechteck/Dreieck/Custom Polygon. ROW und bestehende Formen erhalten. Ungültige/negative/nicht-endliche Werte ablehnen; count=0/1 testen. Form/Dimensionen/SeatCount/Spacing ändern Geometrie in einer Aktion. Vorhandene Sitzidentitäten soweit möglich beibehalten, insbesondere belegte Sitze nicht durch Regeneration ersetzen.

## Persistenz und Contract

Explizites Save als atomare Änderung eines gesamten Layouts; keine Einzelrequests pro Node. Additiver, versionierter Contract mit Event-ID, erwarteter Revision und validiertem Document. Server liest Event-Zugriff aus authentifizierter Identität. IDs/Parents werden vollständig gegen das autorisierte Event geprüft. Optimistische Konkurrenzprüfung schützt andere Editor-Sessions; Transaktion schützt Teilzustände.

Bestehende Rows aktualisieren, neue Rows mit neuen UUIDs erstellen, gezielte Löschungen statt Delete/Recreate. Vorhandene guestId/invitationId/SeatStatus/Presence unangetastet lassen; entfernte belegte Sitze konfliktbehaftet behandeln. Save-Historie mit stabilen IDs und vollständiger Geometry. Unbekannte Shapes nicht stillschweigend in Kreise umwandeln. Dreieck erfordert kompatible Erweiterung oder explizite versionierte Shape-Metadaten — im Contract dokumentieren und testen.

GraphQL-Operations als .graphql, Codegen aus Quellen; additive Schema-Änderung samt Gateway-Komposition und Offline-Schemaquelle prüfen. Keine handgeschriebenen Generated-Dateien. Bestandsmutationen nicht versehentlich brechen.

## Renderer und UX

Gemeinsamer World-Renderer für Editor und Viewer. Viewer benötigt nur Document + Belegung/Presence + Kamera. Keine History-/Selection-Provider-Pflicht. AVAILABLE/RESERVED/ASSIGNED/BLOCKED aus Domain, dazu Presence; SOLD nur bei künftigem echtem Contract. Text/Legende/Statussymbol ergänzen Farbe.

Editor integriert sich in AppShell: Header mit Event/Layout und Save/Preview; kompakte horizontale Icon-Toolbar; einklappbare Layers links, Canvas in der Mitte, Properties rechts; Statuszeile mit Auswahl/Zoom/Dirty. MUI-9-Komponenten und DESIGN.md-Tokens, keine Blur-Flächen oder dekorativen Cards. Kleine Viewports: Panels per Schalter öffnen, Controls umbrechen, Canvas bleibt bedienbar. Viewer: ruhiger Header, Filter/Legende, maximale Kartenfläche.

## Umsetzung und Nachweise

Reihenfolge: Koordinaten/Document → Selection/Drag → Transform → History/Multi/Duplicate → Shapes/Generatoren → atomare Persistenz → Viewer → UI → abschließende Tests. Jede Stufe muss kompilierbar bleiben.

Unit: Geometry, Rotation/Translation/Bounds, Adapter-Roundtrip, Kamera-Matrix, Duplicate, Move, Undo/Redo/Branch. Component: Pointer-Gesten, Marquee, Multi-Drag, Keyboard/Textfelder, Save-Fehler. Backend: Validation, Event-Isolation, stabile IDs, unveränderte Assignments, Konflikte/Transaktionsrollback, Schema-Vertrag. Browser: öffentliche Smoke-Spec plus gezielter Editor mit realen Pointer-Aktionen und Screenshots; authentifizierter Save/Load nur mit verfügbarer Infrastruktur als PASS melden.

Performance erst nach Messung weiter optimieren: keine globalen Pointer-State-Updates, memoized Nodes; keine zusätzliche Library ohne belegten Bedarf. Offene Punkte und tatsächliche Prüfergebnisse nach Implementierung ergänzen.

## Verbindliche Phasengrenze und Prüfstand (2026-09-09)

Phase 1–3 implementieren ausschließlich World-Dokument, Adapter, Renderer, Kamera, Single Select und Single-Drag. Drag beginnt ab 3 CSS-Pixeln, hält die Startkamera fest, verwendet Pointer Capture und RAF-DOM-Vorschau. Escape, Cancel, Capture-Verlust und Kontextwechsel verwerfen die Vorschau. Ein tatsächlicher Drag committed eine lokale Bewegung und eine vorhandene Move-Mutation für den gezogenen Parent; Fehler rollen die Geometrie zurück.

Kein Atomic Save, keine neue History, kein Multi-Drag und keine Datenbankmigration. TableMapper liefert nun gespeicherte Breite/Höhe, Move-Rückgabetypen entsprechen SectionPayload/TablePayload. Offline-Codegen verwendet ein mit isoliert erzeugtem Nest-SDL abgeglichenes Quellschema-Overlay; generierte Dateien werden ausschließlich mit GraphQL Code Generator erzeugt.

PASS: 26 gezielte Frontend-Unit-/Komponententests für Adapter, Kamera, Bounds, flache Positionierung, Capture/Cancel, Request-Sperre und Rollback. Backend-Mapper-/Resolver-Regressionen wurden zunächst als Fehler reproduziert und anschließend erfolgreich geprüft. PRE-EXISTING FAILURE: Frontend-Typecheck `env.shared.test.ts`: fehlender Export `toUuidOrEmpty`. Weitere Browser-/Build-Prüfergebnisse werden im Abschlussstand ergänzt.

Browser-Nachweis: PASS, 12 echte Chromium-Komponentenfälle im separaten Vite-Test-Harness (keine Produktionsroute, kontrollierter Persistenzadapter). Nach der Screenshotprüfung wurde die RAF-Bereinigung korrigiert: Inline-Transforms werden entfernt, damit die neue CSS-Dokumentposition nach Commit sichtbar bleibt. Die Regression prüft DOM-Endposition und Kamera nach Drag/Pan. Screenshots: `test-results/seat-layout-harness/{table-drag,rollback,viewer}.png`. Der erste öffentliche Smoke bestand für `/`; die 404-Route zeigte einen separaten Next-Performance-Messfehler. Wiederholungsprüfung und Produktionsbuild werden im Import-Abschluss dokumentiert.
