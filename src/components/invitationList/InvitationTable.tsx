"use client";

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
import React, { useMemo, useState } from "react";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { AnimatePresence, motion } from "framer-motion";

import { InvitationLogicProp } from "@/app/checkpoint/event/[id]/invitation/page";
import { Invitation } from "@/types/invitation/invitation.type";
import InvitationStatusChip from "./InvitationStatusChip";

/* ---------------------------------------------------------------------------
 * Desktop Table view for Invitations
 * - Expand button is isolated from row click
 * - VisionOS-style spring accordion
 * - Bulk select cascades to plus-ones
 * ------------------------------------------------------------------------- */
export default function InvitationTable({ logic }: InvitationLogicProp) {
  const { invitations, selected, toggleSelect } = logic;
  const theme = useTheme();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  /** Parent invitations */
  const parents = useMemo(
    () => invitations.filter((i) => !i.invitedByInvitationId),
    [invitations],
  );

  /** Plus-ones grouped by parent */
  const plusOnesByParent = useMemo(() => {
    return invitations.reduce<Record<string, Invitation[]>>((acc, inv) => {
      if (inv.invitedByInvitationId) {
        acc[inv.invitedByInvitationId] ??= [];
        acc[inv.invitedByInvitationId].push(inv);
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
  const toggleParentWithChildren = (parent: Invitation) => {
    const children = plusOnesByParent[parent.id] ?? [];
    const ids = [parent.id, ...children.map((c) => c.id)];

    const allSelected = ids.every((id) => selected.includes(id));

    ids.forEach((id) => {
      if (allSelected && selected.includes(id)) toggleSelect(id);
      if (!allSelected && !selected.includes(id)) toggleSelect(id);
    });
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
          <TableCell>Name</TableCell>
          <TableCell>Telefonnummern</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Link</TableCell>
          <TableCell align="right">Aktionen</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {parents.map((parent) => {
          const children = plusOnesByParent[parent.id] ?? [];
          const isExpanded = expanded[parent.id];

          return (
            <React.Fragment key={parent.id}>
              {/* PARENT ROW */}
              <TableRow
                hover
                onClick={() => logic.openInvitation(parent)}
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
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={
                      selected.includes(parent.id) &&
                      children.every((c) => selected.includes(c.id))
                    }
                    indeterminate={
                      selected.includes(parent.id) &&
                      children.some((c) => !selected.includes(c.id))
                    }
                    onChange={() => toggleParentWithChildren(parent)}
                  />
                </TableCell>

                {/* NAME + EXPAND */}
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {children.length > 0 && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(parent.id);
                        }}
                        sx={{
                          transform: isExpanded
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform .25s ease",
                        }}
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    )}

                    <Typography fontWeight={600}>
                      {parent.firstName} {parent.lastName}
                    </Typography>
                  </Stack>
                </TableCell>

                <TableCell>{parent.phoneNumber}</TableCell>

                <TableCell>
                  <InvitationStatusChip
                    status={parent.status}
                    rsvp={parent.rsvpChoice}
                  />
                </TableCell>

                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      sx={{
                        maxWidth: 160,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      /rsvp/{parent.id}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${window.location.origin}/checkpoint/rsvp/${parent.id}`,
                        )
                      }
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>

                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <IconButton
                    color="error"
                    onClick={() =>
                      logic
                        .deleteInvitation({ variables: { id: parent.id } })
                        .then(() => logic.refetch())
                    }
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </TableCell>
              </TableRow>

              {/* PLUS-ONES TREE */}
              <AnimatePresence initial={false}>
                {isExpanded && children.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0 }}>
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
                          {children.map((po) => (
                            <Box
                              key={po.id}
                              onClick={() => logic.openInvitation(po)}
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
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <Stack direction="row" spacing={1}>
                                  <Checkbox
                                    checked={selected.includes(po.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={() => toggleSelect(po.id)}
                                  />
                                  <Typography fontWeight={500}>
                                    {po.firstName} {po.lastName}
                                  </Typography>
                                </Stack>

                                <InvitationStatusChip
                                  status={po.status}
                                  rsvp={po.rsvpChoice}
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
