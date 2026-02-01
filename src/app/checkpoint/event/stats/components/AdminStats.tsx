"use client";

import { Grid } from "@mui/material";
import { JSX } from "react";
import { AdminEventStats } from "../../mock/eventStats.mock";
import StatCard from "./StatCard";

type Props = {
  stats: AdminEventStats;
};

export default function AdminStats({ stats }: Props): JSX.Element {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <StatCard label="Aktuell im Event" value={stats.currentlyInside} />
      </Grid>

      <Grid item xs={6}>
        <StatCard label="Peak gleichzeitig" value={stats.peakInside} />
      </Grid>

      <Grid item xs={6}>
        <StatCard
          label="Ø Aufenthaltsdauer"
          value={`${stats.avgStayMinutes} min`}
        />
      </Grid>

      <Grid item xs={6}>
        <StatCard label="Scans heute" value={stats.scansToday} />
      </Grid>
    </Grid>
  );
}
