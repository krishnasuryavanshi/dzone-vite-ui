'use client';

import { Store, showNotification } from '@/services';
import { AuthBindings } from '@refinedev/core';
import { encrypt } from '@/lib/utils';
import { StorageKey } from '@/lib/enums';
import { login as authLogin, logout as authLogout } from '../auth/auth-service';
import { useAuthStore } from '../auth/stores';

const StoreKey_RememberMe = StorageKey.RememberMe;
const StoreKey_Useridentity = StorageKey.UserIdentity;

export const logout = async () => {
  await authLogout();
};

export const authProvider: AuthBindings = {
  login: async (params) => {
    try {
      const data = await authLogin(params.email, params.password);

      if (!data?.modules?.length) {
        showNotification({
          message:
            'Access denied: Invalid credentials or insufficient permissions.',
          type: 'error',
        });
        return { success: false };
      }

      const isRememberMeChecked = Store.get(StoreKey_RememberMe) === true;
      if (isRememberMeChecked) {
        const user = {
          email: params.email,
          password: encrypt(params.password),
        };
        Store.set(StoreKey_Useridentity, user);
      } else {
        Store.remove(StoreKey_Useridentity);
      }

      return {
        success: true,
        redirectTo: '/',
      };
    } catch {
      showNotification({
        message:
          'Access denied: Invalid credentials or insufficient permissions.',
        type: 'error',
      });
      return { success: false };
    }
  },
  logout: async () => {
    try {
      await authLogout();
      showNotification({
        message: 'You have been logged out successfully',
      });
      return {
        success: true,
        redirectTo: '/login',
      };
    } catch (error) {
      showNotification({
        message: 'Error occurred while logging out!',
        type: 'error',
      });
      return {
        success: false,
      };
    }
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return {
      error,
    };
  },
  check: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      return {
        authenticated: false,
        logout: true,
        redirectTo: '/login',
      };
    }

    return {
      authenticated: true,
    };
  },
  getPermissions: async () => {
    const { roles } = useAuthStore.getState();
    if (roles?.length) {
      return roles;
    }
    return null;
  },
  getIdentity: async () => {
    const { user } = useAuthStore.getState();
    if (user) {
      return {
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        avatar: (user as any).image,
      };
    }
    return null;
  },
};
