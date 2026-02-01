"use client";

import React from "react";
import { Button } from "@mui/material";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";

export default function SeatImportButton({ onOpen }: { onOpen: () => void }) {
  return (
    <Button
      variant="outlined"
      startIcon={<UploadRoundedIcon />}
      onClick={onOpen}
    >
      CSV Importieren
    </Button>
  );
}
