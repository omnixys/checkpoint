import {
  AddPlusOneDocument,
  AddPlusOneMutation,
  AddPlusOneMutationVariables,
  ApproveInvitationDocument,
  ApproveInvitationMutation,
  ApproveInvitationMutationVariables,
  BulkApproveInvitationsDocument,
  BulkApproveInvitationsMutation,
  BulkApproveInvitationsMutationVariables,
  CreateInvitationDocument,
  CreateInvitationMutation,
  CreateInvitationMutationVariables,
  ImportInvitationsDocument,
  ImportInvitationsMutation,
  ImportInvitationsMutationVariables,
  RemoveAllPlusOnesDocument,
  RemoveAllPlusOnesMutation,
  RemoveAllPlusOnesMutationVariables,
  RemoveInvitationDocument,
  RemoveInvitationMutation,
  RemoveInvitationMutationVariables,
  RemovePlusOneDocument,
  RemovePlusOneMutation,
  RemovePlusOneMutationVariables,
  SendBulkInvitationsDocument,
  SendBulkInvitationsMutation,
  SendBulkInvitationsMutationVariables,
  UpdatePlusOneDocument,
  UpdatePlusOneMutation,
  UpdatePlusOneMutationVariables,
} from "@/checkpoint/generated/graphql";
import { useMutation } from "@apollo/client/react";

interface Props {}

export default function useInvitationMutation() {
  /* -----------------------------------------------------------------------
   * PLUS ONE
   * --------------------------------------------------------------------- */

  const [createPlusOneMutation, addPlusOneMutationResult] = useMutation<
    AddPlusOneMutation,
    AddPlusOneMutationVariables
  >(AddPlusOneDocument);
  const addPlusOnePayload =
    addPlusOneMutationResult.data?.createPlusOnesInvitation;

  const [updatePlusOneMutation, updatePlusOneMutationResult] = useMutation<
    UpdatePlusOneMutation,
    UpdatePlusOneMutationVariables
  >(UpdatePlusOneDocument);
  const updatePlusOnePayload =
    updatePlusOneMutationResult.data?.updatePlusOnesInvitation;

  const [removePlusOneMutation, removePlusOneMutationResult] = useMutation<
    RemovePlusOneMutation,
    RemovePlusOneMutationVariables
  >(RemovePlusOneDocument);
  const removePlusOnePayload =
    removePlusOneMutationResult.data?.removePlusOneInvitation;

  const [removeAllPlusOneMutation, removeAllPlusOneMutationResult] = useMutation<
    RemoveAllPlusOnesMutation,
    RemoveAllPlusOnesMutationVariables
  >(RemoveAllPlusOnesDocument);
  const removeAllPlusOnePayload =
    removeAllPlusOneMutationResult.data?.removeAllPlusOnesByInvitationId;

  /* -----------------------------------------------------------------------
   * INVITEE
   * --------------------------------------------------------------------- */
  const [createInvitationMutation, createInvitationMutationResult] = useMutation<
    CreateInvitationMutation,
    CreateInvitationMutationVariables
  >(CreateInvitationDocument);

  const [approveInvitationMutation, approveInvitationMutationResult] = useMutation<
    ApproveInvitationMutation,
    ApproveInvitationMutationVariables
  >(ApproveInvitationDocument);

  const [deleteInvitationMutation, deleteInvitationMutationResult] = useMutation<
    RemoveInvitationMutation,
    RemoveInvitationMutationVariables
  >(RemoveInvitationDocument);

  const [importInvitationsMutation, importInvitationsMutationResult] = useMutation<
    ImportInvitationsMutation,
    ImportInvitationsMutationVariables
  >(ImportInvitationsDocument);

  const [
    sendBulkInvitationsMutation,
    sendBulkInvitationsMutationMutationResult,
  ] = useMutation<
    SendBulkInvitationsMutation,
    SendBulkInvitationsMutationVariables
  >(SendBulkInvitationsDocument);

  const [bulkApproveMutation, bulkApproveMutationMutationResult] = useMutation<
    BulkApproveInvitationsMutation,
    BulkApproveInvitationsMutationVariables
  >(BulkApproveInvitationsDocument);

  return {
    createPlusOneMutation,
    addPlusOnePayload,
    addPlusOneLoading: addPlusOneMutationResult.loading,
    addPlusOneError: addPlusOneMutationResult.error,

    updatePlusOneMutation,
    updatePlusOnePayload,
    updatePlusOneLoading: addPlusOneMutationResult.loading,
    updatePlusOneError: addPlusOneMutationResult.error,

    removePlusOneMutation,
    removePlusOnePayload,
    removePlusOneLoading: addPlusOneMutationResult.loading,
    removePlusOneError: addPlusOneMutationResult.error,

    removeAllPlusOneMutation,
    removeAllPlusOnePayload,
    removeAllPlusOneLoading: addPlusOneMutationResult.loading,
    removeAllPlusOneError: addPlusOneMutationResult.error,

    createInvitationMutation,
    approveInvitationMutation,
    deleteInvitationMutation,
    importInvitationsMutation,
    sendBulkInvitationsMutation,

    bulkApproveMutation,
    bulkApproveMutationLoading: bulkApproveMutationMutationResult.loading,
  };
}
