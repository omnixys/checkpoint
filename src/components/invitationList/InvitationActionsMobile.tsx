"use client";

import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { UseInvitationLogicReturn } from "./hooks/useInvitationLogic";
import UserCreationInbox from "./button/UserCreationInbox";
import RefreshArcButton from "./RefreshArcButton";

/* ---------------------------------------------------------------------------
 * VisionOS Mobile Action Menu
 * Appears only on small screens (< 600px).
 * ------------------------------------------------------------------------- */
export default function InvitationActionsMobile({
  logic,
}: {
  logic: UseInvitationLogicReturn;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  if (!isMobile) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        width: "100%",
      }}
    >
      <IconButton
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          backdropFilter: "blur(16px)",
          backgroundColor: theme.palette.background.paper,
          borderRadius: "16px",
          boxShadow: theme.shadows[4],
        }}
      >
        <MoreHorizRoundedIcon />
      </IconButton>

      <Menu
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            backdropFilter: "blur(20px)",
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[6],
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setAnchor(null);
            logic.setCreateOpen(true);
          }}
        >
          Neue Einladung
        </MenuItem>

        <MenuItem
          onClick={() => {
            setAnchor(null);
            logic.setImportOpen(true);
          }}
        >
          Importieren
        </MenuItem>

        <MenuItem>
          <UserCreationInbox logic={logic} />
        </MenuItem>
      </Menu>
    </Box>
  );
}
