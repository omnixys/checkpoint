"use client";

import TourOverlay from "@/checkpoint/components/TourOverlay";
import React, { createContext, useContext, useState } from "react";

type AnchorMap = Record<string, HTMLElement>;

export type TourStep = {
  id: string;
  target: string;
  title: string;
  description: string;
  allowInteraction?: boolean; // 🔥 Blocking Mode Control
};

type TourContextType = {
  register: (id: string, el: HTMLElement | null) => void;
  anchors: AnchorMap;
  start: (steps: TourStep[]) => void;
  stop: () => void;
  steps: TourStep[];
  stepIndex: number;
  next: () => void;
  prev: () => void;
  isActive: boolean;
};

const TourContext = createContext<TourContextType | null>(null);

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour outside provider");
  return ctx;
}

export default function TourProvider({ children }: { children: React.ReactNode }) {
  const [anchors, setAnchors] = useState<AnchorMap>({});
  const [steps, setSteps] = useState<TourStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);

  const isActive = steps.length > 0;

  const register = (id: string, el: HTMLElement | null) => {
    if (!el) return;
    setAnchors((prev) => ({ ...prev, [id]: el }));
  };

  const start = (s: TourStep[]) => {
    setSteps(s);
    setStepIndex(0);
  };

  const stop = () => {
    setSteps([]);
    setStepIndex(0);
  };

  return (
    <TourContext.Provider
      value={{
        anchors,
        register,
        start,
        stop,
        steps,
        stepIndex,
        isActive,
        next: () =>
          setStepIndex((i) => {
            if (i === steps.length - 1) return i;
            return i + 1;
          }),
        prev: () => setStepIndex((i) => Math.max(i - 1, 0)),
      }}
    >
      {children}
      <TourOverlay />
    </TourContext.Provider>
  );
}
