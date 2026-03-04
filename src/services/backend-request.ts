/**
 * Backend request wrapper with auth, error handling, and auto-logout.
 */
import { ApiHost } from '@/lib/constants';
import { HttpMethod } from '@/lib/enums';
import { IApiRequestConfig } from '@/lib/types';
import { backendRequest } from './back-end-manager';
import { logger } from './logger';
import { showNotification } from './notification';
import { useAuthStore, useTokenStore } from '../auth/stores';
import { usePermissionsStore } from '../stores/permissions-store';

export const authenticatedRequest = async ({
  method = HttpMethod.GET,
  isAuthenticated = true,
  apiHost = ApiHost.BackendService,
  apiVersion,
  ...rest
}: IApiRequestConfig) => {
  // Direct backend calls skip the /api prefix.
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
      logger.warn('Auth: auto-logout triggered', {
        status: error.status,
        resource: rest.resource,
        url: rest.url,
      });
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
