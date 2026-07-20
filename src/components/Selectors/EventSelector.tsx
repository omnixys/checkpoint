"use client";

import {
  Box,
  FormControl,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Typography,
} from "@mui/material";
import type { JSX } from "react";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useAuth } from "@/checkpoint/providers/AuthProvider";

export default function EventSelector(): JSX.Element {
  const { myEventList, activeEventId, selectEvent, loading } = useActiveEvent();
  const { isAuthenticated } = useAuth();

  const handleChange = async (e: SelectChangeEvent<string>) => {
    const newId = e.target.value;
    await selectEvent(newId);
  };

  if (!isAuthenticated) {
    return (
      <Typography variant="body2" sx={{ opacity: 0.6, px: 2, py: 1, userSelect: "none" }}>
        Nicht angemeldet
      </Typography>
    );
  }

  if (loading) {
    return (
      <Typography variant="body2" sx={{ opacity: 0.6, px: 2, py: 1, userSelect: "none" }}>
        Lädt...
      </Typography>
    );
  }

   console.log("myEventList: ")
  console.log(myEventList)

  if (!myEventList || myEventList.length === 0) {
    return (
      <Typography variant="body2" sx={{ opacity: 0.6, px: 2, py: 1, userSelect: "none" }}>
        Keine Events
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", px: 2, mt: 1 }}>
      <FormControl fullWidth={true} size="small">
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
          {myEventList.map((ev: any) => (
            <MenuItem key={ev.id} value={ev.id}>
              {ev.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
