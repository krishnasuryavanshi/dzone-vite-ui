/**
 * Token store for Vite app.
 * Persisted to localStorage. No BFF fetch — token comes from login.
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TokenStore {
  accessToken: string | null;
  apiUrl: string | null;
  isLoading: boolean;
  error: string | null;

  setToken: (token: string, apiUrl?: string) => void;
  fetchToken: () => Promise<string | null>;
  getToken: () => Promise<string | null>;
  getApiUrl: () => Promise<string | null>;
  clearToken: () => void;
}

export const useTokenStore = create<TokenStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      apiUrl: null,
      isLoading: false,
      error: null,

      setToken: (token, apiUrl) =>
        set({
          accessToken: token,
          apiUrl: apiUrl || import.meta.env.VITE_API_URL || null,
          isLoading: false,
          error: null,
        }),

      // In the Vite app, token is set at login — no BFF endpoint to fetch from
      fetchToken: async () => {
        return get().accessToken;
      },

      getToken: async () => {
        return get().accessToken;
      },

      getApiUrl: async () => {
        return get().apiUrl || import.meta.env.VITE_API_URL || null;
      },

      clearToken: () =>
        set({ accessToken: null, apiUrl: null, isLoading: false, error: null }),
    }),
    {
      name: 'token-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
