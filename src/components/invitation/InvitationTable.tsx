"use client";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import InvitationDeleteConfirmDialog from "@/checkpoint/components/invitation/dialogs/InvitationDeleteConfirmDialog";
import InvitationSelectionCheckbox from "@/checkpoint/components/invitation/InvitationSelectionCheckbox";
import InvitationStatusChip from "@/checkpoint/components/invitation/InvitationStatusChip";
import type { InvitationPayload } from "@/checkpoint/generated/graphql";
import type { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { env } from "@/checkpoint/lib/env";

/* ---------------------------------------------------------------------------
 * Local derived types
 * ------------------------------------------------------------------------- */
type InvitationRow = NonNullable<InvitationLogic["invitations"]>[number];
type RsvpType = "PRIVATE" | "PUBLIC";

/* ---------------------------------------------------------------------------
 * Desktop Table view for Invitations
 * - Expand button is isolated from row click
 * - VisionOS-style spring accordion
 * - Parent and plus-one selection remain independent
 * ------------------------------------------------------------------------- */
export default function InvitationTable({ logic }: { logic: InvitationLogic }) {
  const t = useTypedTranslations("invitation");
  const { invitations, selected, toggleSelect } = logic;
  const theme = useTheme();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  /** Parent invitations */
  const parents = useMemo(
    () => invitations.filter((invitation) => !invitation.invitedByInvitationId),
    [invitations],
  );

  /** Plus-ones grouped by parent */
  const plusOnesByParent = useMemo(
    () =>
      invitations.reduce<Record<string, InvitationRow[]>>((acc, invitation) => {
        const parentId = invitation.invitedByInvitationId;

        if (parentId) {
          const existingChildren = acc[parentId] ?? [];
          acc[parentId] = [...existingChildren, invitation];
        }

        return acc;
      }, {}),
    [invitations],
  );

  /** Toggle expand without opening dialog */
  const toggleExpand = (parentId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  };

  const handleCopyLink = async (invitationId: string) => {
    const origin = typeof window === "undefined" ? "" : window.location.origin;

    const url = `${origin}${env.CHECKPOINT_BASE_PATH}rsvp/${invitationId}`;
    await navigator.clipboard.writeText(url);
  };

  const handleDelete = async (invitationId: string) => {
    setDeleteConfirmId(invitationId);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    await logic.deleteInvitationMutation({
      variables: { id: deleteConfirmId },
    });
    setDeleteConfirmId(null);
    await logic.reload();
  };

  const deleteConfirmName = useMemo(() => {
    if (!deleteConfirmId) return "";
    const row = invitations.find((inv) => inv.id === deleteConfirmId);
    return row ? `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim() : "";
  }, [deleteConfirmId, invitations]);

  return (
    <Box sx={{ width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      <Table
        sx={{
          minWidth: 860,
          borderRadius: "20px",
          overflow: "hidden",
          backdropFilter: "blur(14px)",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell width={48} />
            <TableCell>{t("table.type")}</TableCell>
            <TableCell>{t("table.name")}</TableCell>
            <TableCell>{t("table.phone")}</TableCell>
            <TableCell>{t("table.email")}</TableCell>
            <TableCell>{t("table.status")}</TableCell>
            <TableCell>{t("table.link")}</TableCell>
            <TableCell align="right">{t("table.actions")}</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {parents.map((parent) => {
            const children = plusOnesByParent[parent.id] ?? [];
            const isExpanded = expanded[parent.id] ?? false;

            return (
              <React.Fragment key={parent.id}>
                {/* PARENT ROW */}
                <TableRow
                  hover={true}
                  onClick={() => logic.openInvitation(parent as InvitationPayload)}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: selected.includes(parent.id)
                      ? alpha(theme.palette.primary.main, 0.1)
                      : undefined,
                    transition: "transform .25s ease, box-shadow .25s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: theme.shadows[6],
                    },
                  }}
                >
                  {/* CHECKBOX */}
                  <TableCell onClick={(event) => event.stopPropagation()}>
                    <InvitationSelectionCheckbox
                      checked={selected.includes(parent.id)}
                      onChange={() => toggleSelect(parent.id)}
                      slotProps={{
                        input: {
                          "aria-label": `${parent.firstName} ${parent.lastName} auswählen`,
                        },
                      }}
                    />
                  </TableCell>

                  {/* Type */}
                  <TableCell>{t(`rsvpType.${parent.type as RsvpType}`)}</TableCell>

                  {/* NAME + EXPAND */}
                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        alignItems: "center",
                        minWidth: 0,
                      }}
                    >
                      {children.length > 0 && (
                        <IconButton
                          size="small"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleExpand(parent.id);
                          }}
                          sx={{
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform .25s ease",
                          }}
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      )}

                      <Typography
                        sx={{
                          fontWeight: 600,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {parent.firstName ?? "-"} {parent.lastName ?? ""}
                      </Typography>

                      {(parent.selectedInvitedBy?.length ?? 0) > 0 && (
                        <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
                          {parent.selectedInvitedBy.map((item) => (
                            <Chip
                              key={item}
                              label={item}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: 11 }}
                            />
                          ))}
                        </Stack>
                      )}
                    </Stack>
                  </TableCell>

                  {/* Phone */}
                  <TableCell>{parent.phoneNumber ?? "-"}</TableCell>

                  {/* Email */}
                  <TableCell>{parent.email ?? "-"}</TableCell>

                  {/* Status */}
                  <TableCell>
                    <InvitationStatusChip
                      status={parent.status}
                      rsvp={parent.rsvpChoice ?? undefined}
                    />
                  </TableCell>

                  {/* Link */}
                  <TableCell onClick={(event) => event.stopPropagation()}>
                    <Tooltip title={t("copyLink")}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          void handleCopyLink(parent.id);
                        }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="right" onClick={(event) => event.stopPropagation()}>
                    <Tooltip title={t("delete")}>
                      <IconButton
                        color="error"
                        onClick={() => {
                          void handleDelete(parent.id);
                        }}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>

                {/* PLUS-ONES TREE */}
                <AnimatePresence initial={false}>
                  {isExpanded && children.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ p: 0 }}>
                        <motion.div
                          initial={{ opacity: 0, height: 0, filter: "blur(6px)" }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                            filter: "blur(0px)",
                          }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 24,
                          }}
                        >
                          <Stack
                            spacing={1}
                            sx={{
                              pl: 8,
                              py: 1.5,
                              borderLeft: `2px solid ${theme.palette.divider}`,
                              background:
                                "linear-gradient(90deg, rgba(255,255,255,0.05), transparent)",
                            }}
                          >
                            {children.map((plusOne) => (
                              <Box
                                key={plusOne.id}
                                onClick={() => logic.openInvitation(plusOne as InvitationPayload)}
                                sx={{
                                  px: 2,
                                  py: 1.2,
                                  borderRadius: 2,
                                  cursor: "pointer",
                                  backdropFilter: "blur(8px)",
                                  background: theme.palette.action.hover,
                                  border: `1px solid ${
                                    selected.includes(plusOne.id)
                                      ? alpha(theme.palette.primary.main, 0.55)
                                      : "transparent"
                                  }`,
                                  ...(selected.includes(plusOne.id) && {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                  }),
                                  "&:hover": {
                                    background: theme.palette.action.selected,
                                  },
                                }}
                              >
                                <Stack
                                  direction="row"
                                  sx={{
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <Stack direction="row" spacing={1}>
                                    <InvitationSelectionCheckbox
                                      checked={selected.includes(plusOne.id)}
                                      onClick={(event) => event.stopPropagation()}
                                      onChange={() => toggleSelect(plusOne.id)}
                                      slotProps={{
                                        input: {
                                          "aria-label": `${plusOne.firstName} ${plusOne.lastName} auswählen`,
                                        },
                                      }}
                                    />

                                    <Typography
                                      sx={{
                                        fontWeight: 500,
                                        overflowWrap: "anywhere",
                                      }}
                                    >
                                      {plusOne.firstName ?? "-"} {plusOne.lastName ?? ""}
                                    </Typography>
                                  </Stack>

                                  <InvitationStatusChip
                                    status={plusOne.status}
                                    rsvp={plusOne.rsvpChoice ?? undefined}
                                  />
                                </Stack>
                              </Box>
                            ))}
                          </Stack>
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>

      <InvitationDeleteConfirmDialog
        open={deleteConfirmId !== null}
        name={deleteConfirmName}
        onCancel={() => setDeleteConfirmId(null)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}
