"use client";

import { useCallback, useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useSnackbar } from "notistack";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { MyInvitationsQuery, MyInvitationsQueryVariables, MyInvitationsDocument, InvitationQuery, InvitationDocument, CreatePlusOnesInvitationMutation, CreatePlusOnesInvitationMutationVariables, CreatePlusOnesInvitationDocument, RemovePlusOneInvitationMutation, RemovePlusOneInvitationMutationVariables, RemovePlusOneInvitationDocument, RemoveAllPlusOnesByInvitationIdMutation, RemoveAllPlusOnesByInvitationIdMutationVariables, RemoveAllPlusOnesByInvitationIdDocument, UpdatePlusOnesInvitationMutation, UpdatePlusOnesInvitationMutationVariables, UpdatePlusOnesInvitationDocument, CreatePlusOneInput } from "@/checkpoint/generated/graphql";
import {  UpdatePlusOneInput } from "@/checkpoint/app/(protected)/my-plus-ones/types/plusOne.types";



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
  const { enqueueSnackbar } = useSnackbar();
  const t = useTypedTranslations("invitation");

    const { data:kp } = useQuery<
      MyInvitationsQuery,
      MyInvitationsQueryVariables
    >(MyInvitationsDocument, {
      fetchPolicy: "cache-and-network",
    });
  
  const invitationId = kp?.myInvitations[0]?.id
  
  const { data, loading, refetch } = useQuery<InvitationQuery, InvitationQueryVariables>(InvitationDocument,{
    variables: { invitationId: kp?.myInvitations[0]?.id ?? '' },
    skip: invitationId === undefined,
    fetchPolicy: "cache-and-network",
  });

  const [create] = useMutation<
    CreatePlusOnesInvitationMutation,
    CreatePlusOnesInvitationMutationVariables
    >(CreatePlusOnesInvitationDocument);
    const [update] = useMutation<
      UpdatePlusOnesInvitationMutation,
      UpdatePlusOnesInvitationMutationVariables
    >(UpdatePlusOnesInvitationDocument);
  const [remove] = useMutation<
    RemovePlusOneInvitationMutation,
    RemovePlusOneInvitationMutationVariables
  >(RemovePlusOneInvitationDocument);
  const [removeAll] = useMutation<
    RemoveAllPlusOnesByInvitationIdMutation,
    RemoveAllPlusOnesByInvitationIdMutationVariables
  >(RemoveAllPlusOnesByInvitationIdDocument);


  const plusOnes = useMemo(() => {
    const entries = data?.invitation?.plusOnes ?? [];

    return entries.map((entry) => ({
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
  }, [data]);

  const remaining = data?.invitation?.maxInvitees ?? 0;

  const createPlusOne = useCallback(
    async (input: CreatePlusOneInput) => {
      if (!invitationId || !data?.invitation?.eventId) {
        enqueueSnackbar(t("plusOnes.errorMissingInvitation"), {
          variant: "error",
        });
        return;
      }

      try {
        await create({
          variables: {
            input: {
              eventId: data.invitation.eventId,
              invitedByInvitationId: invitationId,
              firstName: input.firstName.trim(),
              lastName: input.lastName.trim(),
              email: input.email?.trim() || null,
              phoneNumbers: input.phoneNumbers,
            },
          },
        });

        enqueueSnackbar(t("plusOnes.created"), {
          variant: "success",
        });

        await refetch();
      } catch {
        enqueueSnackbar(t("plusOnes.errorCreate"), {
          variant: "error",
        });
      }
    },
    [create, data, enqueueSnackbar, invitationId, refetch, t],
  );

  const updatePlusOne = useCallback(
    async (input: UpdatePlusOneInput) => {
      try {
        await update({
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

        await refetch();
      } catch {
        enqueueSnackbar(t("plusOnes.errorUpdate"), {
          variant: "error",
        });
      }
    },
    [enqueueSnackbar, refetch, t, update],
  );

  const removePlusOne = useCallback(
    async (id: string) => {
      try {
        await remove({
          variables: {
            id,
          },
        });

        enqueueSnackbar(t("plusOnes.removed"), {
          variant: "success",
        });

        await refetch();
      } catch {
        enqueueSnackbar(t("plusOnes.errorRemove"), {
          variant: "error",
        });
      }
    },
    [enqueueSnackbar, refetch, remove, t],
  );

  const removeAllPlusOnes = useCallback(async () => {
    if (!invitationId) {
      enqueueSnackbar(t("plusOnes.errorMissingInvitation"), {
        variant: "error",
      });
      return;
    }

    try {
      await removeAll({
        variables: {
          id: invitationId,
        },
      });

      enqueueSnackbar(t("plusOnes.removedAll"), {
        variant: "success",
      });

      await refetch();
    } catch {
      enqueueSnackbar(t("plusOnes.errorRemoveAll"), {
        variant: "error",
      });
    }
  }, [enqueueSnackbar, invitationId, refetch, removeAll, t]);

  return {
    plusOnes,
    remaining,
    loading,
    hasRootInvitation: Boolean(invitationId),
    createPlusOne,
    updatePlusOne,
    removePlusOne,
    removeAllPlusOnes,
  };
};
