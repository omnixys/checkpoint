# Seat Layout Import V1

## Geltungsbereich

Bild-, PDF- und Kameraquellen erzeugen nach ausdrücklicher Analyse und Prüfung einen lokalen Layoutentwurf. Keine Seat-Domain-Mutation wird während Analyse, Review oder Bearbeitung eines übernommenen Imports aufgerufen. Ein gemeinsamer Document-Save fehlt absichtlich. Es gibt keinen Atomic-Save-Vertrag, keine neue History, keinen allgemeinen Inspector und keine Datenbankmigration.

Die Foundation liegt in `seatMapCanvas/core`: serialisierbares ID-Record-Dokument mit World-Mittelpunkten, flacher Renderer, Kamera, Single Select und Single-Drag ab 3 CSS-Pixeln. Presets behalten ihren bestehenden Backendpfad; dieser wird im lokalen Entwurf deaktiviert. Der destruktive Auto-Generator wird für Imports nie verwendet.

## Pipeline und Modulgrenzen

`Quelle → Vorschau → Vorverarbeitung → echte Erkennung → LayoutImportDraft → Review → importLayoutDraft() → LayoutDocument`

- `import/sources`: Browserdateien, PDF.js, Kamera, Zuschnitt, Orientierung, Homographie, Rasterisierung und Ressourcenfreigabe.
- `import/transport.ts`: ein Multipart-Request, Cookie-Authentifizierung, AbortSignal, Laufzeitvalidierung der Antwort mit Zod.
- Seat Service `src/layout-import`: REST-Transport, explizite Pfad-Event-Berechtigung, Original-/Rastervalidierung und terminierbarer Worker.
- `recognizers`: getrennte Rastergeometrie, semantische Zuordnung und Interpreter. `LayoutRecognizer` ist die Providergrenze; V1 verwendet ausschließlich `geometry-v1`.
- `import/contract.ts`: serialisierbarer Draft mit Source-Metadaten, Vorschlägen, optionaler heuristischer Confidence, Warnungen und Reviewstatus. Keine File-, Blob-, URL-, Canvas- oder Streamobjekte.
- `import/domain.ts`: Draftprojektion für denselben World-Renderer, Korrekturen, exakte Sitzgeneratoren und Übernahme mit neuen UUIDs.

Der Viewer kennt keine Importquellentypen. Sein Renderer erhält bei Review lediglich eine optionale Bildfläche mit URL, Größe, Sichtbarkeit und Deckkraft. Fachliche Belegung, Presence und Farbgruppen bleiben getrennte Sitz-ID-Overlays.

## Koordinaten und Identität

Die Erkennung liefert Mittelpunkt-X und Breite relativ zur vorbereiteten Bildbreite; Mittelpunkt-Y und Höhe relativ zur vorbereiteten Bildhöhe. Winkel sind Grad um den eigenen Mittelpunkt, positiv im Bildschirmkoordinatensystem im Uhrzeigersinn. Die Bildachsen bestimmen die Orientierung nach der Vorverarbeitung.

Die Übernahme skaliert die gesamte Bildfläche auf 1.000 World Units Breite, mit unverändertem Seitenverhältnis. Das ist keine physische Maßeinheit. Bei vorhandenem Layout liegt der linke Bildrand 100 World Units rechts der bisherigen rotierten Bounds; die obere Kante liegt auf deren oberer Kante. Bei leerem Layout liegt die linke obere Bildkante am World-Ursprung.

Erkannte Sections sind gleichrangige neue Sections. Unzugeordnete Tische und freie Sitze erhalten einen neuen Importbereich. Für alle Nodes entstehen frische UUIDs; Erkennungs-IDs werden nur zum Remapping benutzt. Bereichsnamen sind pro Event, Tischnamen pro neuer Section eindeutig. Bestätigte Sitznummern werden auf Konflikte geprüft, andere deterministisch pro Bereich vergeben. Bestehende Nodes und IDs bleiben unverändert. Keine Inhaber, Reservierungen, Presence oder Farbstatus werden importiert.

Bestandsadapter verwenden weiterhin reine Parent-Translation: Table = Section + lokaler Table-Offset; Tischsitz = Section + Table + Seat; freier Sitz = Section + Seat. Parent-Rotation wird nicht auf Kinder vererbt. Die bestehende Payload-Baseline erhält insbesondere Nullwerte, Metadaten und nicht geänderte Formen.

## Echte deterministische Erkennung

