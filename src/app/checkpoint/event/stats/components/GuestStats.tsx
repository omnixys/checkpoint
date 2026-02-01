"use client";

import { Grid } from "@mui/material";
import { JSX } from "react";
import { GuestEventStats } from "../../mock/eventStats.mock";
import StatCard from "./StatCard";

type Props = {
  stats: GuestEventStats;
};

export default function GuestStats({ stats }: Props): JSX.Element {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <StatCard label="Eingeladen" value={stats.invited} />
      </Grid>

      <Grid item xs={6}>
        <StatCard label="Zugesagt" value={stats.confirmed} />
      </Grid>

      <Grid item xs={6}>
        <StatCard label="Abgelehnt" value={stats.declined} />
      </Grid>

      <Grid item xs={6}>
        <StatCard label="Eingecheckt" value={stats.checkedIn} />
      </Grid>
    </Grid>
  );
}
