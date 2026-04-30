import { create } from 'zustand';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { api, setAuthFailureHandler } from '../api/client';
import { loadTokens, clearTokens } from '../services/keychain.service';

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
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

// Ensure you configure this with your actual Web Client ID before using
// GoogleSignin.configure({ webClientId: 'YOUR_WEB_CLIENT_ID' });

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  signInWithGoogle: async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) throw new Error('No ID token from Google');

      const res = await api.post('/auth/google', { idToken });
      
      // Tokens are already saved in keychain via the API client response if we did it there,
      // actually wait, we need to save them. The client.ts doesn't auto-save on login.
      // Let's import saveTokens and do it here or update client.ts to handle it.
      const { saveTokens } = await import('../services/keychain.service');
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
