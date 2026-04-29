"use client";

import {
  Alert,
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import RSVPSuccess from "@/checkpoint/app/rsvp/success/RSVPSuccess";
import PhoneNumberDialog from "@/checkpoint/components/common/phoneNumber/PhoneNumberDialog";
import PhoneNumberListAccordion from "@/checkpoint/components/common/phoneNumber/PhoneNumberListAccordion";
import PlusOneDialog from "@/checkpoint/components/common/plus-one/PlusOneDialog";
import PlusOneListAccordion from "@/checkpoint/components/common/plus-one/PlusOneListAccordion";
import EventParticipationField from "@/checkpoint/components/EventParticipationField";
import LanguageSwitcher from "@/checkpoint/components/LanguageSwitcher";
import ThemeToggleButton from "@/checkpoint/components/ThemeToggleButton";
import { usePhoneNumbers } from "@/checkpoint/hooks/common/usePhoneNumbers";
import { EventSelectionNode, useEventSelection } from "@/checkpoint/hooks/events/useEventSelection";
import useEventTreeQuery from "@/checkpoint/hooks/events/useEventTreeQuery";
import { usePlusOnes } from "@/checkpoint/hooks/invitation/usePlusOnes";
import usePublicRsvpMutation from "@/checkpoint/hooks/invitation/usePublicRsvpMutation";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { CallingCodeCountry } from "@/checkpoint/types/country.type";
import ColorBubbleSwitcher from "../../components/ColorBubbleSwitcher";

/* ------------------------------------------------------------------ */
/* Shared UI */
/* ------------------------------------------------------------------ */

function ErrorState({ title, message }: { title: string; message: string }) {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card>
          <CardContent>
            <Stack
              spacing={2}
              sx={{
                alignItems: "center",
              }}
            >
              <Typography variant="h5">{title}</Typography>
              <Alert severity="error">{message}</Alert>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

function LoadingScreen() {
  const t = useTypedTranslations("common");
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <CircularProgress />
      <Typography variant="body2">{t("loading")}</Typography>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Page */
/* ------------------------------------------------------------------ */

export default function RsvpClient({
  callingCodeCountry,
}: {
  callingCodeCountry: CallingCodeCountry[];
}) {
  const t = useTypedTranslations("rsvp");

  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);
  const [phoneDialogIndex, setPhoneDialogIndex] = useState<number | null>(null);
  const [plusOneDialogIndex, setPlusOneDialogIndex] = useState<number | null>(null);

  const { phoneNumbers, addPhone, updatePhone, removePhone, getValidPhones } = usePhoneNumbers();

  const {
    plusOnes,
    add,
    remove,
    update,
    addPhone: addPlusOnePhone,
    updatePhone: updatePlusOnePhone,
    removePhone: removePlusOnePhone,
    toGraphQL,
  } = usePlusOnes();

  const { publicEventTree, publicEventTreeLoading, publicEventTreeError } = useEventTreeQuery({
    eventId: eventId ?? undefined,
    loadPublicEventTree: true,
  });

  const { createPublicInvitation, publicRsvpError, publicRsvpLoading } = usePublicRsvpMutation({});

  const childEvents: EventSelectionNode[] = useMemo(() => {
    const children = publicEventTree?.subEvents?.filter((child) => child.id !== eventId);
    return (
      children?.map((item) => ({
        id: item.id,
        name: item.name,
        parentId: item.parentId,
        depth: item.depth,
      })) ?? []
    );
  }, [publicEventTree]);

  const selectedPhone = useMemo(() => {
    if (phoneDialogIndex === null) return null;
    return phoneNumbers[phoneDialogIndex] ?? null;
  }, [phoneDialogIndex, phoneNumbers]);

  const selectedPlusOne = useMemo(() => {
    if (plusOneDialogIndex === null) return null;
    return plusOnes[plusOneDialogIndex] ?? null;
  }, [plusOneDialogIndex, plusOnes]);

  const { selectedEventIds, isRootSelected, isChildSelected, toggleRoot, toggleChild } =
    useEventSelection({
      rootEventId: eventId ?? "",
      children: childEvents,
    });

  /* ---------------- Guards ---------------- */

  if (!eventId) {
    return <ErrorState title={t("invalidLink")} message={t("missingEventId")} />;
  }

  if (publicEventTreeLoading) {
    return <LoadingScreen />;
  }

  if (publicEventTreeError) {
    return <ErrorState title={t("error")} message={t("eventLoadFailed")} />;
  }

  if (publicEventTreeError) {
    return <ErrorState title={t("error")} message={t("eventTreeLoadFailed")} />;
  }

  if (!publicEventTree) {
    return <ErrorState title={t("notFound")} message={t("eventNotAvailable")} />;
  }

  if (submitted) {
    return <RSVPSuccess />;
  }

  const handleSubmit = async () => {
    const validPhones = getValidPhones();
    const mappedPlusOnes = toGraphQL();

    const nextValidationMessages: string[] = [];

    if (!firstName.trim()) {
      nextValidationMessages.push(t("validation.firstNameRequired"));
    }

    if (!lastName.trim()) {
      nextValidationMessages.push(t("validation.lastNameRequired"));
    }

    if (!email.trim() && validPhones.length === 0) {
      nextValidationMessages.push(t("validation.contactRequired"));
    }

    if (childEvents.length > 0 && selectedEventIds.length === 0) {
      nextValidationMessages.push(t("validation.eventRequired"));
    }

    setValidationMessages(nextValidationMessages);

    if (nextValidationMessages.length > 0) {
      return;
    }
    const effectiveEventId = isRootSelected
      ? eventId
      : selectedEventIds.length === 1
        ? selectedEventIds[0]
        : null;

    if (!effectiveEventId) {
      setValidationMessages([t("validation.multiEventNotSupported")]);
      return;
    }

    await createPublicInvitation({
      variables: {
        input: {
          eventId: effectiveEventId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          message: null,
          email: email.trim() || null,
          phoneNumbers: validPhones,
          plusOnes: mappedPlusOnes,
        },
      },
    });

    setSubmitted(true);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Box
          aria-label="Appearance and language controls"
          sx={{
            alignItems: "center",
            backdropFilter: "blur(22px) saturate(160%)",
            backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.72),
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 999,
            boxShadow: "0 18px 55px rgba(15, 23, 42, 0.18)",
            display: "flex",
            gap: 0.75,
            left: { xs: "50%", sm: "auto" },
            p: 0.75,
            position: "fixed",
            right: { xs: "auto", sm: 24 },
            top: { xs: 16, sm: 24 },
            transform: { xs: "translateX(-50%)", sm: "none" },
            transition: "transform 220ms ease, box-shadow 220ms ease, background-color 220ms ease",
            zIndex: (theme) => theme.zIndex.appBar + 1,
            "&:hover, &:focus-within": {
              backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.86),
              boxShadow: "0 22px 70px rgba(15, 23, 42, 0.24)",
              transform: {
                xs: "translateX(-50%) translateY(-3px)",
                sm: "translateY(-3px)",
              },
            },
            "& > .rsvp-floating-control": {
              alignItems: "center",
              borderRadius: "50%",
              display: "flex",
              height: 44,
              justifyContent: "center",
              minWidth: 44,
              transition:
                "transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease",
              "&:hover, &:focus-within": {
                backgroundColor: "action.hover",
                boxShadow: "0 8px 22px rgba(15, 23, 42, 0.14)",
                transform: "translateY(-4px) scale(1.04)",
              },
              "& .MuiIconButton-root": {
                m: 0,
              },
              "& .MuiButton-root": {
                minWidth: 44,
                px: 0,
              },
            },
          }}
        >
          <Box className="rsvp-floating-control">
            <ColorBubbleSwitcher />
          </Box>
          <Box className="rsvp-floating-control">
            <ThemeToggleButton />
          </Box>
          <Box className="rsvp-floating-control">
            <LanguageSwitcher />
          </Box>
        </Box>

        <Card sx={{ width: "100%" }}>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h4">{publicEventTree.rootEvent.name}</Typography>

              <EventParticipationField
                rootEventId={eventId}
                rootEventName={publicEventTree.rootEvent.name}
                children={childEvents}
                isRootSelected={isRootSelected}
                isChildSelected={isChildSelected}
                onToggleRoot={toggleRoot}
                onToggleChild={toggleChild}
              />

              <TextField
                label={t("firstName")}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
                required
              />

              <TextField
                label={t("lastName")}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
                required
              />

              <TextField
                label={t("emailOptional")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />

              <PhoneNumberListAccordion
                values={phoneNumbers}
                onAdd={addPhone}
                onEdit={setPhoneDialogIndex}
                onRemove={removePhone}
              />

              <PlusOneListAccordion
                values={plusOnes}
                onAdd={add}
                onEdit={setPlusOneDialogIndex}
                onRemove={remove}
              />

              {validationMessages.length > 0 && (
                <Alert severity="error">
                  <Stack spacing={0.5}>
                    {validationMessages.map((message, index) => (
                      <Typography key={index} variant="body2">
                        {message}
                      </Typography>
                    ))}
                  </Stack>
                </Alert>
              )}

              {publicRsvpError && <Alert severity="error"> {t("submitFailed")}</Alert>}

              <Button variant="contained" onClick={handleSubmit} disabled={publicRsvpLoading}>
                {t("submit")}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <PhoneNumberDialog
        open={phoneDialogIndex !== null}
        index={phoneDialogIndex}
        value={selectedPhone}
        countries={callingCodeCountry}
        onClose={() => setPhoneDialogIndex(null)}
        onChange={updatePhone}
      />

      <PlusOneDialog
        open={plusOneDialogIndex !== null}
        index={plusOneDialogIndex}
        value={selectedPlusOne}
        countries={callingCodeCountry}
        onClose={() => setPlusOneDialogIndex(null)}
        onChange={update}
        onAddPhone={addPlusOnePhone}
        onUpdatePhone={updatePlusOnePhone}
        onRemovePhone={removePlusOnePhone}
        onRemove={remove}
      />
    </Container>
  );
}
