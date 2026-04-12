import axios from 'axios';
import { APEX_BASE_URL } from '../constants/config';
import { getAccessToken } from '../utils/AuthStorageUtils';

const apexClient = axios.create({
  baseURL: APEX_BASE_URL.replace(/\/$/, ''),
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
