"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useMutationHandler } from "@/checkpoint/hooks/core/useMutationHandler";
import type { QuickReply } from "@/checkpoint/hooks/support/useQuickReplies";
import { useQuickReplies } from "@/checkpoint/hooks/support/useQuickReplies";

interface QuickReplyManagerProps {
  open: boolean;
  onClose: () => void;
}

export default function QuickReplyManager({ open, onClose }: QuickReplyManagerProps) {
  const theme = useTheme();
  const { quickReplies, loading, create, update, remove } = useQuickReplies();
  const createHandler = useMutationHandler();
  const deleteHandler = useMutationHandler();

  const [editId, setEditId] = useState<string | null>(null);
  const [key, setKey] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState("");

  const resetForm = () => {
    setEditId(null);
    setKey("");
    setBody("");
    setChannel("");
  };

  const startEdit = (reply: QuickReply) => {
    setEditId(reply.id);
    setKey(reply.key);
    setBody(reply.body);
    setChannel(reply.channel ?? "");
  };

  const handleSave = () => {
    createHandler.execute(async () => {
      if (editId) {
        await update(editId, {
          key,
          body,
          channel: channel || null,
        });
      } else {
        await create({
          key,
          body,
          channel: channel || null,
        });
      }
      resetForm();
    });
  };

  const handleDelete = (id: string) => {
    deleteHandler.execute(async () => {
      await remove(id);
    });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Quick Replies</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
              <TextField
                label="Key"
                placeholder="/greeting"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                size="small"
                sx={{ minWidth: 160 }}
              />
              <TextField
                label="Channel"
                placeholder="WHATSAPP, WEBCHAT, ..."
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                size="small"
                sx={{ minWidth: 160 }}
              />
              <TextField
                label="Body"
                placeholder="Reply text..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                size="small"
                multiline
                maxRows={3}
                sx={{ flex: 1 }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleSave}
                disabled={createHandler.loading || !key || !body}
              >
                {editId ? "Update" : "Add"}
              </Button>
            </Stack>

            {loading && (
              <Typography sx={{ color: "text.disabled", textAlign: "center" }}>
                Loading...
              </Typography>
            )}

            {!loading && (!quickReplies || quickReplies.length === 0) && (
              <Typography sx={{ color: "text.disabled", textAlign: "center", fontSize: "0.8rem" }}>
                No quick replies yet. Create one above.
              </Typography>
            )}

            <List dense>
              <AnimatePresence>
                {quickReplies?.map((reply) => (
                  <motion.div
                    key={reply.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ListItem
                      secondaryAction={
                        <Stack direction="row" spacing={0.5}>
                          <IconButton size="small" onClick={() => startEdit(reply)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(reply.id)}
                            disabled={deleteHandler.loading}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      }
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      }}
                    >
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                            <Typography sx={{ fontWeight: 600, fontSize: "0.8rem", fontFamily: "monospace" }}>
                              {reply.key}
                            </Typography>
                            {reply.channel && (
                              <Chip label={reply.channel} size="small" variant="outlined" />
                            )}
                          </Stack>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: 500,
                            }}
                          >
                            {reply.body}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </motion.div>
                ))}
              </AnimatePresence>
            </List>
          </Stack>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={createHandler.success}
        autoHideDuration={3000}
        onClose={createHandler.reset}
      >
        <Alert severity="success" onClose={createHandler.reset}>
          Quick reply saved
        </Alert>
      </Snackbar>

      <Snackbar
        open={deleteHandler.success}
        autoHideDuration={3000}
        onClose={deleteHandler.reset}
      >
        <Alert severity="info" onClose={deleteHandler.reset}>
          Quick reply deleted
        </Alert>
      </Snackbar>
    </>
  );
}
