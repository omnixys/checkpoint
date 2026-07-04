"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import {
  Alert,
  alpha,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  FormGroup,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import RsvpSuccess from "@/checkpoint/app/rsvp/success/RSVPSuccess";
import PhoneNumberDialog from "@/checkpoint/components/common/phoneNumber/PhoneNumberDialog";
import PhoneNumberListAccordion from "@/checkpoint/components/common/phoneNumber/PhoneNumberListAccordion";
import PlusOneDialog from "@/checkpoint/components/common/plus-one/PlusOneDialog";
import PlusOneListAccordion from "@/checkpoint/components/common/plus-one/PlusOneListAccordion";
import EventParticipationField from "@/checkpoint/components/EventParticipationField";
import LanguageSwitcher from "@/checkpoint/components/LanguageSwitcher";
import { CinematicRsvpLayout, RsvpChapter } from "@/checkpoint/components/rsvp/CinematicRsvpLayout";
import ThemeToggleButton from "@/checkpoint/components/ThemeToggleButton";
import { usePhoneNumbers } from "@/checkpoint/hooks/common/usePhoneNumbers";
import {
  type EventSelectionNode,
  useEventSelection,
} from "@/checkpoint/hooks/events/useEventSelection";
import useEventTreeQuery from "@/checkpoint/hooks/events/useEventTreeQuery";
import { usePlusOnes } from "@/checkpoint/hooks/invitation/usePlusOnes";
import usePublicRsvpMutation from "@/checkpoint/hooks/invitation/usePublicRsvpMutation";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import type { CallingCodeCountry } from "@/checkpoint/types/country.type";
import ColorBubbleSwitcher from "../../components/ColorBubbleSwitcher";

/* ------------------------------------------------------------------ */
/* Shared UI */
/* ------------------------------------------------------------------ */

