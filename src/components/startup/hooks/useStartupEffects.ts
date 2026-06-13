"use client";

import { useEffect } from "react";

const SOUNDS = [
  "/sounds/bright_variant.wav",
  "/sounds/intro.wav",
  "/sounds/ios_tab.wav",
  "/sounds/powerup.wav",
  "/sounds/scifi.wav",
];

/**
 * Handles startup audio + vibration + auto-dismiss.
 */
export function useStartupEffects(onDone: () => void, duration: number, enabled = true) {
  useEffect(() => {
    if (!enabled) {
      onDone();
      return;
    }

    const sound = SOUNDS[Math.floor(Math.random() * SOUNDS.length)];
    const audio = new Audio(sound);

    audio.volume = 0.38;
    audio.playbackRate = 0.95 + Math.random() * 0.1;

    void audio.play().catch(() => {
      // Browsers may block non-interactive startup audio.
    });

    if ("vibrate" in navigator) {
      navigator.vibrate(30);
    }

    const timer = window.setTimeout(onDone, duration);

    return () => window.clearTimeout(timer);
  }, [duration, enabled, onDone]);
}
