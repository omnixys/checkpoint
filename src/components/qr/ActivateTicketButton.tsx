"use client";

import { useMutation } from "@apollo/client/react";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import { Alert, Button, CircularProgress, Stack, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";
import {
  ActivateDeviceDocument,
  type ActivateDeviceMutation,
  type ActivateDeviceMutationVariables,
} from "@/checkpoint/generated/graphql";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import {
  createDeviceKeyPair,
  getDeviceHash,
  savePrivateKey,
} from "@/checkpoint/utils/ticket/device-utils";

type Props = {
  ticketId: string;
  onActivated?: (() => void) | undefined;
};

export default function ActivateTicketButton({ ticketId, onActivated }: Props) {
  const theme = useTheme();
  const tQr = useTypedTranslations("qr");
  const [error, setError] = useState<boolean>(false);
  const [activateDevice, { loading }] = useMutation<
    ActivateDeviceMutation,
    ActivateDeviceMutationVariables
  >(ActivateDeviceDocument);

  const handleActivate = async () => {
    setError(false);

    try {
      const deviceId = await getDeviceHash();
      const { publicKey, privateKey } = await createDeviceKeyPair();
      await savePrivateKey(privateKey);

      await activateDevice({
        variables: {
          input: {
            ticketId,
            deviceId,
            publicKey,
          },
        },
      });

      onActivated?.();
    } catch {
      setError(true);
    }
  };

  return (
    <Stack spacing={1.5}>
      <Button
        fullWidth={true}
        variant="contained"
        onClick={handleActivate}
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
    </Stack>
  );
}
