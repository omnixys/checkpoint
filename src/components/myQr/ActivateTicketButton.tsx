"use client";

import { ACTIVATE_DEVICE } from "@/graphql/ticket/ticket.mutation";
import {
  ActivateDeviceRequest,
  ActivateDeviceResult,
} from "@/types/ticket/ticket-graphql-mutation.type";
import { getDeviceHash } from "@/utils/device-hash";
import { getDeviceKeyPair } from "@/utils/device-keypair";
import { useMutation } from "@apollo/client/react";
import { Button, CircularProgress, useTheme } from "@mui/material";

type Props = {
  ticketId: string;
};

export default function ActivateTicketButton({ ticketId }: Props) {
  const theme = useTheme();
  const omni = theme.palette.omnixys;

  const [activateDevice, { loading }] = useMutation<
    ActivateDeviceResult,
    ActivateDeviceRequest
  >(ACTIVATE_DEVICE);

  const handleActivate = async () => {
    try {
      const deviceHash = await getDeviceHash();
      const { publicKey } = await getDeviceKeyPair();

      await activateDevice({
        variables: {
          input: {
            ticketId,
            deviceHash,
            devicePublicKey: publicKey,
            ip: "client",
          },
        },
      });
    } catch (e) {
      console.error("Ticket activation failed", e);
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
        bgcolor: omni.primary,
        color: omni.textPrimary,
        boxShadow: `0 10px 30px ${omni.primary}44`,
        "&:hover": {
          bgcolor: omni.secondary,
        },
      }}
    >
      {loading ? (
        <CircularProgress size={22} sx={{ color: omni.textPrimary }} />
      ) : (
        "Ticket auf diesem Gerät aktivieren"
      )}
    </Button>
  );
}
