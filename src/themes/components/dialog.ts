import { Components, Theme } from "@mui/material/styles";

export const dialogComponents = (theme: Theme): Components["MuiDialog"] => ({
  styleOverrides: {
    paper: {
      borderRadius: 24,
      margin: theme.spacing(2),
      maxHeight: `calc(100dvh - ${theme.spacing(4)})`,
      padding: theme.spacing(2),
      width: `calc(100% - ${theme.spacing(4)})`,

      backgroundColor:
        theme.palette.mode === "dark" ? "rgba(28,28,30,0.85)" : "rgba(255,255,255,0.85)",

      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",

      boxShadow:
        theme.palette.mode === "dark"
          ? "0 30px 80px rgba(0,0,0,0.7)"
          : "0 30px 80px rgba(0,0,0,0.18)",

      [theme.breakpoints.down("sm")]: {
        borderRadius: 18,
        margin: theme.spacing(1),
        maxHeight: `calc(100dvh - ${theme.spacing(2)})`,
        padding: theme.spacing(1.25),
        width: `calc(100% - ${theme.spacing(2)})`,
      },
    },
  },
});

export const dialogTitleComponents = (theme: Theme): Components["MuiDialogTitle"] => ({
  styleOverrides: {
    root: {
      padding: theme.spacing(1, 1, 1.5),
      overflowWrap: "anywhere",

      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(0.5, 0.5, 1),
      },
    },
  },
});

export const dialogContentComponents = (theme: Theme): Components["MuiDialogContent"] => ({
  styleOverrides: {
    root: {
      minWidth: 0,
      overflowX: "hidden",
      padding: theme.spacing(1),

      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(0.5),
      },
    },
  },
});

export const dialogActionsComponents = (theme: Theme): Components["MuiDialogActions"] => ({
  styleOverrides: {
    root: {
      gap: theme.spacing(1),
      padding: theme.spacing(1),

      [theme.breakpoints.down("sm")]: {
        alignItems: "stretch",
        flexDirection: "column-reverse",

        "& > :not(style)": {
          marginLeft: 0,
          width: "100%",
        },
      },
    },
  },
});
