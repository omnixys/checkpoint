import { Components, Theme } from "@mui/material/styles";

export const textFieldComponents = (
  theme: Theme,
): Components["MuiTextField"] => ({
  defaultProps: {
    variant: "outlined",
    size: "medium",
  },

  styleOverrides: {
    root: {
      "& .MuiOutlinedInput-root": {
        borderRadius: theme.shape.borderRadius,
      },
    },
  },
});
