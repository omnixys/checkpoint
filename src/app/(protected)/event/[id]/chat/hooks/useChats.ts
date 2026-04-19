"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const GET_CHATS = gql`
  query GetChats {
    getChats {
      id
      chatId
      name
      isGroup
      createdAt
      updatedAt
    }
  }
`;

export function useChats() {
  const { data, loading, error } = useQuery(GET_CHATS);

  return {
    chats: data?.getChats ?? [],
    loading,
    error,
  };
}
