"use client";

import { Checkbox, type CheckboxProps } from "@mui/material";
import { alpha, type Theme } from "@mui/material/styles";

export function getInvitationSelectionColors(theme: Theme) {
  return {
    unchecked: alpha(theme.palette.text.primary, theme.palette.mode === "dark" ? 0.72 : 0.58),
    active: theme.palette.primary.main,
  };
}

/** Theme-aware invitation selection with a clearly visible unchecked state. */
export default function InvitationSelectionCheckbox(props: CheckboxProps) {
  return (
    <Checkbox
      color="primary"
      {...props}
      sx={[
        (theme) => {
          const colors = getInvitationSelectionColors(theme);

          return {
            width: 40,
            height: 40,
            color: colors.unchecked,
            "&.Mui-checked, &.MuiCheckbox-indeterminate": {
              color: colors.active,
            },
            "&:hover": {
              backgroundColor: alpha(colors.active, 0.1),
            },
            "&.Mui-focusVisible": {
              outline: `2px solid ${alpha(colors.active, 0.72)}`,
              outlineOffset: 2,
            },
          };
        },
        ...(Array.isArray(props.sx) ? props.sx : props.sx ? [props.sx] : []),
      ]}
    />
  );
}
