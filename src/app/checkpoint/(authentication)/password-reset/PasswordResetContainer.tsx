"use client";

import { JSX, useState } from "react";
import SecurityQuestionStep from "./SecurityQuestionStep";
import NewPasswordStep from "./NewPasswordStep";

type Step = "QUESTIONS" | "NEW_PASSWORD";

export default function PasswordResetContainer(): JSX.Element {
  const [step, setStep] = useState<Step>("QUESTIONS");
  const [id, setId] = useState<string | undefined>(undefined);

  if (step === "QUESTIONS") {
    return (
      <SecurityQuestionStep
        onSuccess={() => setStep("NEW_PASSWORD")}
        setId={setId}
      />
    );
  }

  return <NewPasswordStep id={id} />;
}
