"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useCallback } from "react";

export interface QuickReply {
  id: string;
  key: string;
  body: string;
  channel: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface QuickReplyListData {
  quickReplies: QuickReply[];
}

interface QuickReplySingleData {
  createQuickReply: QuickReply;
}

interface QuickReplyUpdateData {
  updateQuickReply: QuickReply;
}

interface QuickReplyDeleteData {
  deleteQuickReply: boolean;
}

const LIST = gql`
  query QuickReplies {
    quickReplies {
      id
      key
      body
      channel
      tags
      createdAt
      updatedAt
    }
  }
`;

const CREATE = gql`
  mutation CreateQuickReply($key: String!, $body: String!, $channel: String, $tags: [String!]) {
    createQuickReply(key: $key, body: $body, channel: $channel, tags: $tags) {
      id
      key
      body
      channel
      tags
      createdAt
      updatedAt
    }
  }
`;

const UPDATE = gql`
  mutation UpdateQuickReply($id: String!, $key: String, $body: String, $channel: String, $tags: [String!]) {
    updateQuickReply(id: $id, key: $key, body: $body, channel: $channel, tags: $tags) {
      id
      key
      body
      channel
      tags
      createdAt
      updatedAt
    }
  }
`;

const DELETE = gql`
  mutation DeleteQuickReply($id: String!) {
    deleteQuickReply(id: $id)
  }
`;

export function useQuickReplies() {
  const list = useQuery<QuickReplyListData>(LIST);

  const [createMutation] = useMutation<QuickReplySingleData>(CREATE);
  const [updateMutation] = useMutation<QuickReplyUpdateData>(UPDATE);
  const [deleteMutation] = useMutation<QuickReplyDeleteData>(DELETE);

  const create = useCallback(
    async (data: { key: string; body: string; channel?: string | null; tags?: string[] }) => {
      const result = await createMutation({
        variables: data,
        refetchQueries: [{ query: LIST }],
      });
      return result.data?.createQuickReply;
    },
    [createMutation],
  );

  const update = useCallback(
    async (id: string, data: { key?: string; body?: string; channel?: string | null; tags?: string[] }) => {
      const result = await updateMutation({
        variables: { id, ...data },
        refetchQueries: [{ query: LIST }],
      });
      return result.data?.updateQuickReply;
    },
    [updateMutation],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteMutation({
        variables: { id },
        refetchQueries: [{ query: LIST }],
      });
    },
    [deleteMutation],
  );

  return {
    quickReplies: list.data?.quickReplies,
    loading: list.loading,
    error: list.error,
    create,
    update,
    remove,
  };
}
