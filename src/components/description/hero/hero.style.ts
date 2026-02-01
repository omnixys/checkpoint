// components/event-description/hero/hero.style.ts
import { Theme } from "@mui/material";
import { spotlightHover } from "@/components/description/motion";

export const heroSx = {
  root: (theme: Theme, height: any) => ({
    position: "relative",
    width: "100%",
    height: height ?? "80vh",
    borderRadius: (theme.shape.borderRadius as number) * 2,
    overflow: "hidden",
    cursor: "default",
    ...spotlightHover,
  }),

  bg: (bg?: string) => ({
    position: "absolute",
    inset: 0,
    ...(bg ? { backgroundImage: `url(${bg})` } : {}),
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    zIndex: 1,
  }),

  overlay: (theme: any, opacity: number = 0.32) => ({
    position: "absolute",
    inset: 0,
    background: `linear-gradient(rgba(0,0,0,${opacity}), rgba(0,0,0,${
      opacity * 0.8
    }))`,
    zIndex: 2,
  }),

  content: (theme: any) => ({
    position: "relative",
    zIndex: 3,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    px: 3,
    color: theme.palette.common.white,
    backdropFilter: "blur(2px)",
  }),

  editButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 4,
  },
};
