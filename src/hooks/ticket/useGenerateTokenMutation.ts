import { useMutation } from "@apollo/client/react";
import {
  GenerateTokenDocument,
  type GenerateTokenMutation,
  type GenerateTokenMutationVariables,
} from "@/checkpoint/generated/graphql";
import { useQueryError } from "@/checkpoint/hooks/error";

export default function useGenerateTokenMutation() {
  const [generateToken, generateTokenMutationResult] = useMutation<
    GenerateTokenMutation,
    GenerateTokenMutationVariables
  >(GenerateTokenDocument);

  const token = generateTokenMutationResult.data?.generateToken;
  useQueryError(generateTokenMutationResult.error, { operationName: "GenerateToken" });

  return {
    generateToken,
    token,
    generateTokenLoading: generateTokenMutationResult.loading,
    generateTokenError: generateTokenMutationResult.error,
  };
}
