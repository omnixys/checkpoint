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
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type {
  PlusOneAgeCategory,
  PlusOneItem,
  PlusOnePhoneNumberType,
  UpdatePlusOneInput,
} from "@/checkpoint/app/(protected)/me/my-plus-ones/types/plusOne.types";
import type { CreatePlusOneInput } from "@/checkpoint/generated/graphql";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { glassInputSx } from "@/checkpoint/themes/styles/glassInput";

type PlusOneDialogMode = "create" | "edit";

interface Props {
  open: boolean;
  mode: PlusOneDialogMode;
  initialValue?: PlusOneItem | null;
  onClose: () => void;
  onCreate: (input: CreatePlusOneInput) => Promise<void>;
  onUpdate: (input: UpdatePlusOneInput) => Promise<void>;
}

const phoneTypeOptions: PlusOnePhoneNumberType[] = [
  "WHATSAPP",
  "MOBILE",
  "PRIVATE",
  "WORK",
  "HOME",
  "OTHER",
];

const MotionBox = motion.create(Box);

export default function PlusOneDialog({
  open,
  mode,
  initialValue,
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
  const [phoneType, setPhoneType] = useState<PlusOnePhoneNumberType>("WHATSAPP");
  const [label, setLabel] = useState("");
  const [plusOneAgeCategory, setPlusOneAgeCategory] = useState<PlusOneAgeCategory | "">("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setFirstName(initialValue?.firstName ?? "");
    setLastName(initialValue?.lastName ?? "");
    setEmail(initialValue?.email ?? "");
    setPlusOneAgeCategory(initialValue?.plusOneAgeCategory ?? "");

    const primaryPhone =
      initialValue?.phoneNumbers?.find((phone) => phone.isPrimary) ??
      initialValue?.phoneNumbers?.[0];

    setCountryCode(primaryPhone?.countryCode ?? "+49");
    setNumber(primaryPhone?.number ?? "");
    setPhoneType(primaryPhone?.type ?? "WHATSAPP");
    setLabel(primaryPhone?.label ?? "");
  }, [initialValue, open]);

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
      type: PlusOnePhoneNumberType;
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
    firstName.trim().length > 0 && lastName.trim().length > 0 && plusOneAgeCategory !== "";

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
          eventId: "",
          invitedByInvitationId: "",
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim() || null,
          plusOneAgeCategory: selectedAgeCategory,
          phoneNumbers,
        });
      } else if (initialValue) {
        await onUpdate({
          id: initialValue.id,
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
        <MotionBox
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.22 }}
        >
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
        </MotionBox>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <AnimatePresence mode="wait">
          <MotionBox
            key={mode}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Stack spacing={2.25}>
              <MotionBox
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03, duration: 0.2 }}
              >
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
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.07, duration: 0.2 }}
              >
                <TextField
                  label={tInvitation("plusOnes.fields.email")}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  fullWidth={true}
                  type="email"
                  sx={glassInputSx(theme)}
                />
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.09, duration: 0.2 }}
              >
                <FormControl required={true} fullWidth={true}>
                  <FormLabel>{tCommon("plusOne.ageCategory")}</FormLabel>
                  <RadioGroup
                    row={true}
                    value={plusOneAgeCategory}
                    onChange={(event) =>
                      setPlusOneAgeCategory(event.target.value as PlusOneAgeCategory)
                    }
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
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
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
                        onChange={(event) => setCountryCode(event.target.value)}
                        fullWidth={true}
                        sx={glassInputSx(theme)}
                      />

                      <TextField
                        label={tInvitation("plusOnes.fields.phoneNumber")}
                        value={number}
                        onChange={(event) => setNumber(event.target.value)}
                        fullWidth={true}
                        sx={glassInputSx(theme)}
                      />
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <TextField
                        select={true}
                        label={tInvitation("plusOnes.fields.phoneType")}
                        value={phoneType}
                        onChange={(event) =>
                          setPhoneType(event.target.value as PlusOnePhoneNumberType)
                        }
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
              </MotionBox>
            </Stack>
          </MotionBox>
        </AnimatePresence>
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

        <MotionBox whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            variant="contained"
            startIcon={mode === "create" ? <AddRoundedIcon /> : <SaveRoundedIcon />}
          >
            {submitLabel}
          </Button>
        </MotionBox>
      </DialogActions>
    </Dialog>
  );
}
