"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import { CountryCode, parsePhoneNumberFromString } from "libphonenumber-js";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { EVENT_BY_ID_2 } from "@/graphql/event/event-query.graphql";
import { createCombinedApolloClient } from "@/lib/client/combined-client";
import { EventById2Result } from "@/types/event/event-query-graphql.type";
import { CountryPhoneInput } from "./CountryPhoneInput";
import { buildInternationalPhone, normalizeNationalPhone } from "./phone-utils";

/* ------------------------------------------------------------------
 * GraphQL
 * ------------------------------------------------------------------ */

const CREATE_INVITATION_FROM_RSVP = gql`
  mutation CreateInvitationFromRsvp($input: PublicRsvpInput!) {
    createInvitationFromRsvp(input: $input) {
      id
      status
    }
  }
`;

/* ------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------ */

export type PublicPlusOneInput = {
  firstName: string;
  lastName: string;
};

export type PublicRsvpInput = {
  eventId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  plusOnes?: PublicPlusOneInput[];
};

export type CreateInvitationFromRsvpRequest = {
  input: PublicRsvpInput;
};

export type CreateInvitationFromRsvpResult = {
  createInvitationFromRsvp: {
    id: string;
    status: string;
  };
};

/* ------------------------------------------------------------------
 * Shared UI States
 * ------------------------------------------------------------------ */

function ErrorState({
  title = "Fehler",
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        minHeight="100vh"
        alignItems="center"
        justifyContent="center"
      >
        <Card elevation={3}>
          <CardContent>
            <Stack spacing={2} textAlign="center">
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
      display="flex"
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress />
    </Box>
  );
}

/* ------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------ */

export default function RsvpClient() {
  /* ----------------------------- Hooks ----------------------------- */

  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [country, setCountry] = useState<CountryCode>("DE");
  const [plusOnes, setPlusOnes] = useState<PublicPlusOneInput[]>([]);

  const client = useMemo(() => createCombinedApolloClient(), []);

  const {
    data,
    loading: loadingEvent,
    error: eventError,
  } = useQuery<EventById2Result>(EVENT_BY_ID_2, {
    client,
    variables: { eventId: eventId ?? "" },
    skip: !eventId,
  });

  const [createInvitation, { loading, error }] = useMutation<
    CreateInvitationFromRsvpResult,
    CreateInvitationFromRsvpRequest
  >(CREATE_INVITATION_FROM_RSVP, {
    client,
    onCompleted: () => setSubmitted(true),
  });

  /* --------------------------- UI Guards --------------------------- */

  if (!eventId) {
    return (
      <ErrorState
        title="Ungültiger Link"
        message="Der Einladungslink enthält kein gültiges Event."
      />
    );
  }

  if (loadingEvent) {
    return <LoadingScreen />;
  }

  if (eventError) {
    return (
      <ErrorState
        title="Event konnte nicht geladen werden"
        message="Bitte überprüfe den Link oder versuche es später erneut."
      />
    );
  }

  const event = data?.event2;

  if (!event) {
    return (
      <ErrorState
        title="Event nicht verfügbar"
        message="Dieses Event existiert nicht oder die RSVP ist geschlossen."
      />
    );
  }

  if (submitted) {
    return (
      <Container maxWidth="sm">
        <Card elevation={3} sx={{ mt: 8, textAlign: "center" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Thank you for your RSVP
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We have received your details. The organizer will contact you if
              needed.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  /* --------------------------- Handlers --------------------------- */

  const addPlusOne = () => {
    setPlusOnes((p) => [...p, { firstName: "", lastName: "" }]);
  };

  const updatePlusOne = (
    index: number,
    field: keyof PublicPlusOneInput,
    value: string
  ) => {
    setPlusOnes((p) =>
      p.map((po, i) => (i === index ? { ...po, [field]: value } : po))
    );
  };

  const removePlusOne = (index: number) => {
    setPlusOnes((p) => p.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const international = buildInternationalPhone(country, phone);
    const parsed = parsePhoneNumberFromString(international, {
      defaultCountry: country,
    });

    if (!parsed || !parsed.isValid()) return;

    await createInvitation({
      variables: {
        input: {
          eventId,
          firstName,
          lastName,
          phoneNumber: parsed.nationalNumber,
          plusOnes,
        },
      },
    });
  };

  const normalizedPhone = normalizeNationalPhone(phone, "DE");
  const phoneInvalid = phone.length > 0 && !normalizedPhone;

  /* ----------------------------- Form ----------------------------- */

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        justifyContent="center"
      >
        <Card elevation={4}>
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h4">{event.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(event.startsAt).toLocaleString()} –{" "}
                  {new Date(event.endsAt).toLocaleString()}
                </Typography>
                {event.address?.street && (
                  <Typography variant="body2" color="text.secondary">
                    {event.address.street} {event.address.zip}{" "}
                    {event.address.city}
                  </Typography>
                )}
              </Box>

              <TextField
                label="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
                required
              />

              <TextField
                label="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
                required
              />

              <CountryPhoneInput
                country={country}
                phone={phone}
                onCountryChange={setCountry}
                onPhoneChange={setPhone}
                error={phoneInvalid}
                helperText={phoneInvalid ? "Invalid phone number" : undefined}
              />

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>
                    Bring guests (Plus-Ones)
                    {plusOnes.length > 0 && ` (${plusOnes.length})`}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    {plusOnes.map((po, idx) => (
                      <Card key={idx} variant="outlined">
                        <CardContent>
                          <Stack spacing={2}>
                            <TextField
                              label="First name"
                              value={po.firstName}
                              onChange={(e) =>
                                updatePlusOne(idx, "firstName", e.target.value)
                              }
                              fullWidth
                              required
                            />
                            <TextField
                              label="Last name"
                              value={po.lastName}
                              onChange={(e) =>
                                updatePlusOne(idx, "lastName", e.target.value)
                              }
                              fullWidth
                              required
                            />
                            <Button
                              color="error"
                              size="small"
                              onClick={() => removePlusOne(idx)}
                            >
                              Remove guest
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                    <Button variant="outlined" onClick={addPlusOne}>
                      Add guest
                    </Button>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              {error && (
                <Alert severity="error">
                  {error.message.includes("already")
                    ? "You have already submitted an RSVP for this event."
                    : "Unable to submit RSVP. Please try again later."}
                </Alert>
              )}

              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={
                  loading ||
                  !firstName ||
                  !lastName ||
                  phoneInvalid ||
                  phone.length === 0
                }
              >
                {loading ? "Submitting…" : "Confirm attendance"}
              </Button>

              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
              >
                Your data will only be used for event organization purposes.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
