"use client";

import { RENAME_SECTION } from "@/components/../graphql/seat/seat-mutation.graphql";
import {
  RenameSectionRequest,
  RenameSectionResult,
} from "@/components/../types/seat/seat-mutation-graphql.type";
import { Seat } from "@/components/../types/seat/seat.type";
import { useMutation } from "@apollo/client/react";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  sectionName: string;
  seats: Seat[];
  onClose: () => void;
  refetch: () => void;
};

// TODO conflict handling im frontend

export default function SectionInfoDialog({
  open,
  sectionName,
  seats,
  onClose,
  refetch,
}: Props) {
  const [name, setName] = useState(sectionName);

  const [renameSection, { data }] = useMutation<
    RenameSectionResult,
    RenameSectionRequest
  >(RENAME_SECTION);

  const occupied = seats.filter((s) => s.guestId || s.invitationId).length;
  const free = seats.length - occupied;

  const sectionId = seats[0].section.id;

  useEffect(() => {
    if (data?.renameSection.success === true) {
      (async () => {
        await refetch();
        onClose();
      })();
    }
  }, [data, refetch, onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Section</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <Stack direction="row" spacing={1}>
            <Chip label={`Frei: ${free}`} />
            <Chip color="error" label={`Belegt: ${occupied}`} />
          </Stack>

          <Typography variant="caption" color="text.secondary">
            Insgesamt {seats.length} Sitzplätze
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button
          variant="contained"
          onClick={async () => {
            renameSection({
              variables: {
                input: {
                  sectionId,
                  newName: name,
                },
              },
            });
          }}
        >
          Umbenennen
        </Button>
      </DialogActions>
    </Dialog>
  );
}
