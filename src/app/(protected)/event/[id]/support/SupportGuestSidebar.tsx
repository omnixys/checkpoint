"use client";

import { Avatar, alpha, Box, Chip, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { CommunicationSearch } from "@/checkpoint/components/communication/CommunicationSearch";
import useGuestQuery from "@/checkpoint/hooks/user/useGuestQuery";

interface Props {
  eventId?: string;
  selectedGuestId: string | null;
  onSelect: (userId: string, guestName: string, phoneNumber?: string) => void;
}

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  borderRight: `1px solid ${
    theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.06) : alpha("#000000", 0.06)
  }`,
}));

const GuestCard = styled("button")<{ selected: boolean }>(({ theme, selected }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  width: "100%",
  padding: "12px 12px",
  border: "none",
  borderRadius: 12,
  background: selected
    ? theme.palette.mode === "dark"
      ? alpha(theme.palette.primary.main, 0.15)
      : alpha(theme.palette.primary.main, 0.08)
    : "transparent",
  cursor: "pointer",
  textAlign: "left",
  transition: "background 0.15s",
  "&:hover": {
    background: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.06) : alpha("#000000", 0.04),
  },
}));

const OnlineDot = styled("span")<{ online: boolean }>(({ theme, online }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: online ? theme.palette.success.main : alpha("#FFFFFF", 0.2),
  border: `2px solid ${theme.palette.background.paper}`,
  position: "absolute",
  bottom: 0,
  right: 0,
}));

export function SupportGuestSidebar({ eventId, selectedGuestId, onSelect }: Props) {
  const theme = useTheme();
  const [search, setSearch] = useState("");

  const { guestList } = useGuestQuery({
    eventId,
    loadGuestIdList: true,
  });

  const guests = useMemo(() => {
    return (guestList ?? []).map((g) => {
      const phoneNumbers = g.personalInfo?.phoneNumbers;
      const phone =
        phoneNumbers?.find((p) => p.type === "WHATSAPP" && p.isPrimary) ??
        phoneNumbers?.find((p) => p.isPrimary) ??
        phoneNumbers?.[0];
      const phoneNumber = phone ? `${phone.countryCode}${phone.number}` : undefined;
      return {
        id: g.id,
        name: g.personalInfo
          ? `${g.personalInfo.firstName ?? ""} ${g.personalInfo.lastName ?? ""}`.trim() ||
            g.username
          : g.username,
        isOnline: false,
        phoneNumber,
        initials: (() => {
          const fn = g.personalInfo?.firstName ?? "";
          const ln = g.personalInfo?.lastName ?? "";
          return (
            `${fn.charAt(0)}${ln.charAt(0)}`.toUpperCase() || g.username.charAt(0).toUpperCase()
          );
        })(),
      };
    });
  }, [guestList]);

  const filtered = useMemo(() => {
    if (!search.trim()) return guests;
    const q = search.toLowerCase().trim();
    return guests.filter((p) => p.name.toLowerCase().includes(q) || p.phoneNumber?.includes(q));
  }, [guests, search]);

  return (
    <Container>
      <Box sx={{ px: 2, py: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 18, letterSpacing: 0 }}>Guests</Typography>
        <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary" }}>
          {guests.length} registered
        </Typography>
      </Box>

      <Box sx={{ px: 1.5, pb: 1 }}>
        <CommunicationSearch placeholder="Search guests..." value={search} onChange={setSearch} />
      </Box>

      <Box sx={{ flex: 1, overflow: "auto", px: 1, pb: 1 }}>
        {filtered.length === 0 ? (
          <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", py: 4 }}>
            No guests found
          </Typography>
        ) : (
          filtered.map((guest) => (
            <GuestCard
              key={guest.id}
              selected={guest.id === selectedGuestId}
              onClick={() => onSelect(guest.id, guest.name, guest.phoneNumber)}
              type="button"
            >
              <Box sx={{ position: "relative", flexShrink: 0 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    fontSize: 14,
                    fontWeight: 700,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                  }}
                >
                  {guest.initials}
                </Avatar>
                <OnlineDot online={guest.isOnline} />
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ alignItems: "center", display: "flex", gap: 0.5 }}>
                  <Typography
                    noWrap
                    sx={{
                      flex: 1,
                      fontSize: "0.85rem",
                      fontWeight: guest.id === selectedGuestId ? 700 : 600,
                      lineHeight: 1.3,
                    }}
                  >
                    {guest.name}
                  </Typography>
                </Box>
                {guest.phoneNumber && (
                  <Typography
                    noWrap
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.72rem",
                      lineHeight: 1.3,
                      mt: 0.25,
                    }}
                  >
                    {guest.phoneNumber}
                  </Typography>
                )}
                <Box sx={{ alignItems: "center", display: "flex", gap: 0.5, mt: 0.5 }}>
                  <Chip
                    label="WhatsApp"
                    size="small"
                    sx={{
                      height: 16,
                      fontSize: "0.6rem",
                      fontWeight: 600,
                      bgcolor: alpha("#25D366", 0.1),
                      color: "#25D366",
                      "& .MuiChip-label": { px: 0.75 },
                    }}
                  />
                </Box>
              </Box>
            </GuestCard>
          ))
        )}
      </Box>
    </Container>
  );
}
