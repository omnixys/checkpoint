"use client";

import { InvitationCreateInput, PhoneNumberInput } from "@/checkpoint/generated/graphql";
import { usePhoneNumbers } from "@/checkpoint/hooks/common/usePhoneNumbers";
import { useCallback, useEffect, useMemo, useState } from "react";

export type InvitationFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  maxInvitees: number;
  invitedByInvitationId: string;
  eventId: string;
};

type InvitationCreateMetadata = {
  autoApproveOnAccept: boolean;
  eventEndsAt: string;
  eventName: string | null;
};

export type UseInvitationFormOptions = {
  /**
   * Event id is required for create payload generation.
   */
  eventId: string;

  /**
   * Optional default country for newly added phone numbers.
   */
  defaultCountry?: string;

  /**
   * Optional initial values.
   * Useful for edit flows or prefilled create flows.
   */
  initialValues?: Partial<InvitationFormValues>;

  /**
   * Optional initial phone numbers.
   * Useful for edit flows.
   */
  initialPhoneNumbers?: PhoneNumberInput[];

  /**
   * When enabled, the hook ensures that at least one phone row exists.
   * This improves UX for create dialogs.
   */
  autoCreateFirstPhone?: boolean;
};

export type UseInvitationFormReturn = {
  values: InvitationFormValues;

  setField: <K extends keyof InvitationFormValues>(
    field: K,
    value: InvitationFormValues[K],
  ) => void;

  resetForm: () => void;

  phoneNumbers: PhoneNumberInput[];
  addPhone: () => void;
  removePhone: (index: number) => void;
  updatePhone: <K extends keyof PhoneNumberInput>(
    index: number,
    field: K,
    value: PhoneNumberInput[K],
  ) => void;
  setAllPhones: (values: PhoneNumberInput[]) => void;

  isDirty: boolean;
  isValid: boolean;

  /**
   * Final GraphQL-ready payload.
   */
  buildCreateInput: (metadata: InvitationCreateMetadata) => InvitationCreateInput;
};

const DEFAULT_VALUES: InvitationFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  maxInvitees: 0,
  invitedByInvitationId: "",
  eventId: "",
};

/**
 * Removes blank phone rows and normalizes optional values
 * before sending data to the API.
 */
function sanitizePhoneNumbers(values: PhoneNumberInput[]): PhoneNumberInput[] {
  const cleaned: PhoneNumberInput[] = values
    .map((phone) => ({
      ...phone,
      number: phone.number.trim(),
      countryCode: phone.countryCode.trim(),
      label: phone.label?.trim() ? phone.label.trim() : null,
      isPrimary: phone.isPrimary ?? false,
    }))
    .filter((phone) => phone.number !== "" && phone.countryCode !== "");

  if (cleaned.length === 0) {
    return [];
  }

  const hasPrimary = cleaned.some((phone) => phone.isPrimary === true);

  return cleaned.map((phone, index) => ({
    ...phone,
    isPrimary: hasPrimary ? (phone.isPrimary ?? false) : index === 0,
  }));
}

/**
 * useInvitationForm
 *
 * Centralized invitation form state for create/edit flows.
 * Keeps business logic outside UI components.
 */
export function useInvitationForm({
  eventId,
  defaultCountry = "+49",
  initialValues,
  initialPhoneNumbers,
  autoCreateFirstPhone = true,
}: UseInvitationFormOptions): UseInvitationFormReturn {
  const mergedInitialValues = useMemo<InvitationFormValues>(
    () => ({
      ...DEFAULT_VALUES,
      eventId,
      ...initialValues,
    }),
    [initialValues, eventId],
  );

  const [values, setValues] = useState<InvitationFormValues>(mergedInitialValues);

  const {
    phoneNumbers,
    addPhone,
    removePhone,
    updatePhone,
    setAll: setAllPhones,
  } = usePhoneNumbers(defaultCountry);

  /**
   * Initialize / reinitialize form values when the caller changes inputs.
   * This is useful for edit dialogs or when dialog data is replaced.
   */
  useEffect(() => {
    setValues(mergedInitialValues);
  }, [mergedInitialValues]);

  /**
   * Initialize / reinitialize phone numbers.
   */
  useEffect(() => {
    setAllPhones(initialPhoneNumbers ?? []);
  }, [initialPhoneNumbers, setAllPhones]);

  /**
   * Improve UX for create dialogs:
   * always show one phone row instead of an empty section.
   */
  useEffect(() => {
    if (autoCreateFirstPhone && phoneNumbers.length === 0) {
      addPhone();
    }
  }, [autoCreateFirstPhone, phoneNumbers.length, addPhone]);

  const setField = useCallback(
    <K extends keyof InvitationFormValues>(field: K, value: InvitationFormValues[K]) => {
      setValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const resetForm = useCallback(() => {
    setValues(mergedInitialValues);
    setAllPhones(initialPhoneNumbers ?? []);

    if (autoCreateFirstPhone && (!initialPhoneNumbers || initialPhoneNumbers.length === 0)) {
      /**
       * setAllPhones runs asynchronously through state updates,
       * so we add a first empty phone row explicitly when needed.
       */
      queueMicrotask(() => {
        addPhone();
      });
    }
  }, [mergedInitialValues, initialPhoneNumbers, setAllPhones, autoCreateFirstPhone, addPhone]);

  const sanitizedPhoneNumbers = useMemo(() => sanitizePhoneNumbers(phoneNumbers), [phoneNumbers]);

  const hasName = values.firstName.trim() !== "" && values.lastName.trim() !== "";

  const hasContact = values.email.trim() !== "" || sanitizedPhoneNumbers.length > 0;

  const hasValidMaxInvitees = Number.isInteger(values.maxInvitees) && values.maxInvitees >= 0;

  const isValid = hasName && hasContact && hasValidMaxInvitees;

  const isDirty = useMemo(() => {
    const basePhones = JSON.stringify(initialPhoneNumbers ?? []);
    const currentPhones = JSON.stringify(phoneNumbers);

    return (
      values.firstName !== mergedInitialValues.firstName ||
      values.lastName !== mergedInitialValues.lastName ||
      values.email !== mergedInitialValues.email ||
      values.maxInvitees !== mergedInitialValues.maxInvitees ||
      values.invitedByInvitationId !== mergedInitialValues.invitedByInvitationId ||
      basePhones !== currentPhones
    );
  }, [values, mergedInitialValues, initialPhoneNumbers, phoneNumbers]);

  const buildCreateInput = useCallback((metadata: InvitationCreateMetadata): InvitationCreateInput => {
    const trimmedEmail = values.email.trim();
    const trimmedInvitedByInvitationId = values.invitedByInvitationId.trim();

    return {
      eventId: values.eventId,
      eventName: metadata.eventName,
      eventEndsAt: metadata.eventEndsAt,
      autoApproveOnAccept: metadata.autoApproveOnAccept,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: trimmedEmail !== "" ? trimmedEmail : null,
      maxInvitees: values.maxInvitees < 0 ? 0 : values.maxInvitees,
      phoneNumbers: sanitizedPhoneNumbers.length > 0 ? sanitizedPhoneNumbers : null,
      invitedByInvitationId:
        trimmedInvitedByInvitationId !== "" ? trimmedInvitedByInvitationId : null,
      phoneNumber: null,
    };
  }, [values, sanitizedPhoneNumbers]);

  return {
    values,
    setField,
    resetForm,

    phoneNumbers,
    addPhone,
    removePhone,
    updatePhone,
    setAllPhones,

    isDirty,
    isValid,

    buildCreateInput,
  };
}
