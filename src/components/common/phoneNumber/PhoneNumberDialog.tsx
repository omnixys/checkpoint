"use client";

import PhoneNumberField from "@/checkpoint/components/common/phoneNumber/PhoneNumberField";
import { Country, PhoneNumberInput } from "@/checkpoint/generated/graphql";
import { CallingCodeCountry } from "@/checkpoint/types/country.type";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  value: PhoneNumberInput | null;
  index: number | null;
  countries: CallingCodeCountry[];
  onChange: any;
};

export default function PhoneNumberDialog({
  open,
  onClose,
  value,
  index,
  countries,
  onChange,
}: Props) {
  if (!value || index === null) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
