"use client";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Button } from "@mui/material";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";

interface Props {
  onOpen: () => void;
}

export default function EventSelectorMobileButton({ onOpen }: Props) {
  const { activeEvent } = useActiveEvent();

  return (
    <Button
      onClick={onOpen}
      variant="text"
      sx={{
        textTransform: "none",
        color: "text.primary",
        fontWeight: 600,
        fontSize: 16,
        display: "flex",
        alignItems: "center",
        gap: 0.5,
      }}
    >
      {activeEvent?.name ?? "Event wählen"}
      <ArrowDropDownIcon />
    </Button>
  );
}
