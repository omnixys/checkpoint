"use client";

import { useMutation } from "@apollo/client/react";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import { Alert, Button, CircularProgress, Stack, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useRef, useState } from "react";
import DeviceBindingConfirmDialog from "@/checkpoint/components/qr/DeviceBindingConfirmDialog";
import {
  ActivateDeviceDocument,
  type ActivateDeviceMutation,
  type ActivateDeviceMutationVariables,
} from "@/checkpoint/generated/graphql";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import {
  createDeviceKeyPair,
  getDeviceHash,
  saveDeviceBindingMeta,
  saveDevicePrivateKey,
} from "@/checkpoint/utils/ticket/device-utils";

interface Props {
  ticketId: string;
  eventName?: string | undefined;
  requireConfirmation?: boolean;
  onActivated?: (() => void) | undefined;
}

export default function ActivateTicketButton({
  ticketId,
  eventName,
  requireConfirmation = false,
  onActivated,
}: Props) {
  const theme = useTheme();
  const tQr = useTypedTranslations("qr");
  const [error, setError] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const inFlightRef = useRef(false);
  const [activateDevice, { loading }] = useMutation<
    ActivateDeviceMutation,
    ActivateDeviceMutationVariables
  >(ActivateDeviceDocument);

  const runActivation = async () => {
    if (inFlightRef.current) {
      return;
    }
    inFlightRef.current = true;
    setError(false);

    try {
      const deviceId = await getDeviceHash();
      const { publicKey, privateKey } = await createDeviceKeyPair();
      await saveDevicePrivateKey(ticketId, privateKey);

      const result = await activateDevice({
        variables: {
          input: {
            ticketId,
            deviceId,
            publicKey,
          },
        },
      });

      const boundAt = result.data?.activateDevice.deviceActivationAt;
      saveDeviceBindingMeta(ticketId, {
        ticketId,
        eventId: result.data?.activateDevice.eventId ?? "",
        eventName: eventName ?? "",
        deviceId,
        boundAt: boundAt ?? new Date().toISOString(),
      });

      onActivated?.();
    } catch {
      setError(true);
    } finally {
      inFlightRef.current = false;
    }
  };

  const handleClick = () => {
    if (requireConfirmation) {
      setConfirmOpen(true);
      return;
    }
    void runActivation();
  };

  return (
    <Stack spacing={1.5}>
      <Button
        fullWidth={true}
        variant="contained"
        onClick={handleClick}
        disabled={loading}
        startIcon={
          loading ? undefined : (
            <ShieldRoundedIcon sx={{ width: theme.spacing(2.3), height: theme.spacing(2.3) }} />
          )
        }
        sx={{
          borderRadius: 3,
          py: 1.4,
          fontWeight: 900,
          color: theme.palette.primary.contrastText,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          boxShadow: `0 ${theme.spacing(1.25)} ${theme.spacing(3.5)} ${alpha(
            theme.palette.primary.main,
            0.32,
          )}`,
          "&:hover": {
            boxShadow: `0 ${theme.spacing(1.5)} ${theme.spacing(4)} ${alpha(
              theme.palette.primary.main,
              0.42,
            )}`,
          },
        }}
      >
        {loading ? (
          <CircularProgress size={theme.spacing(2.4)} color="inherit" />
        ) : (
          tQr("activateDevice")
        )}
      </Button>

      {error ? (
        <Alert
          severity="error"
          sx={{
            borderRadius: 3,
            border: 1,
            borderColor: alpha(theme.palette.error.main, 0.32),
            backgroundColor: alpha(theme.palette.error.main, 0.09),
          }}
        >
          {tQr("deviceActivationFailed")}
        </Alert>
      ) : null}

      <DeviceBindingConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          void runActivation();
        }}
      />
    </Stack>
  );
}
