"use client";

import { useQuery } from "@apollo/client/react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React from "react";

import EventActions from "@/components/eventDetails/EventActions";
import EventHeaderA from "@/components/eventDetails/EventHeaderA";
import EventHeaderB from "@/components/eventDetails/EventHeaderB";
import EventHeaderC from "@/components/eventDetails/EventHeaderC";
import EventHeaderD from "@/components/eventDetails/EventHeaderD";
import EventTabContent from "@/components/eventDetails/EventTabContent";
import EventTabs from "@/components/eventDetails/EventTabs";
import EventVariantToggle from "@/components/eventDetails/EventVariantToggle";
import BackToListButton from "@/components/utils/BackToListButton";
import {
  EventByIdRequest,
  EventByIdResult,
} from "@/types/event/event-query-graphql.type";
import { EVENT_BY_ID } from "@/graphql/event/event-query.graphql";
import { useAuth } from "@/providers/AuthProvider";

export default function PremiumEventDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
    const { isAuthenticated } = useAuth();

  const { data, loading, error } = useQuery<EventByIdResult, EventByIdRequest>(
    EVENT_BY_ID,
    {
      variables: { eventId: id },
      fetchPolicy: "cache-and-network",
    }
  );

  const [variant, setVariant] = React.useState<"A" | "B" | "C" | "D">("D");
  const [activeTab, setActiveTab] = React.useState("settings");
  const [description, setDescription] = React.useState("");

  if (!isAuthenticated) {
      router.push('/')
    }
  
  if (loading || !data) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={36} />
      </Box>
    );
  }

  if (error || !data.event) {
    return (
      <Typography color="error" sx={{ mt: 4, textAlign: "center" }}>
        Event konnte nicht geladen werden.
      </Typography>
    );
  }

  const ev = data.event;

  return (
    <Stack
      spacing={4}
      sx={{
        px: { xs: 2, md: 4 },
        py: 3,
        maxWidth: "1100px",
        mx: "auto",
      }}
    >
      {/* Back Button */}
      <BackToListButton backTo="/event" />

      {/* Variant Switch */}
      <EventVariantToggle variant={variant} onChange={setVariant} />

      {/* Header Variants */}
      {variant === "A" && <EventHeaderA ev={ev} />}
      {variant === "B" && <EventHeaderB ev={ev} />}
      {variant === "C" && <EventHeaderC ev={ev} />}
      {variant === "D" && <EventHeaderD ev={ev} />}

      {/* Apple Tabs */}
      <EventTabs active={activeTab} onChange={setActiveTab} />

      {/* Content Renderer */}
      <EventTabContent
        ev={ev}
        active={activeTab}
        onDescriptionChange={setDescription}
      />

      {/* Actions */}
      <EventActions ev={ev} />
    </Stack>
  );
}
