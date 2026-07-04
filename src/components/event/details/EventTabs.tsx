"use client";

import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { EventVisibleTab } from "@/checkpoint/generated/graphql";
import type { EventTabKey } from "@/checkpoint/hooks/events/useEventTabs";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

interface TabDefinition {
  key: EventTabKey;
  visibleTab: EventVisibleTab;
  tKey: any;
}

const TABS: TabDefinition[] = [
  { key: "timeline", visibleTab: EventVisibleTab.TIMELINE, tKey: "tabs.timeline" },
  { key: "details", visibleTab: EventVisibleTab.DETAILS, tKey: "tabs.details" },
  { key: "map", visibleTab: EventVisibleTab.MAP, tKey: "tabs.map" },
];

interface Props {
  active: EventTabKey;
  onChange: (v: EventTabKey) => void;
  visibleTabs?: readonly EventVisibleTab[] | null;
}

export default function EventTabs({ active, onChange, visibleTabs }: Props) {
  const theme = useTheme();
  const t = useTypedTranslations("event");
  const visibleTabSet = useMemo(() => new Set(visibleTabs?.length ? visibleTabs : TABS.map((tab) => tab.visibleTab)), [visibleTabs]);
  const tabs = useMemo(() => TABS.filter((tab) => visibleTabSet.has(tab.visibleTab)), [visibleTabSet]);

  useEffect(() => {
    if (tabs.length > 0 && !tabs.some((tab) => tab.key === active)) {
      onChange(tabs[0]!.key);
    }
  }, [active, onChange, tabs]);

  return (
    <Box
      sx={{
        position: "sticky",
        top: -40,
        zIndex: 5,
        backdropFilter: "blur(14px)",
        backgroundColor: alpha(theme.palette.background.paper, 0.5),
        borderRadius: "20px",
        px: 2,
        py: 1.2,
        boxShadow: theme.shadows[3],
        overflowX: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ minWidth: "max-content" }}>
        {tabs.map((tab) => {
          const selected = active === tab.key;

          return (
            <Box
              key={tab.key}
              sx={{ position: "relative", cursor: "pointer" }}
              onClick={() => onChange(tab.key)}
            >
              <Typography
                sx={{
                  px: 1,
                  py: 0.8,
                  fontWeight: selected ? 700 : 500,
                  color: selected ? theme.palette.primary.main : theme.palette.text.secondary,
                  transition: "0.25s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {t(tab.tKey)}
              </Typography>

              {selected && (
                <motion.div
                  layoutId="event-tabs-underline"
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: -4,
                    height: 3,
                    borderRadius: 3,
                    backgroundColor: theme.palette.primary.main,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
