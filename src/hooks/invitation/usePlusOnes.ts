"use client";

import { useCallback, useMemo, useState } from "react";
import type { PhoneNumberInput, PublicPlusOneInput } from "@/checkpoint/generated/graphql";
import type { NormalizedPlusOne } from "@/checkpoint/types/event.type";

type CompleteNormalizedPlusOne = NormalizedPlusOne & {
  plusOneAgeCategory: PublicPlusOneInput["plusOneAgeCategory"];
};

/**
 * Strongly typed handler contracts
 * This prevents accidental mixing with invitee handlers
 */
export interface PlusOnePhoneHandlers {
  addPhone: (plusOneIndex: number) => void;
  updatePhone: <K extends keyof PhoneNumberInput>(
    plusOneIndex: number,
    phoneIndex: number,
    field: K,
    value: PhoneNumberInput[K],
  ) => void;
  removePhone: (plusOneIndex: number, phoneIndex: number) => void;
}

export function usePlusOnes() {
  const [plusOnes, setPlusOnes] = useState<NormalizedPlusOne[]>([]);

  const add = useCallback(() => {
    setPlusOnes((prev) => [
      ...prev,
      {
        firstName: "",
        lastName: "",
        email: null,
        plusOneAgeCategory: null,
        phoneNumbers: [],
      },
    ]);
  }, []);

  const remove = useCallback((index: number) => {
    setPlusOnes((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const update = useCallback(
    <K extends keyof NormalizedPlusOne>(index: number, field: K, value: NormalizedPlusOne[K]) => {
      setPlusOnes((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
    },
    [],
  );

  /**
   * 🔒 Phone handlers are FULLY isolated from invitee state
   */
  const addPhone = useCallback((plusOneIndex: number) => {
    setPlusOnes((prev) =>
      prev.map((p, i) =>
        i === plusOneIndex
          ? {
              ...p,
              phoneNumbers: [
                ...p.phoneNumbers,
                {
                  type: "WHATSAPP",
                  number: "",
                  label: "",
                  countryCode: "+49",
                  isPrimary: p.phoneNumbers.length === 0,
                },
              ],
            }
          : p,
      ),
    );
  }, []);

  const updatePhone = useCallback(
    <K extends keyof PhoneNumberInput>(
      plusOneIndex: number,
      phoneIndex: number,
      field: K,
      value: PhoneNumberInput[K],
    ) => {
      setPlusOnes((prev) =>
        prev.map((p, i) => {
          if (i !== plusOneIndex) {
            return p;
          }

          const phones = [...p.phoneNumbers];
          const currentPhone = phones[phoneIndex];

          if (!currentPhone) {
            return p;
          }

          phones[phoneIndex] = {
            ...currentPhone,
            [field]: value,
          };

          return {
            ...p,
            phoneNumbers: phones,
          };
        }),
      );
    },
    [],
  );
  const removePhone = useCallback((plusOneIndex: number, phoneIndex: number) => {
    setPlusOnes((prev) =>
      prev.map((p, i) =>
        i === plusOneIndex
          ? {
              ...p,
              phoneNumbers: p.phoneNumbers.filter((_, pi) => pi !== phoneIndex),
            }
          : p,
      ),
    );
  }, []);

  /**
   * Validation layer
   */
  const valid = useMemo(
    () =>
      plusOnes.filter((p): p is CompleteNormalizedPlusOne =>
        Boolean(p.firstName.trim() && p.lastName.trim() && p.plusOneAgeCategory),
      ),
    [plusOnes],
  );

  /**
   * GraphQL mapping (safe + normalized)
   */
  const toGraphQl = useCallback(
    (): PublicPlusOneInput[] =>
      valid.map((p) => ({
        firstName: p.firstName.trim(),
        lastName: p.lastName.trim(),
        email: p.email?.trim() || null,
        plusOneAgeCategory: p.plusOneAgeCategory,
        phoneNumbers: p.phoneNumbers.length > 0 ? p.phoneNumbers : null,
      })),
    [valid],
  );

  return {
    plusOnes,

    // plusOne core
    add,
    remove,
    update,

    // 🔒 isolated phone handlers
    addPhone,
    updatePhone,
    removePhone,

    // mapping
    toGraphQL: toGraphQl,
  };
}
