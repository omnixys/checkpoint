"use client";

import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const SEND_MESSAGE = gql`
  mutation SendTestMessage($input: SendMessageInput!) {
    sendTestMessage(input: $input)
  }
`;

export function useSendMessage() {
  const [mutate, { loading }] = useMutation(SEND_MESSAGE);

  async function send(to: string, message: string) {
    await mutate({
      variables: {
        input: {
          to: "+4915111951223",
          message,
        },
      },
    });
  }

  return {
    send,
    loading,
  };
}
