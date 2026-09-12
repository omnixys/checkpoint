"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

const QR_ZOOM_CANVAS_SIZE = 480;
const QR_ZOOM_MARGIN_SIZE = 12;

const MotionBox = motion.create(Box);

interface Props {
  open: boolean;
  onClose: () => void;
  payload: string;
  remainingSeconds: number;
  eventName?: string | undefined;
}

export default function QrZoomDialog({
  open,
  onClose,
  payload,
  remainingSeconds,
  eventName,
}: Props) {
  const theme = useTheme();
  const tQr = useTypedTranslations("qr");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" aria-labelledby="qr-zoom-title">
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "flex-start",
          justifyContent: "space-between",
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 3 },
          pb: 0,
          minWidth: 0,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <DialogTitle id="qr-zoom-title" sx={{ p: 0, mb: 0.5, fontWeight: 900 }}>
            {eventName ?? tQr("title")}
          </DialogTitle>
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary, display: "block" }}
          >
            {tQr("subtitle")}
          </Typography>
        </Box>

        <IconButton
          aria-label={tQr("close")}
          onClick={onClose}
          sx={{
            flexShrink: 0,
            width: theme.spacing(4.5),
            height: theme.spacing(4.5),
            color: theme.palette.text.secondary,
            backgroundColor: alpha(theme.palette.background.paper, 0.6),
            border: 1,
            borderColor: alpha(theme.palette.divider, 0.62),
            "&:hover": {
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              color: theme.palette.text.primary,
            },
          }}
        >
          <CloseRoundedIcon sx={{ width: theme.spacing(2.4), height: theme.spacing(2.4) }} />
        </IconButton>
      </Stack>

      <DialogContent>
        <Stack spacing={2} sx={{ alignItems: "center", width: "100%" }}>
          <MotionBox
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            sx={{
              width: "100%",
              maxWidth: { xs: theme.spacing(34), sm: theme.spacing(42) },
              aspectRatio: "1 / 1",
              p: { xs: 1.25, sm: 1.75 },
              borderRadius: 4,
              border: 1,
              borderColor: alpha(theme.palette.divider, 0.72),
              backgroundColor: theme.palette.common.white,
              boxShadow: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.14)}, 0 ${theme.spacing(
                1,
              )} ${theme.spacing(3)} ${alpha(theme.palette.common.black, 0.14)}`,
            }}
          >
            <QRCodeCanvas
              value={payload}
              size={QR_ZOOM_CANVAS_SIZE}
              marginSize={QR_ZOOM_MARGIN_SIZE}
              fgColor={theme.palette.common.black}
              bgColor={theme.palette.common.white}
              style={{ width: "100%", height: "100%", display: "block" }}
            />
          </MotionBox>

          <Typography
            variant="body2"
            sx={{
              fontWeight: 800,
              color: remainingSeconds > 0 ? theme.palette.text.secondary : theme.palette.error.main,
            }}
          >
            {remainingSeconds > 0
              ? tQr("validFor", { seconds: remainingSeconds })
              : tQr("noActiveQr")}
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
