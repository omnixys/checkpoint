"use client";

import { useDevice } from "@/providers/DeviceProvider";
import { alpha, Box, Stack, useTheme } from "@mui/material";
import { motion } from "framer-motion";

type VariantType = "A" | "B" | "C" | "D";

type Props = {
  variant: VariantType;
  onChange: (v: VariantType) => void;
};

/* --------------------------------------------------------
 * Vision Pro Style Floating Option
 * ------------------------------------------------------ */
function VisionOption({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: VariantType;
  active: boolean;
  onClick: () => void;
}) {
  const theme = useTheme();

  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Box
        onClick={onClick}
        sx={{
          px: 2.8,
          py: 1.4,
          borderRadius: "22px",
          textAlign: "center",
          fontWeight: 600,
          fontSize: "0.85rem",
          cursor: "pointer",
          whiteSpace: "nowrap",

          // Vision Pro floating glass
          backdropFilter: "blur(22px)",
          background: active
            ? alpha(theme.palette.primary.main, 0.22)
            : alpha(theme.palette.background.paper, 0.28),

          border: `1px solid ${
            active
              ? alpha(theme.palette.primary.main, 0.45)
              : alpha(theme.palette.divider, 0.35)
          }`,

          // Inner glow + light bloom
          boxShadow: active
            ? `
                0 0 12px ${alpha(theme.palette.primary.main, 0.6)},
                inset 0 0 14px ${alpha(theme.palette.primary.light, 0.22)},
                0 4px 20px ${alpha("#000", 0.25)}
              `
            : `
                inset 0 0 8px ${alpha(theme.palette.common.white, 0.08)},
                0 4px 12px ${alpha("#000", 0.22)}
              `,

          color: active
            ? theme.palette.primary.main
            : theme.palette.text.secondary,

          transition: "all 0.3s ease",
          userSelect: "none",
        }}
      >
        {label}
      </Box>
    </motion.div>
  );
}

/* --------------------------------------------------------
 * Simple Desktop Option
 * ------------------------------------------------------ */
function DesktopOption({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: VariantType;
  active: boolean;
  onClick: () => void;
}) {
  const theme = useTheme();

  return (
    <motion.div whileTap={{ scale: 0.94 }} whileHover={{ scale: 1.06 }}>
      <Box
        onClick={onClick}
        sx={{
          cursor: "pointer",
          px: 2.6,
          py: 1.1,
          borderRadius: "18px",
          fontWeight: 600,
          fontSize: "0.9rem",
          bgcolor: active
            ? alpha(theme.palette.primary.main, 0.28)
            : alpha(theme.palette.background.paper, 0.35),
          color: active
            ? theme.palette.primary.main
            : theme.palette.text.secondary,
          backdropFilter: "blur(14px)",
          boxShadow: active
            ? `0 0 12px ${alpha(theme.palette.primary.main, 0.4)}`
            : `0 0 8px ${alpha(theme.palette.common.black, 0.15)}`,
          border: `1px solid ${
            active
              ? alpha(theme.palette.primary.main, 0.4)
              : alpha(theme.palette.divider, 0.3)
          }`,
          transition: "all .25s ease",
          userSelect: "none",
          textAlign: "center",
        }}
      >
        {label}
      </Box>
    </motion.div>
  );
}

/* --------------------------------------------------------
 * MAIN COMPONENT
 * ------------------------------------------------------ */
export default function EventVariantToggle({ variant, onChange }: Props) {
  const { isMobile } = useDevice();
  const theme = useTheme();

  const OPTIONS: { label: string; value: VariantType }[] = [
    { label: "A – Calendar", value: "A" },
    { label: "B – Hero", value: "B" },
    { label: "C – Dashboard", value: "C" },
    { label: "D – Vision Pro", value: "D" },
  ];

  return (
    <>
      {/* MOBILE: Vision Pro UI */}
      {isMobile && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Stack
            direction="row"
            spacing={1.2}
            sx={{
              overflowX: "auto",
              whiteSpace: "nowrap",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              py: 0.4,
              px: 1,
              borderRadius: "30px",

              // floating capsule background VisionOS
              backdropFilter: "blur(28px)",
              background: alpha(theme.palette.background.paper, 0.3),
              border: `1px solid ${alpha(theme.palette.divider, 0.25)}`,
              boxShadow: `
                inset 0 0 20px ${alpha(theme.palette.common.white, 0.06)},
                0 4px 25px ${alpha("#000", 0.28)}
              `,
            }}
          >
            {OPTIONS.map((o) => (
              <VisionOption
                key={o.value}
                label={o.label}
                value={o.value}
                active={variant === o.value}
                onClick={() => onChange(o.value)}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* DESKTOP: Normal UI */}
      {!isMobile && (
        <Stack direction="row" spacing={1.5}>
          {OPTIONS.map((o) => (
            <DesktopOption
              key={o.value}
              label={o.label}
              value={o.value}
              active={variant === o.value}
              onClick={() => onChange(o.value)}
            />
          ))}
        </Stack>
      )}
    </>
  );
}
