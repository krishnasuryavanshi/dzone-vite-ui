/**
 * Session hook — reads from Zustand auth + token stores.
 */
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore, useTokenStore } from '../../auth/stores';
import { logout } from '../../auth/auth-service';
import type { Session, SessionStatus } from '../types/auth.types';

const noop = () => {};

export function useSession() {
  const {
    isLoading,
    isAuthenticated,
    user,
    roles,
    tenantCode,
    isDzoneUser,
    tenantType,
    modules,
    moduleAccessList,
  } = useAuthStore(
    useShallow((s) => ({
      isLoading: s.isLoading,
      isAuthenticated: s.isAuthenticated,
      user: s.user,
      roles: s.roles,
      tenantCode: s.tenantCode,
      isDzoneUser: s.isDzoneUser,
      tenantType: s.tenantType,
      modules: s.modules,
      moduleAccessList: s.moduleAccessList,
    })),
  );

  const accessToken = useTokenStore((s) => s.accessToken);

  return useMemo(() => {
    if (isLoading) {
      return { data: null, status: 'loading' as SessionStatus, update: noop };
    }

    if (!isAuthenticated || !user) {
      return {
        data: null,
        status: 'unauthenticated' as SessionStatus,
        update: noop,
      };
    }

    const session: Session = {
      accessToken: accessToken || '',
      apiUrl: import.meta.env.VITE_API_URL || '',
      roles: roles || [],
      tenantCode: tenantCode || [],
      isDzoneUser: isDzoneUser || false,
      user: user,
      tenantType: tenantType || '',
      modules: modules || {},
      moduleAccessList: moduleAccessList || [],
      permissions: [],
      error: '',
    };

    return {
      data: session,
      status: 'authenticated' as SessionStatus,
      update: noop,
    };
  }, [
    isLoading,
    isAuthenticated,
    user,
    roles,
    tenantCode,
    isDzoneUser,
    tenantType,
    modules,
    moduleAccessList,
    accessToken,
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
    await logout();
  } catch {
    useAuthStore.getState().clear();
    useTokenStore.getState().clearToken();
  }

  if (options?.redirect !== false) {
    window.location.href = '/login';
  }
}
