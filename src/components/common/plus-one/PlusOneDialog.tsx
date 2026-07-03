"use client";

import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import PlusOneField from "@/checkpoint/components/common/plus-one/PlusOneField";
import type { PhoneNumberInput } from "@/checkpoint/generated/graphql";
import type { CallingCodeCountry } from "@/checkpoint/types/country.type";
import type { NormalizedPlusOne } from "@/checkpoint/types/event.type";

interface Props {
  open: boolean;
  index: number | null;
  value: NormalizedPlusOne | null;
  countries: CallingCodeCountry[];

  onClose: () => void;

  onChange: <K extends keyof NormalizedPlusOne>(
    index: number,
    field: K,
    value: NormalizedPlusOne[K],
  ) => void;

  onAddPhone: (index: number, phone: PhoneNumberInput) => void;

  onUpdatePhone: <K extends keyof PhoneNumberInput>(
    index: number,
    phoneIndex: number,
    field: K,
    value: PhoneNumberInput[K],
  ) => void;

  onRemovePhone: (index: number, phoneIndex: number) => void;

  onRemove: (index: number) => void;
}

/**
 * PlusOneDialog
 *
 * Full-screen editing experience for PlusOne.
 * Reuses existing PlusOneField to avoid duplication.
 */
export default function PlusOneDialog({
  open,
  index,
  value,
  countries,
  onClose,
  onChange,
  onAddPhone,
  onUpdatePhone,
  onRemovePhone,
  onRemove,
}: Props) {
  if (index === null || !value) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="sm">
      <DialogTitle>Begleitperson bearbeiten</DialogTitle>

      <DialogContent>
        <PlusOneField
          value={value}
          index={index}
          countries={countries}
          onChange={onChange}
          onRemove={onRemove}
          onAddPhone={onAddPhone}
          onUpdatePhone={onUpdatePhone}
          onRemovePhone={onRemovePhone}
        />
      </DialogContent>
    </Dialog>
  );
}
