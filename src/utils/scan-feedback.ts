import { Capacitor } from "@capacitor/core";
import type { ImpactStyle } from "@capacitor/haptics";
import type { ScanResult } from "../../types/scan/scan.type";

/* ---------------------------------------------
 * Lazy imports (native only)
 * ------------------------------------------- */

async function hapticImpact(style: ImpactStyle) {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { Haptics } = await import("@capacitor/haptics");
    await Haptics.impact({ style });
  } catch {
    /* ignore */
  }
}

/* ---------------------------------------------
 * Web Audio Context (lazy)
 * ------------------------------------------- */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

/* ---------------------------------------------
 * Simple Beep Generator
 * ------------------------------------------- */

function playBeep(frequency: number, durationMs: number, volume = 0.15) {
  try {
    const ctx = getAudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = frequency;
    gain.gain.value = volume;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch {
    /* ignore */
  }
}

/* ---------------------------------------------
 * Public API
 * ------------------------------------------- */

export async function playScanFeedback(result: ScanResult) {
  switch (result.status) {
    case "SUCCESS":
      await hapticImpact(
        (
          await import("@capacitor/haptics")
        ).ImpactStyle.Medium
      );
      playBeep(1200, 80);
      break;

    case "WARNING":
      await hapticImpact(
        (
          await import("@capacitor/haptics")
        ).ImpactStyle.Light
      );
      setTimeout(
        async () =>
          hapticImpact((await import("@capacitor/haptics")).ImpactStyle.Light),
        120
      );
      playBeep(800, 120);
      break;

    case "ERROR":
    default:
      await hapticImpact(
        (
          await import("@capacitor/haptics")
        ).ImpactStyle.Heavy
      );
      playBeep(300, 200);
      break;
  }
}
