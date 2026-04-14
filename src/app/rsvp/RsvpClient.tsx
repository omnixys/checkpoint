"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import {
  Alert,
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

import {
  Country,
  CreateInvitationFromRsvpDocument,
  CreateInvitationFromRsvpMutation,
  CreateInvitationFromRsvpMutationVariables,
  EventChildrenDocument,
  EventChildrenQuery,
  EventChildrenQueryVariables,
  GetEventByIdRsvpDocument,
  GetEventByIdRsvpQuery,
  GetEventByIdRsvpQueryVariables,
} from "@/checkpoint/generated/graphql";

import PhoneNumberAccordion from "@/checkpoint/components/common/phoneNumber/PhoneNumberAccordion";
import PhoneNumberDialog from "@/checkpoint/components/common/phoneNumber/PhoneNumberDialog";
import PlusOneAccordion from "@/checkpoint/components/common/plus-one/PlusOneAccordion";
import EventParticipationField from "@/checkpoint/components/EventParticipationField";
import { usePhoneNumbers } from "@/checkpoint/hooks/common/usePhoneNumbers";
import { EventSelectionNode, useEventSelection } from "@/checkpoint/hooks/events/useEventSelection";
import { usePlusOnes } from "@/checkpoint/hooks/invitation/usePlusOnes";
import PhoneNumberListAccordion from "@/checkpoint/components/common/phoneNumber/PhoneNumberListAccordion";
import PlusOneListAccordion from "@/checkpoint/components/common/plus-one/PlusOneListAccordion";
import PlusOneDialog from "@/checkpoint/components/common/plus-one/PlusOneDialog";
import RSVPSuccess from "@/checkpoint/app/rsvp/success/RSVPSuccess";
import { CallingCodeCountry } from "@/checkpoint/types/country.type";

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

  const {
    data,
    loading: loadingEvent,
    error: eventError,
  } = useQuery<GetEventByIdRsvpQuery, GetEventByIdRsvpQueryVariables>(GetEventByIdRsvpDocument, {
    variables: { id: eventId ?? "" },
    skip: !eventId,
  });

  const {
    data: treeData,
    loading: loadingTree,
    error: treeError,
  } = useQuery<EventChildrenQuery, EventChildrenQueryVariables>(EventChildrenDocument, {
    variables: { id: eventId ?? "" },
    skip: !eventId,
  });

  const [createInvitation, { loading, error }] = useMutation<
    CreateInvitationFromRsvpMutation,
    CreateInvitationFromRsvpMutationVariables
  >(CreateInvitationFromRsvpDocument, {
    onCompleted: () => setSubmitted(true),
  });

  const event = data?.eventRsvp;

  const childEvents: EventSelectionNode[] = useMemo(() => {
    const children = treeData?.eventChildren.filter((child) => child.id !== eventId);
    return (
      children?.map((item) => ({
        id: item.id,
        name: item.name,
        parentId: item.parentId,
        depth: item.depth,
      })) ?? []
    );
  }, [treeData]);

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
    return <ErrorState title="Ungültiger Link" message="Missing eventId." />;
  }

  if (loadingEvent || loadingTree) {
    return <LoadingScreen />;
  }

  if (eventError) {
    return <ErrorState title="Fehler" message="Event konnte nicht geladen werden." />;
  }

  if (treeError) {
    return <ErrorState title="Fehler" message="Event-Struktur konnte nicht geladen werden." />;
  }

  if (!event) {
    return <ErrorState title="Nicht gefunden" message="Event ist nicht verfügbar." />;
  }

  if (submitted) {
    return <RSVPSuccess />;
  }

  const handleSubmit = async () => {
    const validPhones = getValidPhones();
    const mappedPlusOnes = toGraphQL();

    const nextValidationMessages: string[] = [];

    if (!firstName.trim()) {
      nextValidationMessages.push("Vorname ist erforderlich.");
    }

    if (!lastName.trim()) {
      nextValidationMessages.push("Nachname ist erforderlich.");
    }

    if (!email.trim() && validPhones.length === 0) {
      nextValidationMessages.push(
        "Bitte gib mindestens eine E-Mail-Adresse oder Telefonnummer an.",
      );
    }

    /**
     * Future-ready event selection:
     * selectedEventIds is already available here for the future backend contract.
     * Current PublicRsvpInput does not yet expose event selection IDs.
     */
    if (childEvents.length > 0 && selectedEventIds.length === 0) {
      nextValidationMessages.push(
        "Bitte wähle mindestens ein Event aus, an dem du teilnehmen möchtest.",
      );
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
      setValidationMessages([
        "Mehrfachauswahl von Teil-Events wird aktuell noch nicht unterstützt.",
      ]);
      return;
    }

    await createInvitation({
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
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          minHeight: "100vh",
        }}
      >
        <Card sx={{ width: "100%" }}>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h4">{event.name}</Typography>

              <EventParticipationField
                rootEventId={eventId}
                rootEventName={event.name}
                children={childEvents}
                isRootSelected={isRootSelected}
                isChildSelected={isChildSelected}
                onToggleRoot={toggleRoot}
                onToggleChild={toggleChild}
              />

              <TextField
                label="Vorname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
                required
              />

              <TextField
                label="Nachname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
                required
              />

              <TextField
                label="E-Mail (optional)"
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

              {error && <Alert severity="error">{error.message}</Alert>}

              <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                Absenden
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
