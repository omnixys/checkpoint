"use client";

import {
  Box,
  Chip,
  Container,
  IconButton,
  Paper,
  Popover,
  Stack,
  Switch,
  FormControlLabel,
  TextField,
  Typography,
  useTheme,
  Divider,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TuneIcon from "@mui/icons-material/Tune";

import { useSecurityGuests } from "./useSecurityGuests";
import { useDevice } from "@/providers/DeviceProvider";
import BackToEventDetail from "@/components/invitationList/button/BackToEventDetail";
import { useAuth } from "@/providers/AuthProvider";
import { VisionEmblaCarousel } from "./VisionCarousel";
import RefreshArcButton from "@/components/invitationList/RefreshArcButton";
import { red } from "@mui/material/colors";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

type Filter = "ALL" | "CHECKED_IN" | "INSIDE" | "OUTSIDE" | "NOT_ARRIVED";

/* ------------------------------------------------------------------ */
/* Page */
/* ------------------------------------------------------------------ */

export default function SecurityGuestListPage() {
  const { isMobile, isTablet, isDesktop } = useDevice();

  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { id: eventId } = useParams();

  const theme = useTheme();
  const omni = theme.palette.omnixys;
  const apple = theme.palette.apple;

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);

  const { guests, reload } = useSecurityGuests(eventId as string);
  const [axis, setAxis] = useState<"x" | "y">("x");


  /* ------------------------------------------------------------------ */
  /* Redirect Guard */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (!isAuthenticated) router.push("/checkpoint/");
  }, [isAuthenticated, router]);

  /* ------------------------------------------------------------------ */
  /* Counters */
  /* ------------------------------------------------------------------ */

  const counters = useMemo(() => {
    return [
      { key: "total", label: "Gesamt", value: guests.length },
      {
        key: "checked",
        label: "Eingecheckt",
        value: guests.filter((g) => g.checkedInAt).length,
        color: omni.success,
      },
      {
        key: "inside",
        label: "Drinnen",
        value: guests.filter((g) => g.presence === "INSIDE").length,
        color: omni.primary,
      },
      {
        key: "outside",
        label: "Draußen",
        value: guests.filter((g) => g.presence !== "INSIDE").length,
        color: apple.quaternaryLabel,
      },
      { key: "not arrived", label: "Nicht da", value: guests.filter((g) => !g.checkedInAt).length, color: red[500] },
    ];
  }, [guests, omni]);




  /* ------------------------------------------------------------------ */
  /* Adaptive Filter Options */
  /* ------------------------------------------------------------------ */

  const filterOptions = useMemo(() => {
    const hasCheckedIn = guests.some((g) => g.checkedInAt);
    const hasInside = guests.some((g) => g.presence === "INSIDE");
    const hasOutside = guests.some((g) => g.presence !== "INSIDE");
    const hasNotArrived = guests.some((g) => !g.checkedInAt);

    return [
      { key: "ALL", label: "Alle", visible: true },
      { key: "CHECKED_IN", label: "Eingecheckt", visible: hasCheckedIn },
      { key: "INSIDE", label: "Drinnen", visible: hasInside },
      { key: "OUTSIDE", label: "Draußen", visible: hasOutside },
      { key: "NOT_ARRIVED", label: "Nicht da", visible: hasNotArrived },
    ].filter((f) => f.visible);
  }, [guests]);

  /* ------------------------------------------------------------------ */
  /* Filtering */
  /* ------------------------------------------------------------------ */

  const guestsFiltered = useMemo(() => {
    return guests.filter((g) => {
      const matchesSearch =
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        String(g.seat?.number ?? "").includes(search);

      const matchesFilter =
        filter === "ALL" ||
        (filter === "CHECKED_IN" && g.checkedInAt) ||
        (filter === "INSIDE" && g.presence === "INSIDE") ||
        (filter === "OUTSIDE" && g.presence !== "INSIDE") ||
        (filter === "NOT_ARRIVED" && !g.checkedInAt);

      return matchesSearch && matchesFilter;
    });
  }, [search, filter, guests]);


      const counters2 = useMemo(() => {
        return {
          total: guestsFiltered.length,
          checkedIn: guestsFiltered.filter((g) => g.status === "CHECKED_IN")
            .length,
          inside: guestsFiltered.filter((g) => g.presence === "INSIDE").length,
          outside: guestsFiltered.filter((g) => g.presence === "OUTSIDE")
            .length,
          notArrived: guestsFiltered.filter((g) => g.status === "NOT_ARRIVED")
            .length,
        };
      }, [guestsFiltered]);

  /* ------------------------------------------------------------------ */
  /* Render */
  /* ------------------------------------------------------------------ */

  return (
    <Container maxWidth={isMobile ? false : "lg"} disableGutters={isMobile}>
      <Stack spacing={3} px={isMobile ? 1.5 : 0}>
        <BackToEventDetail />

        {/* ================================================================ */}
        {/* STATUS CAROUSEL (AUTO, MAX 2 VISIBLE) */}
        {/* ================================================================ */}
        {isMobile || isTablet ? (
          <>
            <VisionEmblaCarousel
              items={counters}
              slidesPerView={1}
              autoplay
              delay={3000}
              axis={axis}
              renderItem={(item) => (
                <Paper
                  elevation={0}
                  sx={{
                    px: 2,
                    py: 1.4,
                    borderRadius: 3,
                    backdropFilter: "blur(22px)",
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? "rgba(255,255,255,0.8)"
                        : "rgba(20,20,20,0.6)",
                    border: `1px solid ${apple.separator}`,
                  }}
                >
                  <Typography
                    fontSize={12}
                    color={apple.secondaryLabel}
                    fontWeight={600}
                  >
                    {item.label}
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      fontSize={22}
                      fontWeight={800}
                      color={item.color ?? apple.label}
                      sx={{
                        textShadow: "0 6px 20px rgba(0,0,0,0.25)",
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                </Paper>
              )}
              options={{ loop: true }}
            />

            {/* <FormControlLabel
              control={
                <Switch
                  checked={axis === "y"}
                  onChange={(e) => setAxis(e.target.checked ? "y" : "x")}
                />
              }
              label="Vertikaler Modus"
            /> */}
          </>
        ) : (
          <Paper
            elevation={0}
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 20,
              backdropFilter: "blur(18px)",
              backgroundColor: apple.background + "ee",
              border: `1px solid ${omni.secondary}`,
              borderRadius: 3,
              px: 3,
              py: 2,
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ md: "center" }}
            >
              {/* Counters */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography fontWeight={700} color={apple.label}>
                  Gäste
                </Typography>

                <Divider orientation="vertical" flexItem />

                <Chip
                  label={`Gesamt: ${counters2.total}`}
                  sx={{ fontWeight: 700 }}
                />

                <Chip
                  label={`Eingecheckt: ${counters2.checkedIn}`}
                  sx={{
                    fontWeight: 700,
                    bgcolor: omni.success + "22",
                    color: omni.success,
                  }}
                />

                <Chip
                  label={`Drinnen: ${counters2.inside}`}
                  sx={{
                    fontWeight: 700,
                    bgcolor: omni.primary + "22",
                    color: omni.primary,
                  }}
                />

                <Chip
                  label={`Draußen: ${counters2.outside}`}
                  sx={{
                    fontWeight: 700,
                    bgcolor: apple.quaternaryLabel + "22",
                    color: apple.quaternaryLabel,
                  }}
                />

                <Chip
                  label={`Nicht da: ${counters2.notArrived}`}
                  sx={{
                    fontWeight: 700,
                    bgcolor: red[500] + "22",
                    color: red[500],
                  }}
                />
              </Stack>

              {/* Actions */}
              <Stack direction="row" spacing={1} alignItems="center">
                <RefreshArcButton onReload={reload} />
              </Stack>
            </Stack>
          </Paper>
        )}

        {/* Controls */}
        {isDesktop && (
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ md: "center" }}
          >
            <TextField
              placeholder="Name oder Sitzplatz suchen …"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
            />

            <FormControl sx={{ minWidth: 220 }}>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value as Filter)}
              >
                <MenuItem value="ALL">Alle Gäste</MenuItem>
                <MenuItem value="NOT_ARRIVED">Noch nicht angekommen</MenuItem>
                <MenuItem value="CHECKED_IN">Eingecheckt</MenuItem>
                <MenuItem value="INSIDE">Drinnen</MenuItem>
                <MenuItem value="OUTSIDE">Draußen</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                />
              }
              label="High Contrast"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={largeText}
                  onChange={(e) => setLargeText(e.target.checked)}
                />
              }
              label="Große Schrift"
            />
          </Stack>
        )}

        {isTablet && (
          <>
            <Stack spacing={1}>
              <Typography variant="h4" fontWeight={700} color={apple.label}>
                Gästeliste – Security
              </Typography>
              <Typography color={apple.secondaryLabel}>
                Live-Übersicht über Gäste, Sitzplätze und Aufenthaltsstatus
              </Typography>
            </Stack>
            <Stack
              direction={{ xs: "row", md: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ md: "center" }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                  />
                }
                label="High Contrast"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={largeText}
                    onChange={(e) => setLargeText(e.target.checked)}
                  />
                }
                label="Große Schrift"
              />
              <RefreshArcButton onReload={reload} />
            </Stack>
          </>
        )}

        {/* ================================================================ */}
        {/* SEARCH + CONTROL CAPSULE */}
        {/* ================================================================ */}
        {(isMobile || isTablet) && (
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              placeholder="Name oder Sitzplatz …"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              size="small"
            />

            {isMobile && (
              <IconButton onClick={(e) => setFilterAnchor(e.currentTarget)}>
                <TuneIcon />
              </IconButton>
            )}
          </Stack>
        )}

        {/* ================================================================ */}
        {/* FILTER CAROUSEL (SEGMENTED ORB) */}
        {/* ================================================================ */}
        {(isMobile || isTablet) && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {filterOptions.map((opt) => (
              <motion.div
                key={opt.key}
                whileTap={{ scale: 0.9 }}
                style={{ scrollSnapAlign: "center" }}
              >
                <Box
                  onClick={() => setFilter(opt.key as Filter)}
                  sx={{
                    px: 2.4,
                    py: 1,
                    borderRadius: 999,
                    whiteSpace: "nowrap",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    backdropFilter: "blur(24px)",
                    backgroundColor:
                      filter === opt.key
                        ? apple.systemFill
                        : "rgba(255,255,255,0.08)",
                    color:
                      filter === opt.key ? apple.label : apple.secondaryLabel,
                    border: `1px solid ${apple.separator}`,
                  }}
                >
                  {opt.label}
                </Box>
              </motion.div>
            ))}
          </Box>
        )}

        {/* ================================================================ */}
        {/* GUEST LIST */}
        {/* ================================================================ */}
        <Stack spacing={2}>
          {guestsFiltered.map((guest) => (
            <Paper
              key={guest.ticketId}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                backgroundColor: highContrast
                  ? omni.backgroundDefault
                  : omni.backgroundPaper,
                border: highContrast
                  ? `2px solid ${omni.primary}`
                  : `1px solid ${omni.secondary}`,
              }}
            >
              <Typography fontWeight={800} fontSize={largeText ? 20 : 16}>
                {guest.name}
              </Typography>

              {guest.seat && (
                <Typography fontSize={12} color={apple.secondaryLabel}>
                  {guest.seat.section} · {guest.seat.table} ·{" "}
                  {guest.seat.number}
                </Typography>
              )}

              <Stack direction="row" spacing={1} mt={1}>
                <Chip
                  size="small"
                  label={guest.checkedInAt ? "Eingecheckt" : "Nicht da"}
                  sx={{
                    bgcolor: guest.checkedInAt
                      ? omni.success + "22"
                      : omni.error + "22",
                    color: guest.checkedInAt ? omni.success : omni.error,
                    fontWeight: 700,
                  }}
                />

                <Chip
                  size="small"
                  label={guest.presence === "INSIDE" ? "Drinnen" : "Draußen"}
                />
              </Stack>
            </Paper>
          ))}
        </Stack>

        {/* ================================================================ */}
        {/* CONTROL POPOVER */}
        {/* ================================================================ */}
        <Popover
          open={Boolean(filterAnchor)}
          anchorEl={filterAnchor}
          onClose={() => setFilterAnchor(null)}
          PaperProps={{
            sx: {
              p: 2,
              minWidth: 260,
              borderRadius: 4,
              backdropFilter: "blur(30px)",
            },
          }}
        >
          <Stack spacing={2}>
            <Typography fontWeight={800}>Anzeige</Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                />
              }
              label="High Contrast"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={largeText}
                  onChange={(e) => setLargeText(e.target.checked)}
                />
              }
              label="Große Schrift"
            />
          </Stack>
        </Popover>
      </Stack>
    </Container>
  );
}
