import { type Conversation, ConversationType } from "@/checkpoint/generated/graphql";

export function conversationsOfType(
  conversations: readonly Conversation[],
  type: ConversationType,
): Conversation[] {
  return conversations.filter((conversation) => conversation.type === type);
}

export function findDirectConversation(
  conversations: readonly Conversation[],
  currentUserId: string | undefined,
  targetUserId: string,
): Conversation | undefined {
  return conversations.find((conversation) => {
    if (conversation.channel !== "IN_APP" || conversation.type !== ConversationType.DIRECT) {
      return false;
    }
    const participantIds = conversation.participants.map((participant) => participant.userId);
    return (
      participantIds.includes(targetUserId) &&
      (!currentUserId || participantIds.includes(currentUserId))
    );
  });
}
