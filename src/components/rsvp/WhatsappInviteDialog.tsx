"use client";

import { UPDATE_USER_PHONE_NUMBERS } from "@/graphql/invitation/invitation.mutation";
import { useMutation } from "@apollo/client/react";
import {
  Button,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";

/**
 * WhatsappInviteDialog
 * - Saves WhatsApp number for the newly created User
 * - Builds WhatsApp message containing all PlusOne invitation links
 * - Opens WhatsApp or WhatsApp Web immediately after saving
 */
export default function WhatsappInviteDialog({
  open,
  onClose,
  invitation,
  plusOnes,
}: {
  open: boolean;
  onClose: () => void;
  invitation: any;
  plusOnes: any[];
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [whNumber, setWhNumber] = useState("");
  const [saving, setSaving] = useState(false);

  // Mutation: Update user phone numbers
  const [updatePhoneNumbers] = useMutation(UPDATE_USER_PHONE_NUMBERS);

  if (!open) return null;

  const userId = invitation?.guestProfileId;

  /** Build WhatsApp message for multiple PlusOnes */
  const buildWhatsappMessage = () => {
    let message =
      `Hallo! 👋\n` + `Ich möchte dich zu meinem Event einladen.\n\n`;

    for (const p of plusOnes) {
      const link = `${
        typeof window !== "undefined" ? window.location.origin : ""
      }/checkpoint/rsvp?inv=${p.id}`;
      message += `• Einladung für ${p.firstName} ${p.lastName}: ${link}\n`;
    }

    message += `\nBitte öffne den Link in deinem Browser und bestätige deine Teilnahme.`;

    return encodeURIComponent(message);
  };

  /** Save phone number + open WhatsApp  */
  const handleSend = async () => {
    if (!whNumber.trim() || saving) return;
    setSaving(true);

    // 1. Update phone number in user profile
    await updatePhoneNumbers({
      variables: {
        input: {
          userId,
          phoneNumbers: [
            {
              type: "WHATSAPP",
              number: whNumber.trim(),
              isPrimary: false,
            },
          ],
        },
      },
    });

    // 2. Build WhatsApp share link
    const encodedMsg = buildWhatsappMessage();
    const target = `https://wa.me/${whNumber}?text=${encodedMsg}`;

    // 3. Close dialog + open WhatsApp
    onClose();
    setTimeout(() => {
      window.open(target, "_blank");
    }, 350);

    setSaving(false);
  };

  /** Desktop VisionOS Bubble */
  const DesktopBubble = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        background: theme.palette.background.paper + "D8",
        borderRadius: "24px",
        padding: "32px 40px",
        boxShadow: theme.shadows[6],
        width: "90%",
        maxWidth: "460px",
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h6" fontWeight={700} textAlign="center">
          WhatsApp Einladung senden
        </Typography>

        <Typography textAlign="center" sx={{ opacity: 0.8 }}>
          Bitte gib deine WhatsApp-Nummer ein, um die Einladungen direkt zu
          versenden.
        </Typography>

        <TextField
          fullWidth
          label="WhatsApp Nummer"
          value={whNumber}
          onChange={(e) => setWhNumber(e.target.value)}
        />

        <Stack spacing={2}>
          <Button
            variant="contained"
            disabled={!whNumber.trim() || saving}
            onClick={handleSend}
            sx={{
              py: 1.4,
              borderRadius: "14px",
              fontSize: "1.05rem",
              fontWeight: 600,
            }}
          >
            Senden via WhatsApp
          </Button>

          <Button
            variant="text"
            onClick={onClose}
            sx={{
              opacity: 0.7,
              borderRadius: "14px",
            }}
          >
            Abbrechen
          </Button>
        </Stack>
      </Stack>
    </motion.div>
  );

  /** Mobile Fullscreen Sheet */
  const MobileSheet = () => (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: theme.palette.background.paper + "E6",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        padding: "32px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight={700} textAlign="center">
          WhatsApp Einladung
        </Typography>

        <Typography textAlign="center" sx={{ opacity: 0.8 }}>
          Trage deine WhatsApp-Nummer ein, damit die Einladung direkt verschickt
          werden kann.
        </Typography>

        <TextField
          fullWidth
          label="WhatsApp Nummer"
          value={whNumber}
          onChange={(e) => setWhNumber(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          disabled={!whNumber.trim() || saving}
          onClick={handleSend}
          sx={{
            py: 1.6,
            borderRadius: "16px",
            fontSize: "1.1rem",
            fontWeight: 600,
          }}
        >
          Senden
        </Button>

        <Button
          fullWidth
          variant="text"
          onClick={onClose}
          sx={{
            opacity: 0.7,
            py: 1.4,
          }}
        >
          Abbrechen
        </Button>
      </Stack>
    </motion.div>
  );

  return <>{isMobile ? <MobileSheet /> : <DesktopBubble />}</>;
}
