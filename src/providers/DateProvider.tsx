"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { JSX, PropsWithChildren } from "react";

export default function DateProvider({ children }: PropsWithChildren): JSX.Element {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
      {children}
    </LocalizationProvider>
  );
}
