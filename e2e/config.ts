export const EVENT_ID = process.env.NEXT_PUBLIC_EVENT_ID ?? "01a0f47a-cc4e-4d70-9ecc-a5cd60c37521";
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL ?? "https://api.omnixys.com/graphql";
export const SEAT_MAP_URL = `/event/${EVENT_ID}/seat/map`;

export const TEST_USER = {
  username: process.env.E2E_USERNAME ?? "caleb",
  password: process.env.E2E_PASSWORD ?? "p",
};

export const AUTH_STORAGE_FILE = ".playwright-auth.json";
