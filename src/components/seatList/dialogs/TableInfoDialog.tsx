"use client";

import { RENAME_TABLE } from "@/components/../graphql/seat/seat-mutation.graphql";
import {
  RenameTableRequest,
  RenameTableResult,
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
  tableName: string;
  seats: Seat[];
  onClose: () => void;
  refetch: () => void;
};

// TODO conflict handling im frontend
export default function TableInfoDialog({
  open,
  tableName,
  seats,
  onClose,
  refetch,
}: Props) {
  const [name, setName] = useState(tableName);

  const [renameTable, { data }] = useMutation<
    RenameTableResult,
    RenameTableRequest
  >(RENAME_TABLE);

  const occupied = seats.filter((s) => s.guestId || s.invitationId).length;
  const free = seats.length - occupied;

  const tableId = seats[0].table.id;

  useEffect(() => {
    if (data?.renameTable.success === true) {
      (async () => {
        await refetch();
        onClose();
      })();
    }
  }, [data, refetch, onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Tisch</DialogTitle>

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
          onClick={() => {
            renameTable({
              variables: {
                input: {
                  tableId,
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
