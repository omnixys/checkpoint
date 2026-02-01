// DialogTransition.tsx
"use client";

import React from "react";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

const DialogTransition = React.forwardRef(function DialogTransition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default DialogTransition;
