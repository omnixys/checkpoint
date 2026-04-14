"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  InvitationPayload,
  PhoneNumberInput,
  PublicPlusOneInput,
  ReplyInvitationDocument,
  ReplyInvitationMutation,
  ReplyInvitationMutationVariables,
} from "@/checkpoint/generated/graphql";
import { PlusOneModel } from "@/checkpoint/hooks/invitation/usePlusOnes";

type InvitationPlusOne = NonNullable<InvitationPayload["plusOnes"]>[number];

type RsvpFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumbers: PhoneNumberInput[];
  plusOnes: PlusOneModel[];
};

function createEmptyPhone(): PhoneNumberInput {
  return {
    type: "MOBILE",
    number: "",
    countryCode: "+49",
    isPrimary: false,
    label: "",
  };
}

function createEmptyPlusOne(): PlusOneModel {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumbers: [],
  };
}

function normalizePhoneNumbers(
  phoneNumbers: InvitationPayload["phoneNumbers"],
): PhoneNumberInput[] {
  return (phoneNumbers ?? []).map((phone) => ({
    type: phone.type,
    number: phone.number,
    countryCode: phone.countryCode,
    isPrimary: phone.isPrimary,
    label: phone.label,
  }));
}

function normalizePlusOne(input: InvitationPlusOne): PlusOneModel {
  return {
    firstName: input.firstName ?? "",
    lastName: input.lastName ?? "",
    email: input.email ?? null,
    phoneNumbers: normalizePhoneNumbers(input.phoneNumbers),
  };
}

function toGraphQlPlusOne(input: PlusOneModel): PublicPlusOneInput {
  return {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input?.email?.trim() || null,
    phoneNumbers: input.phoneNumbers.length > 0 ? input.phoneNumbers : null,
  };
}

/**
 * Enterprise RSVP Hook
 *
 * Handles:
 * - form state
 * - validation
 * - submission
 * - mapping to GraphQL DTO
 */
