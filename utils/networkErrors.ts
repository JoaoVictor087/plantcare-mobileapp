import * as Network from 'expo-network';
import { isAxiosError } from 'axios';

/** Lança se o dispositivo estiver claramente sem rede (mutações não tentam a API). */
export async function assertInternetDisponivel(): Promise<void> {
  let net: Awaited<ReturnType<typeof Network.getNetworkStateAsync>>;
  try {
    net = await Promise.race([
      Network.getNetworkStateAsync(),
      new Promise<Awaited<ReturnType<typeof Network.getNetworkStateAsync>>>(
        (_, reject) =>
          setTimeout(() => reject(new Error('network-check-timeout')), 2500)
      ),
    ]);
  } catch {
    return;
  }
  if (net.isConnected === false || net.isInternetReachable === false) {
    const err = new Error('Sem conexão com a internet.') as Error & {
      code?: string;
    };
    err.code = 'OFFLINE';
    throw err;
  }
}

/** Falha típica quando não há rede ou o host não responde. */
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
