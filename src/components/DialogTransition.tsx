// DialogTransition.tsx
"use client";

import Slide from "@mui/material/Slide";
import type { TransitionProps } from "@mui/material/transitions";
import React from "react";

const DialogTransition = React.forwardRef(function DialogTransition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default DialogTransition;
