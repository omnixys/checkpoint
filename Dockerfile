# @license GPL-3.0-or-later
# Copyright (C) 2025 Caleb Gyamfi - Omnixys Technologies
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# ---------------------------------------------------------------------------------------
# Dockerfile – Omnixys UI Service (Next.js 16 Standalone, PNPM)
# ---------------------------------------------------------------------------------------
# syntax=docker/dockerfile:1.14.0

# ---------------------------------------------------------------------------------------
# Build arguments (via docker-bake.hcl)
# ---------------------------------------------------------------------------------------
ARG NODE_VERSION=24.10.0
ARG APP_NAME=checkpoint-ui
ARG APP_VERSION=0.0.0-dev
ARG CREATED
ARG REVISION

# ---------------------------------------------------------------------------------------
# Stage 1: Build
# ---------------------------------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS build

ENV NODE_ENV=production
ENV DOCKER=true
ENV TZ=UTC

WORKDIR /app

# ---- System dependencies + pnpm (ROOT) ----
USER root
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      ca-certificates \
      openssl && \
    npm install -g pnpm@10.26.2 && \
    rm -rf /var/lib/apt/lists/*

# ---- Ensure correct ownership ----
RUN chown -R node:node /app

# ---- Switch to non-root ----
USER node

# ---- Configure pnpm paths explicitly (CRITICAL FIX) ----
ENV PNPM_HOME=/home/node/.pnpm
ENV PNPM_STORE_PATH=/home/node/.pnpm-store
ENV PATH=$PNPM_HOME:$PATH

# ---- Install dependencies ----
COPY --chown=node:node package.json pnpm-lock.yaml ./

RUN --mount=type=cache,target=/home/node/.pnpm-store \
    pnpm install --frozen-lockfile

# ---- Copy source & build ----
COPY --chown=node:node . .

RUN pnpm run build

# ---------------------------------------------------------------------------------------
# Stage 2: Final runtime (Next.js standalone)
# ---------------------------------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS final

# ---- Build args for OCI labels ----
ARG NODE_VERSION
ARG APP_NAME
ARG APP_VERSION
ARG CREATED
ARG REVISION

# ---- OCI image metadata ----
LABEL org.opencontainers.image.title="omnixys-${APP_NAME}-service" \
      org.opencontainers.image.description="Omnixys ${APP_NAME}-service – Next.js 16 Standalone UI, Node.js ${NODE_VERSION}, version ${APP_VERSION}, based on Debian Bookworm." \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.licenses="GPL-3.0-or-later" \
      org.opencontainers.image.vendor="Omnixys Technologies" \
      org.opencontainers.image.authors="caleb.gyamfi@omnixys.com" \
      org.opencontainers.image.base.name="node:${NODE_VERSION}-bookworm-slim" \
      org.opencontainers.image.url="https://github.com/omnixys/omnixys-${APP_NAME}-service" \
      org.opencontainers.image.source="https://github.com/omnixys/omnixys-${APP_NAME}-service" \
      org.opencontainers.image.created="${CREATED}" \
      org.opencontainers.image.revision="${REVISION}" \
      org.opencontainers.image.documentation="https://github.com/omnixys/omnixys-${APP_NAME}-service/blob/main/README.md"

# ---- Runtime environment ----
ENV NODE_ENV=production
ENV PORT=3000
ENV TZ=UTC

WORKDIR /opt/app

# ---- Runtime system packages ----
USER root
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      dumb-init \
      ca-certificates && \
    rm -rf /var/lib/apt/lists/* /tmp/* && \
    chown -R node:node /opt/app

# ---- Switch to non-root ----
USER node

# ---- Copy Next.js standalone output ----
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public

EXPOSE 3000

# ---- Healthcheck ----
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD node -e "fetch('http://localhost:3000').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# ---- Start ----
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
