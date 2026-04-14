"use client";

import EventList from "@/checkpoint/components/event/EventList";
import EventsHeader from "@/checkpoint/components/event/EventsHeader";
import EventsNavBar from "@/checkpoint/components/event/EventsNavBar";
import GlobalSearch from "@/checkpoint/components/event/GlobalSearch";
import PullToRefresh from "@/checkpoint/components/utils/PullToRefresh";
import ViewModeToggle from "@/checkpoint/components/utils/ViewModeToggle";
import { useEventsPageState } from "@/checkpoint/hooks/events/useEventsPageState";
import { env } from "@/checkpoint/lib/env";
import { toLocal } from "@/checkpoint/utils/date-utils";
import { Box, Stack } from "@mui/material";

/**
 * PURE UI LAYER
 * - No business logic
 * - No data logic
 * - Only orchestration
 */
export default function EventsPageClient() {
  const state = useEventsPageState();

  return (
    <>
      <GlobalSearch />
      <EventsNavBar />

      <PullToRefresh onReload={state.refresh}>
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
          <EventsHeader
            search={state.search}
            onSearchChange={state.setSearch}
            filter={state.filter}
            onFilterChange={state.setFilter}
            count={state.count}
            loading={state.loading}
            onRefresh={state.refresh}
            onCreateHref={`${env.CHECKPOINT_BASE_PATH}event/new`}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <ViewModeToggle
              viewMode={state.viewMode}
              onViewModeChange={state.setViewMode}
              visualOverride={state.visualOverride}
              onVisualOverrideChange={state.setVisualOverride}
              disabled={false}
            />
          </Box>

          <EventList
            ref={state.listRef}
            toLocal={toLocal}
            search={state.search}
            filter={state.filter}
            viewMode={state.viewMode}
            visualOverride={state.visualOverride}
            onCountChange={state.setCount}
            onLoadingChange={state.setLoading}
          />
        </Stack>
      </PullToRefresh>
    </>
  );
}
