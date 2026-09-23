import { ThemeProvider } from "@mui/material/styles";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ChannelType,
  DeliveryStatus,
  type Message,
  MessageContentType,
} from "@/checkpoint/generated/graphql";
import type { PendingMessage } from "@/checkpoint/hooks/support/useSupportChat";
import { createAppTheme } from "@/checkpoint/themes/createAppTheme";
import supportEn from "../../../../messages/en/support.json";
import { SupportChatPanel } from "./SupportChatPanel";

function makeMessage(overrides: Partial<Message> = {}): Message {
  return {
    __typename: "Message",
    id: "m1",
    conversationId: "c1",
    senderId: "agent",
    body: "Hi there",
    contentType: MessageContentType.TEXT,
    channel: ChannelType.IN_APP,
    deliveryStatus: DeliveryStatus.DELIVERED,
    createdAt: "2026-09-23T10:00:00.000Z",
    editedAt: null,
    deletedAt: null,
    ...overrides,
  };
}

interface RenderOptions {
  messages?: Message[];
  pendingMessages?: PendingMessage[];
  latestMessage?: Message | null;
  onSend?: (body: string) => Promise<void>;
  onRetry?: (pending: PendingMessage) => Promise<void>;
  sending?: boolean;
  isCreating?: boolean;
  currentUserId?: string | undefined;
  messagesLoading?: boolean;
}

function renderPanel(options: RenderOptions = {}) {
  const {
    messages = [makeMessage()],
    pendingMessages = [],
    latestMessage = null,
    onSend = vi.fn().mockResolvedValue(undefined),
    onRetry,
    sending = false,
    isCreating = false,
    currentUserId = undefined,
    messagesLoading = false,
  } = options;

  return render(
    <ThemeProvider theme={createAppTheme("light")}>
      <NextIntlClientProvider messages={{ support: supportEn }} locale="en">
        <SupportChatPanel
          currentUserId={currentUserId}
          isCreating={isCreating}
          latestMessage={latestMessage}
          messages={messages}
          messagesLoading={messagesLoading}
          onRetry={onRetry}
          onSend={onSend}
          pendingMessages={pendingMessages}
          sending={sending}
        />
      </NextIntlClientProvider>
    </ThemeProvider>,
  );
}

describe("SupportChatPanel", () => {
  afterEach(cleanup);

  it("renders incoming and outgoing messages", () => {
    renderPanel({
      messages: [
        makeMessage({ senderId: "agent", body: "Hello from support" }),
        makeMessage({ id: "m2", senderId: "me", body: "Thanks!" }),
      ],
      currentUserId: "me",
    });

    expect(screen.getByText("Hello from support")).toBeInTheDocument();
    expect(screen.getByText("Thanks!")).toBeInTheDocument();
  });

  it("shows the translated empty state when there is no conversation", () => {
    renderPanel({ messages: [], latestMessage: null });

    expect(screen.getByText("How can we help?")).toBeInTheDocument();
    expect(screen.getByLabelText("Send message")).toBeInTheDocument();
  });

  it("sends the typed message when the send button is clicked", async () => {
    const onSend = vi.fn().mockResolvedValue(undefined);
    renderPanel({ onSend });

    fireEvent.change(screen.getByPlaceholderText("Type your message..."), {
      target: { value: "Need help with my ticket" },
    });
    fireEvent.click(screen.getByLabelText("Send message"));

    expect(onSend).toHaveBeenCalledWith("Need help with my ticket");
  });

  it("keeps the send button disabled until there is input", () => {
    renderPanel({});

    expect(screen.getByLabelText("Send message")).toBeDisabled();
  });

  it("renders a failed pending message with an accessible retry action", () => {
    const onRetry = vi.fn().mockResolvedValue(undefined);
    const pending: PendingMessage = {
      id: "p1",
      body: "Waiting for agent",
      status: "failed",
      createdAt: "2026-09-23T10:05:00.000Z",
    };
    renderPanel({ messages: [], pendingMessages: [pending], onRetry });

    expect(screen.getByText("Failed")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Retry"));
    expect(onRetry).toHaveBeenCalledWith(pending);
  });
});
