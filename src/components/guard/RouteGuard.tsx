"use client";

import { CircularProgress, Box } from "@mui/material";
import { useMemo, type ReactNode } from "react";
import { resolveExperience } from "@/checkpoint/lib/experience/resolver";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import ForbiddenPage from "./ForbiddenPage";
import type { FeatureId } from "@/checkpoint/lib/experience/types";

interface Props {
  featureId: FeatureId;
  fallback?: ReactNode;
  children: ReactNode;
}

export default function RouteGuard({ featureId, fallback, children }: Props) {
  const { myRoles, myPermissions, loading } = useActiveEvent();

  const roleIds = useMemo(() => myRoles.map((r) => r.key), [myRoles]);
  const experience = useMemo(
    () => resolveExperience(roleIds, myPermissions),
    [roleIds, myPermissions],
  );

  const isAllowed = experience.allowedFeatureIds.includes(featureId);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAllowed) {
    return fallback ?? <ForbiddenPage />;
  }

  return <>{children}</>;
}
