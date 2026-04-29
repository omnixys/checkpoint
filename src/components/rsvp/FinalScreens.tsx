"use client";

import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { motion } from "framer-motion";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { env } from "@/checkpoint/lib/env";

/**
 * FinalScreens
 * - type="accepted": showing plusOnes & share links
 * - type="declined": final decline message
 */
export default function FinalScreens({
  type,
  invitation,
  plusOnes,
}: {
  type: "accepted" | "declined";
  invitation: any;
  plusOnes?: any[];
}) {
  const t = useTypedTranslations("rsvp");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [whDialogOpen, setWhDialogOpen] = useState(false);

  const firstName = invitation?.firstName ?? "";
  const lastName = invitation?.lastName ?? "";

  /** Helper for copy to clipboard */
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {}
  };

  /** ACCEPTED Screen */
  if (type === "accepted") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
      >
        <Box
          sx={{
            backdropFilter: "blur(26px)",
            WebkitBackdropFilter: "blur(26px)",
            background: theme.palette.background.paper + "BB",
            borderRadius: "24px",
            p: isMobile ? 3 : 4,
            boxShadow: theme.shadows[3],
          }}
        >
          <Stack spacing={3}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{
                fontWeight: 700,

                alignItems: "center",
              }}
            >
              {t("final.accepted.thanks", { firstName })}
            </Typography>

            <Typography sx={{ opacity: 0.85, textAlign: "center" }}>
              Wir haben deine Zusage gespeichert.
              <br />
              {invitation?.approved === false && (
                <>
                  <br />
                  {t("final.accepted.approvalHint")}
                </>
              )}
            </Typography>

            {/* PlusOnes Section */}
            {plusOnes && plusOnes.length > 0 && (
              <Stack
                spacing={2}
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 2,
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="subtitle1" sx={{ opacity: 0.85, fontWeight: 700 }}>
                  {t("final.accepted.plusOnesTitle")}
                </Typography>

                {plusOnes.map((p: any) => {
                  const link = `${window.location.origin}/checkpoint/rsvp?inv=${p.id}`;

                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 18,
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: "16px",
                          backdropFilter: "blur(20px)",
                          WebkitBackdropFilter: "blur(20px)",
                          background: theme.palette.background.paper + "44",
                          boxShadow: theme.shadows[1],
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Stack spacing={0.5}>
                          <Typography
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            {p.firstName} {p.lastName}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.6 }}>
                            {t("final.accepted.personalLink")}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              opacity: 0.85,
                              fontWeight: 500,
                              wordBreak: "break-all",
                            }}
                          >
                            {link}
                          </Typography>
                        </Stack>

                        <Tooltip title={t("common.copy")}>
                          <IconButton onClick={() => copyToClipboard(link)} sx={{ opacity: 0.7 }}>
                            <ContentCopyIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </motion.div>
                  );
                })}
              </Stack>
            )}

            {/* WhatsApp Invite Button */}
            {plusOnes && plusOnes.length > 0 && (
              <Button
                variant="contained"
                onClick={() => setWhDialogOpen(true)}
                sx={{
                  mt: 2,
                  py: 1.6,
                  borderRadius: "14px",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                }}
              >
                {t("final.accepted.invitePlusOne")}
              </Button>
            )}
          </Stack>
        </Box>

        {/* WhatsApp Invite Dialog */}
        {/* <WhatsappInviteDialog
          open={whDialogOpen}
          onClose={() => setWhDialogOpen(false)}
          invitation={invitation}
          plusOnes={plusOnes ?? []}
        /> */}
      </motion.div>
    );
  }

  /** DECLINED Screen */
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
    >
      <Box
        sx={{
          backdropFilter: "blur(26px)",
          WebkitBackdropFilter: "blur(26px)",
          background: theme.palette.background.paper + "BB",
          borderRadius: "24px",
          p: isMobile ? 3 : 4,
          boxShadow: theme.shadows[3],
        }}
      >
        <Stack
          spacing={3}
          sx={{
            alignItems: "center",
          }}
        >
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{
              fontWeight: 700,

              alignItems: "center",
            }}
          >
            {t("final.declined.title")}
          </Typography>

          <Typography sx={{ opacity: 0.85, textAlign: "center" }}>
            {t("final.declined.saved", { firstName })}
            <br />
            {t("final.declined.contactHint")}
          </Typography>

          <Button
            variant="contained"
            onClick={() => (window.location.href = env.CHECKPOINT_BASE_PATH)}
            sx={{
              mt: 2,
              px: 4,
              py: 1.4,
              borderRadius: "14px",
              fontSize: "1.05rem",
            }}
          >
            {t("final.declined.backHome")}
          </Button>
        </Stack>
      </Box>
    </motion.div>
  );
}
