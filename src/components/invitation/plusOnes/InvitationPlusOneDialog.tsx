"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {
  alpha,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useEffect, useMemo, useState } from "react";
import type {
  CreatePlusOneInput,
  InvitationPayload,
  PlusOneAgeCategory,
  UpdatePlusOneInput,
} from "@/checkpoint/generated/graphql";
import { PhoneNumberType } from "@/checkpoint/generated/graphql";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { glassInputSx } from "@/checkpoint/themes/styles/glassInput";
import { stripNonDigits, stripNonDigitsAllowPlus } from "@/checkpoint/utils/input/numericInput";

type PlusOneDialogMode = "create" | "edit";

interface ContactPhoneFallback {
  countryCode?: string;
  number?: string;
  type?: PhoneNumberType;
  label?: string | null;
}

function resolveContactPhone(
  invitation: InvitationPayload | null | undefined,
): ContactPhoneFallback {
  const structured =
    invitation?.phoneNumbers?.find((phone) => phone.isPrimary) ?? invitation?.phoneNumbers?.[0];

  if (structured?.countryCode && structured?.number) {
    return {
      countryCode: structured.countryCode,
      number: structured.number,
      type: structured.type,
      label: structured.label,
    };
  }

  const raw = invitation?.phoneNumber;
  if (raw?.trim()) {
    const parsed = parsePhoneNumberFromString(raw.trim());
    if (parsed?.countryCallingCode && parsed.nationalNumber) {
      return {
        countryCode: `+${parsed.countryCallingCode}`,
        number: parsed.nationalNumber,
        type: PhoneNumberType.WHATSAPP,
        label: null,
      };
    }
    return { countryCode: "+49", number: raw.trim(), type: PhoneNumberType.WHATSAPP, label: null };
  }

  return {};
}

interface Props {
  open: boolean;
  mode: PlusOneDialogMode;
  eventId: string;
  invitedByInvitationId: string;
  initialValue?: InvitationPayload | null;
  parentInvitation?: InvitationPayload | null;
  onClose: () => void;
  onCreate: (input: CreatePlusOneInput) => Promise<void>;
  onUpdate: (input: UpdatePlusOneInput) => Promise<void>;
}

const phoneTypeOptions: PhoneNumberType[] = [
  PhoneNumberType.WHATSAPP,
  PhoneNumberType.MOBILE,
  PhoneNumberType.PRIVATE,
  PhoneNumberType.WORK,
  PhoneNumberType.HOME,
  PhoneNumberType.OTHER,
];

