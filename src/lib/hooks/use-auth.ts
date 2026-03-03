/**
 * Auth hooks — reads directly from Zustand auth stores.
 */
import { useAuthStore } from '../../auth/stores';
import { login, logout } from '../../auth/auth-service';
import { router } from '../../router';
import { showNotification } from '../../services/notification';
import { usePermissionsStore } from '../../stores/permissions-store';

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
        const result = await login(params.email, params.password);
        router.navigate('/organizations', { replace: true });
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
