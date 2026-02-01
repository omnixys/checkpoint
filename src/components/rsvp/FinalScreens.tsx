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

import WhatsappInviteDialog from "./WhatsappInviteDialog";

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
              fontWeight={700}
              textAlign="center"
            >
              Danke {firstName}!
            </Typography>

            <Typography textAlign="center" sx={{ opacity: 0.85 }}>
              Wir haben deine Zusage gespeichert.
              <br />
              {invitation?.approved === false && (
                <>
                  <br />
                  Bitte beachte: Dein Ticket wird erst nach Freigabe durch das
                  Event-Team erstellt.
                </>
              )}
            </Typography>

            {/* PlusOnes Section */}
            {plusOnes && plusOnes.length > 0 && (
              <Stack spacing={2} mt={2}>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{ opacity: 0.85 }}
                >
                  Deine eingeladenen Personen
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
                          <Typography fontWeight={600}>
                            {p.firstName} {p.lastName}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.6 }}>
                            Persönlicher Einladungslink:
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

                        <Tooltip title="Kopieren">
                          <IconButton
                            onClick={() => copyToClipboard(link)}
                            sx={{ opacity: 0.7 }}
                          >
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
                PlusOne einladen (WhatsApp)
              </Button>
            )}
          </Stack>
        </Box>

        {/* WhatsApp Invite Dialog */}
        <WhatsappInviteDialog
          open={whDialogOpen}
          onClose={() => setWhDialogOpen(false)}
          invitation={invitation}
          plusOnes={plusOnes ?? []}
        />
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
        <Stack spacing={3} alignItems="center">
          <Typography
            variant={isMobile ? "h6" : "h5"}
            fontWeight={700}
            textAlign="center"
          >
            Schade, dass du nicht kommen kannst
          </Typography>

          <Typography textAlign="center" sx={{ opacity: 0.85 }}>
            {firstName} {lastName}, deine Absage wurde gespeichert.
            <br />
            Wenn du dich umentscheiden möchtest, wende dich bitte direkt an das
            Event-Team.
          </Typography>

          <Button
            variant="contained"
            onClick={() => (window.location.href = "/checkpoint/")}
            sx={{
              mt: 2,
              px: 4,
              py: 1.4,
              borderRadius: "14px",
              fontSize: "1.05rem",
            }}
          >
            Zur Startseite
          </Button>
        </Stack>
      </Box>
    </motion.div>
  );
}
