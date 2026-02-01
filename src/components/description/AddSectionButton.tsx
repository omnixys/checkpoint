"use client";

import React from "react";
import { Box, Fab, Menu, MenuItem } from "@mui/material";
import { Add } from "@mui/icons-material";
import { SectionType } from "./section/section.types";

interface Props {
  onAdd: (type: SectionType) => void;
  label?: string
}

export default function AddSectionButton({ onAdd }: Props) {
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);

  return (
    <Box sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 2001 }}>
      <Fab color="primary" onClick={(e) => setAnchor(e.currentTarget)}>
        <Add />
      </Fab>

      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
        {[
          "hero",
          "text",
          "gallery",
          "features",
          "timeline",
          "location",
          "team",
          "faq",
          "quote",
        ].map((type) => (
          <MenuItem
            key={type}
            onClick={() => {
              onAdd(type as SectionType);
              setAnchor(null);
            }}
          >
            Add {type}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
