"use client";

import { Alert, Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { imageQuad, type Quad } from "./geometry";
import { canvas, canvasPng, context, decodeImage, prepareImage, rotateSource } from "./image";
import { PdfSource } from "./pdf";
import { CameraSession, ObjectUrls } from "./resources";

export type ImportSourceKind = "IMAGE" | "PDF" | "CAMERA";
export interface PreparedImportSource {
  png: Blob;
  previewUrl: string;
  metadata: {
    kind: ImportSourceKind;
    name: string;
    width: number;
    height: number;
    pageNumber?: number;
  };
  originalPdf?: File;
  originalFile: File;
}

interface Props {
  kind: ImportSourceKind;
  onPrepared: (source: PreparedImportSource | null) => void;
  disabled?: boolean;
}

const cornerLabels = ["Oben links", "Oben rechts", "Unten rechts", "Unten links"] as const;

/** Acquisition and preprocessing only; analysis is explicitly started by the parent dialog. */
export function ImportSourcePanel({ kind, onPrepared, disabled = false }: Props) {
  const camera = useRef(new CameraSession());
  const urls = useRef(new ObjectUrls());
  const pdf = useRef<PdfSource | null>(null);
  const originalPdf = useRef<File | null>(null);
  const originalFile = useRef<File | null>(null);
  const source = useRef<HTMLCanvasElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const preparedUrlRef = useRef<string | null>(null);
  const request = useRef<AbortController | null>(null);
  const callback = useRef(onPrepared);
  callback.current = onPrepared;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [prepared, setPrepared] = useState<string | null>(null);
  const [preparedDimensions, setPreparedDimensions] = useState({ width: 1, height: 1 });
  const [quad, setQuad] = useState<Quad>(imageQuad(1, 1));
  const [dimensions, setDimensions] = useState({ width: 1, height: 1 });
  const [cameraActive, setCameraActive] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [confirmedPage, setConfirmedPage] = useState<number | null>(null);

  const invalidatePrepared = useCallback(() => {
    if (preparedUrlRef.current) urls.current.revoke(preparedUrlRef.current);
    preparedUrlRef.current = null;
    setPrepared(null);
    callback.current(null);
  }, []);

  const clear = useCallback(() => {
    request.current?.abort();
    request.current = null;
    camera.current.stop();
    if (video.current) video.current.srcObject = null;
    pdf.current?.dispose();
    pdf.current = null;
    originalPdf.current = null;
    originalFile.current = null;
    source.current = null;
    urls.current.dispose();
    previewUrlRef.current = null;
    preparedUrlRef.current = null;
    callback.current(null);
  }, []);

  useEffect(() => {
    clear();
    setPreview(null);
    setPrepared(null);
    setPageCount(0);
    setPageNumber(1);
    setConfirmedPage(null);
    setCameraActive(false);
    setBusy(false);
    setError(null);
    setName(kind === "CAMERA" ? "Kameraaufnahme" : "");
    return clear;
  }, [kind, clear]);

  const run = async (operation: (signal: AbortSignal) => Promise<void>) => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setError(null);
    try {
      await operation(controller.signal);
    } catch (cause) {
      if (!controller.signal.aborted)
        setError(
          cause instanceof Error ? cause.message : "Die Quelle konnte nicht verarbeitet werden.",
        );
    } finally {
      if (request.current === controller) {
        setBusy(false);
        request.current = null;
      }
    }
  };

  const showSource = async (image: HTMLCanvasElement, signal: AbortSignal) => {
    const blob = await canvasPng(image);
    signal.throwIfAborted();
    source.current = image;
    setDimensions({ width: image.width, height: image.height });
    setQuad(imageQuad(image.width, image.height));
    if (previewUrlRef.current) urls.current.revoke(previewUrlRef.current);
    previewUrlRef.current = urls.current.create(blob);
    setPreview(previewUrlRef.current);
    invalidatePrepared();
  };

  const loadFile = (file: File) => {
    clear();
    setPreview(null);
    setPrepared(null);
    setCameraActive(false);
    setPageCount(0);
    setConfirmedPage(null);
    setPageNumber(1);
    setName(file.name);
    originalFile.current = file;
    void run(async (signal) => {
      if (kind === "PDF") {
        const document = new PdfSource();
        pdf.current = document;
        originalPdf.current = file;
        const count = await document.open(file, signal);
        signal.throwIfAborted();
        setPageCount(count);
        await showSource(await document.page(1, signal), signal);
      } else {
        await showSource(await decodeImage(file, signal), signal);
      }
    });
  };

  const choosePage = (page: number) => {
    request.current?.abort();
    source.current = null;
    if (previewUrlRef.current) urls.current.revoke(previewUrlRef.current);
    previewUrlRef.current = null;
    setPreview(null);
    setPageNumber(page);
    setConfirmedPage(null);
    invalidatePrepared();
    if (!Number.isInteger(page) || page < 1 || page > pageCount) return;
    void run(async (signal) => {
      if (pdf.current) await showSource(await pdf.current.page(page, signal), signal);
    });
  };

  const startCamera = () => {
    clear();
    setPreview(null);
    setPrepared(null);
    setName("Kameraaufnahme");
    setCameraActive(true);
    void run(async (signal) => {
      if (!navigator.mediaDevices?.getUserMedia)
        throw new Error("Kamera nicht verfügbar. Bitte ein Bild hochladen.");
      let stream: MediaStream | null;
      try {
        stream = await camera.current.start(
          navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices),
        );
      } catch {
        throw new Error(
          "Kein Kamerazugriff. Bitte die Berechtigung prüfen oder ein Bild hochladen.",
        );
      }
      if (!stream) return;
      if (signal.aborted) {
        camera.current.stop();
        return;
      }
      if (video.current) {
        video.current.srcObject = stream;
        try {
          await video.current.play();
        } catch {
          camera.current.stop();
          throw new Error(
            "Die Kameravorschau kann nicht gestartet werden. Bitte ein Bild hochladen.",
          );
        }
      }
    });
  };

  const capture = () => {
    void run(async (signal) => {
      const element = video.current;
      if (!element?.videoWidth || !element.videoHeight)
        throw new Error("Die Kamera ist noch nicht bereit. Bitte erneut aufnehmen.");
      const scale = Math.min(1, 2048 / Math.max(element.videoWidth, element.videoHeight));
      const image = canvas(
        Math.round(element.videoWidth * scale),
        Math.round(element.videoHeight * scale),
      );
      context(image).drawImage(element, 0, 0, image.width, image.height);
      camera.current.stop();
      element.srcObject = null;
      setCameraActive(false);
      originalFile.current = new File([await canvasPng(image)], "kamera.png", {
        type: "image/png",
      });
      signal.throwIfAborted();
      await showSource(image, signal);
    });
  };

  const updateCorner = (index: number, axis: "x" | "y", value: number) => {
    invalidatePrepared();
    setQuad(
      (previous) =>
        previous.map((point, i) =>
          i === index ? { ...point, [axis]: value } : point,
        ) as unknown as Quad,
    );
  };

  const prepare = () => {
    void run(async (signal) => {
      if (!source.current || !originalFile.current)
        throw new Error("Bitte zuerst eine Quelle auswählen.");
      if (kind === "PDF" && confirmedPage !== pageNumber)
        throw new Error("Bitte die ausgewählte PDF-Seite bestätigen.");
      invalidatePrepared();
      const result = await prepareImage(source.current, quad, signal);
      signal.throwIfAborted();
      const previewUrl = urls.current.create(result.png);
      preparedUrlRef.current = previewUrl;
      setPrepared(previewUrl);
      setPreparedDimensions({ width: result.width, height: result.height });
      callback.current({
        png: result.png,
        originalFile: originalFile.current,
        previewUrl,
        metadata: {
          kind,
          name,
          width: result.width,
          height: result.height,
          ...(kind === "PDF" ? { pageNumber } : {}),
        },
        ...(originalPdf.current ? { originalPdf: originalPdf.current } : {}),
      });
    });
  };

  return (
    <Stack spacing={2} aria-busy={busy}>
      <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
        <Button component="label" variant="outlined" disabled={disabled || busy}>
          {kind === "PDF" ? "PDF auswählen" : "Bild auswählen"}
          <input
            hidden
            type="file"
            accept={kind === "PDF" ? "application/pdf" : "image/png,image/jpeg,image/webp"}
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (file) loadFile(file);
              event.currentTarget.value = "";
            }}
          />
        </Button>
        {kind === "CAMERA" && (
          <Button onClick={startCamera} disabled={disabled || busy}>
            Kamera starten
          </Button>
        )}
        {busy && (
          <Button
            onClick={() => {
              request.current?.abort();
              camera.current.stop();
              setBusy(false);
            }}
          >
            Abbrechen
          </Button>
        )}
      </Stack>
      <Typography variant="caption" color="text.secondary">
        Maximal 20 MiB · Bilder bis 24 Megapixel · PDFs bis 100 Seiten
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {busy && (
        <Stack direction="row" sx={{ gap: 1, alignItems: "center" }} role="status">
          <CircularProgress size={20} />
          <Typography variant="body2">Vorschau wird verarbeitet…</Typography>
        </Stack>
      )}
      {kind === "CAMERA" && cameraActive && (
        <Stack spacing={1}>
          <Box
            component="video"
            ref={video}
            muted
            playsInline
            aria-label="Live-Kameravorschau"
            sx={{ width: "100%", maxHeight: "40vh", borderRadius: 1 }}
          />
          <Button onClick={capture} disabled={disabled || busy}>
            Einzelbild aufnehmen
          </Button>
          <Button
            onClick={() => {
              request.current?.abort();
              camera.current.stop();
              if (video.current) video.current.srcObject = null;
              setCameraActive(false);
              setBusy(false);
            }}
          >
            Kamera beenden
          </Button>
        </Stack>
      )}
      {pageCount > 0 && (
        <Stack direction="row" sx={{ gap: 1, alignItems: "center", flexWrap: "wrap" }}>
          <TextField
            type="number"
            size="small"
            sx={{ minWidth: (theme) => theme.spacing(24) }}
            label={`PDF-Seite (1–${pageCount})`}
            value={pageNumber}
            disabled={disabled || busy}
            onChange={(event) => choosePage(Number(event.target.value))}
            slotProps={{ htmlInput: { min: 1, max: pageCount, step: 1, name: "import-pdf-page" } }}
          />
          <Button
            disabled={
              disabled ||
              busy ||
              !preview ||
              pageNumber < 1 ||
              pageNumber > pageCount ||
              !Number.isInteger(pageNumber)
            }
            onClick={() => setConfirmedPage(pageNumber)}
          >
            {confirmedPage === pageNumber ? "Seite bestätigt" : "Diese Seite bestätigen"}
          </Button>
        </Stack>
      )}
      {preview && (
        <>
          <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
            {name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Bild ausrichten und die vier Planecken setzen. Der gewählte Ausschnitt wird entzerrt;
            erst danach die Vorschau vorbereiten.
          </Typography>
          <Box
            sx={{
              position: "relative",
              alignSelf: "center",
              width: "100%",
              maxWidth: `${(60 * dimensions.width) / dimensions.height}vh`,
              m: 2,
            }}
          >
            <Box
              component="img"
              src={preview}
              alt="Originalvorlage mit korrigierbaren Planecken"
              width={dimensions.width}
              height={dimensions.height}
              sx={{ width: "100%", height: "auto", display: "block", borderRadius: 1 }}
            />
            <Box
              component="svg"
              viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                color: "primary.main",
                pointerEvents: "none",
              }}
              aria-hidden="true"
            >
              <polygon
                points={
                  quad.every((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
                    ? quad.map((p) => `${p.x},${p.y}`).join(" ")
                    : ""
                }
                fill="none"
                stroke="currentColor"
                strokeWidth={Math.max(dimensions.width, dimensions.height) / 200}
              />
            </Box>
            {quad.map((point, index) => (
              <Box
                component="button"
                type="button"
                key={cornerLabels[index]}
                aria-label={`Planecke ${cornerLabels[index]}`}
                disabled={disabled || busy}
                sx={{
                  position: "absolute",
                  left: `${Number.isFinite(point.x) ? (point.x / dimensions.width) * 100 : 0}%`,
                  top: `${Number.isFinite(point.y) ? (point.y / dimensions.height) * 100 : 0}%`,
                  transform: "translate(-50%, -50%)",
                  width: (theme) => theme.spacing(6),
                  height: (theme) => theme.spacing(6),
                  borderRadius: 1,
                  bgcolor: "background.paper",
                  border: 1,
                  borderColor: "primary.main",
                  color: "text.primary",
                  cursor: "move",
                  touchAction: "none",
                  "&:focus-visible": {
                    outline: "2px solid",
                    outlineColor: "primary.main",
                    outlineOffset: 2,
                  },
                }}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={(event) => {
                  if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
                  const bounds = event.currentTarget.parentElement!.getBoundingClientRect();
                  updateCorner(
                    index,
                    "x",
                    Math.round(
                      Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)) *
                        dimensions.width,
                    ),
                  );
                  updateCorner(
                    index,
                    "y",
                    Math.round(
                      Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height)) *
                        dimensions.height,
                    ),
                  );
                }}
                onPointerUp={(event) => {
                  if (event.currentTarget.hasPointerCapture(event.pointerId))
                    event.currentTarget.releasePointerCapture(event.pointerId);
                }}
                onKeyDown={(event) => {
                  const delta = event.shiftKey ? 10 : 1;
                  const axis = event.key === "ArrowLeft" || event.key === "ArrowRight" ? "x" : "y";
                  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key))
                    return;
                  event.preventDefault();
                  const value =
                    point[axis] +
                    (event.key === "ArrowLeft" || event.key === "ArrowUp" ? -delta : delta);
                  updateCorner(
                    index,
                    axis,
                    Math.max(
                      0,
                      Math.min(axis === "x" ? dimensions.width : dimensions.height, value),
                    ),
                  );
                }}
              >
                {index + 1}
              </Box>
            ))}
          </Box>
          <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
            <Button
              disabled={disabled || busy}
              onClick={() =>
                void run(async (signal) => {
                  if (source.current) await showSource(rotateSource(source.current, 1), signal);
                })
              }
            >
              90° im Uhrzeigersinn
            </Button>
            <Button
              disabled={disabled || busy}
              onClick={() => {
                setQuad(imageQuad(dimensions.width, dimensions.height));
                invalidatePrepared();
              }}
            >
              Ausschnitt zurücksetzen
            </Button>
          </Stack>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
            {quad.map((point, index) => (
              <Stack key={cornerLabels[index]} direction="row" sx={{ gap: 1 }}>
                {(["x", "y"] as const).map((axis) => (
                  <TextField
                    fullWidth
                    key={axis}
                    type="number"
                    size="small"
                    label={`${index + 1}. ${cornerLabels[index]} ${axis.toUpperCase()}`}
                    value={Number.isFinite(point[axis]) ? point[axis] : ""}
                    error={!Number.isFinite(point[axis])}
                    disabled={disabled || busy}
                    onChange={(event) =>
                      updateCorner(
                        index,
                        axis,
                        event.target.value === "" ? Number.NaN : Number(event.target.value),
                      )
                    }
                    slotProps={{
                      htmlInput: {
                        min: 0,
                        max: axis === "x" ? dimensions.width : dimensions.height,
                        step: 1,
                        name: `import-corner-${index}-${axis}`,
                      },
                    }}
                  />
                ))}
              </Stack>
            ))}
          </Box>
          <Button
            variant="contained"
            onClick={prepare}
            disabled={disabled || busy || (kind === "PDF" && confirmedPage !== pageNumber)}
          >
            Vorschau vorbereiten
          </Button>
        </>
      )}
      {prepared && (
        <Stack spacing={1}>
          <Alert severity="success">
            Vorschau bereit. Die Analyse startet erst mit „Analysieren“.
          </Alert>
          <Box
            component="img"
            src={prepared}
            width={preparedDimensions.width}
            height={preparedDimensions.height}
            alt="Vorbereitete, entzerrte Analysevorlage"
            sx={{ width: "100%", maxHeight: "40vh", objectFit: "contain", borderRadius: 1 }}
          />
        </Stack>
      )}
    </Stack>
  );
}
