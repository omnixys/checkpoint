"use client";

import { GET_MESSAGES } from "@/checkpoint/app/(protected)/event/[id]/chat/hooks/useMessages";
import { gql} from "@apollo/client";
import { useSubscription } from "@apollo/client/react";

const WHATSAPP_SUB = gql`
  subscription WhatsappMessage($chatId: String!) {
    whatsappMessage(chatId: $chatId) {
      id
      chatId
      direction
      from
      to
      body
      mediaUrl
      messageId
      createdAt
    }
  }
`;

export function useMessageSubscription(chatId: string | null) {
  useSubscription(WHATSAPP_SUB, {
    variables: { chatId },
    skip: !chatId,

    onData: ({ client, data }) => {
      const newMessage = data.data?.whatsappMessage;
      console.log({newMessage});
      if (!newMessage) return;

      /**
       * 🔥 CORRECT CACHE UPDATE (ARG AWARE)
       */
      client.cache.updateQuery(
        {
          query: GET_MESSAGES,
          variables: { chatId },
        },
        (existing: any) => {
          if (!existing) return existing;

          return {
            getMessages: [...existing.getMessages, newMessage],
          };
        },
      );
    },
  });
}
