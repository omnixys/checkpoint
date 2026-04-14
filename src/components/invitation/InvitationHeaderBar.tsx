"use client";

import { IconButton, Stack, Tooltip, alpha, useTheme } from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import { motion } from "framer-motion";
import { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import RefreshArcButton from "@/checkpoint/components/RefreshArcButton";
import UserCreationInbox from "@/checkpoint/components/invitation/UserCreationInbox";

/* ---------------------------------------------------------------------------
 * Invitation Header Action Bar
 *
 * Responsibilities:
 * - Create Invitation
 * - Import Invitations
 * - Reload Data
 * - Show User Inbox (created users)
 *
 * Design:
 * - Glassmorphism
 * - Floating compact controls
 * ------------------------------------------------------------------------- */
export default function InvitationHeaderBar({ logic }: { logic: InvitationLogic }) {
  const theme = useTheme();

  return (
    <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
      {/* -----------------------------
       * CREATE INVITATION
       * --------------------------- */}
      <Tooltip title="Einladung erstellen">
        <motion.div whileTap={{ scale: 0.9 }}>
          <IconButton
            onClick={() => logic.setCreateOpen(true)}
            sx={{
              backdropFilter: "blur(12px)",
              background: alpha(theme.palette.primary.main, 0.15),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              boxShadow: theme.shadows[3],
              "&:hover": {
                background: alpha(theme.palette.primary.main, 0.25),
              },
            }}
          >
            <AddRoundedIcon />
          </IconButton>
        </motion.div>
      </Tooltip>

      {/* -----------------------------
       * IMPORT INVITATIONS
       * --------------------------- */}
      <Tooltip title="Einladungen importieren">
        <motion.div whileTap={{ scale: 0.9 }}>
          <IconButton
            onClick={() => logic.setImportOpen(true)}
            sx={{
              backdropFilter: "blur(12px)",
              background: alpha(theme.palette.secondary.main, 0.15),
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
              boxShadow: theme.shadows[3],
              "&:hover": {
                background: alpha(theme.palette.secondary.main, 0.25),
              },
            }}
          >
            <UploadFileRoundedIcon />
          </IconButton>
        </motion.div>
      </Tooltip>

      {/* -----------------------------
       * RELOAD (ARC BUTTON)
       * --------------------------- */}
      <RefreshArcButton onReload={logic.reload} />

      {/* -----------------------------
       * USER INBOX (CREATED USERS)
       * --------------------------- */}
      <UserCreationInbox logic={logic} />
    </Stack>
  );
}