function ErrorState({ title, message }: { title: string; message: string }) {
  return (
    <Box
      component="main"
      sx={{
        background:
          "radial-gradient(circle at 50% 15%, rgba(216,184,121,0.16), transparent 34%), #050506",
        color: "#f1ece2",
        minHeight: "100dvh",
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            minHeight: "100dvh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper sx={{ p: { xs: 3, sm: 5 }, textAlign: "center", width: "100%" }}>
            <Stack spacing={2} sx={{ alignItems: "center" }}>
              <Typography variant="h4">{title}</Typography>
              <Alert severity="error">{message}</Alert>
            </Stack>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

function LoadingScreen() {
  const t = useTypedTranslations("common");
  return (
    <Box
      sx={{
        background:
          "radial-gradient(circle at 50% 15%, rgba(216,184,121,0.16), transparent 34%), #050506",
        color: "#f1ece2",
        display: "flex",
        minHeight: "100dvh",
        flexDirection: "column",
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress color="inherit" size={34} thickness={2} />
      <Typography variant="body2">{t("loading")}</Typography>
    </Box>
  );
}

function AppearanceControls() {
  return (
    <Box
      aria-label="Appearance and language controls"
      sx={{
        alignItems: "center",
        backdropFilter: "blur(22px) saturate(160%)",
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.78),
        border: "1px solid",
        borderColor: (theme) => alpha(theme.palette.primary.main, 0.26),
        borderRadius: 999,
        boxShadow: "0 18px 55px rgba(0,0,0,0.3)",
        display: "flex",
        gap: 0.5,
        left: { xs: "50%", sm: "auto" },
        p: 0.5,
        position: "fixed",
        right: { xs: "auto", sm: 24 },
        top: { xs: 16, sm: 24 },
        transform: { xs: "translateX(-50%)", sm: "none" },
        zIndex: (theme) => theme.zIndex.appBar + 1,
        "& > .rsvp-floating-control": {
          alignItems: "center",
          borderRadius: "50%",
          display: "flex",
          minHeight: 44,
          minWidth: 44,
          justifyContent: "center",
          "& .MuiIconButton-root": { m: 0 },
          "& .MuiButton-root": { minWidth: 44, px: 0 },
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
  const [guestNote, setGuestNote] = useState("");
  const [selectedInvitedBy, setSelectedInvitedBy] = useState<string[]>([]);
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

  const { createPublicInvitation, publicRsvpError, publicRsvpLoading } = usePublicRsvpMutation();

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
  }, [eventId, publicEventTree]);

  const selectedPhone = useMemo(() => {
    if (phoneDialogIndex === null) {
      return null;
    }
    return phoneNumbers[phoneDialogIndex] ?? null;
  }, [phoneDialogIndex, phoneNumbers]);

  const selectedPlusOne = useMemo(() => {
    if (plusOneDialogIndex === null) {
      return null;
    }
    return plusOnes[plusOneDialogIndex] ?? null;
  }, [plusOneDialogIndex, plusOnes]);

  const { selectedEventIds, isRootSelected, isChildSelected, toggleRoot, toggleChild } =
    useEventSelection({
      rootEventId: eventId ?? "",
      children: childEvents,
    });

  const invitedByOptions = useMemo(() => {
    if (!publicEventTree || !eventId) {
      return [];
    }

    const effectiveEventId = isRootSelected
      ? eventId
      : selectedEventIds.length === 1
        ? selectedEventIds[0]
        : eventId;

    const settings =
      effectiveEventId === eventId || effectiveEventId === publicEventTree.rootEvent.id
        ? publicEventTree.rootEvent.settings
        : publicEventTree.subEvents?.find((child) => child.id === effectiveEventId)?.settings;

    return settings?.invitedByOptions ?? [];
  }, [eventId, isRootSelected, publicEventTree, selectedEventIds]);

  const toggleInvitedBy = (value: string) => {
    setSelectedInvitedBy((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

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
    return <RsvpSuccess />;
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

    if (validPhones.length === 0) {
      nextValidationMessages.push(t("validation.contactRequired"));
    }

    if (
      plusOnes.some(
        (plusOne) =>
          (plusOne.firstName.trim() || plusOne.lastName.trim()) && !plusOne.plusOneAgeCategory,
      )
    ) {
      nextValidationMessages.push(t("validation.plusOneAgeRequired"));
    }

    if (childEvents.length > 0 && selectedEventIds.length === 0) {
      nextValidationMessages.push(t("validation.eventRequired"));
    }

    if (invitedByOptions.length > 0 && selectedInvitedBy.length === 0) {
      nextValidationMessages.push(t("validation.invitedByRequired"));
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
          selectedInvitedBy,
          guestNote: guestNote.trim() || null,
          plusOnes: mappedPlusOnes,
        },
      },
    });

    setSubmitted(true);
  };

  return (
    <CinematicRsvpLayout
      controls={<AppearanceControls />}
      eventName={publicEventTree.rootEvent.name}
      heroDescription={t("public.heroDescription")}
      heroEyebrow={t("public.heroEyebrow")}
    >
      <RsvpChapter
        description={t("public.participationDescription")}
        index="01"
        title={t("public.participationTitle")}
      >
        <EventParticipationField
          rootEventId={eventId}
          rootEventName={publicEventTree.rootEvent.name}
          events={childEvents}
          isRootSelected={isRootSelected}
          isChildSelected={isChildSelected}
          onToggleRoot={toggleRoot}
          onToggleChild={toggleChild}
        />
      </RsvpChapter>

      <RsvpChapter
        description={t("public.guestInfoDescription")}
        index="02"
        title={t("public.guestInfoTitle")}
      >
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          }}
        >
          <TextField
            autoComplete="given-name"
            label={t("firstName")}
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            fullWidth={true}
            required={true}
          />
          <TextField
            autoComplete="family-name"
            label={t("lastName")}
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            fullWidth={true}
            required={true}
          />
          <TextField
            autoComplete="email"
            label={t("emailOptional")}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            fullWidth={true}
            sx={{ gridColumn: { md: "1 / -1" } }}
            type="email"
          />
        </Box>
      </RsvpChapter>

      <RsvpChapter
        description={t("public.contactDescription")}
        index="03"
        title={t("public.contactTitle")}
      >
        <PhoneNumberListAccordion
          values={phoneNumbers}
          onAdd={addPhone}
          onEdit={setPhoneDialogIndex}
          onRemove={removePhone}
        />
      </RsvpChapter>

      {invitedByOptions.length > 0 && (
        <RsvpChapter
          description={t("public.invitedByDescription")}
          index="04"
          title={t("public.invitedByTitle")}
        >
          <FormGroup
            sx={{
              display: "grid",
              gap: 1,
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
            }}
          >
            {invitedByOptions.map((option) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={selectedInvitedBy.includes(option)}
                    onChange={() => toggleInvitedBy(option)}
                  />
                }
                label={option}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  minHeight: 48,
                  mx: 0,
                  px: 1.5,
                }}
              />
            ))}
          </FormGroup>
        </RsvpChapter>
      )}

      <RsvpChapter
        description={t("public.companionsDescription")}
        index={invitedByOptions.length > 0 ? "05" : "04"}
        title={t("public.companionsTitle")}
      >
        <PlusOneListAccordion
          values={plusOnes}
          onAdd={add}
          onEdit={setPlusOneDialogIndex}
          onRemove={remove}
        />
      </RsvpChapter>

      <RsvpChapter
        description={t("public.guestNoteDescription")}
        index={invitedByOptions.length > 0 ? "06" : "05"}
        title={t("public.guestNoteTitle")}
      >
        <TextField
          fullWidth={true}
          label={t("public.guestNoteLabel")}
          minRows={4}
          multiline={true}
          value={guestNote}
          onChange={(event) => setGuestNote(event.target.value)}
        />
      </RsvpChapter>

      <Paper
        component="section"
        elevation={0}
        sx={{
          background: (theme) =>
            `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.14)}, ${alpha(theme.palette.background.paper, 0.82)})`,
          border: "1px solid",
          borderColor: (theme) => alpha(theme.palette.primary.main, 0.32),
          borderRadius: { xs: 3, md: 5 },
          p: { xs: 3, sm: 5, md: 7 },
          textAlign: "center",
        }}
      >
        <Stack spacing={3} sx={{ alignItems: "center" }}>
          <Typography
            component="h2"
            sx={{
              fontFamily: "var(--font-wedding-serif), Georgia, serif",
              fontSize: "clamp(2rem, 6vw, 4rem)",
              fontWeight: 400,
              lineHeight: 1.1,
            }}
          >
            {t("public.confirmTitle")}
          </Typography>
          <Typography
            color="text.secondary"
            id="rsvp-submit-note"
            sx={{ lineHeight: 1.8, maxWidth: 560 }}
          >
            {t("public.confirmDescription")}
          </Typography>

          {validationMessages.length > 0 && (
            <Alert severity="error" sx={{ maxWidth: 680, textAlign: "left", width: "100%" }}>
              <Stack spacing={0.5}>
                {validationMessages.map((message) => (
                  <Typography key={message} variant="body2">
                    {message}
                  </Typography>
                ))}
              </Stack>
            </Alert>
          )}

          {publicRsvpError && (
            <Alert severity="error" sx={{ maxWidth: 680, width: "100%" }}>
              {t("submitFailed")}
            </Alert>
          )}

          <Button
            aria-describedby="rsvp-submit-note"
            disabled={publicRsvpLoading}
            endIcon={
              publicRsvpLoading ? (
                <CircularProgress color="inherit" size={18} />
              ) : (
                <ArrowForwardRoundedIcon />
              )
            }
            onClick={handleSubmit}
            size="large"
            sx={{
              minWidth: { xs: "100%", sm: 280 },
              mt: 1,
              px: 5,
              py: 1.6,
            }}
            variant="contained"
          >
            {t("submit")}
          </Button>
        </Stack>
      </Paper>

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
    </CinematicRsvpLayout>
  );
}
