"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import PhoneNumberField from "@/checkpoint/components/common/phoneNumber/PhoneNumberField";
import type { PhoneNumberInput } from "@/checkpoint/generated/graphql";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import type { CallingCodeCountry } from "@/checkpoint/types/country.type";
import type { NormalizedPlusOne } from "@/checkpoint/types/event.type";

interface Props {
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
}

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
  const t = useTypedTranslations("common");

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <IconButton onClick={() => onRemove(index)} size="small">
        <DeleteIcon fontSize="small" />
      </IconButton>

      <Stack spacing={2} sx={{ minWidth: 0 }}>
        <TextField
          label="First name"
          value={value.firstName}
          onChange={(e) => onChange(index, "firstName", e.target.value)}
          fullWidth={true}
        />

        <TextField
          label="Last name"
          value={value.lastName}
          onChange={(e) => onChange(index, "lastName", e.target.value)}
          fullWidth={true}
        />

        <TextField
          label="Email (optional)"
          value={value.email ?? ""}
          onChange={(e) => onChange(index, "email", e.target.value || null)}
          fullWidth={true}
        />

        <FormControl required={true} fullWidth={true}>
          <FormLabel>{t("plusOne.ageCategory")}</FormLabel>
          <RadioGroup
            row={true}
            value={value.plusOneAgeCategory ?? ""}
            onChange={(event) =>
              onChange(
                index,
                "plusOneAgeCategory",
                event.target.value as NormalizedPlusOne["plusOneAgeCategory"],
              )
            }
            sx={{
              gap: { xs: 0.5, sm: 2 },
              "& .MuiFormControlLabel-root": {
                minHeight: 44,
              },
            }}
          >
            <FormControlLabel value="OVER_SIX" control={<Radio />} label={t("plusOne.overSix")} />
            <FormControlLabel value="UNDER_SIX" control={<Radio />} label={t("plusOne.underSix")} />
          </RadioGroup>
        </FormControl>

        {/* 📞 Nested Phones */}
        <Stack spacing={2}>
          {value.phoneNumbers.map((p, phoneIndex) => (
            <PhoneNumberField
              key={`${p.type}:${p.countryCode}:${p.number}:${p.label ?? ""}`}
              value={p}
              index={phoneIndex}
              countries={countries}
              onChange={(_i, field, val) => onUpdatePhone(index, phoneIndex, field, val)}
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
            fullWidth={true}
          >
            + Add phone
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
