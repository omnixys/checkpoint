"use client";


import type { JSX, PropsWithChildren } from "react";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


export default function DateProvider({
  children,
}: PropsWithChildren): JSX.Element {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
      {children}
    </LocalizationProvider>
  );
}
