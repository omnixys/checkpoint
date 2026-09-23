 # @license GPL-3.0-or-later
 # Copyright (C) 2025 Caleb Gyamfi - Omnixys Technologies
 #
 # This program is free software: you can redistribute it and/or modify
 # it under the terms of the GNU General Public License as published by
 # the Free Software Foundation, either version 3 of the License, or
 # (at your option) any later version.
 #
 # This program is distributed in the hope that it will be useful,
 # but WITHOUT ANY WARRANTY; without even the implied warranty of
 # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 # See the GNU General Public License for more details.
 #
 # For more information, visit <https://www.gnu.org/licenses/>.
 
# ---------------------------------------------------------------------------------------
# 🧱 docker-bake.hcl – Omnixys Bake Setup
# ---------------------------------------------------------------------------------------
# Build orchestration for Omnixys Node-based microservices using HashiCorp Docker Bake.
# Aufruf mit  APP_VERSION=$(node -p "require('./package.json').version") docker buildx bake
# ---------------------------------------------------------------------------------------

variable "APP_NAME" {
  default = "checkpoint"
}

# Automatically use today's date (YYYY-MM-DD) as version tag
variable "APP_VERSION" {
  default = "dev"
}

variable "NODE_VERSION" {
  default = "25.8.2"
}

variable "CREATED" {
  default = timestamp()
}

variable "REVISION" {
  default = "local-dev"
}

# ---------------------------------------------------------------------------------------
# Target Group
# ---------------------------------------------------------------------------------------

group "default" {
  targets = ["build"]
}

target "build" {
  dockerfile = "./Dockerfile"
  context = "."

    secret = [
    "id=omnixys_token,src=.secrets/omnixys_token"
  ]

  args = {
    NODE_VERSION = "${NODE_VERSION}"
    APP_NAME     = "${APP_NAME}"
    APP_VERSION  = "${APP_VERSION}"
    CREATED      = "${CREATED}"
    REVISION     = "${REVISION}"

    NODE_ENV= "staging"
    NEXT_PUBLIC_OTEL_ENDPOINT= "https://api-dev.omnixys.com/otel/v1/traces"
    NEXT_PUBLIC_OTEL_SERVICE_NAME= "checkpoint"
    NEXT_PUBLIC_OTEL_SAMPLE_RATE= "0.1"
    NEXT_PUBLIC_BACKEND_SERVER_URL= "https://api-dev.omnixys.com/graphql"
    NEXT_PUBLIC_GATEWAY_URL= "https://api-dev.omnixys.com"
    NEXT_PUBLIC_GRAPHQL_WS_URL= "wss://api-dev.omnixys.com/ws"
    NEXT_PUBLIC_FALLBACK_URL= "/"
    NEXT_PUBLIC_CHECKPOINT_BASE_PATH= "/"
    NEXT_PUBLIC_EVENT_ID= "2dae12d9-025f-72cd-a285-87130fd6f63e"
    NEXT_PUBLIC_BASE_URL= "https://checkpoint-dev.omnixys.com"
    NEXT_PUBLIC_APP_URL= "https://checkpoint-dev.omnixys.com"
    NEXT_PUBLIC_NEXYS_HOME_URL= "https://nexys.omnixys.com"
    NEXT_PUBLIC_EVENT_API= "https://api-dev.omnixys.com/event/media"
    NEXT_PUBLIC_INVITATION_API= "https://api-dev.omnixys.com/invitation/invitation"
    ANALYTICS_CONSENT_SECRET= "asd"
    PLAYWRIGHT_USER_USERNAME= "caleb"
    OMNIXYS_TENANT_ID= "6e788f7f-c233-4cb8-bbde-c0b855e564be"
    NEXT_PUBLIC_OMNIXYS_TENANT_ID= "6e788f7f-c233-4cb8-bbde-c0b855e564be"
    ANALYTICS_API_URL= "https://api-dev.omnixys.com/analytics"
    ANALYTICS_INTERNAL_TOKEN= "dein-geheimes-token"
    NEXT_PUBLIC_EVENT_ID= "2dae12d9-025f-72cd-a285-87130fd6f63e"
  }

  labels = {
    "org.opencontainers.image.title"         = "omnixys-${APP_NAME}-service"
    "org.opencontainers.image.version"       = "${APP_VERSION}"
    "org.opencontainers.image.created"       = "${CREATED}"
    "org.opencontainers.image.revision"      = "${REVISION}"
    "org.opencontainers.image.source"        = "https://github.com/omnixys/omnixys-${APP_NAME}-service"
    "org.opencontainers.image.licenses"      = "GPL-3.0-or-later"
    "org.opencontainers.image.vendor"        = "omnixys"
    "org.opencontainers.image.authors"       = "caleb.gyamfi@omnixys.com"
  }

  tags = [
    "omnixys/${APP_NAME}:${APP_VERSION}"
  ]

platforms = ["linux/arm64"]
output = ["type=docker"]

}
