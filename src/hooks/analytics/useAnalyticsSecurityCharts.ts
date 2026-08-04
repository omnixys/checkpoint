import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import {
  AnalyticsSecurityChartsDocument,
  type AnalyticsSecurityChartsQuery,
  type AnalyticsSecurityChartsQueryVariables,
} from "@/checkpoint/generated/graphql";

export interface SecurityChartPoint {
  time: string;
  value: number;
}

interface AnalyticsSecurityChartsResult {
  scans: SecurityChartPoint[];
  warnings: SecurityChartPoint[];
  loading: boolean;
  error: Error | undefined;
}

function toChartPoint(point: { time: string; value: number }): SecurityChartPoint {
  return {
    time: formatTime(point.time),
    value: point.value,
  };
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

/**
 * Resolves the checkpoint security charts (scans + warnings per minute)
 * for the active tenant through the gateway subgraph.
 */
export function useAnalyticsSecurityCharts(
  workspaceSlug = "checkpoint",
): AnalyticsSecurityChartsResult {
  const { to, from } = useMemo(() => {
    const to = new Date();
    const from = new Date(to.getTime() - 24 * 60 * 60 * 1000);
    return { to, from };
  }, []);

  const { data, loading, error } = useQuery<
    AnalyticsSecurityChartsQuery,
    AnalyticsSecurityChartsQueryVariables
  >(AnalyticsSecurityChartsDocument, {
    variables: { workspaceSlug, from: from.toISOString(), to: to.toISOString() },
    fetchPolicy: "cache-and-network",
  });

  return useMemo(() => {
    const charts = data?.analyticsSecurityCharts;
    return {
      scans: (charts?.scans ?? []).map(toChartPoint),
      warnings: (charts?.warnings ?? []).map(toChartPoint),
      loading,
      error: error ?? undefined,
    };
  }, [data, loading, error]);
}
