"use client";

import { alpha, Box, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";

import { motion } from "framer-motion";
import { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import RefreshArcButton from "@/checkpoint/components/RefreshArcButton";
import UserCreationInbox from "@/checkpoint/components/invitation/UserCreationInbox";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { useDevice } from "@/checkpoint/providers/DeviceProvider";
import { env } from "@/checkpoint/lib/env";
import { copyToClipboard } from "@/checkpoint/utils/invitation/link";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
  logic: InvitationLogic;
};

export function InvitationHeaderBar({ collapsed, onToggle, logic }: Props) {
  const t = useTypedTranslations("invitation");
  const theme = useTheme();
  const params = useParams();
  const id = params?.id;
  const eventId = Array.isArray(id) ? id[0] : id;
  const { currentUser } = useAuth();

  const { isMobile } = useDevice();

  const copyInvitationLink = async () => {
    if (!eventId) return;

    const url = new URL(`${env.CHECKPOINT_BASE_PATH}rsvp`, window.location.origin);
    url.searchParams.set("eventId", eventId);

    await copyToClipboard(url.toString());
  };

  return (
    <Box
      sx={{
        px: isMobile ? 1.5 : 3,
        py: isMobile ? 1 : collapsed ? 1.2 : 2,
        transition: "all 0.25s ease",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background: alpha(theme.palette.background.paper, 0.7),
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* 🔥 MOBILE LAYOUT */}
      {isMobile ? (
        <Stack spacing={1.2}>
          {/* TOP ROW */}
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* BACK */}
            <Link href={`/event/${id}`} passHref>
              <motion.div whileTap={{ scale: 0.9 }}>
                <IconButton>
                  <ArrowCircleLeftIcon color="primary" />
                </IconButton>
              </motion.div>
            </Link>

            {/* PRIMARY ACTION */}
            <Stack direction="row" spacing={1}>
              <Tooltip title={t("create")}>
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

              <RefreshArcButton onReload={logic.reload} />
            </Stack>
          </Stack>

          {/* TITLE BLOCK */}
          <Stack
            spacing={0.2}
            sx={{
              px: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {t("title")}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
              }}
            >
              {t("subtitle")}
            </Typography>
          </Stack>

          {/* FILTER TOGGLE */}
          <Stack
            direction="row"
            sx={{
              justifyContent: "flex-end",
            }}
          >
            <Tooltip title={collapsed ? t("showFilters") : t("hideFilters")}>
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
          </Stack>
        </Stack>
      ) : (
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Link href={`/event/${id}`} passHref>
              <Tooltip title={t("backToEvent")}>
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
              <Typography variant={collapsed ? "h6" : "h5"} sx={{ fontWeight: 700 }}>
                {t("title")}
              </Typography>

              {!collapsed && (
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {t("subtitle")}
                </Typography>
              )}
            </Stack>
          </Stack>

          {/* ACTIONS */}
          <Stack direction="row" spacing={1}>
            <Tooltip title={t("create")}>
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

            <Box>
              <RefreshArcButton onReload={logic.reload} />
            </Box>

            {currentUser?.role === "ADMIN" && (
              <Box>
                <UserCreationInbox logic={logic} />
              </Box>
            )}

            <Tooltip title={t("copyLink")}>
              <motion.div whileTap={{ scale: 0.9 }}>
                <IconButton
                  disabled={!eventId}
                  onClick={() => {
                    void copyInvitationLink();
                  }}
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
                  <ContentCopyRoundedIcon />
                </IconButton>
              </motion.div>
            </Tooltip>

            <Box>
              <Tooltip title={collapsed ? t("showFilters") : t("hideFilters")}>
                <motion.div
                  animate={{ rotate: collapsed ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
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
      )}
    </Box>
  );
}
