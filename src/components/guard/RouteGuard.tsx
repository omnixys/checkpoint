"use client";

import { Box, CircularProgress } from "@mui/material";
import { type ReactNode, useMemo } from "react";
import { resolveExperience } from "@/checkpoint/lib/experience/resolver";
import type { FeatureId } from "@/checkpoint/lib/experience/types";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import ForbiddenPage from "./ForbiddenPage";

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
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAllowed) {
    return fallback ?? <ForbiddenPage />;
  }

  return <>{children}</>;
}
