"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, MenuItem, Stack, Switch, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { PHONE_NUMBER_TYPES } from "@/checkpoint/constants/phone-number.constants";
import type { PhoneNumberInput } from "@/checkpoint/generated/graphql";
import type { CallingCodeCountry } from "@/checkpoint/types/country.type";

interface Props {
  value: PhoneNumberInput;
  index: number;
  countries: CallingCodeCountry[];

  onChange: <K extends keyof PhoneNumberInput>(
    index: number,
    field: K,
    value: PhoneNumberInput[K],
  ) => void;

  onRemove: (index: number) => void;
}

/**
 * PhoneNumberField
 *
 * Fully controlled, reusable phone input component
 */
export default function PhoneNumberField({
  value,
  index,
  countries: callingCodeCountries,
  onChange,
  onRemove,
}: Props) {
  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        position: "relative",
      }}
    >
      {/* Remove */}
      <IconButton
        onClick={() => onRemove(index)}
        size="small"
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>

      <Stack spacing={2} sx={{ p: { xs: 1, sm: 2 }, pt: 3 }}>
        {/* TYPE + LABEL */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            select={true}
            fullWidth={true}
            label="Type"
            value={value?.type}
            onChange={(e) => onChange(index, "type", e.target.value as PhoneNumberInput["type"])}
          >
            {PHONE_NUMBER_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth={true}
            label="Label"
            value={value?.label ?? ""}
            onChange={(e) => onChange(index, "label", e.target.value)}
          />
        </Stack>

        {/* COUNTRY + NUMBER */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            select={true}
            label="Country"
            value={value?.countryCode}
            onChange={(e) => onChange(index, "countryCode", e.target.value)}
            sx={{ minWidth: { xs: "100%", sm: 160 } }}
          >
            {callingCodeCountries.map((c) => (
              <MenuItem key={c.iso2} value={c.callingCode ?? undefined}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                  }}
                >
                  {c.flagSvg && <Image src={c.flagSvg} width={18} height={18} alt={c.name} />}
                  <Typography variant="body2">({c.callingCode})</Typography>
                </Stack>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth={true}
            label="Phone number"
            value={value?.number}
            onChange={(e) => onChange(index, "number", e.target.value)}
            placeholder="17612345678"
          />
        </Stack>

        {/* PRIMARY */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: "center",
          }}
        >
          <Typography variant="body2">Primary</Typography>
          <Switch
            checked={value?.isPrimary ?? false}
            onChange={(e) => onChange(index, "isPrimary", e.target.checked)}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
