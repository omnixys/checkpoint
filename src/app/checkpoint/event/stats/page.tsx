"use client";

import { Box, Divider, Typography } from "@mui/material";
import { JSX } from "react";

import AdminStats from "./components/AdminStats";
import EmptyStatsState from "./components/EmptyStatsState";
import GuestStats from "./components/GuestStats";

import EventsNavBar from "@/components/eventList/EventsNavBar";
import { useActiveEvent } from "@/providers/ActiveEventProvider";
import { adminStatsMock, guestStatsMock } from "./mock/eventStats.mock";

export default function EventStatsPage(): JSX.Element {
  const { activeRole } = useActiveEvent();

  const isAdmin =
    activeRole?.includes("ADMIN") || activeRole?.includes("EVENT_ADMIN");

  const guestStats = guestStatsMock;
  const adminStats = adminStatsMock;

  if (!guestStats) {
    return <EmptyStatsState />;
  }

  return (
    <Box padding={2}>
      <EventsNavBar />
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Event-Statistiken
      </Typography>

      <GuestStats stats={guestStats} />

      {isAdmin && adminStats && (
        <>
          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Admin-Insights
          </Typography>

          <AdminStats stats={adminStats} />
        </>
      )}
    </Box>
  );
}
