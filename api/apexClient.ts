import axios from 'axios';
import { APEX_BASE_URL, HTTP_TIMEOUT_MS } from '../constants/config';
import { getAccessToken } from '../utils/AuthStorageUtils';

const apexClient = axios.create({
  baseURL: APEX_BASE_URL.replace(/\/$/, ''),
  timeout: HTTP_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

apexClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apexClient;
