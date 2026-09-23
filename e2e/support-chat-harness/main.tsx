import { Box, CssBaseline, Stack, ThemeProvider, Typography } from "@mui/material";
import { NextIntlClientProvider } from "next-intl";
import { Suspense, useEffect, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import {
  ChannelType,
  DeliveryStatus,
  type Message,
  MessageContentType,
} from "../../src/generated/graphql";
import { SupportChatPage } from "../../src/components/support/chat/SupportChatPage";
import { DeviceProvider } from "../../src/providers/DeviceProvider";
import { createAppTheme } from "../../src/themes/createAppTheme";
import supportEn from "../../messages/en/support.json";

const theme = createAppTheme("light", "original");

function makeMessage(overrides: Partial<Message>): Message {
  return {
    __typename: "Message",
    id: "m1",
    conversationId: "c1",
    senderId: "agent-1",
    body: "Thanks for contacting us! How can we help you today?",
    contentType: MessageContentType.TEXT,
    channel: ChannelType.IN_APP,
    deliveryStatus: DeliveryStatus.DELIVERED,
    createdAt: "2026-09-23T10:00:00.000Z",
    editedAt: null,
    deletedAt: null,
    ...overrides,
  };
}

const messages: Message[] = [
  makeMessage({}),
  makeMessage({
    id: "m2",
    senderId: "guest-1",
    body: "I need help with my seat assignment, the seat map looks different in my app.",
    createdAt: "2026-09-23T10:02:00.000Z",
  }),
  makeMessage({
    id: "m3",
    senderId: "agent-1",
    body: "Sure — open the seat overview under “My seat” and your latest assignment appears there.",
    createdAt: "2026-09-23T10:04:00.000Z",
  }),
];

// Emulates the real padded chain (AppShell + /me layout) that SupportChatPage
// is rendered inside, so its full-bleed negative margins are exercised against
// the same values as the app. Breakpoints mirror the production components.
function Shell({ children }: { children: ReactNode }) {
  const [width, setWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  if (width >= 1200) {
    const shellPx = width >= 1536 ? 5 : 4;
    return (
      <Box sx={{ display: "flex", height: "100dvh", minHeight: "100dvh", overflow: "hidden", width: "100%" }}>
        <Box sx={{ alignSelf: "flex-start", bgcolor: "background.paper", height: "100vh", width: 260 }}>
          <Typography sx={{ p: 2, color: "text.secondary", fontSize: "0.75rem" }}>Sidebar</Typography>
        </Box>
        <Box sx={{ flexGrow: 1, height: "100dvh", minWidth: 0, overflowY: "auto", p: shellPx }}>
          <Box sx={{ minHeight: "100dvh", px: 6, py: 4 }}>
            <Stack spacing={4} sx={{ maxWidth: 1200, mx: "auto" }}>{children}</Stack>
          </Box>
        </Box>
      </Box>
    );
  }
  const contentPx = width >= 600 ? 2 : 1.5;
  const layoutPx = width >= 900 ? 6 : contentPx;
  const layoutPy = width >= 600 ? 4 : 2;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100dvh", minHeight: "100dvh", overflow: "hidden", width: "100%" }}>
      <Box
        sx={{
          alignItems: "center",
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          height: 56,
          left: 0,
          px: 2,
          position: "fixed",
          right: 0,
          top: 0,
          zIndex: 120,
        }}
      >
        <Typography sx={{ fontWeight: 600 }}>Checkpoint</Typography>
      </Box>
      <Box sx={{ flexGrow: 1, minWidth: 0, overflowY: "auto", px: contentPx, pt: "56px", pb: "76px" }}>
        <Box sx={{ minHeight: "100dvh", px: layoutPx, py: layoutPy }}>
          <Stack spacing={4} sx={{ maxWidth: 1200, mx: "auto" }}>{children}</Stack>
        </Box>
      </Box>
      <Box sx={{ alignItems: "center", borderTop: 1, borderColor: "divider", display: "flex", gap: 3, height: 76, justifyContent: "space-around", px: 3 }}>
        {["Home", "Events", "Me", "Menu"].map((label) => (
          <Typography key={label} sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
            {label}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

function Harness() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DeviceProvider>
        <Shell>
          <Box sx={{ width: "100%" }}>
            <Suspense fallback={null}>
              <SupportChatPage
                currentUserId="guest-1"
                isCreating={false}
                latestMessage={messages[messages.length - 1] ?? null}
                messages={messages}
                messagesLoading={false}
                onRetry={async () => undefined}
                onSend={async () => undefined}
                pendingMessages={[]}
                sending={false}
              />
            </Suspense>
          </Box>
        </Shell>
      </DeviceProvider>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <NextIntlClientProvider locale="en" messages={{ support: supportEn }}>
    <Harness />
  </NextIntlClientProvider>,
);
