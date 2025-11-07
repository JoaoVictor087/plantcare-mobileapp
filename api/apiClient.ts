import axios from 'axios';
import {getAccessToken, getRefreshToken, limparAuthData, salvarAuthData} from "../utils/AuthStorageUtils";

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    userId: number;
}

const apiClient = axios.create({
    baseURL: 'http://10.0.2.2:8080/api',
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
                    throw new Error('Sem refresh token');
                }


                const { data } = await apiClient.post<AuthResponse>('/auth/refresh', {
                    refreshToken: refreshToken,
                });

                await salvarAuthData(data);

                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

                return apiClient(originalRequest);

            } catch (refreshError) {
                console.error('Refresh token falhou. Fazendo logout.', refreshError);
                await limparAuthData();
                const { router } =  require('expo-router')
                router.replace('/login')
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;