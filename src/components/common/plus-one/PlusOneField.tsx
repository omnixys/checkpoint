"use client";

import PhoneNumberField from "@/checkpoint/components/common/phoneNumber/PhoneNumberField";
import type { PhoneNumberInput } from "@/checkpoint/generated/graphql";
import { CallingCodeCountry } from "@/checkpoint/types/country.type";
import { NormalizedPlusOne } from "@/checkpoint/types/event.type";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, IconButton, Stack, TextField } from "@mui/material";

type Props = {
  value: NormalizedPlusOne;
  index: number;
  countries: CallingCodeCountry[];

  onChange: <K extends keyof NormalizedPlusOne>(
    index: number,
    field: K,
    value: NormalizedPlusOne[K],
  ) => void;

  onRemove: (index: number) => void;

  // nested phones
  onAddPhone: (index: number, phone: PhoneNumberInput) => void;
  onUpdatePhone: <K extends keyof PhoneNumberInput>(
    index: number,
    phoneIndex: number,
    field: K,
    value: PhoneNumberInput[K],
  ) => void;
  onRemovePhone: (index: number, phoneIndex: number) => void;
};

export default function PlusOneField({
  value,
  index,
  countries,
  onChange,
  onRemove,
  onAddPhone,
  onUpdatePhone,
  onRemovePhone,
}: Props) {
  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <IconButton onClick={() => onRemove(index)} size="small">
        <DeleteIcon fontSize="small" />
      </IconButton>

      <Stack spacing={2}>
        <TextField
          label="First name"
          value={value.firstName}
          onChange={(e) => onChange(index, "firstName", e.target.value)}
          fullWidth
        />

        <TextField
          label="Last name"
          value={value.lastName}
          onChange={(e) => onChange(index, "lastName", e.target.value)}
          fullWidth
        />

        <TextField
          label="Email (optional)"
          value={value.email ?? ""}
          onChange={(e) => onChange(index, "email", e.target.value || null)}
          fullWidth
        />

        {/* 📞 Nested Phones */}
        <Stack spacing={2}>
          {value.phoneNumbers.map((p, phoneIndex) => (
            <PhoneNumberField
              key={phoneIndex}
              value={p}
              index={phoneIndex}
              countries={countries}
              onChange={(i, field, val) => onUpdatePhone(index, phoneIndex, field, val)}
              onRemove={() => onRemovePhone(index, phoneIndex)}
            />
          ))}

          <Button
            variant="outlined"
            onClick={() =>
              onAddPhone(index, {
                type: "WHATSAPP",
                number: "",
                label: "",
                countryCode: "+49",
                isPrimary: value.phoneNumbers.length === 0,
              })
            }
          >
            + Add phone
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
