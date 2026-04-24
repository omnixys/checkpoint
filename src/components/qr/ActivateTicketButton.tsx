"use client";

import {
  ActivateDeviceMutation,
  ActivateDeviceMutationVariables,
  ActivateDeviceDocument,
} from "@/checkpoint/generated/graphql";
import {
  createDeviceKeyPair,
  getDeviceHash,
  savePrivateKey,
} from "@/checkpoint/utils/ticket/device-utils";
import { useMutation } from "@apollo/client/react";
import { Button, CircularProgress, useTheme } from "@mui/material";

/**
 * Activates device binding for a ticket.
 *
 * Why:
 * - Backend requires deviceId + publicKey for verification
 * - Without this → DEVICE_MISMATCH
 */
type Props = {
  ticketId: string;
};

export default function ActivateTicketButton({ ticketId }: Props) {
  const theme = useTheme();
  const omni = theme.palette.omnixys;

  const [activateDevice, { loading }] = useMutation<
    ActivateDeviceMutation,
    ActivateDeviceMutationVariables
  >(ActivateDeviceDocument);

  const handleActivate = async () => {
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
    } catch (error) {
      console.error("Device activation failed", error);
    }
  };

  return (
    <Button
      fullWidth
      onClick={handleActivate}
      disabled={loading}
      sx={{
        borderRadius: 3,
        py: 1.4,
        fontWeight: 700,
        bgcolor: theme.palette.primary.main,
        color: theme.palette.text.primary,
        boxShadow: `0 10px 30px ${theme.palette.primary.main}44`,
        "&:hover": {
          bgcolor: theme.palette.secondary.main,
        },
      }}
    >
      {loading ? (
        <CircularProgress
          size={22}
          sx={{ color: theme.palette.text.primary }}
        />
      ) : (
        "Ticket auf diesem Gerät aktivieren"
      )}
    </Button>
  );
}
