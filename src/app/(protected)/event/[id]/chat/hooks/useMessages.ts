"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

export const GET_MESSAGES = gql`
  query GetMessages($chatId: String!) {
    getMessages(chatId: $chatId) {
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

export function useMessages(chatId: string | null) {
  const { data, loading, error } = useQuery(GET_MESSAGES, {
    variables: { chatId },
    skip: !chatId,
    fetchPolicy: "cache-and-network",
  });

  return {
    messages: data?.getMessages ?? [],
    loading,
    error,
  };
}
