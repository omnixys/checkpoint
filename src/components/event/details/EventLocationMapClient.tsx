"use client";

import { alpha, Box, ToggleButton, ToggleButtonGroup, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import MapIcon from "@mui/icons-material/Map";
import SatelliteIcon from "@mui/icons-material/SatelliteAlt";
import { useEventAddressQuery } from "@/checkpoint/hooks/address/useAddressQuery";
import { useMapMarker } from "@/checkpoint/hooks/theme/useMapMarker";

/* --------------------------------------------------------
 * Map Styles
 * ------------------------------------------------------ */
type MapStyle = "standard" | "dark" | "satellite";

const MAP_STYLES: Record<MapStyle, string> = {
  standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  satellite:
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
};

/* --------------------------------------------------------
 * Fly Animation
 * ------------------------------------------------------ */
function FlyToLocation({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lon], 15, { duration: 1.2 });
  }, [lat, lon, map]);

  return null;
}

/* --------------------------------------------------------
 * MAIN COMPONENT
 * ------------------------------------------------------ */
export default function EventLocationMapClient({ eventId }: { eventId: string }) {
  const theme = useTheme();
  const markerIcon = useMapMarker();

  const { address, loading } = useEventAddressQuery(eventId);

  const [style, setStyle] = useState<MapStyle>("satellite");

  useEffect(() => {
    if (theme.palette.mode === "dark") {
      setStyle("dark");
    }
  }, [theme.palette.mode]);

  if (loading || !address) {
    return null;
  }

  const lat = address.lat;
  const lon = address.lon;

  if (!lat || !lon) {
    return null;
  }

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      sx={{
        position: "relative",
        borderRadius: "24px",
        overflow: "hidden",
        height: 300,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
        boxShadow: `
          0 20px 60px ${alpha("#000", 0.6)},
          inset 0 0 20px ${alpha(theme.palette.primary.main, 0.1)}
        `,
      }}
    >
      {/* STYLE SWITCH */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 1000,
          backdropFilter: "blur(12px)",
          borderRadius: "12px",
          overflow: "hidden",
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        <ToggleButtonGroup
          value={style}
          exclusive={true}
          onChange={(_, v: MapStyle | null) => v && setStyle(v)}
          size="small"
        >
          <ToggleButton value="standard">
            <MapIcon fontSize="small" />
          </ToggleButton>

          <ToggleButton value="satellite">
            <SatelliteIcon fontSize="small" />
          </ToggleButton>

          <ToggleButton value="dark">
            <DarkModeIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <MapContainer
        center={[lat, lon]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer attribution="© OpenStreetMap" url={MAP_STYLES[style]} />

        <FlyToLocation lat={lat} lon={lon} />

        <Marker position={[lat, lon]} icon={markerIcon} />
      </MapContainer>
    </Box>
  );
}
