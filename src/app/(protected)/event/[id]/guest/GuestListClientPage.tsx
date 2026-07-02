"use client";

import { Filter } from "@/checkpoint/components/guests/types";
import RefreshArcButton from "@/checkpoint/components/RefreshArcButton";
import { BackToEventDetailButton } from "@/checkpoint/components/utils/back-to-event-detail-button";
import { VisionEmblaCarousel } from "@/checkpoint/components/vision/VisionCarousel";
import { useSecurityGuests } from "@/checkpoint/hooks/user/useSecurityGuests";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { env } from "@/checkpoint/lib/env";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { useDevice } from "@/checkpoint/providers/DeviceProvider";
import TuneIcon from "@mui/icons-material/Tune";
import {
  alpha,
  Box,
  Chip,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Popover,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Page */
/* ------------------------------------------------------------------ */

export default function GuestListClientPage() {
  const t = useTypedTranslations("event");

  const { isMobile, isTablet, isDesktop } = useDevice();

  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { id } = useParams();

  const eventId = id as string;

  const theme = useTheme();
  const omni = theme.palette.omnixys;
  const apple = theme.palette.apple;

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);

  const { guests, reload } = useSecurityGuests(eventId);
  const [axis, setAxis] = useState<"x" | "y">("x");

  /* ------------------------------------------------------------------ */
  /* Redirect Guard */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (!isAuthenticated) router.push(env.CHECKPOINT_BASE_PATH);
  }, [isAuthenticated, router]);

  /* ------------------------------------------------------------------ */
  /* Counters */
  /* ------------------------------------------------------------------ */

  const counters = useMemo(() => {
    return [
      { key: "total", label: t("guests.total"), value: guests.length },
      {
        key: "checked",
        label: t("guests.checkedIn"),
        value: guests.filter((g) => g.checkedInAt).length,
        color: theme.palette.success.main,
      },
      {
        key: "inside",
        label: t("guests.inside"),
        value: guests.filter((g) => g.presence === "INSIDE").length,
        color: theme.palette.primary.main,
      },
      {
        key: "outside",
        label: t("guests.outside"),
        value: guests.filter((g) => g.presence !== "INSIDE").length,
        color: apple.quaternaryLabel,
      },
      {
        key: "not arrived",
        label: t("guests.notArrived"),
        value: guests.filter((g) => !g.checkedInAt).length,
        color: red[500],
      },
    ];
  }, [guests]);

  /* ------------------------------------------------------------------ */
  /* Adaptive Filter Options */
  /* ------------------------------------------------------------------ */

  const filterOptions = useMemo(() => {
    const hasCheckedIn = guests.some((g) => g.checkedInAt);
    const hasInside = guests.some((g) => g.presence === "INSIDE");
    const hasOutside = guests.some((g) => g.presence !== "INSIDE");
    const hasNotArrived = guests.some((g) => !g.checkedInAt);

    return [
      { key: "ALL", label: t("filter.all"), visible: true },
      { key: "CHECKED_IN", label: t("filter.checkedIn"), visible: hasCheckedIn },
      { key: "INSIDE", label: t("filter.inside"), visible: hasInside },
      { key: "OUTSIDE", label: t("filter.outside"), visible: hasOutside },
      { key: "NOT_ARRIVED", label: t("filter.notArrived"), visible: hasNotArrived },
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
      checkedIn: guestsFiltered.filter((g) => g.status === "CHECKED_IN").length,
      inside: guestsFiltered.filter((g) => g.presence === "INSIDE").length,
      outside: guestsFiltered.filter((g) => g.presence === "OUTSIDE").length,
      notArrived: guestsFiltered.filter((g) => g.status === "NOT_ARRIVED").length,
    };
  }, [guestsFiltered]);

  /* ------------------------------------------------------------------ */
  /* Render */
  /* ------------------------------------------------------------------ */

  return (
    <Container maxWidth={isMobile ? false : "lg"} disableGutters={isMobile}>
      <Stack spacing={3} sx={{ px: isMobile ? 1.5 : 0, minWidth: 0 }}>
        <BackToEventDetailButton />

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
                    sx={{
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                    color={apple.secondaryLabel}
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
                      color={item.color ?? apple.label}
                      sx={{
                        textShadow: "0 6px 20px rgba(0,0,0,0.25)",
                        fontSize: 22,
                        fontWeight: 800,
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
              backgroundColor: alpha(apple.systemBackground, 0.93),
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              px: 3,
              py: 2,
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Counters */}
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  alignItems: "center",
                  flexWrap: "wrap",
                  rowGap: 1,
                  minWidth: 0,
                }}
              >
                <Typography
                  color={apple.label}
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {t("guests.title")}
                </Typography>

                <Divider orientation="vertical" flexItem />

                <Chip
                  label={t("guests.totalWithCount", { count: counters2.total })}
                  sx={{ fontWeight: 700 }}
                />

                <Chip
                  label={t("guests.checkedInWithCount", {
                    count: counters2.checkedIn,
                  })}
                  sx={{
                    fontWeight: 700,
                    bgcolor: theme.palette.success.light + "22",
                    color: theme.palette.success.main,
                  }}
                />

                <Chip
                  label={t("guests.insideWithCount", {
                    count: counters2.inside,
                  })}
                  sx={{
                    fontWeight: 700,
                    bgcolor: theme.palette.primary.light + "22",
                    color: theme.palette.primary.main,
                  }}
                />

                <Chip
                  label={t("guests.outsideWithCount", {
                    count: counters2.outside,
                  })}
                  sx={{
                    fontWeight: 700,
                    bgcolor: apple.quaternaryLabel + "22",
                    color: apple.quaternaryLabel,
                  }}
                />

                <Chip
                  label={t("guests.notArrivedWithCount", {
                    count: counters2.notArrived,
                  })}
                  sx={{
                    fontWeight: 700,
                    bgcolor: red[500] + "22",
                    color: red[500],
                  }}
                />
              </Stack>

              {/* Actions */}
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                }}
              >
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
            sx={{
              alignItems: { xs: "stretch", md: "center" },
            }}
          >
            <TextField
              placeholder={t("search.placeholder2")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
            />

            <FormControl sx={{ minWidth: { xs: "100%", md: 220 } }}>
              <Select value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
                <MenuItem value="ALL">{t("filter.allGuests")}</MenuItem>
                <MenuItem value="NOT_ARRIVED">{t("filter.notArrived")}</MenuItem>
                <MenuItem value="CHECKED_IN">{t("filter.checkedIn")}</MenuItem>
                <MenuItem value="INSIDE">{t("filter.inside")}</MenuItem>
                <MenuItem value="OUTSIDE">{t("filter.outside")}</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                />
              }
              label={t("ui.highContrast")}
            />

            <FormControlLabel
              control={
                <Switch checked={largeText} onChange={(e) => setLargeText(e.target.checked)} />
              }
              label={t("ui.largeText")}
            />
          </Stack>
        )}

        {isTablet && (
          <>
            <Stack spacing={1}>
              <Typography
                variant="h4"
                color={apple.label}
                sx={{
                  fontWeight: 700,
                }}
              >
                {t("guests.securityTitle")}
              </Typography>
              <Typography color={apple.secondaryLabel}>{t("guests.subtitle")} </Typography>
            </Stack>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                  />
                }
                label={t("ui.highContrast")}
              />

              <FormControlLabel
                control={
                  <Switch checked={largeText} onChange={(e) => setLargeText(e.target.checked)} />
                }
                label={t("ui.largeText")}
              />
              <RefreshArcButton onReload={reload} />
            </Stack>
          </>
        )}

        {/* ================================================================ */}
        {/* SEARCH + CONTROL CAPSULE */}
        {/* ================================================================ */}
        {(isMobile || isTablet) && (
          <Stack
            direction="row"
            spacing={1}
              sx={{
                alignItems: "center",
                minWidth: 0,
              }}
            >
            <TextField
              placeholder={t("search.placeholder2")}
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
              pb: 0.5,
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
                      filter === opt.key ? apple.systemFill : "rgba(255,255,255,0.08)",
                    color: filter === opt.key ? apple.label : apple.secondaryLabel,
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
                  ? theme.palette.background.default
                  : theme.palette.background.paper,
                border: highContrast
                  ? `2px solid ${theme.palette.primary.main}`
                  : `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: largeText ? 20 : 16,
                }}
              >
                {guest.name}
              </Typography>

              {guest.seat && (
                <Typography
                  sx={{
                    fontSize: 12,
                  }}
                  color={apple.secondaryLabel}
                >
                  {guest.seat.label}
                </Typography>
              )}

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  mt: 1,
                  flexWrap: "wrap",
                  rowGap: 1,
                }}
              >
                <Chip
                  size="small"
                  label={guest.checkedInAt ? t("guests.checkedIn") : t("guests.notArrived")}
                  sx={{
                    bgcolor: guest.checkedInAt
                      ? theme.palette.success.light + "22"
                      : theme.palette.error.light + "22",
                    color: guest.checkedInAt
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                    fontWeight: 700,
                  }}
                />

                <Chip
                  size="small"
                  label={guest.presence === "INSIDE" ? t("guests.inside") : t("guests.outside")}
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
          slotProps={{
            paper: {
              sx: {
                p: 2,
                minWidth: 260,
                borderRadius: 4,
                backdropFilter: "blur(30px)",
              },
            },
          }}
        >
          <Stack spacing={2}>
            <Typography
              sx={{
                fontWeight: 800,
              }}
            >
              {t("ui.display")}
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                />
              }
              label={t("ui.highContrast")}
            />

            <FormControlLabel
              control={
                <Switch checked={largeText} onChange={(e) => setLargeText(e.target.checked)} />
              }
              label={t("ui.largeText")}
            />
          </Stack>
        </Popover>
      </Stack>
    </Container>
  );
}
