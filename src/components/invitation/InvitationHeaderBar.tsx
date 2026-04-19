"use client";

import { alpha, Box, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";


import { motion } from "framer-motion";
import { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import RefreshArcButton from "@/checkpoint/components/RefreshArcButton";
import UserCreationInbox from "@/checkpoint/components/invitation/UserCreationInbox";
import Link from "next/link";
import { use } from "react";
import { useParams, usePathname } from "next/navigation";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
  logic: InvitationLogic;
};

/**
 * Header Top Bar
 *
 * - Always visible
 * - Compact when collapsed
 * - Contains primary actions
 */
export function InvitationHeaderBar({ collapsed, onToggle, logic }: Props) {
  const theme = useTheme();
  const params = useParams();
    const id = params?.id;

  return (
    <Box
      sx={{
        px: 3,
        py: collapsed ? 1.2 : 2,
        transition: "all 0.25s ease",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background:
          theme.palette.mode === "dark"
            ? "rgba(0,0,0,0.6)"
            : "rgba(255,255,255,0.7)",
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.6),
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Link href={`/event/${id}`} passHref>
            <Tooltip title={"Zurück zum Event"}>
              <motion.div
                transition={{ duration: 0.25, ease: "easeInOut" }}
                whileTap={{ scale: 0.9 }}
              >
                <IconButton>
                  <ArrowCircleLeftIcon fontSize="large" color={"primary"} />
                </IconButton>
              </motion.div>
            </Tooltip>
          </Link>

          {/* LEFT */}
          <Stack
            spacing={0.2}
            sx={{
              alignItems: "flex-start",
              backdropFilter: "blur(12px)",
              background: alpha(theme.palette.background.paper, 0.6),
              borderRadius: "12px",
              px: 2,
              py: 1,
            }}
          >
            <Typography
              variant={collapsed ? "h6" : "h5"}
              sx={{ fontWeight: 700 }}
            >
              Einladungen
            </Typography>

            {!collapsed && (
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Verwalte Gäste, Status und Einladungen
              </Typography>
            )}
          </Stack>
        </Stack>

        {/* RIGHT ACTIONS */}

        <Stack direction="row" spacing={1}>
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

          {/* <IconButton>
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
          </IconButton> */}

          <Box>
            <RefreshArcButton onReload={logic.reload} />
          </Box>
          <Box>
            <UserCreationInbox logic={logic} />
          </Box>
          {/* Collapse Toggle */}
          <Box>
            <Tooltip
              title={collapsed ? "Filter anzeigen" : "Filter ausblenden"}
            >
              <motion.div
                animate={{ rotate: collapsed ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconButton
                  onClick={onToggle}
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
                  <ExpandMoreIcon />
                </IconButton>
              </motion.div>
            </Tooltip>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
