"use client";

import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";

import {
  CREATE_PLUS_ONES_INVITATION,
  REMOVE_PLUS_ONE_INVITATION,
} from "@/graphql/invitation/invitation.mutation";
import { useMutation } from "@apollo/client/react";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";

/**
 * PlusOneEditor
 * - Allows temporary creation of PlusOnes (Valkey)
 * - Each plusOne is stored as a temporary "invitation-like" entry
 * - After approval → system creates real invitations
 */
export default function PlusOneEditor({
  invitation,
  plusOnes,
  refetchPlusOnes,
}: {
  invitation: any;
  plusOnes: any[];
  refetchPlusOnes: () => Promise<any>;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // local fields for creating a new PlusOne
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [relationship, setRelationship] = useState("");

  const [createPlusOne, { loading: creating }] = useMutation(
    CREATE_PLUS_ONES_INVITATION
  );
  const [removePlusOne] = useMutation(REMOVE_PLUS_ONE_INVITATION);

  const canAdd =
    firstName.trim().length > 0 && lastName.trim().length > 0 && !creating;

  /**
   * Handle Add PlusOne (Valkey temporary container)
   */
  const handleAdd = async () => {
    if (!canAdd) return;

    await createPlusOne({
      variables: {
        input: {
          eventId: invitation.eventId,
          invitedByInvitationId: invitation.id,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          maxInvitees: 0,
        },
      },
    });

    setFirstName("");
    setLastName("");
    setRelationship("");

    await refetchPlusOnes();
  };

  /**
   * Handle Remove single PlusOne
   */
  const handleRemove = async (id: string) => {
    await removePlusOne({ variables: { id } });
    await refetchPlusOnes();
  };

  return (
    <Box
      sx={{
        mt: 3,
        p: isMobile ? 2 : 3,
        borderRadius: "20px",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        background: theme.palette.background.paper + "66",
        boxShadow: theme.shadows[2],
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight={600}>
          Weitere Personen hinzufügen
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Du kannst so viele PlusOnes eintragen, wie dir in deiner Einladung
          erlaubt sind.
        </Typography>

        {/* Input fields */}
        <Stack spacing={2}>
          <Stack direction={isMobile ? "column" : "row"} spacing={2}>
            <TextField
              fullWidth
              label="Vorname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Nachname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Stack>

          <TextField
            fullWidth
            label="Beziehung (optional)"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
          />

          <Button
            variant="outlined"
            disabled={!canAdd}
            onClick={handleAdd}
            sx={{
              borderRadius: "14px",
              py: 1.2,
            }}
          >
            + Person hinzufügen
          </Button>
        </Stack>

        {/* Existing plusOnes list */}
        {plusOnes.length > 0 && (
          <Stack spacing={2} mt={3}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ opacity: 0.85 }}
            >
              Hinzugefügte Personen
            </Typography>

            {plusOnes.map((p: any) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    backdropFilter: "blur(18px)",
                    WebkitBackdropFilter: "blur(18px)",
                    background: theme.palette.background.paper + "44",
                    boxShadow: theme.shadows[1],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Stack spacing={0.5}>
                    <Typography fontWeight={600}>
                      {p.firstName} {p.lastName}
                    </Typography>

                    {relationship && (
                      <Typography variant="body2" sx={{ opacity: 0.6 }}>
                        Beziehung: {relationship}
                      </Typography>
                    )}
                  </Stack>

                  <IconButton
                    onClick={() => handleRemove(p.id)}
                    sx={{ opacity: 0.6 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </motion.div>
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