export function useRsvpForm(invitation: InvitationPayload) {
  const [state, setState] = useState<RsvpFormState>({
    firstName: invitation.firstName ?? "",
    lastName: invitation.lastName ?? "",
    email: invitation.email ?? "",
    phoneNumbers: normalizePhoneNumbers(invitation.phoneNumbers),
    plusOnes: (invitation.plusOnes ?? []).map(normalizePlusOne),
  });

  const [replyInvitation, { loading }] = useMutation<
    ReplyInvitationMutation,
    ReplyInvitationMutationVariables
  >(ReplyInvitationDocument);

  function update<K extends keyof RsvpFormState>(key: K, value: RsvpFormState[K]) {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function addPhone() {
    setState((prev) => ({
      ...prev,
      phoneNumbers: [...prev.phoneNumbers, createEmptyPhone()],
    }));
  }

  function removePhone(index: number) {
    setState((prev) => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.filter((_, currentIndex) => currentIndex !== index),
    }));
  }

  function updatePhone<K extends keyof PhoneNumberInput>(
    index: number,
    field: K,
    value: PhoneNumberInput[K],
  ) {
    setState((prev) => {
      const nextPhoneNumbers = [...prev.phoneNumbers];
      const currentPhone = nextPhoneNumbers[index];

      if (!currentPhone) {
        return prev;
      }

      nextPhoneNumbers[index] = {
        ...currentPhone,
        [field]: value,
      };

      return {
        ...prev,
        phoneNumbers: nextPhoneNumbers,
      };
    });
  }

  function addPlusOne() {
    setState((prev) => ({
      ...prev,
      plusOnes: [...prev.plusOnes, createEmptyPlusOne()],
    }));
  }

  function removePlusOne(index: number) {
    setState((prev) => ({
      ...prev,
      plusOnes: prev.plusOnes.filter((_, currentIndex) => currentIndex !== index),
    }));
  }

  function updatePlusOne<K extends keyof PlusOneModel>(
    index: number,
    field: K,
    value: PlusOneModel[K],
  ) {
    setState((prev) => {
      const nextPlusOnes = [...prev.plusOnes];
      const currentPlusOne = nextPlusOnes[index];

      if (!currentPlusOne) {
        return prev;
      }

      nextPlusOnes[index] = {
        ...currentPlusOne,
        [field]: value,
      };

      return {
        ...prev,
        plusOnes: nextPlusOnes,
      };
    });
  }

  function addPlusOnePhone(index: number, phone: PhoneNumberInput) {
    setState((prev) => {
      const nextPlusOnes = [...prev.plusOnes];
      const current = nextPlusOnes[index];

      if (!current) return prev;

      nextPlusOnes[index] = {
        ...current,
        phoneNumbers: [...current.phoneNumbers, phone],
      };

      return {
        ...prev,
        plusOnes: nextPlusOnes,
      };
    });
  }

  function updatePlusOnePhone<K extends keyof PhoneNumberInput>(
    plusOneIndex: number,
    phoneIndex: number,
    field: K,
    value: PhoneNumberInput[K],
  ) {
    setState((prev) => {
      const nextPlusOnes = [...prev.plusOnes];
      const currentPlusOne = nextPlusOnes[plusOneIndex];

      if (!currentPlusOne) {
        return prev;
      }

      const nextPhoneNumbers = [...currentPlusOne.phoneNumbers];
      const currentPhone = nextPhoneNumbers[phoneIndex];

      if (!currentPhone) {
        return prev;
      }

      nextPhoneNumbers[phoneIndex] = {
        ...currentPhone,
        [field]: value,
      };

      nextPlusOnes[plusOneIndex] = {
        ...currentPlusOne,
        phoneNumbers: nextPhoneNumbers,
      };

      return {
        ...prev,
        plusOnes: nextPlusOnes,
      };
    });
  }

  function removePlusOnePhone(plusOneIndex: number, phoneIndex: number) {
    setState((prev) => {
      const nextPlusOnes = [...prev.plusOnes];
      const currentPlusOne = nextPlusOnes[plusOneIndex];

      if (!currentPlusOne) {
        return prev;
      }

      nextPlusOnes[plusOneIndex] = {
        ...currentPlusOne,
        phoneNumbers: currentPlusOne.phoneNumbers.filter(
          (_, currentIndex) => currentIndex !== phoneIndex,
        ),
      };

      return {
        ...prev,
        plusOnes: nextPlusOnes,
      };
    });
  }

  const isValid = useMemo(() => {
    const hasPhone = state.phoneNumbers.some((phone) => phone.number.trim().length > 3);
    const hasEmail = state.email.trim().length > 3;
    const hasFirstName = state.firstName.trim().length > 0;
    const hasLastName = state.lastName.trim().length > 0;

    return hasFirstName && hasLastName && (hasPhone || hasEmail) && !loading;
  }, [state, loading]);

  async function submit() {
    if (!isValid) {
      return;
    }

    const cleanedPlusOnes = state.plusOnes
      .filter((plusOne) => plusOne.firstName.trim() && plusOne.lastName.trim())
      .map(toGraphQlPlusOne);

    const trimmedEmail = state.email.trim();

    await replyInvitation({
      variables: {
        input: {
          invitationId: invitation.id,
          choice: "YES",
          replyInput: {
            firstName: state.firstName.trim(),
            lastName: state.lastName.trim(),
            email: trimmedEmail || null,
            phoneNumbers: state.phoneNumbers.length > 0 ? state.phoneNumbers : null,
            plusOnes: cleanedPlusOnes.length > 0 ? cleanedPlusOnes : null,
          },
        },
      },
    });
  }

  return {
    state,
    update,
    addPhone,
    removePhone,
    updatePhone,
    addPlusOne,
    removePlusOne,
    updatePlusOne,
    addPlusOnePhone,
    updatePlusOnePhone,
    removePlusOnePhone,
    isValid,
    submit,
    loading,
  };
}
