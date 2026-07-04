import { env } from "@/checkpoint/lib/env";

export const EVENT_ID = env.EVENT_ID ?? "01a0f47a-cc4e-4d70-9ecc-a5cd60c37521";
export const BACKEND_URL = env.BACKEND_SERVER_URL;
export const SEAT_MAP_URL = `/event/${EVENT_ID}/seat/map`;

export const TEST_USER = {
  username: env.E2E_USERNAME ?? "caleb",
  password: env.E2E_PASSWORD ?? "p",
};

export const AUTH_STORAGE_FILE = ".playwright-auth.json";
