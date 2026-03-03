/**
 * Session hook — replaces next-auth/react useSession.
 * Reads from Zustand auth + token stores.
 */
import { useMemo } from 'react';
import { useAuthStore, useTokenStore } from '../../auth/stores';
import type { Session, SessionStatus } from '../types/auth.types';

const noop = () => {};

export function useSession() {
  const auth = useAuthStore();
  const token = useTokenStore();

  return useMemo(() => {
    if (auth.isLoading) {
      return { data: null, status: 'loading' as SessionStatus, update: noop };
    }

    if (!auth.isAuthenticated || !auth.user) {
      return {
        data: null,
        status: 'unauthenticated' as SessionStatus,
        update: noop,
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
      update: noop,
    };
  }, [
    auth.isLoading,
    auth.isAuthenticated,
    auth.user,
    auth.roles,
    auth.tenantCode,
    auth.isDzoneUser,
    auth.tenantType,
    auth.modules,
    auth.moduleAccessList,
    token.accessToken,
  ]);
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

export async function signOut(options?: { redirect?: boolean }) {
  try {
    const { logout } = await import('../../auth/auth-service');
    await logout();
  } catch {
    useAuthStore.getState().clear();
    useTokenStore.getState().clearToken();
  }

  if (options?.redirect !== false) {
    window.location.href = '/login';
  }
}
