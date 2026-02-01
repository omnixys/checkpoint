"use client";

import { Capacitor } from "@capacitor/core";
import { Box, Card, CardActions, CardContent, Typography } from "@mui/material";
import { useState } from "react";

import { ScanResult } from "@/types/scan/scan.type";
import { getDeviceHash } from "@/utils/device-hash";
import { playScanFeedback } from "@/utils/scan-feedback";
import { useScanTicket } from "./hooks/useScanTicket";
import NativeScanner from "./NativeScanner";
import ScanResultCard from "./ScanResultCard";
import StatusHeader from "./StatusHeader";
import WebCameraScanner from "./WebCameraScanner";

export default function ScanContent() {
  const scanTicket = useScanTicket();
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleWebDetect = async (qrText: string) => {
    
    const res = await scanTicket(qrText);
    await playScanFeedback(res);
    setResult(res);
    return res.valid;
  };
  const isNative = Capacitor.isNativePlatform();

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top animated header */}
      <StatusHeader />

      {/* Scanner section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, sm: 3 },
          pb: 4,
        }}
      >
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
              QR-Scanner
            </Typography>

            {isNative ? (
              <NativeScanner />
            ) : (
              <WebCameraScanner onDetect={handleWebDetect} />
            )}

            {result && (
              <Box sx={{ mt: 2 }}>
                <ScanResultCard result={result} />
              </Box>
            )}
          </CardContent>

          <CardActions>
            <Typography variant="caption" color="text.secondary">
              {isNative
                ? "Nativer ML-Kit-Scanner"
                : "Browser-Scanner (BarcodeDetector)"}
            </Typography>
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
}
