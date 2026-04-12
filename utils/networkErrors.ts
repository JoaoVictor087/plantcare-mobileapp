import { isAxiosError } from 'axios';

/** Falha típica quando não há rede ou o host não responde (útil para diagnóstico). */
export function isRedeOuServidorIndisponivel(error: unknown): boolean {
  if (!isAxiosError(error)) {
    return error instanceof TypeError && String(error.message).includes('fetch');
  }
  if (error.code === 'ECONNABORTED') {
    return true;
  }
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return true;
  }
  if (!error.response) {
    return true;
  }
  const status = error.response.status;
  return status >= 500 || status === 408;
}
