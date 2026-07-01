import { useMutation } from "@apollo/client/react";
import {
  RenameSectionDocument,
  type RenameSectionMutation,
  type RenameSectionMutationVariables,
} from "@/checkpoint/generated/graphql";
import { useMutationError } from "@/checkpoint/hooks/error";

export default function useSeatMutation() {
  const handleMutationError = useMutationError({ operationName: "RenameSection" });
  const [renameSection, { data }] = useMutation<
    RenameSectionMutation,
    RenameSectionMutationVariables
  >(RenameSectionDocument, { onError: (error) => void handleMutationError(error) });

  return {
    renameSection,
    data,
  };
}
