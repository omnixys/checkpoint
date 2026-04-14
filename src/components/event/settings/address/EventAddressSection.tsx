"use client";

import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import AddressForm, { FormState } from "./AddressForm";
import AddressMapPreview from "./AddressMapPreview";
import { useEventAddress } from "@/checkpoint/components/event/settings/address/useEventAddress";
import AddressSummaryCard from "@/checkpoint/components/event/settings/address/AddressSummaryCard";

export default function EventAddressSection({ eventId }: { eventId: string }) {
  const theme = useTheme();

  const { createAddress, deleteAddress, resolveGeo, address, loading, refetch } =
    useEventAddress(eventId);

  const [form, setForm] = useState<FormState | null>(null);
  const [geo, setGeo] = useState<any>(null);

  if (loading) return null;

  /**
   * -------------------------------------------------------------
   * Handle form change
   * -------------------------------------------------------------
   */
  const handleFormChange = async (val: FormState) => {
    setForm(val);

    const text = `${val.formatted ?? ""}`;

    if (text.length < 5) return;

    const result = await resolveGeo(text);

    if (result) {
      setGeo(result);
    }
  };

  const handleDelete = async () => {
    await deleteAddress();
    await refetch(); // 🔥 wichtig → UI reset
  };

  /**
   * -------------------------------------------------------------
   * CREATE (FIXED)
   * -------------------------------------------------------------
   */
  const handleCreate = async () => {
    if (!form || !geo) return;

    await createAddress({
      eventId,

      cityId: geo.cityId,
      postalCodeId: geo.postalCodeId,
      stateId: geo.stateId,
      countryId: geo.countryId,
      streetId: geo.streetId,
      houseNumberId: geo.houseNumberId,

      additionalInfo: "",
    });

    await refetch(); // 🔥 CRITICAL
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
