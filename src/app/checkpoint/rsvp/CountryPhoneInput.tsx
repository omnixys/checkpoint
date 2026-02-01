// CountryPhoneInput.tsx
"use client";

import { Stack, TextField, MenuItem, Box, Typography } from "@mui/material";
import ReactCountryFlag from "react-country-flag";
import { CountryCode } from "libphonenumber-js";
import { buildInternationalPhone, normalizeNationalPhone, COUNTRIES } from "./phone-utils";


type Props = {
  country: CountryCode;
  phone: string;
  onCountryChange: (c: CountryCode) => void;
  onPhoneChange: (v: string) => void;
  label?: string;
};

export function CountryPhoneInput({
  country,
  phone,
  onCountryChange,
  onPhoneChange,
  label = "Phone number",
}: Props) {
  const international = buildInternationalPhone(country, phone);
  const valid =
    phone.length === 0 || normalizeNationalPhone(international, country);

  return (
    <Stack direction="row" spacing={2}>
      {/* Country select */}
      <TextField
        select
        label="Country"
        value={country}
        onChange={(e) => onCountryChange(e.target.value as CountryCode)}
        sx={{ width: 190 }}
      >
        {COUNTRIES.map((c) => (
          <MenuItem key={c.code} value={c.code}>
            <Box display="flex" alignItems="center" gap={1}>
              <ReactCountryFlag
                svg
                countryCode={c.code}
                style={{ width: "1.25em", height: "1.25em" }}
              />
              <Typography variant="body2">
               ({c.callingCode})
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </TextField>

      {/* Phone input */}
      <TextField
        label={label}
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        fullWidth
        required
        placeholder="15111951223"
        error={!valid}
        helperText={!valid ? "Invalid phone number" : "Local number only"}
        inputProps={{ inputMode: "tel" }}
      />
    </Stack>
  );
}
