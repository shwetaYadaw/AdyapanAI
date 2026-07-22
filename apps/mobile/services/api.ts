import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.adyapan.com';

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach stored access token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — auto refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (!refreshToken) {
        await clearAuth();
        return Promise.reject(error);
      }
      try {
        const { data } = await axios.post(`${API_URL}/api/v1/auth/refresh-token`, { refreshToken });
        await SecureStore.setItemAsync('accessToken', data.data.accessToken);
        original.headers!.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        await clearAuth();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

async function clearAuth() {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
}

export function extractError(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? error.message ?? 'An error occurred';
  }
  return 'An unexpected error occurred';
}
