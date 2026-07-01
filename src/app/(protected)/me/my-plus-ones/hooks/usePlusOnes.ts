"use client";

import { UpdatePlusOneInput } from "@/checkpoint/app/(protected)/me/my-plus-ones/types/plusOne.types";
import { CreatePlusOneInput } from "@/checkpoint/generated/graphql";
import useInvitationMutation from "@/checkpoint/hooks/invitation/useInvitationMutation";
import useInvitationQuery from "@/checkpoint/hooks/invitation/useInvitationQuery";
import useMyInvitationQuery from "@/checkpoint/hooks/invitation/useMyInvitationQuery";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useSnackbar } from "notistack";
import { useCallback, useMemo } from "react";
import { RemoveAllPlusOnesMutation } from "../../../../../generated/graphql";

type InvitationQueryVariables = {
  invitationId: string;
};

type UsePlusOnesResult = {
  plusOnes: any;
  remaining: number;
  loading: boolean;
  hasRootInvitation: boolean;
  createPlusOne: (input: CreatePlusOneInput) => Promise<void>;
  updatePlusOne: (input: UpdatePlusOneInput) => Promise<void>;
  removePlusOne: (id: string) => Promise<void>;
  removeAllPlusOnes: () => Promise<void>;
};

export const usePlusOnes = (): UsePlusOnesResult => {
  const { activeEvent } = useActiveEvent();
  const eventId = activeEvent?.id;
  const { enqueueSnackbar } = useSnackbar();
  const t = useTypedTranslations("invitation");

  const { myInvitationIdMap } = useMyInvitationQuery({
    loadMyInvitationIdList: true,
  });
  const getInvitationId = (eventId: string) => {
    return myInvitationIdMap.get(eventId)?.id ?? null;
  };
  const invitationId = eventId ? getInvitationId(eventId) : null;
  const eventEndsAt = activeEvent?.settings?.endsAt ?? null;

  const { plusOneInvitationList, plusOneInvitationListLoading } = useInvitationQuery({
    invitationId: invitationId ?? undefined,
    loadPlusOneInvitationList: true,
  });

  const {
    createPlusOneMutation,
    updatePlusOneMutation,
    removePlusOneMutation,
    removeAllPlusOneMutation,
  } = useInvitationMutation();

  const plusOnes = useMemo(() => {
    return plusOneInvitationList?.plusOnes.map((entry) => ({
      id: entry.id,
      firstName: entry.firstName ?? "",
      lastName: entry.lastName ?? "",
      email: entry.email ?? null,
      status: entry.status ?? null,
      phoneNumbers:
        entry.phoneNumbers?.map((phone) => ({
          countryCode: phone.countryCode,
          number: phone.number,
          type: phone.type,
          label: phone.label ?? undefined,
          isPrimary: phone.isPrimary,
        })) ?? [],
      // seat: entry..seat
      //   ? {
      //       id: entry.seat.id,
      //       label: entry.seat.label ?? null,
      //     }
      //   : null,
    }));
  }, [plusOneInvitationList]);

  const remaining = plusOneInvitationList?.maxInvitees ?? 0;

  const createPlusOne = useCallback(
    async (input: CreatePlusOneInput) => {
      if (!invitationId || !eventId || !eventEndsAt) {
        enqueueSnackbar(t("plusOnes.errorMissingInvitation"), {
          variant: "error",
        });
        return;
      }

      try {
        await createPlusOneMutation({
          variables: {
            input: {
              eventId,
              invitedByInvitationId: invitationId,
              firstName: input.firstName.trim(),
              lastName: input.lastName.trim(),
              email: input.email?.trim() || null,
              phoneNumbers: input.phoneNumbers,
            },
            eventEndsAt,
          },
        });

        enqueueSnackbar(t("plusOnes.created"), {
          variant: "success",
        });
      } catch {
        enqueueSnackbar(t("plusOnes.errorCreate"), {
          variant: "error",
        });
      }
    },
    [createPlusOneMutation, enqueueSnackbar, eventEndsAt, eventId, invitationId, t],
  );

  const updatePlusOne = useCallback(
    async (input: UpdatePlusOneInput) => {
      try {
        await updatePlusOneMutation({
          variables: {
            input: {
              id: input.id,
              firstName: input.firstName.trim(),
              lastName: input.lastName.trim(),
              email: input.email?.trim() || null,
              phoneNumbers: input.phoneNumbers,
            },
          },
        });

        enqueueSnackbar(t("plusOnes.updated"), {
          variant: "success",
        });
      } catch {
        enqueueSnackbar(t("plusOnes.errorUpdate"), {
          variant: "error",
        });
      }
    },
    [enqueueSnackbar, t, updatePlusOneMutation],
  );

  const removePlusOne = useCallback(
    async (id: string) => {
      try {
        const kp = await removePlusOneMutation({
          variables: {
            id,
          },
        });

        enqueueSnackbar(t("plusOnes.removed"), {
          variant: "success",
        });
      } catch {
        enqueueSnackbar(t("plusOnes.errorRemove"), {
          variant: "error",
        });
      }
    },
    [enqueueSnackbar, removePlusOneMutation, t],
  );

  const removeAllPlusOnes = useCallback(async () => {
    if (!invitationId) {
      enqueueSnackbar(t("plusOnes.errorMissingInvitation"), {
        variant: "error",
      });
      return;
    }

    try {
      await removeAllPlusOneMutation({
        variables: {
          id: invitationId,
        },
      });

      enqueueSnackbar(t("plusOnes.removedAll"), {
        variant: "success",
      });
    } catch {
      enqueueSnackbar(t("plusOnes.errorRemoveAll"), {
        variant: "error",
      });
    }
  }, [enqueueSnackbar, invitationId, removeAllPlusOneMutation, t]);

  return {
    plusOnes,
    remaining,
    loading: plusOneInvitationListLoading,
    hasRootInvitation: Boolean(invitationId),

    createPlusOne,
    updatePlusOne,
    removePlusOne,
    removeAllPlusOnes,
  };
};
