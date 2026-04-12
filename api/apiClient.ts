import axios from 'axios';
import { API_BASE_URL, HTTP_TIMEOUT_MS } from '../constants/config';
import {
  getAccessToken,
  getRefreshToken,
  isSessaoAdmin,
  limparAuthData,
  salvarAuthData,
} from '../utils/AuthStorageUtils';

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    userId: number;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL.replace(/\/$/, ''),
  timeout: HTTP_TIMEOUT_MS,
});

apiClient.interceptors.request.use(
    async (config) => {
        const token = await getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;


apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const config = error.config;
        if (!config) {
            return Promise.reject(error);
        }

        const path = String(config.url ?? '');
        if (path.includes('/auth/refresh')) {
            return Promise.reject(error);
        }

        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }

        if ((config as { _retry?: boolean })._retry) {
            return Promise.reject(error);
        }
        (config as { _retry?: boolean })._retry = true;

        if (isRefreshing) {
            return Promise.reject(error);
        }
        isRefreshing = true;

        try {
            const refreshToken = await getRefreshToken();
            if (!refreshToken) {
                if (await isSessaoAdmin()) {
                    return Promise.reject(error);
                }
                await limparAuthData();
                const { router } = await import('expo-router');
                router.replace('/(auth)/login');
                return Promise.reject(error);
            }

            const { data } = await apiClient.post<AuthResponse>('/auth/refresh', {
                refreshToken,
            });

            await salvarAuthData(data);

            const h = config.headers;
            if (h && typeof (h as { set?: (k: string, v: string) => void }).set === 'function') {
                (h as { set: (k: string, v: string) => void }).set(
                    'Authorization',
                    `Bearer ${data.accessToken}`
                );
            } else if (h && typeof h === 'object') {
                (h as Record<string, string>).Authorization = `Bearer ${data.accessToken}`;
            }

            return apiClient(config);
        } catch (refreshError) {
            console.error('Refresh token falhou.', refreshError);
            if (await isSessaoAdmin()) {
                return Promise.reject(refreshError);
            }
            await limparAuthData();
            const { router } = await import('expo-router');
            router.replace('/(auth)/login');
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default apiClient;