"use client";

import { Box, Stack } from "@mui/material";
import React from "react";

import EventList from "@/components/eventList/EventList";
import EventsHeader from "@/components/eventList/EventsHeader";
import EventsNavBar from "@/components/eventList/EventsNavBar";
import GlobalSearch from "@/components/eventList/GlobalSearch";
import PullToRefreshWrapper from "@/components/utils/PullToRefreshWrapper";
import ViewModeToggle from "@/components/utils/ViewModeToggle";
import type { EventListHandle, EventsFilter } from "@/types/event/event.type";
import { toLocal } from "@/utils/date";

export default function EventsPage() {
  const listRef = React.useRef<EventListHandle>(null);

  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<EventsFilter>("all");
  const [count, setCount] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const [viewMode, setViewMode] = React.useState<"list" | "grid">("list");
  const [visualOverride, setVisualOverride] = React.useState<
    "auto" | "image" | "banner" | "none"
  >("auto");

  const refresh = () => listRef.current?.refresh();

  return (
    <>
      <GlobalSearch />
      <EventsNavBar />
      <PullToRefreshWrapper onRefresh={refresh}>
        <Stack
          spacing={4}
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            pt: { xs: 2, md: 3 },
            pb: 6,
            mx: "auto",
            maxWidth: "1400px",
          }}
        >
          {/* HEADER */}
          <EventsHeader
            search={search}
            onSearchChange={setSearch}
            filter={filter}
            onFilterChange={setFilter}
            count={count}
            loading={loading}
            onRefresh={refresh}
            onCreateHref={"/checkpoint/event/new"}
          />

          {/* VIEW MODE */}
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              visualOverride={visualOverride}
              onVisualOverrideChange={setVisualOverride}
            />
          </Box>

          {/* LIST */}
          <EventList
            ref={listRef}
            toLocal={toLocal}
            search={search}
            filter={filter}
            viewMode={viewMode}
            visualOverride={visualOverride}
            onCountChange={setCount}
            onLoadingChange={setLoading}
          />
        </Stack>
      </PullToRefreshWrapper>
    </>
  );
}