Der Worker validiert Original und vorbereitete PNG-Datei, dekodiert mit sharp, berücksichtigt EXIF, legt Transparenz auf Weiß und erzeugt ein begrenztes Graustufenraster. Otsu-Binarisierung und zusammenhängende Komponenten führen zu geschlossenen Konturen. Konturen werden gegen Rechtecke und Ellipsen geprüft (Shape-IoU mindestens 0,80, Modellabstand mindestens 0,06). Ähnliche Ellipsenachsen ergeben Kreisvorschläge. Wiederholte kleinere Körper, Größenverhältnisse, Nähe und Containment liefern Sitz-/Tisch-/Bereichsvorschläge. Mehrdeutige Parents bleiben prüfpflichtig.

Confidence sind Qualitätsheuristiken, keine Wahrscheinlichkeiten. Fehlende Werte bleiben unbekannt. Unsichere Vorschläge werden markiert; nicht unterstützte `STAGE`, `AISLE`, `LABEL` und `UNKNOWN` müssen ausdrücklich ausgeschlossen oder umklassifiziert werden. Diese Review-Annotationen werden nie zu zusätzlichen Domain-Node-Arten.

Unterstützt werden saubere, dunkle, voneinander getrennte Symbole auf hellem Hintergrund nach manueller Ausrichtung und Perspektivkorrektur. Keine OCR, keine Handschrift, keine allgemeine Venue-Fotoerkennung, keine Garantie für individuell gedrehte oder überlappende Symbole. Ein leeres Ergebnis ist zulässig und erlaubt manuelle Draft-Erstellung auf der Vorlage.

Der reine Perimetergenerator wurde selektiv aus der Sicherung übernommen und geprüft. ROUND/CIRCLE, RECTANGLE, OVAL und ROW erzeugen exakt die bestätigte Sitzanzahl. Unbekannte Formen und ungültige Geometrie werden abgewiesen. Regeneration ersetzt ausschließlich Draftsitze des ausgewählten Drafttisches. Die ursprüngliche Erkennung bleibt von der Generatorgeometrie unabhängig.

## Quellen und Lebensdauer

Dateiauswahl und Kameraaufnahme starten keine Analyse. Zuerst sind Quellvorschau, Zuschnitt/Planecken und eine vorbereitete Vorschau erforderlich. PDFs zeigen Seitenzahl und laden Seitenvorschauen nach Bedarf; jede ausgewählte Seite muss ausdrücklich bestätigt werden. Vier Planecken können per Pointer oder numerisch korrigiert werden. Orientierung und Perspektivtransformation werden außerhalb des Pointermove-Pfads berechnet; gekreuzte, degenerierte oder nicht endliche Vierecke werden abgewiesen.

Kamera startet erst auf Benutzeraktion und bevorzugt die Rückkamera. Fehlende Unterstützung oder verweigerte Berechtigung bietet Datei-Upload. Tracks werden bei Aufnahme, Quellenwechsel, Abbruch und Unmount gestoppt, auch bei verspätet eintreffendem Stream. Object-URLs, PDF-Worker und Renderingaufträge werden freigegeben. Quellbytes existieren nur im Browser und während des begrenzten Requests/Workers; es gibt keine Upload-Session und keine dauerhaften Medien.

## Transport, Sicherheit und Grenzen

`POST /layout-import/:eventId/analyze` erhält genau drei Multipart-Parts:

| Part | Inhalt |
| --- | --- |
| `metadata` | JSON: `kind`, vorbereitete `width`, `height`, bei PDF `pageNumber`; keine Dateinamen |
| `preparedImage` | Vorbereitetes PNG |
| `originalSource` | Originalbild, Kamera-PNG oder Original-PDF, einmal im selben Request |

Auch Bildoriginale werden übertragen, damit der Server ursprünglichen MIME-Typ und das 24-MP-Limit unabhängig prüfen kann. PDF-Struktur, Seitenzahl und Seitenindex werden serverseitig mit PDF.js geprüft; serverseitiges PDF-Rendering findet nicht statt. Die Response ist ein unverpacktes `LayoutRecognitionResult`, kein GraphQL- oder Base64-Payload.

CookieAuthGuard und RoleGuard prüfen die vorhandene Identität. ManageSeats wird ausdrücklich über `getPermissionsForUser(user.id, pathEventId)` geprüft. Aktiver Event aus Header/Cookie autorisiert niemals ein anderes Pfad-Event. Keine Bildbytes, Dateinamen oder Credentials werden geloggt; nur Event-ID, Quellentyp, Vorschlagsanzahl und Dauer.

