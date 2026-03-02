/**
 * Shim for `next-auth/react`.
 * Maps useSession, signIn, signOut, getSession, SessionProvider
 * to client-side Zustand auth stores.
 */
import React from 'react';
import { useAuthStore, useTokenStore, usePermissionsStore } from '../auth/stores';

export type SessionStatus = 'authenticated' | 'unauthenticated' | 'loading';

export interface Session {
  accessToken: string;
  apiUrl: string;
  roles: any[];
  tenantCode: string[];
  isDzoneUser: boolean;
  user: any;
  tenantType: string;
  modules: Record<string, boolean>;
  moduleAccessList: any[];
  permissions: string[];
  error: string;
}

export function useSession() {
  const auth = useAuthStore();
  const token = useTokenStore();

  if (auth.isLoading) {
    return { data: null, status: 'loading' as SessionStatus, update: () => {} };
  }

  if (!auth.isAuthenticated || !auth.user) {
    return {
      data: null,
      status: 'unauthenticated' as SessionStatus,
      update: () => {},
    };
  }

  const session: Session = {
    accessToken: token.accessToken || '',
    apiUrl: import.meta.env.VITE_API_URL || '',
    roles: auth.roles || [],
    tenantCode: auth.tenantCode || [],
    isDzoneUser: auth.isDzoneUser || false,
    user: auth.user,
    tenantType: auth.tenantType || '',
    modules: auth.modules || {},
    moduleAccessList: auth.moduleAccessList || [],
    permissions: [],
    error: '',
  };

  return {
    data: session,
    status: 'authenticated' as SessionStatus,
    update: () => {},
  };
}

export async function getSession(): Promise<Session | null> {
  const auth = useAuthStore.getState();
  const token = useTokenStore.getState();

  if (!auth.isAuthenticated || !auth.user) return null;

  return {
    accessToken: token.accessToken || '',
    apiUrl: import.meta.env.VITE_API_URL || '',
    roles: auth.roles || [],
    tenantCode: auth.tenantCode || [],
    isDzoneUser: auth.isDzoneUser || false,
    user: auth.user,
    tenantType: auth.tenantType || '',
    modules: auth.modules || {},
    moduleAccessList: auth.moduleAccessList || [],
    permissions: [],
    error: '',
  };
}

export async function signIn(
  _provider?: string,
  credentials?: { email: string; password: string; redirect?: boolean },
) {
  if (!credentials) return { ok: false, error: 'No credentials' };

  try {
    // Dynamic import to avoid circular dependency
    const { login } = await import('../auth/auth-service');
    await login(credentials.email, credentials.password);
    return { ok: true, error: null };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'Login failed' };
  }
}

export async function signOut(options?: { redirect?: boolean }) {
  try {
    const { logout } = await import('../auth/auth-service');
    await logout();
  } catch {
    // Clear stores even if the API call fails
    useAuthStore.getState().clear();
    useTokenStore.getState().clearToken();
    usePermissionsStore.getState().clearPermissions();
  }

  if (options?.redirect !== false) {
    window.location.href = '/login';
  }
}

/**
 * SessionProvider — no-op passthrough.
 * Auth state lives in Zustand stores, not React context.
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return children;
}
