import {
  AutocompleteAddressQuery,
  AutocompleteAddressQueryVariables,
  AutocompleteAddressDocument,
} from "@/checkpoint/generated/graphql";
import { useLazyQuery } from "@apollo/client/react";

export function useAddressAutocomplete() {
  return useLazyQuery<AutocompleteAddressQuery, AutocompleteAddressQueryVariables>(
    AutocompleteAddressDocument,
  );
}