| Grenze | Wert |
| --- | --- |
| Originalbild / PDF | 20 MiB |
| Originalbild | 24 Megapixel |
| PDF | 100 Seiten; verschlüsselt nicht unterstützt |
| Vorbereitetes PNG | 2.048 Pixel längste Kante, 8 MiB |
| Erkennungsraster | 1.600 Pixel längste Kante |
| Vorschläge | 10.000, keine stille Kürzung |
| Laufzeit | 20 Sekunden einschließlich Upload, Validierung und Analyse |
| Parallelität | 2 pro Instanz, keine Warteschlange; Überlast HTTP 429 |

Weitere Rechenbudgets begrenzen Rohkomponenten, Kontur-Fitpixel und Parent-Vergleiche. Überkomplexe Quellen können daher bereits vor 10.000 Vorschlägen verständlich abgewiesen werden. Timeout und Clientabbruch terminieren den Worker. Dateisignaturen, Decoder- und Bytelimits gelten unabhängig von Frontendvalidierung. Antwort mit `Cache-Control: no-store`.

Konfiguration: `NEXT_PUBLIC_SEAT_API` ist die Basis-URL des Seat Service (lokal `http://localhost:7409`, ohne `/layout-import`). `CHECKPOINT_ORIGIN` im Seat Service erlaubt bei getrennter Bereitstellung genau den administrierten HTTP(S)-Origin für CORS; keine Wildcards. Sessioncookies müssen für die bestehende Servicebereitstellung gültig sein. Keine Remote-Konfiguration wurde geändert.

Direkte neue Dependencies: PDF.js `6.3.289` in beiden Repositories, sharp `0.35.4` und `@fastify/multipart` `10.1.1` nur im Seat Service. Kein Editor-, State-, CV- oder AI-Paket.

## Lokaler Entwurf und Interaktion

`importLayoutDraft()` gibt eine einzelne Änderung mit Before-/After-Dokument und neuen IDs zurück. Das ist eine spätere Undo-Anschlussstelle, keine History. Reviewfelder ändern ausschließlich den Draft. Der zentrale Single-Drag-Kern verwendet für die Vorschau registrierte DOM-Elemente und RAF; Parent-Bewegung verschiebt Nachfahren einmal.

`useLocalLayoutDraft` hält nach Übernahme das gesamte gemischte Dokument lokal. Bestehende und neue IDs senden dann keine Move-Requests. Refetch ersetzt den Entwurf nicht. Der Status „Lokaler Entwurf – nicht gespeichert“ bleibt sichtbar. Verwerfen kehrt zum zuletzt geladenen Serverdokument zurück. Laufende Backendaktionen sperren Presets, Quellwechsel und Übernahme; weitere Backendaktionen sind im lokalen Entwurf deaktiviert. Der Erstellungsdialog bleibt für zusätzliche Imports verfügbar.

## Reproduzierbare Prüfung

Frontend: `node_modules/.bin/vitest run src/components/seat/seatMapCanvas`, Typecheck, Biome für geänderte Dateien und Next-Produktionsbuild. Backend: Build vor `node --test __tests__/unit/layout-*.test.mjs` plus `layout-import-cors`-Test; ESLint/Prettier/tsc.

Browser: `node_modules/.bin/playwright test --config e2e/seat-layout-harness/playwright.config.ts`. Der Test-Harness ist ausschließlich Vite-Testcode; keine zusätzliche Produktionsroute und kein Auth-Bypass in der App. Der lokale Test-Analyseserver auf 127.0.0.1:5191 verwendet echte Multipartvalidierung, LayoutImportService, sharp, Worker und Recognizer, aber keine Produktionsauthentifizierung. Auth-/Event-Grenzen werden getrennt im tatsächlichen Nest/Fastify-Test mit kontrollierten Auth-/Permission-Adaptern geprüft. Backend muss vor diesem Harness gebaut sein; PNGs stammen aus einer unabhängig gezeichneten Rasterfixture.

Mocktests sind ausdrücklich gekennzeichnet: gespeicherte Move-Requests werden im Foundation-Harness durch einen kontrollierten Persistenzadapter ersetzt; Kamera-/PDF-Lebenszyklus und Dialogfehler haben zusätzliche Test-Doubles. Normale Uploads und die vollständige Bild-Import-Browserstrecke erhalten echte Erkennungsergebnisse. Die drei echten Erkennungsfixtures ergeben ROUND/8, RECTANGLE/10, OVAL/12, insgesamt exakt 30 Sitze.

