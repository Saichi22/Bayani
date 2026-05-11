import { create } from 'zustand';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { api, setAuthFailureHandler } from '../api/client';
import {
  loadTokens,
  clearTokens,
  saveTokens,
} from '../services/keychain.service';

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

import { GOOGLE_WEB_CLIENT_ID } from '@env';

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
});

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  signIn: async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      await saveTokens({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
      set({ user: res.data.user, isAuthenticated: true });
    } catch (error) {
      console.error('Sign-In Error:', error);
      throw error;
    }
  },

  register: async (email, password, name) => {
    try {
      const res = await api.post('/auth/register', { email, password, name });
      // Uncomment if your backend returns tokens immediately after registration
      // await saveTokens({
      //   accessToken: res.data.accessToken,
      //   refreshToken: res.data.refreshToken,
      // });
      // set({ user: res.data.user, isAuthenticated: true });
    } catch (error: any) {
      if (__DEV__) {
        console.error('Registration Error:', {
          message: error?.message,
          response: error?.response?.data,
          request: error?.config,
        });
      }
      throw error;
    }
  },

  signInWithGoogle: async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) throw new Error('No ID token from Google');

      const res = await api.post('/auth/google', { idToken });

      await saveTokens({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });

      set({ user: res.data.user, isAuthenticated: true });
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const tokens = await loadTokens();
      if (tokens?.refreshToken) {
        await api.post('/auth/logout', { refreshToken: tokens.refreshToken });
      }
    } catch (e) {
      // Ignore network errors on logout
    }

    await clearTokens();
    await GoogleSignin.signOut();
    set({ user: null, isAuthenticated: false });
  },

  restoreSession: async () => {
    try {
      const tokens = await loadTokens();
      if (!tokens) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }

      const res = await api.get('/auth/me');
      set({ user: res.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false, isAuthenticated: false });
    }
  },
}));

setAuthFailureHandler(() => {
  useAuthStore.setState({ user: null, isAuthenticated: false });
});
