import { useMutation } from "@apollo/client/react";
import {
  AddPlusOneDocument,
  type AddPlusOneMutation,
  type AddPlusOneMutationVariables,
  ApproveInvitationDocument,
  type ApproveInvitationMutation,
  type ApproveInvitationMutationVariables,
  BulkApproveInvitationsDocument,
  type BulkApproveInvitationsMutation,
  type BulkApproveInvitationsMutationVariables,
  CreateInvitationDocument,
  type CreateInvitationMutation,
  type CreateInvitationMutationVariables,
  ImportInvitationsDocument,
  type ImportInvitationsMutation,
  type ImportInvitationsMutationVariables,
  RemoveAllPlusOnesDocument,
  type RemoveAllPlusOnesMutation,
  type RemoveAllPlusOnesMutationVariables,
  RemoveInvitationDocument,
  type RemoveInvitationMutation,
  type RemoveInvitationMutationVariables,
  RemovePlusOneDocument,
  type RemovePlusOneMutation,
  type RemovePlusOneMutationVariables,
  SendBulkInvitationsDocument,
  type SendBulkInvitationsMutation,
  type SendBulkInvitationsMutationVariables,
  UpdatePlusOneDocument,
  type UpdatePlusOneMutation,
  type UpdatePlusOneMutationVariables,
} from "@/checkpoint/generated/graphql";

export default function useInvitationMutation() {
  /* -----------------------------------------------------------------------
   * PLUS ONE
   * --------------------------------------------------------------------- */

  const [createPlusOneMutation, addPlusOneMutationResult] = useMutation<
    AddPlusOneMutation,
    AddPlusOneMutationVariables
  >(AddPlusOneDocument);
  const addPlusOnePayload = addPlusOneMutationResult.data?.createPlusOnesInvitation;

  const [updatePlusOneMutation, updatePlusOneMutationResult] = useMutation<
    UpdatePlusOneMutation,
    UpdatePlusOneMutationVariables
  >(UpdatePlusOneDocument);
  const updatePlusOnePayload = updatePlusOneMutationResult.data?.updatePlusOnesInvitation;

  const [removePlusOneMutation, removePlusOneMutationResult] = useMutation<
    RemovePlusOneMutation,
    RemovePlusOneMutationVariables
  >(RemovePlusOneDocument);
  const removePlusOnePayload = removePlusOneMutationResult.data?.removePlusOneInvitation;

  const [removeAllPlusOneMutation, removeAllPlusOneMutationResult] = useMutation<
    RemoveAllPlusOnesMutation,
    RemoveAllPlusOnesMutationVariables
  >(RemoveAllPlusOnesDocument);
  const removeAllPlusOnePayload =
    removeAllPlusOneMutationResult.data?.removeAllPlusOnesByInvitationId;

  /* -----------------------------------------------------------------------
   * INVITEE
   * --------------------------------------------------------------------- */
  const [createInvitationMutation, _createInvitationMutationResult] = useMutation<
    CreateInvitationMutation,
    CreateInvitationMutationVariables
  >(CreateInvitationDocument);

  const [approveInvitationMutation, _approveInvitationMutationResult] = useMutation<
    ApproveInvitationMutation,
    ApproveInvitationMutationVariables
  >(ApproveInvitationDocument);

  const [deleteInvitationMutation, _deleteInvitationMutationResult] = useMutation<
    RemoveInvitationMutation,
    RemoveInvitationMutationVariables
  >(RemoveInvitationDocument);

  const [importInvitationsMutation, _importInvitationsMutationResult] = useMutation<
    ImportInvitationsMutation,
    ImportInvitationsMutationVariables
  >(ImportInvitationsDocument);

  const [sendBulkInvitationsMutation, _sendBulkInvitationsMutationMutationResult] = useMutation<
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
