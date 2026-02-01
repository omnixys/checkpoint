"use client";

import React, { JSX } from "react";
import { Box, Typography, TextField, Fade } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";
import { useActiveEvent } from "@/providers/ActiveEventProvider";
import { Event } from "@/types/event/event.type";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function EventSelectorActionSheet({
  open,
  onClose,
}: Props): JSX.Element {
  const { events, activeEventId, selectEvent } = useActiveEvent();
  const [search, setSearch] = React.useState("");

  const filtered = events.filter((ev) =>
    ev.name.toLowerCase().includes(search.toLowerCase())
  );

  // SPRING ANIMATION (real iOS feel)
  const spring = useSpring({
    from: { y: 300, opacity: 0.8 },
    to: {
      y: open ? 0 : 300,
      opacity: open ? 1 : 0,
    },
    config: {
      tension: 260,
      friction: 22, // feels like a native iOS bounce
    },
  });

  const handleSelect = async (id: string) => {
    await selectEvent(id);
    onClose();
  };

  return (
    <>
      {/* Dimmed background */}
      <Fade in={open}>
        <Box
          onClick={onClose}
          sx={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(4px)",
            zIndex: 3000,
          }}
        />
      </Fade>

      {/* SPRING ACTION SHEET */}
      <animated.div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 4000,
          transform: spring.y.to((y) => `translateY(${y}px)`),
          opacity: spring.opacity,
        }}
      >
        <Box
          sx={{
            bgcolor: (t) => t.palette.apple.systemBackground,
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            p: 2,
            pb: 4,
            boxShadow: "0 -8px 30px rgba(0,0,0,0.25)",
          }}
        >
          {/* Title */}
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              textAlign: "center",
              mb: 2,
            }}
          >
            Event auswählen
          </Typography>

          {/* Search */}
          <TextField
            fullWidth
            placeholder="Event suchen"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: (t) =>
                  t.palette.apple.secondarySystemBackground,
              },
            }}
          />

          {/* Event List */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {filtered.map((ev: Event) => (
              <Box
                key={ev.id}
                onClick={() => void handleSelect(ev.id)}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor:
                    ev.id === activeEventId
                      ? "primary.main"
                      : (t) => t.palette.apple.gray6,
                  color: ev.id === activeEventId ? "#fff" : "text.primary",
                  fontWeight: ev.id === activeEventId ? 700 : 500,
                  boxShadow:
                    ev.id === activeEventId
                      ? "0 0 10px rgba(0,0,0,0.15)"
                      : "0 0 4px rgba(0,0,0,0.08)",
                  transition: "0.2s",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  ":hover": {
                    transform: "scale(1.01)",
                    boxShadow: "0 0 12px rgba(0,0,0,0.18)",
                  },
                }}
              >
                {/* Event Icon (Emoji or fallback) */}
                {/* <Box
                  sx={{
                    fontSize: 26,
                    width: 36,
                    textAlign: "center",
                    opacity: 0.9,
                  }}
                >
                  {ev.icon ?? "📅"}
                </Box> */}

                <Typography sx={{ fontSize: 16 }}>{ev.name}</Typography>
              </Box>
            ))}

            {filtered.length === 0 && (
              <Typography sx={{ textAlign: "center", opacity: 0.5, mt: 2 }}>
                Keine Events gefunden
              </Typography>
            )}
          </Box>

          {/* Cancel */}
          <Box sx={{ mt: 3 }}>
            <Box
              sx={{
                p: 1.8,
                textAlign: "center",
                borderRadius: 3,
                bgcolor: (t) => t.palette.apple.gray6,
                color: "text.secondary",
                fontWeight: 600,
                cursor: "pointer",
                transition: "0.2s",
                ":hover": {
                  backgroundColor: (t) => t.palette.apple.gray5,
                },
              }}
              onClick={onClose}
            >
              Abbrechen
            </Box>
          </Box>
        </Box>
      </animated.div>
    </>
  );
}
