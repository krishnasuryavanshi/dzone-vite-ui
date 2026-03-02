/**
 * Client-side auth stores — persisted to localStorage.
 * These replace NextAuth's server-side session management.
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// ── Auth Store (user identity + session state) ──

interface AuthUser {
  name?: string;
  email?: string;
  userId?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  roles: any[];
  tenantCode: string[];
  isDzoneUser: boolean;
  tenantType: string;
  modules: Record<string, boolean>;
  moduleAccessList: any[];

  setAuth: (data: {
    user: AuthUser;
    roles: any[];
    tenantCode: string[];
    isDzoneUser: boolean;
    tenantType: string;
    modules: Record<string, boolean>;
    moduleAccessList: any[];
  }) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      roles: [],
      tenantCode: [],
      isDzoneUser: false,
      tenantType: '',
      modules: {},
      moduleAccessList: [],

      setAuth: (data) =>
        set({
          isAuthenticated: true,
          isLoading: false,
          user: data.user,
          roles: data.roles,
          tenantCode: data.tenantCode,
          isDzoneUser: data.isDzoneUser,
          tenantType: data.tenantType,
          modules: data.modules,
          moduleAccessList: data.moduleAccessList,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      clear: () =>
        set({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          roles: [],
          tenantCode: [],
          isDzoneUser: false,
          tenantType: '',
          modules: {},
          moduleAccessList: [],
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// ── Token Store (JWT access token) ──

interface TokenState {
  accessToken: string | null;
  apiUrl: string | null;
  isLoading: boolean;
  error: string | null;

  setToken: (token: string, apiUrl?: string) => void;
  getToken: () => string | null;
  getApiUrl: () => string | null;
  clearToken: () => void;

  // Compatibility with dzone-ui's fetchToken pattern
  fetchToken: () => Promise<string | null>;
}

export const useTokenStore = create<TokenState>()(
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

      getToken: () => get().accessToken,

      getApiUrl: () => get().apiUrl || import.meta.env.VITE_API_URL || null,

      clearToken: () =>
        set({
          accessToken: null,
          apiUrl: null,
          isLoading: false,
          error: null,
        }),

      // In the Vite app, tokens come from login — no BFF fetch needed
      fetchToken: async () => {
        return get().accessToken;
      },
    }),
    {
      name: 'token-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// ── Re-export the existing permissions store ──
// (It will be copied from dzone-ui, but we also export from here for shim access)
export { usePermissionsStore } from '../stores/permissions-store';
