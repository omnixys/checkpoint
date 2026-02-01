import { Components, Theme } from "@mui/material/styles";

export const dialogComponents = (theme: Theme): Components["MuiDialog"] => ({
  styleOverrides: {
    paper: {
      borderRadius: 24,
      padding: theme.spacing(2),

      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(28,28,30,0.85)"
          : "rgba(255,255,255,0.85)",

      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",

      boxShadow:
        theme.palette.mode === "dark"
          ? "0 30px 80px rgba(0,0,0,0.7)"
          : "0 30px 80px rgba(0,0,0,0.18)",
    },
  },
});
