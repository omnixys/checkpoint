"use client";

import {
  REMOVE_ALL_PLUS_ONE,
  REPLY_INVITATION,
} from "@/graphql/invitation/invitation.mutation";
import { RsvpChoice } from "@/types/invitation/invitation-enum.type";
import {
  ReplyInvitationRequest,
  ReplyInvitationResult,
} from "@/types/invitation/invitation-mutation.graphql.type";
import { PhoneNumberType } from "@/types/user/user-enum-type";
import { useMutation } from "@apollo/client/react";
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import PlusOneEditor from "./PlusOneEditor";

/**
 * AcceptForm
 * - Collects phone & email
 * - Allows PlusOnes creation
 * - Uses RSVP mutation (YES)
 * - Triggers Valkey temporary plusOne creation
 */
export default function AcceptForm({
  invitation,
  plusOnes,
  refetchPlusOnes,
  onAccepted,
  onBack,
}: {
  invitation: any;
  plusOnes: any[];
  refetchPlusOnes: () => Promise<any>;
  onAccepted: () => void;
  onBack: () => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // form fields
  const [phoneType, setPhoneType] = useState<PhoneNumberType>(
    PhoneNumberType.MOBILE
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  // Mutations
  const [replyInvitation, { loading: replying }] = useMutation<
    ReplyInvitationResult,
    ReplyInvitationRequest
  >(REPLY_INVITATION);
  const [removeAllPlusOnes] = useMutation(REMOVE_ALL_PLUS_ONE);

  /**
   * Validation
   */
  const canSubmit = phoneNumber.trim().length > 3 && !replying;

  /**
   * Submit Accept RSVP
   */
  const handleSubmit = async () => {
    if (!canSubmit) return;

    // 1. Clean temporary plusOnes in Valkey (start fresh)
    await removeAllPlusOnes({
      variables: { id: invitation.id },
    });

    // 2. Send RSVP YES mutation
    await replyInvitation({
      variables: {
        input: {
          invitationId: invitation.id,
          choice: RsvpChoice.YES,
          replyInput: {
            email: email.trim() !== "" ? email.trim() : undefined,
            phoneNumbers: [
              {
                type: phoneType,
                number: phoneNumber,
                isPrimary: true,
              },
            ],
          },
        },
      },
    });

    // 3. Refetch invitation & plusOnes (temporary Valkey ones)
    await refetchPlusOnes();

    // 4. Notify parent → go to final accepted screen
    onAccepted();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
    >
      <Box
        sx={{
          backdropFilter: "blur(26px)",
          WebkitBackdropFilter: "blur(26px)",
          background: theme.palette.background.paper + "BB",
          borderRadius: "24px",
          boxShadow: theme.shadows[4],
          p: isMobile ? 3 : 4,
        }}
      >
        <Stack spacing={3}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            fontWeight={700}
            textAlign="center"
          >
            Teilnahme bestätigen
          </Typography>

          <Typography textAlign="center" sx={{ opacity: 0.7 }}>
            Bitte gib deine Kontaktdaten an.
          </Typography>

          {/* Phone Number */}
          <Stack direction="row" spacing={2}>
            <TextField
              select
              fullWidth
              label="Art"
              value={phoneType}
              onChange={(e) => setPhoneType(e.target.value as PhoneNumberType)}
              sx={{
                minWidth: 130,
              }}
            >
              <MenuItem value={PhoneNumberType.WHATSAPP}>WhatsApp</MenuItem>
              <MenuItem value={PhoneNumberType.MOBILE}>Mobil</MenuItem>
              <MenuItem value={PhoneNumberType.PRIVATE}>Privat</MenuItem>
              <MenuItem value={PhoneNumberType.WORK}>Arbeit</MenuItem>
              <MenuItem value={PhoneNumberType.HOME}>Festnetz</MenuItem>
              <MenuItem value={PhoneNumberType.OTHER}>Andere</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="Telefonnummer"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Stack>

          {/* Email */}
          <TextField
            fullWidth
            label="E-Mail (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PlusOnes */}
          <PlusOneEditor
            invitation={invitation}
            plusOnes={plusOnes}
            refetchPlusOnes={refetchPlusOnes}
          />

          {/* Submit */}
          <Stack spacing={2} mt={2}>
            <Button
              variant="contained"
              disabled={!canSubmit}
              onClick={handleSubmit}
              sx={{
                py: 1.6,
                borderRadius: "14px",
                fontSize: "1.05rem",
                fontWeight: 600,
              }}
            >
              Teilnahme bestätigen
            </Button>

            <Button
              variant="text"
              onClick={onBack}
              sx={{
                py: 1.2,
                borderRadius: "14px",
                opacity: 0.7,
              }}
            >
              Zurück
            </Button>
          </Stack>
        </Stack>
      </Box>
    </motion.div>
  );
}
