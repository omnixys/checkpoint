"use client";

import { copyToClipboard } from "@/components/../lib/links";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, Button, Stack } from "@mui/material";

type Props = {
  phone?: string | null;
  inviteText: string;
  rsvpUrl: string;
};

export default function InvitationShareBar({
  phone,
  inviteText,
  rsvpUrl,
}: Props) {
  const openWhatsapp = (text: string) => {
    const base = phone
      ? `https://wa.me/${phone.replace(/\D/g, "")}`
      : "https://wa.me/";
    window.open(
      `${base}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener"
    );
  };

  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 16,
        zIndex: 20,
        mx: "auto",
        width: "fit-content",
        borderRadius: 999,
        backdropFilter: "blur(22px)",
        background: "rgba(255,255,255,0.75)",
        border: "1px solid rgba(255,255,255,0.4)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
        px: 1.5,
        py: 1,
      }}
    >
      <Stack direction="row" spacing={1}>
        <Button
          startIcon={<WhatsAppIcon />}
          onClick={() =>
            openWhatsapp("Hallo, ich melde mich wegen deiner Einladung.")
          }
        >
          Nachricht
        </Button>

        <Button
          startIcon={<WhatsAppIcon />}
          onClick={() => openWhatsapp(inviteText)}
        >
          Einladung
        </Button>

        <Button
          startIcon={<ContentCopyRoundedIcon />}
          onClick={() => copyToClipboard(rsvpUrl)}
        >
          RSVP
        </Button>
      </Stack>
    </Box>
  );
}
