import { describe, expect, it } from "vitest";
import { ChannelType, type Conversation, ConversationType } from "@/checkpoint/generated/graphql";
import { conversationsOfType, findDirectConversation } from "./conversation-selection";

function conversation(id: string, type: ConversationType, participantIds: string[]): Conversation {
  return {
    __typename: "Conversation",
    id,
    type,
    channel: ChannelType.IN_APP,
    participants: participantIds.map((userId) => ({
      __typename: "Participant",
      userId,
    })),
    lastMessage: null,
    lastMessageAt: null,
    unreadCount: 0,
    externalAddress: null,
    externalDisplayName: null,
  };
}

describe("conversation isolation", () => {
  const direct = conversation("direct", ConversationType.DIRECT, ["admin", "caleb"]);
  const support = conversation("support", ConversationType.SUPPORT, ["admin", "caleb"]);

  it("keeps DIRECT conversations in notification and SUPPORT conversations in support", () => {
    expect(conversationsOfType([direct, support], ConversationType.DIRECT)).toEqual([direct]);
    expect(conversationsOfType([direct, support], ConversationType.SUPPORT)).toEqual([support]);
  });

  it("selects a notification conversation only when both requested participants belong to it", () => {
    expect(findDirectConversation([support, direct], "caleb", "admin")).toBe(direct);
    expect(findDirectConversation([direct], "rachel", "admin")).toBeUndefined();
  });
});
