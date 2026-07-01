"use client";

import { useContext } from "react";
import { ErrorContext } from "@/checkpoint/providers/ErrorProvider";

export function useAppError() {
  const context = useContext(ErrorContext);
  if (!context) throw new Error("useAppError must be used inside ErrorProvider");
  return context;
}