export default function InvitationPlusOneDialog({
  open,
  mode,
  eventId,
  invitedByInvitationId,
  initialValue,
  parentInvitation,
  onClose,
  onCreate,
  onUpdate,
}: Props) {
  const theme = useTheme();
  const tInvitation = useTypedTranslations("invitation");
  const tCommon = useTypedTranslations("common");

  const [submitting, setSubmitting] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+49");
  const [number, setNumber] = useState("");
  const [phoneType, setPhoneType] = useState<PhoneNumberType>(PhoneNumberType.WHATSAPP);
  const [label, setLabel] = useState("");
  const [plusOneAgeCategory, setPlusOneAgeCategory] = useState<PlusOneAgeCategory | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setFirstName(initialValue?.firstName ?? "");
    setLastName(initialValue?.lastName ?? "");
    setPlusOneAgeCategory(initialValue?.plusOneAgeCategory ?? null);

    const contactSource = mode === "create" ? parentInvitation : initialValue;
    setEmail(contactSource?.email ?? "");

    const phone = resolveContactPhone(contactSource);
    setCountryCode(phone.countryCode ?? "+49");
    setNumber(phone.number ?? "");
    setPhoneType(phone.type ?? PhoneNumberType.WHATSAPP);
    setLabel(phone.label ?? "");
  }, [initialValue, parentInvitation, open, mode]);

  const title =
    mode === "create"
      ? tInvitation("plusOnes.dialog.createTitle")
      : tInvitation("plusOnes.dialog.editTitle");

  const submitLabel =
    mode === "create"
      ? tInvitation("plusOnes.dialog.createAction")
      : tInvitation("plusOnes.dialog.updateAction");

  const phoneNumbers = useMemo<
    Array<{
      countryCode: string;
      number: string;
      type: PhoneNumberType;
      label: string | null;
      isPrimary: boolean;
    }>
  >(() => {
    if (!number.trim()) {
      return [];
    }

    return [
      {
        countryCode: countryCode.trim(),
        number: number.trim(),
        type: phoneType,
        label: label.trim() || null,
        isPrimary: true,
      },
    ];
  }, [countryCode, label, number, phoneType]);

  const isValid =
    firstName.trim().length > 0 && lastName.trim().length > 0 && plusOneAgeCategory !== null;

  const handleSubmit = async (): Promise<void> => {
    if (!isValid) {
      return;
    }

    const selectedAgeCategory = plusOneAgeCategory;
    if (!selectedAgeCategory) {
      return;
    }

    setSubmitting(true);

    try {
      if (mode === "create") {
        await onCreate({
          eventId,
          invitedByInvitationId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim() || null,
          plusOneAgeCategory: selectedAgeCategory,
          phoneNumbers,
        });
      } else {
        await onUpdate({
          id: initialValue?.id ?? "",
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim() || null,
          plusOneAgeCategory: selectedAgeCategory,
          phoneNumbers,
        });
      }

      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth={true} maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>
        <Stack spacing={0.75}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tInvitation("plusOnes.dialog.subtitle")}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2.25}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label={tInvitation("plusOnes.fields.firstName")}
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              fullWidth={true}
              sx={glassInputSx(theme)}
            />
            <TextField
              label={tInvitation("plusOnes.fields.lastName")}
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              fullWidth={true}
              sx={glassInputSx(theme)}
            />
          </Stack>

          <TextField
            label={tInvitation("plusOnes.fields.email")}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            fullWidth={true}
            type="email"
            sx={glassInputSx(theme)}
          />

          <FormControl required={true} fullWidth={true}>
            <FormLabel>{tCommon("plusOne.ageCategory")}</FormLabel>
            <RadioGroup
              row={true}
              value={plusOneAgeCategory}
              onChange={(event) => setPlusOneAgeCategory(event.target.value as PlusOneAgeCategory)}
              sx={{
                gap: 1,
                mt: 1,
                "& .MuiFormControlLabel-root": {
                  border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                  borderRadius: 2,
                  m: 0,
                  minHeight: 44,
                  px: 1.25,
                },
              }}
            >
              <FormControlLabel
                value="OVER_SIX"
                control={<Radio />}
                label={tCommon("plusOne.overSix")}
              />
              <FormControlLabel
                value="UNDER_SIX"
                control={<Radio />}
                label={tCommon("plusOne.underSix")}
              />
            </RadioGroup>
          </FormControl>

          <Box
            sx={{
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
              background:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.background.paper, 0.6)
                  : alpha(theme.palette.background.paper, 0.8),
              p: 2,
            }}
          >
            <Stack spacing={1.5}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                }}
              >
                {tInvitation("plusOnes.fields.phoneSection")}
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label={tInvitation("plusOnes.fields.countryCode")}
                  value={countryCode}
                  onChange={(event) => setCountryCode(stripNonDigitsAllowPlus(event.target.value))}
                  fullWidth={true}
                  slotProps={{ htmlInput: { inputMode: "tel" } }}
                  sx={glassInputSx(theme)}
                />

                <TextField
                  label={tInvitation("plusOnes.fields.phoneNumber")}
                  value={number}
                  onChange={(event) => setNumber(stripNonDigits(event.target.value))}
                  fullWidth={true}
                  slotProps={{ htmlInput: { inputMode: "tel" } }}
                  sx={glassInputSx(theme)}
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  select={true}
                  label={tInvitation("plusOnes.fields.phoneType")}
                  value={phoneType}
                  onChange={(event) => setPhoneType(event.target.value as PhoneNumberType)}
                  fullWidth={true}
                  sx={glassInputSx(theme)}
                >
                  {phoneTypeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {tInvitation(`plusOnes.phoneTypes.${option}`)}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label={tInvitation("plusOnes.fields.phoneLabel")}
                  value={label}
                  onChange={(event) => setLabel(event.target.value)}
                  fullWidth={true}
                  sx={glassInputSx(theme)}
                />
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          justifyContent: "space-between",
        }}
      >
        <Button onClick={onClose} disabled={submitting} variant="text">
          {tCommon("cancel")}
        </Button>

        <Button
          onClick={() => void handleSubmit()}
          disabled={!isValid || submitting}
          variant="contained"
          startIcon={mode === "create" ? <AddRoundedIcon /> : <SaveRoundedIcon />}
        >
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
