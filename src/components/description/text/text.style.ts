// components/event-description/text/text.style.ts

import { Theme } from "@mui/material";

export const textSx = {
  root: (theme: any) => ({
    maxWidth: "900px",
    margin: "0 auto",
    padding: theme.spacing(6, 2),
  }),

  title: {
    marginBottom: 2,
  },

  content: (theme: Theme, align: string) => ({
    textAlign: align,
    lineHeight: 1.6,
    "& p": {
      marginBottom: theme.spacing(2),
    },
  }),

  editButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
};
