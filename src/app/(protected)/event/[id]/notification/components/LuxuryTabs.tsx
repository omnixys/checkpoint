"use client";

import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { NotificationChannel } from "../types/notification-channel.enum";

type Props = {
  value: NotificationChannel;
  onChange: (value: NotificationChannel) => void;
};

export function LuxuryTabs({ value, onChange }: Props) {
  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        justifyContent: "center",
        backdropFilter: "blur(20px)",
      }}
    >
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, val) => val && onChange(val)}
        sx={{
          borderRadius: "999px",
          background: "rgba(255,255,255,0.05)",
          p: 0.5,
        }}
      >
        {Object.values(NotificationChannel).map((c) => (
          <ToggleButton
            key={c}
            value={c}
            sx={{
              px: 3,
              borderRadius: "999px",
              color: "white",
              "&.Mui-selected": {
                background:
                  "linear-gradient(135deg, #5B8CFF, #7B61FF, #9F6BFF)",
                color: "white",
              },
            }}
          >
            {c}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
