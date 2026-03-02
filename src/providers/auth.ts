'use client';

import { BackendResources } from '@/lib/enums';
import { Store, nextBackendRequest, showNotification } from '@/services';
import { AuthBindings } from '@refinedev/core';
import { getSession, signIn, signOut } from 'next-auth/react';
import { encrypt } from '@/lib/utils';
import { StorageKey } from '@/lib/enums';
import { usePermissionsStore } from '@/stores/permissions-store';
import { useTokenStore } from '@/stores/token-store';
import { IUser } from '@/app/(dashboard)/ums/users/lib/types';

const StoreKey_RememberMe = StorageKey.RememberMe;
const StoreKey_Useridentity = StorageKey.UserIdentity;

export enum IAMProvider {
  Credentials = 'credentials',
}

export const logout = async () => {
  await nextBackendRequest({
    resource: BackendResources.Logout,
  });
  await signOut({
    redirect: false,
  });
  usePermissionsStore.getState().clearPermissions();
  useTokenStore.getState().clearToken();
};

export const authProvider: AuthBindings = {
  login: async (params) => {
    const resp = await signIn(IAMProvider.Credentials, {
      email: params.email,
      password: params.password,
      redirect: false,
    });
    if (resp?.ok) {
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
    }
    showNotification({
      message:
        'Access denied: Invalid credentials or insufficient permissions.',
      type: 'error',
    });
    return {
      success: false,
    };
  },
  logout: async () => {
    try {
      await logout();
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
    const session = await getSession();
    if (!session) {
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
    const session = await getSession();

    if (session?.roles?.length) {
      return session.roles;
    }
    return null;
  },
  getIdentity: async () => {
    const session = await getSession();

    if (session?.user) {
      const { user } = session;
      return {
        name: `${(user as IUser).firstName} ${(user as IUser).lastName}`,
        avatar: user.image,
      };
    }

    return null;
  },
};
