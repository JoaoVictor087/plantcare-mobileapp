import axios from 'axios';
import { API_BASE_URL } from '../constants/config';
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
        const originalRequest = error.config;

        if (error.response?.status === 401 && !isRefreshing) {
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
                    refreshToken: refreshToken,
                });

                await salvarAuthData(data);

                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

                return apiClient(originalRequest);

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
        return Promise.reject(error);
    }
);

export default apiClient;