/**
 * Auth hooks — reads directly from Zustand auth stores.
 */
import { useAuthStore } from '../../auth/stores';
import { login, logout } from '../../auth/auth-service';
import { router } from '../../router';
import { showNotification } from '../../services/notification';
import { usePermissionsStore } from '../../stores/permissions-store';
import { encryptAsync } from '../utils/encryption';
import { Store } from '../../services';
import { StorageKey } from '../enums';
import { getFirstAllowedRoute } from '../utils/get-first-allowed-route';

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
        // Capture before login() changes auth state (which triggers AuthLayout re-render)
        const toParam = new URLSearchParams(window.location.search).get('to');
        const result = await login(params.email, params.password);
        if (Store.get(StorageKey.RememberMe) === true) {
          const encryptedPassword = await encryptAsync(params.password);
          Store.set(StorageKey.UserIdentity, { email: params.email, password: encryptedPassword });
        }
        const accesses = usePermissionsStore.getState().accesses;
        const redirectTo = toParam ? decodeURIComponent(toParam) : getFirstAllowedRoute(accesses);
        router.navigate(redirectTo, { replace: true });
        return result;
      } catch (error: any) {
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
      return logout();
    },
  };
}
