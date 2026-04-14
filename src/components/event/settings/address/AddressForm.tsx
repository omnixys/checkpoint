"use client";

import StreetAutocomplete, {
  Suggestion,
} from "@/checkpoint/components/event/settings/address/StreetAutocomplete";
import { Stack, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  onChange: (val: FormState) => void;
};

export type FormState = {
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;

  /**
   * Optional means:
   * - property may be omitted
   * - do not explicitly set undefined when avoidable
   */
  streetId?: string;
  houseNumberId?: string;
  cityId?: string;
  postalCodeId?: string;
  stateId?: string;
  countryId?: string;

  lat?: number | null;
  lon?: number | null;
  formatted?: string;
};

/**
 * -------------------------------------------------------------
 * Address Form (Apple Maps Style)
 * -------------------------------------------------------------
 */
export default function AddressForm({ onChange }: Props) {
  const theme = useTheme();

  const [form, setForm] = useState<FormState>({
    street: "",
    houseNumber: "",
    city: "",
    postalCode: "",
    state: "",
    country: "",
  });

  useEffect(() => {
    onChange(form);
  }, [form, onChange]);

  return (
    <Stack spacing={2}>
      <StreetAutocompleteWrapper setForm={setForm} form={form} />
    </Stack>
  );
}

/**
 * Wrapper → integrates StreetAutocomplete into the local form state.
 *
 * Important:
 * Nullable values from the autocomplete response are normalized here.
 * This keeps the form state strict and UI-safe.
 */
function StreetAutocompleteWrapper({
  setForm,
  form,
}: {
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  form: FormState;
}) {
  return (
    <StreetAutocomplete
      {...(form.formatted !== undefined ? { value: form.formatted } : {})}
      onChange={(selected: Suggestion | null) => {
        if (!selected) {
          return;
        }

        setForm((prev) => ({
          ...prev,

          // UI values
          street: selected.street ?? "",
          houseNumber: selected.houseNumber ?? "",
          formatted: selected.formatted ?? "",

          /**
           * Backend IDs are currently nullable.
           * Only write them into state when they actually exist.
           */
          ...(selected.streetId !== null ? { streetId: selected.streetId } : {}),
          ...(selected.houseNumberId !== null ? { houseNumberId: selected.houseNumberId } : {}),
          ...(selected.cityId !== null ? { cityId: selected.cityId } : {}),
          ...(selected.postalCodeId !== null ? { postalCodeId: selected.postalCodeId } : {}),
          ...(selected.stateId !== null ? { stateId: selected.stateId } : {}),
          ...(selected.countryId !== null ? { countryId: selected.countryId } : {}),

          lat: selected.lat ?? null,
          lon: selected.lon ?? null,
        }));
      }}
    />
  );
}
