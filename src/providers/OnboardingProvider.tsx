"use client";

import OnboardingModal from "@/checkpoint/components/onboarding/OnboardingModal";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useTour } from "@/checkpoint/providers/TourProvider";
import { buildTour } from "@/checkpoint/utils/layout/build-tour.util";
import { createContext, useContext, useEffect, useState } from "react";

const ONBOARDING_KEY = "checkpoint.onboardingDone";

type ContextType = {
  open: () => void;
  close: () => void;
};

const OnboardingContext = createContext<ContextType | null>(null);


export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within provider");
  return ctx;
}

export default function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { start } = useTour();
  const { activeEvent } = useActiveEvent();
      const t = useTypedTranslations("onboarding");
  
  const role = activeEvent?.myRole ?? 'GUEST';
  

  useEffect(() => {
    const done = localStorage.getItem(ONBOARDING_KEY);
    if (!done) setOpen(true);
  }, []);

  const close = () => {
    localStorage.setItem(ONBOARDING_KEY, "done");
    setOpen(false);
    
    const steps = buildTour({role, activeEvent, t});

    if (steps.length > 0) {
      start(steps);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        open: () => setOpen(true),
        close,
      }}
    >
      {children}
      <OnboardingModal open={open} onClose={close} />
    </OnboardingContext.Provider>
  );
}
