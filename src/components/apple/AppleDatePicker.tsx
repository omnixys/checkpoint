"use client";

import * as React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { de } from "date-fns/locale";
import { TextField } from "@mui/material";
import type { JSX } from "react";

interface AppleDatePickerProps {
  label: string;
  value: Date | null;
  onChange: (value: Date | null) => void;
  disabled?: boolean;
}

export function AppleDatePicker({
  label,
  value,
  onChange,
  disabled = false,
}: AppleDatePickerProps): JSX.Element {
  return (
    <DatePicker
      label={label}
      value={value}
      onChange={onChange}
      localeText={{}} // We override locale with dateAdapter
      disabled={disabled}
      slotProps={{
        textField: {
          fullWidth: true,
          variant: "outlined",
          sx: {
            borderRadius: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(20px)",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderRadius: 3,
            },
          },
        } satisfies Partial<React.ComponentProps<typeof TextField>>,
      }}
      // German locale
      format="dd.MM.yyyy"
      slots={{}}
    />
  );
}
