"use client";

import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export interface Props<T> {
  label?: string;
  onGenerate: () => Promise<T>;
}


export default function AIButton<T>({ label = "AI generate", onGenerate }: Props<T>) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await onGenerate();
    setLoading(false);
  };

  return (
    <Button
      variant="outlined"
      startIcon={
        loading ? (
          <CircularProgress size={18} />
        ) : (
          <AutoAwesomeIcon />
        )
      }
      onClick={handleClick}
      sx={{ mb: 2, textTransform: "none" }}
    >
      {label}
    </Button>
  );
}


//<AIButton label="✨ AI Magic" onGenerate={handleAIGenerate} />