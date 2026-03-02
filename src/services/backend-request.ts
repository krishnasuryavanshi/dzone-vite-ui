/**
 * Replacement backend-request for Vite app.
 * Uses Axios directly + Zustand token store (no BFF proxy).
 */
import { ApiHost } from '@/lib/constants';
import { HttpMethod } from '@/lib/enums';
import { IApiRequestConfig } from '@/lib/types';
import { backendRequest } from './back-end-manager';
import { showNotification } from './notification';
import { useAuthStore, useTokenStore } from '../auth/stores';
import { usePermissionsStore } from '../stores/permissions-store';

export const nextBackendRequest = async ({
  method = HttpMethod.GET,
  isAuthenticated = true,
  apiHost = ApiHost.BackendService,
  apiVersion,
  ...rest
}: IApiRequestConfig) => {
  // In the Vite app, direct backend calls (non-default apiHost) don't need
  // the '/api' prefix — that was only for Next.js BFF routes.
  if (apiVersion === undefined) {
    apiVersion = apiHost === ApiHost.BackendService ? '/api' : '';
  }
  try {
    const response = await backendRequest({
      logRequest: false,
      method,
      isAuthenticated,
      apiHost,
      apiVersion,
      ...rest,
    });
    if (rest.includeResponseHeaders) {
      return response;
    }
    return response.data;
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      // Clear all auth state (client-side logout)
      useAuthStore.getState().clear();
      useTokenStore.getState().clearToken();
      usePermissionsStore.getState().clearPermissions();
      const to = `${window.location.pathname}${window.location.search}`;
      window.location.href = `/login?to=${to}`;
    }
    const errorMessage = error?.data?.message;
    const messageHeader = error?.data?.messageHeader;
    if (errorMessage) {
      showNotification({ message: errorMessage, messageHeader, type: 'error' });
      throw errorMessage;
    } else {
      throw error;
    }
  }
};
