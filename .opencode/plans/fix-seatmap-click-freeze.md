# Fix: seat map blocks every click ("click seat → whole window hangs")

## Bug report (user)
> "bei seatMap wenn ich auf einen sitzplatz klicke hängt dann das ganze fenster!"
> "es liegt daran das die seat map (also eine view) über alles liegt und man nie
> wirklich das fenster klickt"

- Ansicht: neue Karten-Ansicht `/seat/map`, **Ansicht-Modus** (Standard).
- Symptom: nach Klick auf einen Sitz ist die Seite komplett unklickbar, nur Refresh hilft.
- Immer, sofort reproduzierbar; Event ~300–1500 Sitze.
- **Der Benutzer hat recht:** Eine unsichtbare, fensterfüllende View liegt tatsächlich über
  allem und fängt die Klicks ab. Empirisch bestätigt (performance.now-Auflösung, elementFromPoint).

## Root cause (confirmed empirically, two full-window pointer-eating layers)

### Layer 1 — nach Sitz-Klick: Popover-Backdrop + Canvas-Pointer-Capture (der gemeldete Bug)
1. Im View-Modus öffnet `SeatNode` beim Sitz-Klick einen MUI `Popover`. MUI-Modal rendert
   einen **unsichtbaren, vollviewport-deckenden Backdrop** (`.MuiBackdrop-root`,
   `pointer-events:auto`, z-Index im Modal-Kontext 1300). Danach liegt über **jedem** Pixel
   ein Element, das Klicks abfängt (`elementFromPoint` → `.MuiBackdrop-root` überall).
2. Der Backdrop ist ein Portal im `document.body`, aber **im React-Fiber-Baum ein Nachfahre
   des Canvas** → der `onPointerDown` der Karte (`useSeatMapInteraction.ts:115`) bekommt den
   Klick synthetisch gebubbelt, startet im View-Modus einen **Pan-Gesture** und ruft
   `e.currentTarget.setPointerCapture(e.pointerId)` (`:152`).
3. Pointer-Capture retargetet `mouseup`/`click` vom Backdrop weg auf den Canvas
   (gemessen: pointerdown→BACKDROP, danach pointerover/gotpointercapture/pointerup/click→
   `seatmap-canvas`). MUI schließt den Popover nur bei einem `click` mit
   `event.target === event.currentTarget` (`Modal/useModal.js` `createHandleBackdropClick`).
   Dieser `click` kommt nie an → `onClose` → `setAnchorEl(null)` läuft nie → **Popover bleibt
   offen**, sein Fullscreen-Backdrop frisst jeden weiteren Klick, die Seite ist tot bis
   Refresh. Beweis: ein direkt auf dem Backdrop per DOM `.dispatchEvent('click')` gesendeter
   Klick schließt den Popover (`p:0 b:0`) → nur die Capture-Maschinerie blockiert.
4. Gleiche Klasse betrifft auch andere MUI-Overlays (Rename/Anlegen-Dialoge im Edit-Modus).

### Layer 2 — bei jedem Seitenaufruf: StartupVisionPro-Splash (zusätzliches "View über allem")
- `StartupVisionPro.tsx` (in `src/app/layout.tsx:154`, also **vor jeder Route**) rendert eine
  Vollbild-`motion.div` (`position:fixed; inset:0; z-index:999_999`) mit einem
  **Viewport-Ausfüllenden WebGL-`<canvas>`** (`pointer-events:auto`).
- Gemessen: direkt nach dem Laden gilt `elementFromPoint` an **jedem** Punkt (1400x900@0,0)
  → dieses Canvas; ein echter Klick auf "Open account menu" landet auf dem Canvas
  (`pointerdown/mousedown/click → CANVAS`), das Menü öffnet sich nicht.
- Auto-Dismiss per `useStartupEffects(onDone, 3500)` → unmount nach ~3,5–4 s
  (gemessen: canvasCount 1→0 bei ~+4,2 s). In Dev mit wechselnden Fast-Refresh-Änderungen
  kann der Splash häufiger neu laufen. Solange er sichtbar ist, ist die ganze Seite unklickbar.

## Fix

### Primär (behebt "Sitz klicken → Fenster hängt")
`src/components/seat/seatMapCanvas/useSeatMapInteraction.ts` `onPointerDown`:
Pyclient-Pointer only start a gesture → only capture → when the pointerdown physically
originates **inside** the canvas container. Portal-Overlays (Popover/Modal backdrop) sind in
der DOM außerhalb des Containers → ihre Klicks bleiben unangetastet, der Browser liefert das
normale `click` an den Backdrop, MUI schließt den Popover, Seite bleibt interaktiv.

```ts
function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
  if (
    gesture.current ||
    (e.button !== 0 && e.button !== 1) ||
    (e.target as HTMLElement).closest("[data-camera-control]") ||
    !containerRef.current?.contains(e.target as Node)   // NEW
  )
    return;
  ...
}
```

Ein Guard, ein Bug-Bereich; Pan/Drag/Resize/Rotate innerhalb des Canvas funktionieren unverändert.

### Sekundär (Option, separates Issue: "View liegt über allem beim Laden")
`StartupVisionPro.tsx`: Solange der Splash sichtbar ist, blockiert sein Vollbild-Canvas
**jeden** Klick im ganzen Fenster. Es ist rein dekorativ → Wrapper + Canvas
`pointer-events: none` setzen (Parallax-Tilt darf bleiben; die Orb/Cursor-Fläche braucht
keine Eingaben). Damit ist das "man klickt nie wirklich das fenster"-Verhalten beim Laden weg.

## Tests

- **Vitest (RED vorher, GREEN nachher):** in
  `src/components/seat/seatMapCanvas/foundation.test.tsx` (bzw. neue Datei):
  `pointerDown` dessen `target` eine Node in `document.body` **außerhalb** von
  `containerRef.current` ist (Portalsimulation) → `setPointerCapture` wurde **nicht**
  aufgerufen und es folgt keine Pan-Geste (kein `onCamera`/`onMove`).
- **Harness-Playwright (Browser-Regression):** `e2e/seat-layout-harness` erweitern:
  1. Sitz klicken → `.MuiPopover-root` sichtbar,
  2. Klick auf freie Fläche außerhalb des Popovers → Popover/Backdrop schließen (`toHaveCount(0)`),
  3. zweiter Sitz-Klick → Popover öffnet erneut (Seite voll interaktiv).
- **Startup-Overlay:** optionaler Playwright-Check, dass während des Splashs Klicks an
  darunterliegende Controls durchgehen (bzw. Splash kein Pointer-EvCap).

## Validation

```bash
node_modules/.bin/vitest run src/components/seat/seatMapCanvas
node_modules/.bin/playwright test --config e2e/seat-layout-harness/playwright.config.ts
node_modules/.bin/tsc --project e2e/seat-layout-harness/tsconfig.json
pnpm exec biome check .        # check-only
pnpm exec tsc --noEmit
pnpm test:unit
pnpm test
pnpm build
npx playwright test e2e/ui-smoke.spec.ts --project=chromium
```

## Cleanup / housekeeping

- Harness-Vite-Server (PID 85277) aus der Diagnose beenden.
- Laufenden `next dev` (PID 74609) und fremde Working-Tree-Änderungen (`.gitignore`,
  `Dockerfile`, `docker-bake.hcl`, `next.config.ts`) nicht anfassen.
- `.vscode/*` und Dependencies: keine Änderungen nötig.

## Commit

```
fix(seat-map): stop canvas gesture capture from eating overlay backdrop clicks
```
(Optional beim selben Stand: `fix(startup): stop splash canvas from blocking page clicks`)