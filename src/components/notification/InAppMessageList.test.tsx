import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ChannelType,
  DeliveryStatus,
  type Message,
  MessageContentType,
} from "@/checkpoint/generated/graphql";
import { InAppMessageList } from "./InAppMessageList";

function message(id: string, body: string): Message {
  return {
    __typename: "Message",
    id,
    conversationId: "direct-admin-caleb",
    senderId: "admin",
    body,
    contentType: MessageContentType.TEXT,
    channel: ChannelType.IN_APP,
    deliveryStatus: DeliveryStatus.SENT,
    createdAt: "2026-07-23T00:00:00.000Z",
    editedAt: null,
    deletedAt: null,
  };
}

describe("InAppMessageList", () => {
  it("renders the first and consecutive realtime messages without a refetch", () => {
    const view = render(
      <InAppMessageList currentUserId="caleb" loading={false} messages={[]} staffName="Admin" />,
    );
    expect(screen.getByText(/No messages yet/)).toBeInTheDocument();

    view.rerender(
      <InAppMessageList
        currentUserId="caleb"
        loading={false}
        messages={[message("message-1", "Erste Echtzeitnachricht")]}
        staffName="Admin"
      />,
    );
    expect(screen.getByText("Erste Echtzeitnachricht")).toBeInTheDocument();

    view.rerender(
      <InAppMessageList
        currentUserId="caleb"
        loading={false}
        messages={[
          message("message-1", "Erste Echtzeitnachricht"),
          message("message-2", "Zweite Echtzeitnachricht"),
        ]}
        staffName="Admin"
      />,
    );
    expect(screen.getAllByText(/Echtzeitnachricht/)).toHaveLength(2);
  });
});
