"use client";

import { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import InvitationStatusChip from "@/checkpoint/components/invitation/InvitationStatusChip";
import { env } from "@/checkpoint/lib/env";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  Box,
  Checkbox,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { InvitationPayload } from "@/checkpoint/generated/graphql";

/* ---------------------------------------------------------------------------
 * Local derived types
 * ------------------------------------------------------------------------- */
type InvitationRow = NonNullable<InvitationLogic["invitations"]>[number];

/* ---------------------------------------------------------------------------
 * Desktop Table view for Invitations
 * - Expand button is isolated from row click
 * - VisionOS-style spring accordion
 * - Bulk select cascades to plus-ones
 * ------------------------------------------------------------------------- */
export default function InvitationTable({ logic }: { logic: InvitationLogic }) {
  const { invitations, selected, toggleSelect } = logic;
  const theme = useTheme();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  /** Parent invitations */
  const parents = useMemo(() => {
    return invitations.filter((invitation) => !invitation.invitedByInvitationId);
  }, [invitations]);

  /** Plus-ones grouped by parent */
  const plusOnesByParent = useMemo(() => {
    return invitations.reduce<Record<string, InvitationRow[]>>((acc, invitation) => {
      const parentId = invitation.invitedByInvitationId;

      if (parentId) {
        const existingChildren = acc[parentId] ?? [];
        acc[parentId] = [...existingChildren, invitation];
      }

      return acc;
    }, {});
  }, [invitations]);

  /** Toggle expand without opening dialog */
  const toggleExpand = (parentId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  };

  /** Bulk select parent + children */
  const toggleParentWithChildren = (parent: InvitationRow) => {
    const children = plusOnesByParent[parent.id] ?? [];
    const ids = [parent.id, ...children.map((child) => child.id)];

    const allSelected = ids.every((id) => selected.includes(id));

    ids.forEach((id) => {
      if (allSelected && selected.includes(id)) {
        toggleSelect(id);
      }

      if (!allSelected && !selected.includes(id)) {
        toggleSelect(id);
      }
    });
  };

  const handleCopyLink = async (invitationId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const url = `${origin}${env.CHECKPOINT_BASE_PATH}rsvp/${invitationId}`;
    await navigator.clipboard.writeText(url);
  };

  const handleDelete = async (invitationId: string) => {
    await logic.deleteInvitation({
      variables: { id: invitationId },
    });

    await logic.refetch();
  };

  return (
    <Table
      sx={{
        borderRadius: "20px",
        overflow: "hidden",
        backdropFilter: "blur(14px)",
      }}
    >
      <TableHead>
        <TableRow>
          <TableCell width={48} />
          <TableCell>Type</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Telefonnummern</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Link</TableCell>
          <TableCell align="right">Aktionen</TableCell>
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
                hover
                onClick={() => logic.openInvitation(parent as InvitationPayload)}
                sx={{
                  cursor: "pointer",
                  transition: "transform .25s ease, box-shadow .25s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows[6],
                  },
                }}
              >
                {/* CHECKBOX */}
                <TableCell onClick={(event) => event.stopPropagation()}>
                  <Checkbox
                    checked={
                      selected.includes(parent.id) &&
                      children.every((child) => selected.includes(child.id))
                    }
                    indeterminate={
                      selected.includes(parent.id) &&
                      children.some((child) => !selected.includes(child.id))
                    }
                    onChange={() => toggleParentWithChildren(parent)}
                  />
                </TableCell>

                {/* Type */}
                <TableCell>{parent.type}</TableCell>

                {/* NAME + EXPAND */}
                <TableCell>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: "center",
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
                      }}
                    >
                      {parent.firstName ?? "-"} {parent.lastName ?? ""}
                    </Typography>
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
                  <IconButton
                    size="small"
                    onClick={() => {
                      void handleCopyLink(parent.id);
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </TableCell>

                {/* Actions */}
                <TableCell align="right" onClick={(event) => event.stopPropagation()}>
                  <IconButton
                    color="error"
                    onClick={() => {
                      void handleDelete(parent.id);
                    }}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
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
                                  <Checkbox
                                    checked={selected.includes(plusOne.id)}
                                    onClick={(event) => event.stopPropagation()}
                                    onChange={() => toggleSelect(plusOne.id)}
                                  />

                                  <Typography
                                    sx={{
                                      fontWeight: 500,
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
  );
}
