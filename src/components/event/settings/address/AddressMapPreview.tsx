"use client";

import { Box } from "@mui/material";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

/**
 * -------------------------------------------------------------
 * Address Map Preview
 * -------------------------------------------------------------
 * - Displays selected geo location
 * - Lightweight and mobile-first
 */
export default function AddressMapPreview({ lat, lon }: { lat: number; lon: number }) {
  if (!lat || !lon) return null;

  return (
    <Box
      sx={{
        height: 220,
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={[lat, lon]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]} />
      </MapContainer>
    </Box>
  );
}
