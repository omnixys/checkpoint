// src/checkpoint/utils/validation/rsvp.validation.ts

import type { PhoneNumberInput, PublicPlusOneInput } from "@/checkpoint/generated/graphql";
import { type ValidationError, validatePhoneNumber } from "@/checkpoint/utils/validation.util";

/**
 * Validate invitee (main guest)
 */
export function validateInvitee(
  firstName: string,
  lastName: string,
  email: string,
  phoneNumbers: PhoneNumberInput[],
): ValidationError[] {
  const errors: ValidationError[] = [];

  /**
   * 1. Name validation
   */
  if (!firstName.trim()) {
    errors.push({ field: "firstName", message: "First name is required" });
  }

  if (!lastName.trim()) {
    errors.push({ field: "lastName", message: "Last name is required" });
  }

  /**
   * 2. Email OR phone required
   */
  if (!email.trim() && phoneNumbers.length === 0) {
    errors.push({
      field: "contact",
      message: "Either email or phone number is required",
    });
  }

  /**
   * 3. Email validation
   */
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push({
      field: "email",
      message: "Invalid email address",
    });
  }

  /**
   * 4. Phone validation
   */
  phoneNumbers.forEach((p) => {
    errors.push(...validatePhoneNumber(p));
  });

  return errors;
}

/**
 * Validate plus ones
 */
export function validatePlusOnes(plusOnes: PublicPlusOneInput[]): ValidationError[] {
  const errors: ValidationError[] = [];

  plusOnes.forEach((p, index) => {
    if (!p.firstName?.trim()) {
      errors.push({
        field: `plusOnes[${index}].firstName`,
        message: "First name is required",
      });
    }

    if (!p.lastName?.trim()) {
      errors.push({
        field: `plusOnes[${index}].lastName`,
        message: "Last name is required",
      });
    }

    /**
     * Email OR phone rule
     */
    if (!p.email && (!p.phoneNumbers || p.phoneNumbers.length === 0)) {
      errors.push({
        field: `plusOnes[${index}].contact`,
        message: "Email or phone number required",
      });
    }

    /**
     * Email validation
     */
    if (p.email && !/^\S+@\S+\.\S+$/.test(p.email)) {
      errors.push({
        field: `plusOnes[${index}].email`,
        message: "Invalid email",
      });
    }

    /**
     * Phone validation
     */
    p.phoneNumbers?.forEach((phone) => {
      errors.push(...validatePhoneNumber(phone));
    });
  });

  return errors;
}
