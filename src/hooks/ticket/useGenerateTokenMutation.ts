import { GenerateTokenMutation, GenerateTokenMutationVariables, GenerateTokenDocument } from "@/checkpoint/generated/graphql";
import { useMutation } from "@apollo/client/react";

export default function useGenerateTokenMutation() {
    const [generateToken, generateTokenMutationResult] = useMutation<
      GenerateTokenMutation,
      GenerateTokenMutationVariables
      >(GenerateTokenDocument);
  
  const token = generateTokenMutationResult.data?.generateToken;
  
  return {
    generateToken,
    token,
    generateTokenLoading: generateTokenMutationResult.loading,
    generateTokenError: generateTokenMutationResult.error,
  };
}