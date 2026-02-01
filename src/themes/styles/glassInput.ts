import { Theme } from "@mui/material/styles";

export const glassInputSx = (theme: Theme) => {
  const isDark = theme.palette.mode === "dark";

  return {
    "& .MuiOutlinedInput-root": {
      backgroundColor: isDark
        ? "rgba(255,255,255,0.08)"
        : "rgba(255,255,255,0.65)",

      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      color: theme.palette.text.primary,
    },

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)",
    },

    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.omnixys.secondary,
    },

    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.secondary.main,
      borderWidth: 1.5,
    },

    "& .MuiInputLabel-root": {
      color: theme.palette.text.secondary,
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: theme.palette.secondary.main,
    },

    "& input, & textarea": {
      color: theme.palette.text.primary,
    },
  };
};
