import { Components, Theme } from "@mui/material/styles";

export const buttonComponents = (theme: Theme): Components["MuiButton"] => ({
  styleOverrides: {
    root: {
      borderRadius: 999,
      padding: "10px 18px",
      fontWeight: 600,
      textTransform: "none",

      transition:
        "transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",

      "&:active": {
        transform: "scale(0.96)",
      },
    },

    contained: {
      boxShadow:
        theme.palette.mode === "dark"
          ? "0 10px 24px rgba(0,0,0,0.5)"
          : "0 10px 24px rgba(0,0,0,0.15)",

      "&:hover": {
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 14px 32px rgba(0,0,0,0.65)"
            : "0 14px 32px rgba(0,0,0,0.22)",
      },
    },

    outlined: {
      borderColor: theme.palette.divider,
      "&:hover": {
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.04)"
            : "rgba(0,0,0,0.04)",
      },
    },
  },
});
