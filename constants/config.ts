export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://plantcare-api.azurewebsites.net/api';

export const APEX_BASE_URL =
  process.env.EXPO_PUBLIC_APEX_BASE_URL ?? '';

export const HTTP_TIMEOUT_MS = Number(
  process.env.EXPO_PUBLIC_HTTP_TIMEOUT_MS ?? 22000
);