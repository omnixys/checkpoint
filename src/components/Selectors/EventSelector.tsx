"use client";

import { useActiveEvent } from "@/providers/ActiveEventProvider";
import { useAuth } from "@/providers/AuthProvider";
import { Event } from "@/types/event/event.type";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { JSX } from "react";

export default function EventSelector(): JSX.Element {
  const { events, activeEventId, selectEvent } = useActiveEvent();
  const { isAuthenticated } = useAuth();

  const handleChange = async (e: SelectChangeEvent<string>) => {
    const newId = e.target.value;
    await selectEvent(newId);
  };

  if (!isAuthenticated) {
    return (
      <Typography
        variant="body2"
        sx={{ opacity: 0.6, px: 2, py: 1, userSelect: "none" }}
      >
        Nicht angemeldet
      </Typography>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Typography
        variant="body2"
        sx={{ opacity: 0.6, px: 2, py: 1, userSelect: "none" }}
      >
        Keine Events
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", px: 2, mt: 1 }}>
      <FormControl fullWidth size="small">
        <Select
          value={activeEventId ?? ""}
          onChange={handleChange}
          sx={{
            borderRadius: 3,
            fontSize: "0.9rem",
            backgroundColor: (t) => t.palette.apple.gray6,
            "& .MuiSelect-select": {
              py: 1,
            },
          }}
        >
          {events.map((ev: Event) => (
            <MenuItem key={ev.id} value={ev.id}>
              {ev.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
