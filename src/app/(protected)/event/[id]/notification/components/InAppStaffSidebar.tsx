"use client";

import { Box, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { ChannelFilter } from "@/checkpoint/components/communication/ChannelFilter";
import { CommunicationSearch } from "@/checkpoint/components/communication/CommunicationSearch";
import { PersonListItem, type PersonData } from "@/checkpoint/components/communication/PersonListItem";
import { useEventStaff } from "@/checkpoint/hooks/events/useEventStaff";

const CHANNELS = [
  { key: "IN_APP", label: "In-App" },
  { key: "WHATSAPP", label: "WhatsApp" },
  { key: "EMAIL", label: "Mail" },
];

interface Props {
  eventId?: string;
  selectedStaffId: string | null;
  onSelect: (userId: string) => void;
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

export function InAppStaffSidebar({ eventId, selectedStaffId, onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState<string | null>(null);

  const { staff, loading } = useEventStaff({ eventId: eventId ?? "" });

  const staffPersons = useMemo((): PersonData[] => {
    return staff.map((s) => ({
      id: s.userId,
      name:
        s.personalInfo
          ? `${s.personalInfo.firstName ?? ""} ${s.personalInfo.lastName ?? ""}`.trim()
          : s.username ?? s.userId,
      roles: s.roles,
      channels: s.phoneNumbers?.length
        ? ["WHATSAPP", ...(s.email ? ["EMAIL"] : [])]
        : s.email
          ? ["EMAIL"]
          : ["IN_APP"],
      isOnline: false,
      unreadCount: 0,
    }));
  }, [staff]);

  const filtered = useMemo(() => {
    let result = staffPersons;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.roles?.some((r) => r.toLowerCase().includes(q)),
      );
    }
    if (channelFilter) {
      result = result.filter((p) => p.channels?.includes(channelFilter));
    }
    return result;
  }, [staffPersons, search, channelFilter]);

  return (
    <Container>
      <Box sx={{ px: 2, py: 2 }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: 0,
          }}
        >
          Team
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary" }}>
          Event staff &amp; assignments
        </Typography>
      </Box>

      <Box sx={{ px: 1.5, pb: 1 }}>
        <CommunicationSearch
          placeholder="Search staff..."
          value={search}
          onChange={setSearch}
        />
      </Box>

      <ChannelFilter
        channels={CHANNELS}
        selected={channelFilter}
        onChange={setChannelFilter}
      />

      <Box sx={{ flex: 1, overflow: "auto", px: 1, pb: 1 }}>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: (t) =>
                    t.palette.mode === "dark"
                      ? alpha("#FFFFFF", 0.06)
                      : alpha("#000000", 0.04),
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    width: "60%",
                    height: 14,
                    borderRadius: 1,
                    background: (t) =>
                      t.palette.mode === "dark"
                        ? alpha("#FFFFFF", 0.06)
                        : alpha("#000000", 0.04),
                    mb: 0.5,
                  }}
                />
                <Box
                  sx={{
                    width: "40%",
                    height: 10,
                    borderRadius: 1,
                    background: (t) =>
                      t.palette.mode === "dark"
                        ? alpha("#FFFFFF", 0.04)
                        : alpha("#000000", 0.03),
                  }}
                />
              </Box>
            </Box>
          ))
        ) : filtered.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", textAlign: "center", py: 4 }}
          >
            No staff found
          </Typography>
        ) : (
          filtered.map((person) => (
            <PersonListItem
              key={person.id}
              person={person}
              selected={person.id === selectedStaffId}
              onClick={onSelect}
            />
          ))
        )}
      </Box>
    </Container>
  );
}