## Abschlussprüfung (2026-09-10)

| Prüfung | Ergebnis |
| --- | --- |
| Seat-Frontend-Unit-/Komponententests | PASS: 92 Tests, einschließlich Quellen, Draft, Request-Sperre, Navigation und Fehlerpfaden |
| Chromium-Harness | PASS: 19 Tests; echte Bildanalyse liefert exakt 30 Sitze; Import mit Navigation API und History-Fallback, Source-PDF-Worker, EXIF, Kamera-Lebenszyklen |
| Screenshotreview | PASS: flache Endposition nach Drag/Pan, Rollback, Review-Overlay, lokale Übernahme und PDF-Quelle geprüft |
| Geänderte Frontenddateien Format/Lint | PASS; isolierter Harness-Typecheck ebenfalls PASS |
| Frontend Typecheck | PRE-EXISTING FAILURE: ausschließlich fehlender `toUuidOrEmpty`-Export in `src/config/env.shared.test.ts` |
| Frontend Produktionsbuild | PASS: Next/Turbopack einschließlich PDF-Worker-Bundle |
| Backend Layout-/Import-/CORS-Tests | PASS: 27 Tests (2 Foundation, 11 Recognition, 10 Transport, 4 CORS) |
| Backend Typecheck/Build/Source-ESLint/gezielte Formatierung | PASS |
| Gesamte Frontendtests | PRE-EXISTING FAILURE: fehlendes `NEXT_PUBLIC_EVENT_ID` in mehreren Tests, `toUuidOrEmpty`, Feature-Registry erwartet 24 statt 23 Features; 170 bestanden im breiten Lauf vor letzten Ergänzungen |
| Gesamtes Frontend-Biome | PRE-EXISTING FAILURE: Importreihenfolge in RSVPSuccess und fehlende abschließende Newlines in zwei Guest-Confirmation-GraphQL-Dateien; zusätzlich ein ungenutzter Feature-Registry-Import als Warnung |
| Öffentlicher Playwright-Smoke | FAIL: Dev-Startseite bestanden; 404 meldet Next-Performance.measure mit negativem Timestamp. Produktionsprüfung auf alternativem localhost-Port meldet vorhandene Gateway-CORS-Fehler. Keine Fehler unterdrückt |
| Gesamte Backendformatierung/Runtime-Alt-Test | PRE-EXISTING FAILURE: Prisma-generierte Formatabweichungen, falsches `__test__`-Glob, fehlender `@omnixys/context`-Alias im Runtime-Test |
| Echte Auth-/DB-Persistenz-E2E und physische Kamera | NOT RUN: Infrastruktur-/Gerätenachweis nicht verfügbar; kein Persistenz-PASS behauptet |

Offline-Codegen wurde erneut ausgeführt und reproduziert alle drei generierten Dateien bytegleich. Die ersten Build-/Serverversuche in der Sandbox scheiterten an lokalen Prozess-/Portrechten; der autorisiert wiederholte Produktionsbuild bestand. Dependency-Lockfiles wurden zusammen mit den direkten Abhängigkeiten aktualisiert; PDF.js ist beidseitig exakt gleich versioniert. Die vorhandenen VS-Code-Konfigurationen wurden geprüft; keine zusätzlichen Extensions sind notwendig.

Navigation: Anchor-Klicks und die Navigation API warnen vor Verlust. Ohne Navigation API schützt ein einzelner History-Sentinelleintrag natives Zurück sowie direkte History-Aufrufe. Bestehende imperative Desktop-/Tablet-/Mobil-Navigation und das Benutzermenü fragen synchron über `confirmAppNavigation()` vor Router-Aufruf bzw. Logout. Der Hook registriert diese Schranke nur bei lokalem Entwurf. Browser-History kann einen bereinigten zusätzlichen gleichen URL-Eintrag nicht löschen; bei abgebrochenen Mehrfachsprüngen kann der Vorwärtsverlauf gekürzt werden. Zukünftige imperative Navigationsaktionen müssen dieselbe Grenze verwenden.

Offen außerhalb V1: gemeinsamer Document-Save, atomare Persistenz importierter Nodes, echte End-to-End-Speicherung mit Auth/DB, OCR/AI-Erkennung, Multi-Drag und neue History. Die Sicherung späterer früherer Arbeiten bleibt unverändert unter `../../work-in-progress/seat-layout-later-phases-20260909`.
