"use client";

import { useAddressAutocomplete } from "@/checkpoint/components/event/settings/address/useAddressAutocomplete";
import { Autocomplete, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

/**
 * -------------------------------------------------------------
 * Types
 * -------------------------------------------------------------
 *
 * Important:
 * The autocomplete response may contain nullable values.
 * The UI component keeps that shape explicit and lets the form
 * normalize null values at the boundary.
 */
export type Suggestion = {
  streetId: string | null;
  houseNumberId: string | null;
  cityId: string | null;
  postalCodeId: string | null;
  stateId: string | null;
  countryId: string | null;

  formatted: string | null;
  street: string | null;
  houseNumber: string | null;
  lat: number | null;
  lon: number | null;
  confidence: number | null;
};

type Props = {
  value?: string | undefined;
  onChange?: (value: Suggestion | null) => void;
};

/**
 * -------------------------------------------------------------
 * Debounce Hook
 * -------------------------------------------------------------
 */
function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debounced;
}

/**
 * -------------------------------------------------------------
 * StreetAutocomplete (CONTROLLED COMPONENT)
 * -------------------------------------------------------------
 *
 * WHY:
 * - No dependency on react-hook-form
 * - Fully reusable
 * - Works in any context (forms, dialogs, mobile)
 */
export default function StreetAutocomplete({ value, onChange }: Props) {
  const [inputValue, setInputValue] = useState<string>(value ?? "");
  const debounced = useDebouncedValue(inputValue, 400);

  const [load, { data, loading }] = useAddressAutocomplete();

  const options: Suggestion[] = useMemo(() => {
    return (
      data?.addressAutocomplete.map((address) => {
        return {
          formatted: address.formatted ?? null,
          street: address.street ?? null,
          houseNumber: address.houseNumber ?? null,
          lat: address.lat ?? null,
          lon: address.lon ?? null,
          confidence: address.confidence ?? null,

          /**
           * Backend currently does not provide structured IDs.
           * They remain nullable until the API exposes them.
           */
          streetId: null,
          houseNumberId: null,
          cityId: null,
          postalCodeId: null,
          stateId: null,
          countryId: null,
        };
      }) ?? []
    );
  }, [data]);

  /**
   * Keep local input in sync when the parent updates the value.
   */
  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      setInputValue(value);
    }
  }, [value, inputValue]);

  /**
   * Fetch suggestions
   */
  useEffect(() => {
    if (!debounced || debounced.trim().length < 3) {
      return;
    }

    load({
      variables: { text: debounced },
    });
  }, [debounced, load]);

  return (
    <Autocomplete<Suggestion, false, false, false>
      options={options}
      loading={loading}
      inputValue={inputValue}
      onInputChange={(_, nextValue) => {
        setInputValue(nextValue);
      }}
      getOptionLabel={(option) => option.formatted ?? ""}
      filterOptions={(x) => x}
      onChange={(_, selected) => {
        onChange?.(selected ?? null);

        if (selected?.formatted) {
          setInputValue(selected.formatted);
        }
      }}
      renderOption={(props, option) => {
        const { key, ...rest } = props;

        return (
          <li key={key} {...rest}>
            <Stack spacing={0.3}>
              <Typography variant="body2">{option.formatted ?? ""}</Typography>

              {option.confidence != null && (
                <Typography variant="caption" color="text.secondary">
                  Confidence: {Math.round(option.confidence * 100)}%
                </Typography>
              )}
            </Stack>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Street & House Number"
          placeholder="Start typing address..."
          helperText="Select a suggestion"
          slotProps={{
            ...params.slotProps,

            input: {
              ...params.slotProps?.input,
              endAdornment: (
                <>
                  {loading ? <CircularProgress size={18} /> : null}
                  {params.slotProps?.input?.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
}
