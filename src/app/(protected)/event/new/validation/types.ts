import {
  ChildEventFormValue,
  CreateEventWizardFormValue,
  EventAddressFormValue,
} from "@/checkpoint/app/(protected)/event/new/validation/createEvent.schema";
import type { FieldErrors, UseFormReturn } from "react-hook-form";

export enum CreateEventWizardStep {
  Basics = 0,
  Address = 1,
  Settings = 2,
  Children = 3,
  Summary = 4,
  Success = 5,
}

export type GeoSuggestion = {
  cityId?: string;
  postalCodeId?: string;
  stateId?: string;
  countryId?: string;
  streetId?: string;
  houseNumberId?: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  country?: string;
  additionalInfo?: string;
  lat?: number;
  lon?: number;
  label: string;
};

export type CreateEventWizardApi = {
  form: UseFormReturn<CreateEventWizardFormValue>;
  step: CreateEventWizardStep;
  isFirstStep: boolean;
  isLastDataStep: boolean;
  isSuccessStep: boolean;
  nextStep: () => Promise<void>;
  previousStep: () => void;
  jumpToStep: (step: CreateEventWizardStep) => void;
  submitWizard: () => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  geoSuggestions: GeoSuggestion[];
  isResolvingGeo: boolean;
  resolveAddressSuggestions: (query: string) => Promise<void>;
  applyGeoSuggestion: (suggestion: GeoSuggestion) => void;
  clearAddress: () => void;
  addChild: () => void;
  removeChild: (index: number) => void;
  duplicateChild: (index: number) => void;
  getStepErrorState: (step: CreateEventWizardStep) => boolean;
  getSummaryAddress: () => EventAddressFormValue | null;
  getChildren: () => ChildEventFormValue[];
  getErrors: () => FieldErrors<CreateEventWizardFormValue>;
};
