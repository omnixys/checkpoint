"use client";

import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import AddressSummaryCard from "@/checkpoint/components/event/settings/address/AddressSummaryCard";
import { useEventAddressMutation } from "@/checkpoint/hooks/address/useAddressMutation";
import { useEventAddressQuery } from "@/checkpoint/hooks/address/useAddressQuery";
import AddressForm, { type FormState } from "./AddressForm";

export default function EventAddressSection({ eventId }: { eventId: string }) {
  const _theme = useTheme();

  const { resolveGeo, address, loading, refetch } = useEventAddressQuery(eventId);

  const { createAddressMutation, deleteAddressMutation } = useEventAddressMutation();

  const [form, setForm] = useState<FormState | null>(null);
  const [geo, setGeo] = useState<any>(null);

  if (loading) {
    return null;
  }

  /**
   * -------------------------------------------------------------
   * Handle form change
   * -------------------------------------------------------------
   */
  const handleFormChange = async (val: FormState) => {
    setForm(val);

    const text = `${val.formatted ?? ""}`;

    if (text.length < 5) {
      return;
    }

    const result = await resolveGeo(text);

    if (result) {
      setGeo(result);
    }
  };

  const handleDelete = async () => {
    await deleteAddressMutation({
      variables: { eventId },
    });
    await refetch();
  };

  /**
   * -------------------------------------------------------------
   * CREATE (FIXED)
   * -------------------------------------------------------------
   */
  const handleCreate = async () => {
    if (!form || !geo) {
      return;
    }

    const _createPayload = await createAddressMutation({
      variables: {
        input: {
          eventId,

          cityId: geo.cityId,
          postalCodeId: geo.postalCodeId,
          stateId: geo.stateId,
          countryId: geo.countryId,
          streetId: geo.streetId,
          houseNumberId: geo.houseNumberId,

          additionalInfo: "",
        },
      },
    });
  };

  return (
    <Box>
      <Stack spacing={3}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
          }}
        >
          Event Address
        </Typography>

        {address ? (
          <>
            {/* 🔥 SUMMARY VIEW */}
            <AddressSummaryCard
              address={{
                street: address.street ?? undefined,
                houseNumber: address.houseNumber ?? undefined,
                city: address.city ?? undefined,
                postalCode: address.postalCode ?? undefined,
                state: address.state ?? undefined,
                country: address.country ?? undefined,
              }}
            />

            {/* OPTIONAL: EDIT BUTTON */}
            {/* <Button
              variant="outlined"
              onClick={() => {
                // später edit mode
              }}
            >
              Change Address
            </Button> */}
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Delete Address
            </Button>
          </>
        ) : (
          <>
            {/* 🔥 CREATE FLOW */}
            <AddressForm onChange={handleFormChange} />

            {/* {geo?.lat && geo?.lon && (
              <AddressMapPreview lat={geo.lat} lon={geo.lon} />
            )} */}

            <Button variant="contained" onClick={handleCreate}>
              Save Address
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
}
