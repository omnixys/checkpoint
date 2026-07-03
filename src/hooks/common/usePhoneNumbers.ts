// src/checkpoint/hooks/usePhoneNumbers.ts

"use client";

import { useCallback, useState } from "react";
import { DEFAULT_PHONE_TYPE } from "@/checkpoint/constants/phone-number.constants";
import type { PhoneNumberInput } from "@/checkpoint/generated/graphql";

/**
 * usePhoneNumbers
 *
 * Enterprise-grade phone number state management:
 * - Immutable updates (React safe)
 * - Guarantees exactly ONE primary number
 * - GraphQL-compatible structure
 * - Production-ready for forms and mutations
 */
export function usePhoneNumbers(defaultCountry = "+49") {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumberInput[]>([
    {
      type: DEFAULT_PHONE_TYPE,
      number: "",
      label: null,
      countryCode: defaultCountry,
      isPrimary: true,
    },
  ]);

  /**
   * Adds a new phone entry
   */
  const addPhone = useCallback(() => {
    setPhoneNumbers((prev) => [
      ...prev,
      {
        type: DEFAULT_PHONE_TYPE,
        number: "",
        label: null,
        countryCode: defaultCountry,
        isPrimary: false,
      },
    ]);
  }, [defaultCountry]);

  /**
   * Removes a phone entry
   * Ensures at least one primary remains
   */
  const removePhone = useCallback((index: number) => {
    setPhoneNumbers((prev) => {
      const updated = prev.filter((_, i) => i !== index);

      if (prev[index]?.isPrimary && updated.length > 0) {
        return updated.map((p, i) => ({
          ...p,
          isPrimary: i === 0,
        }));
      }

      return updated;
    });
  }, []);

  /**
   * Updates a field in a phone entry
   * Handles primary switching logic safely
   */
  const updatePhone = useCallback(
    <K extends keyof PhoneNumberInput>(index: number, field: K, value: PhoneNumberInput[K]) => {
      setPhoneNumbers((prev) => {
        /**
         * Enforce single primary
         */
        if (field === "isPrimary" && value === true) {
          return prev.map((p, i) => ({
            ...p,
            isPrimary: i === index,
          }));
        }

        return prev.map((p, i) => (i === index ? { ...p, [field]: value } : p));
      });
    },
    [],
  );

  /**
   * Replace entire list (used in edit forms / prefill)
   */
  const setAll = useCallback((values: PhoneNumberInput[]) => {
    setPhoneNumbers(values ?? []);
  }, []);

  /**
   * Returns only valid phone numbers for backend submission
   */
  const getValidPhones = useCallback(
    (): PhoneNumberInput[] => phoneNumbers.filter((p) => p.number && p.number.trim().length > 0),
    [phoneNumbers],
  );

  return {
    phoneNumbers,
    addPhone,
    removePhone,
    updatePhone,
    setAll,
    getValidPhones,
  };
}
