"use client";

/**
 * Central configuration for the startup animation.
 * Contains ALL numeric values used across UI + shader.
 */
export const startupConfig = {
  duration: {
    introMs: 3500,
    fadeMs: 500,
  },

  audio: {
    volume: 0.38,
    playbackMin: 0.95,
    playbackMax: 1.05,
    files: [
      "/sounds/bright_variant.wav",
      "/sounds/intro.wav",
      "/sounds/ios_tab.wav",
      "/sounds/powerup.wav",
      "/sounds/scifi.wav",
    ],
  },

  shader: {
    timeScale: 0.35,
    tiltInfluence: 0.02,

    noise: {
      n1Scale: 6.0,
      n1Time: 0.4,
      n2Scale: 10.0,
      n2Time: 0.3,
      n3Scale: 3.0,
      n3Time: 0.2,
    },

    liquidWeights: {
      n1: 0.6,
      n2: 0.3,
      n3: 0.25,
    },

    bend: {
      base: 0.12,
      liquidInfluence: 0.18,
    },

    brightness: {
      min: 0.3,
      max: 0.75,
    },
  },


  rays: {
    size: 900,
    blur: 90,
    opacity: 0.25,
    rotationDuration: 9,
  },

  logo: {
    size: 150,
  },

  text: {
    opacity: 0.5,
    fontSize: 19,
  },

  motion: {
    orbParallax: 0.8,

    orb: {
      initialScale: 0.5,
      finalScale: 1,
      initialOpacity: 0,
      finalOpacity: 1,
      initialBlur: 22,
      finalBlur: 4,
      duration: 1.2,
      ease: [0.33, 1, 0.68, 1] as const,
    },
  },

  orb: {
    size: 260,
    gradientPosition: {
      x: 50,
      y: 55,
    },
    shadow: {
      blur: 150,
      spread: 70,
    },
  },
};
