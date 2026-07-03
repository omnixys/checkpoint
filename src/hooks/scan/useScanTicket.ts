import { useMutation } from "@apollo/client/react";
import { useCallback } from "react";
import {
  type ScanPayload,
  ScanTokenDocument,
  type ScanTokenMutation,
  type ScanTokenMutationVariables,
} from "@/checkpoint/generated/graphql";

interface QrPayload {
  token: string;
  signature: string;
  deviceId: string;
}

function parseQrPayload(qr: string): QrPayload | null {
  try {
    const parsed: unknown = JSON.parse(qr);

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const candidate = parsed as Partial<Record<keyof QrPayload, unknown>>;

    if (
      typeof candidate.token === "string" &&
      typeof candidate.signature === "string" &&
      typeof candidate.deviceId === "string"
    ) {
      return {
        token: candidate.token,
        signature: candidate.signature,
        deviceId: candidate.deviceId,
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function useScanTicket() {
  const [scanMutation] = useMutation<ScanTokenMutation, ScanTokenMutationVariables>(
    ScanTokenDocument,
  );

  return useCallback(
    async (qr: string): Promise<ScanPayload | null> => {
      const parsed = parseQrPayload(qr);

      if (!parsed) {
        return null;
      }

      const { data } = await scanMutation({
        variables: {
          input: {
            token: parsed.token,
            signature: parsed.signature,
            deviceId: parsed.deviceId,
            gate: "MAIN_GATE",
          },
        },
      });

      return data?.scanToken ?? null;
    },
    [scanMutation],
  );
}
