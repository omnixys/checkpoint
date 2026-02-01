// components/event-description/gallery/gallery.style.ts
import { Theme } from "@mui/material";

export const gallerySx = {
  root: (theme: Theme) => ({
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: theme.spacing(6, 2),
    display: "grid",
    gap: theme.spacing(2),
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  }),

  // ratio wird NICHT mehr hier übergeben
  imageWrapper: (theme: Theme) => ({
    position: "relative",
    width: "100%",
    overflow: "hidden",
    borderRadius: (theme.shape.borderRadius as number)* 2,
  }),

  img: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  } as const,

  editButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
};
