"use client";

import { Box, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { CommunicationSearch } from "@/checkpoint/components/communication/CommunicationSearch";
import { PersonListItem, type PersonData } from "@/checkpoint/components/communication/PersonListItem";
import useGuestQuery from "@/checkpoint/hooks/user/useGuestQuery";

interface Props {
  eventId?: string;
  selectedGuestId: string | null;
  onSelect: (userId: string, guestName: string) => void;
}

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  borderRight: `1px solid ${
    theme.palette.mode === "dark"
      ? alpha("#FFFFFF", 0.06)
      : alpha("#000000", 0.06)
  }`,
}));

export function SupportGuestSidebar({ eventId, selectedGuestId, onSelect }: Props) {
  const [search, setSearch] = useState("");

  const { guestList, guestMap } = useGuestQuery({
    eventId,
    loadGuestIdList: true,
  });

  const guests = useMemo((): PersonData[] => {
    return (guestList ?? []).map((g) => ({
      id: g.id,
      name: g.personalInfo
        ? `${g.personalInfo.firstName ?? ""} ${g.personalInfo.lastName ?? ""}`.trim() || g.username
        : g.username,
      roles: [],
      isOnline: false,
      unreadCount: 0,
    }));
  }, [guestList]);

  const filtered = useMemo(() => {
    if (!search.trim()) return guests;
    const q = search.toLowerCase().trim();
    return guests.filter((p) => p.name.toLowerCase().includes(q));
  }, [guests, search]);

  return (
    <Container>
      <Box sx={{ px: 2, py: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 18, letterSpacing: 0 }}>
          Guests
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary" }}>
          {guests.length} registered guests
        </Typography>
      </Box>

      <Box sx={{ px: 1.5, pb: 1 }}>
        <CommunicationSearch
          placeholder="Search guests..."
          value={search}
          onChange={setSearch}
        />
      </Box>

      <Box sx={{ flex: 1, overflow: "auto", px: 1, pb: 1 }}>
        {filtered.length === 0 ? (
          <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", py: 4 }}>
            No guests found
          </Typography>
        ) : (
          filtered.map((person) => (
            <PersonListItem
              key={person.id}
              person={person}
              selected={person.id === selectedGuestId}
              onClick={(id) => {
                const guest = filtered.find((p) => p.id === id);
                onSelect(id, guest?.name ?? "");
              }}
            />
          ))
        )}
      </Box>
    </Container>
  );
}
