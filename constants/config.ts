/**
 * URLs da API principal (Spring) e da coleção REST exposta pelo Oracle APEX (ORDS ou proxy).
 * Configure no .env: EXPO_PUBLIC_API_BASE_URL e EXPO_PUBLIC_APEX_BASE_URL
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://40.82.162.17:8080/api';

/**
 * Base da coleção de cuidados no APEX (ex.: ORDS: .../ords/schema/objeto/cuidados/ ou proxy no backend).
 * O app depende deste endpoint para o fluxo de cuidados; ajuste conforme o módulo APEX do grupo.
 */
export const APEX_BASE_URL =
  process.env.EXPO_PUBLIC_APEX_BASE_URL ??
  'http://40.82.162.17:8080/api/apex/cuidados';

/** Evita requisições penduradas indefinidamente (tela só “carregando”). */
export const HTTP_TIMEOUT_MS = Number(
  process.env.EXPO_PUBLIC_HTTP_TIMEOUT_MS ?? 22000
);
