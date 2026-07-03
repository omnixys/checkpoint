"use client";

import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
import { Button } from "@mui/material";

export default function SeatImportButton({ onOpen }: { onOpen: () => void }) {
  return (
    <Button variant="outlined" startIcon={<UploadRoundedIcon />} onClick={onOpen}>
      CSV Importieren
    </Button>
  );
}
