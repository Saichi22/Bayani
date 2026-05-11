import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import { clearTokens, loadTokens, saveTokens } from '../services/keychain.service';
import { API_URL } from '@env';

export const BASE_URL = API_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000');

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

let authFailureHandler: (() => void) | null = null;
export function setAuthFailureHandler(handler: () => void) {
  authFailureHandler = handler;
}

let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use(async (config) => {
  const tokens = await loadTokens();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig;
    const status = error.response?.status;
    const url = original?.url || '';

    // Ignore if this was an auth entry request
    const isAuthPath = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh') || url.includes('/auth/google');

    if (status === 401 && original && !original._retry && !isAuthPath) {
      original._retry = true;
      try {
        const newAccessToken = await getOrCreateRefresh();
        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(original);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

async function getOrCreateRefresh(): Promise<string> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = doRefresh().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

async function doRefresh(): Promise<string> {
  const tokens = await loadTokens();
  if (!tokens?.refreshToken) {
    await handleAuthFailure();
    throw new Error('No refresh token');
  }

  try {
    const response = await axios.post(`${BASE_URL}/auth/refresh`, {
      refreshToken: tokens.refreshToken,
    });

    await saveTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    });

    return response.data.accessToken;
  } catch (err) {
    await handleAuthFailure();
    throw err;
  }
}

async function handleAuthFailure() {
  await clearTokens();
  authFailureHandler?.();
}
