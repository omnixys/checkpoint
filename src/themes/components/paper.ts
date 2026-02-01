import { Components, Theme } from "@mui/material/styles";

export const paperComponents = (theme: Theme): Components["MuiPaper"] => ({
  styleOverrides: {
    root: {
      borderRadius: theme.shape.borderRadius,
      backgroundImage: "none",

      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(28,28,30,0.72)"
          : "rgba(255,255,255,0.72)",

      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",

      border:
        theme.palette.mode === "dark"
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(0,0,0,0.06)",

      boxShadow:
        theme.palette.mode === "dark"
          ? "0 20px 40px rgba(0,0,0,0.55)"
          : "0 20px 40px rgba(0,0,0,0.08)",
    },
  },
});
