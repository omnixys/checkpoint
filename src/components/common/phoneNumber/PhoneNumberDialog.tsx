"use client";

import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import PhoneNumberField from "@/checkpoint/components/common/phoneNumber/PhoneNumberField";
import type { PhoneNumberInput } from "@/checkpoint/generated/graphql";
import type { CallingCodeCountry } from "@/checkpoint/types/country.type";

interface Props {
  open: boolean;
  onClose: () => void;
  value: PhoneNumberInput | null;
  index: number | null;
  countries: CallingCodeCountry[];
  onChange: any;
}

export default function PhoneNumberDialog({
  open,
  onClose,
  value,
  index,
  countries,
  onChange,
}: Props) {
  if (!value || index === null) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="sm">
      <DialogTitle>Edit Phone</DialogTitle>

      <DialogContent>
        <PhoneNumberField
          value={value}
          index={index}
          countries={countries}
          onChange={onChange}
          onRemove={() => {}}
        />
      </DialogContent>
    </Dialog>
  );
}
