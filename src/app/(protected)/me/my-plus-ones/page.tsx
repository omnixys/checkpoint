"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import EventSeatRoundedIcon from "@mui/icons-material/EventSeatRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { usePlusOnes } from "@/checkpoint/app/(protected)/me/my-plus-ones/hooks/usePlusOnes";
import PlusOneCard from "@/checkpoint/app/(protected)/me/my-plus-ones/PlusOneCard";
import PlusOneDialog from "@/checkpoint/app/(protected)/me/my-plus-ones/PlusOneDialog";
import type {
  PlusOneItem,
  UpdatePlusOneInput,
} from "@/checkpoint/app/(protected)/me/my-plus-ones/types/plusOne.types";
import type { CreatePlusOneInput } from "@/checkpoint/generated/graphql";
import RouteGuard from "@/checkpoint/components/guard/RouteGuard";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

const MotionBox = motion.create(Box);

export default function MyPlusOnesPage() {
  const t = useTypedTranslations("invitation");
  const theme = useTheme();

  const {
    plusOnes,
    remaining,
    loading,
    hasRootInvitation,
    createPlusOne,
    updatePlusOne,
    removePlusOne,
    removeAllPlusOnes,
  } = usePlusOnes();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlusOne, setEditingPlusOne] = useState<PlusOneItem | null>(null);

  const usedSlots = plusOnes?.length;

  const seatsAssigned = useMemo(
    () => plusOnes?.filter((entry) => entry.seat?.label).length,
    [plusOnes],
  );

  const openCreateDialog = (): void => {
    setEditingPlusOne(null);
    setDialogOpen(true);
  };

  const openEditDialog = (plusOne: PlusOneItem): void => {
    setEditingPlusOne(plusOne);
    setDialogOpen(true);
  };

  const closeDialog = (): void => {
    setDialogOpen(false);
    setEditingPlusOne(null);
  };

  const handleCreate = async (input: CreatePlusOneInput): Promise<void> => {
    await createPlusOne(input);
  };

  const handleUpdate = async (input: UpdatePlusOneInput): Promise<void> => {
    await updatePlusOne(input);
  };

  return (
    <RouteGuard featureId="my-plus-ones">
    <MotionBox
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26 }}
      sx={{
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 3 },
        pb: { xs: 12, sm: 4 },
        minWidth: 0,
      }}
    >
      <Stack spacing={3}>
        <MotionBox
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.26, delay: 0.03 }}
          sx={{
            borderRadius: 5,
            p: { xs: 2, sm: 3 },
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, rgba(106,75,188,0.22) 0%, rgba(28,28,30,0.9) 100%)"
                : "linear-gradient(135deg, rgba(106,75,188,0.10) 0%, rgba(255,255,255,0.96) 100%)",
            border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 24px 60px rgba(0,0,0,0.32)"
                : "0 24px 60px rgba(0,0,0,0.08)",
          }}
        >
          <Stack spacing={1.25}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                overflowWrap: "anywhere",
              }}
            >
              {t("plusOnes.title")}
            </Typography>

            <Typography variant="body1" color="text.secondary">
              {t("plusOnes.subtitle")}
            </Typography>
          </Stack>
        </MotionBox>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <MotionBox
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.22 }}
            whileHover={{ y: -3 }}
            sx={{
              flex: 1,
              borderRadius: 4,
              p: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.75)}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.78),
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                alignItems: "center",
              }}
            >
              <GroupRoundedIcon color="primary" />
              <Stack spacing={0.3}>
                <Typography variant="body2" color="text.secondary">
                  {t("plusOnes.stats.used")}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  {usedSlots}
                </Typography>
              </Stack>
            </Stack>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.22 }}
            whileHover={{ y: -3 }}
            sx={{
              flex: 1,
              borderRadius: 4,
              p: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.75)}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.78),
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                alignItems: "center",
              }}
            >
              <EventSeatRoundedIcon color="primary" />
              <Stack spacing={0.3}>
                <Typography variant="body2" color="text.secondary">
                  {t("plusOnes.stats.remaining")}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  {remaining}
                </Typography>
              </Stack>
            </Stack>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.22 }}
            whileHover={{ y: -3 }}
            sx={{
              flex: 1,
              borderRadius: 4,
              p: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.75)}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.78),
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                alignItems: "center",
              }}
            >
              <EventSeatRoundedIcon color="primary" />
              <Stack spacing={0.3}>
                <Typography variant="body2" color="text.secondary">
                  {t("plusOnes.stats.seatsAssigned")}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  {seatsAssigned}
                </Typography>
              </Stack>
            </Stack>
          </MotionBox>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <Typography variant="body1" color="text.secondary">
            {t("plusOnes.remaining", { count: remaining })}
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <MotionBox whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={openCreateDialog}
                disabled={!hasRootInvitation || remaining <= 0}
                fullWidth={true}
              >
                {t("plusOnes.add")}
              </Button>
            </MotionBox>

            <MotionBox whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outlined"
                startIcon={<DeleteSweepRoundedIcon />}
                onClick={() => void removeAllPlusOnes()}
                disabled={!hasRootInvitation || plusOnes?.length === 0}
                fullWidth={true}
              >
                {t("plusOnes.removeAll")}
              </Button>
            </MotionBox>
          </Stack>
        </Stack>

        <Divider />

        {loading ? (
          <Stack
            spacing={1.5}
            sx={{
              minHeight: 240,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
            <Typography color="text.secondary">{t("plusOnes.loading")}</Typography>
          </Stack>
        ) : hasRootInvitation ? (
          plusOnes?.length === 0 ? (
            <MotionBox
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              sx={{
                borderRadius: 4,
                p: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                backgroundColor: alpha(theme.palette.background.paper, 0.75),
              }}
            >
              <Stack spacing={1.2}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {t("plusOnes.emptyTitle")}
                </Typography>
                <Typography color="text.secondary">{t("plusOnes.emptyDescription")}</Typography>
              </Stack>
            </MotionBox>
          ) : (
            <Stack spacing={1.5}>
              <AnimatePresence mode="popLayout">
                {plusOnes?.map((plusOne, index) => (
                  <PlusOneCard
                    key={plusOne.id}
                    plusOne={plusOne}
                    index={index}
                    onEdit={openEditDialog}
                    onDelete={removePlusOne}
                  />
                ))}
              </AnimatePresence>
            </Stack>
          )
        ) : (
          <Box
            sx={{
              borderRadius: 4,
              p: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.75),
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              {t("plusOnes.noInvitationTitle")}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {t("plusOnes.noInvitationDescription")}
            </Typography>
          </Box>
        )}
      </Stack>

      <PlusOneDialog
        open={dialogOpen}
        mode={editingPlusOne ? "edit" : "create"}
        initialValue={editingPlusOne}
        onClose={closeDialog}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </MotionBox>
    </RouteGuard>
  );
}
