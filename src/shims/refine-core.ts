/**
 * Shim for `@refinedev/core`.
 * Replaces Refine's framework layer with direct Zustand store reads
 * and React Router navigation.
 */
import React from 'react';
import { useAuthStore, usePermissionsStore } from '../auth/stores';

// ── Types ──
export interface BaseRecord {
  id?: string | number;
  [key: string]: any;
}

export interface HttpError {
  message: string;
  statusCode: number;
  [key: string]: any;
}

export interface IResourceItem {
  name: string;
  list?: string;
  create?: string;
  edit?: string;
  show?: string;
  meta?: {
    label?: string;
    icon?: React.ReactNode;
    permissions?: string[];
    [key: string]: any;
  };
  [key: string]: any;
}

export type ResourceProps = IResourceItem;

export interface AuthBindings {
  login?: (params: any) => Promise<any>;
  logout?: (params?: any) => Promise<any>;
  check?: (params?: any) => Promise<any>;
  onError?: (error: any) => Promise<any>;
  getPermissions?: (params?: any) => Promise<any>;
  getIdentity?: (params?: any) => Promise<any>;
}

export interface I18nProvider {
  translate: (key: string, options?: any) => string;
  changeLocale: (lang: string) => Promise<any> | void;
  getLocale: () => string;
}

// ── Components ──

/**
 * Refine component — no-op passthrough.
 * Config is handled by the Vite app's own router and providers.
 */
export function Refine({ children }: { children?: React.ReactNode; [key: string]: any }) {
  return children ?? null;
}

/**
 * Authenticated component — checks auth store.
 */
export function Authenticated({
  children,
  fallback,
  key: _key,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  key?: string;
}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) return fallback ?? null;
  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }
  return children;
}

// ── Hooks ──

export function useIsAuthenticated() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  return {
    data: { authenticated: isAuthenticated },
    isLoading,
    isSuccess: isAuthenticated,
    isError: !isAuthenticated && !isLoading,
  };
}

export function usePermissions<T = any>() {
  const accesses = usePermissionsStore((s) => s.accesses);
  // useAccess expects string[] of permission keys, not the Record<string, boolean> object
  const permissionKeys = Object.keys(accesses || {}).filter((k) => accesses[k]);
  return { data: permissionKeys as T };
}

export function useGetIdentity<T = any>() {
  const user = useAuthStore((s) => s.user);
  if (!user) return { data: null };
  return {
    data: {
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name,
      avatar: user.image,
      ...user,
    } as T,
  };
}

export function useLogin() {
  return {
    mutate: async (params: { email: string; password: string }) => {
      try {
        const { login } = await import('../auth/auth-service');
        const result = await login(params.email, params.password);
        // After successful login, redirect to dashboard
        window.location.href = '/dashboard';
        return result;
      } catch (error: any) {
        const { showNotification } = await import('../services/notification');
        showNotification({
          message: error?.message || 'Login failed. Please check your credentials.',
          type: 'error',
        });
      }
    },
  };
}

export function useLogout() {
  return {
    mutate: async () => {
      const { logout } = await import('../auth/auth-service');
      return logout();
    },
  };
}

export function useTranslate() {
  // i18next is set up globally; this returns t function directly
  // The actual useTranslation hook is used by components that need it
  return (key: string, options?: any) => key;
}

export function useGetLocale() {
  return () => {
    try {
      // Try to get locale from i18next
      return (window as any).__i18n?.language || 'en';
    } catch {
      return 'en';
    }
  };
}

export function useSetLocale() {
  return async (lang: string) => {
    try {
      await (window as any).__i18n?.changeLanguage(lang);
    } catch {
      // noop
    }
  };
}

export function useResource() {
  return {
    resource: undefined,
    resources: [],
    resourceName: '',
    select: (_name: string) => undefined,
  };
}

export function useList<T = any, _E = any, _R = T>(_params?: any) {
  return {
    data: { data: [] as T[], total: 0 },
    isLoading: false,
    isError: false,
    refetch: () => Promise.resolve(),
  };
}
