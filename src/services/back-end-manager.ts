/**
 * Replacement back-end-manager for Vite app.
 * Uses Zustand stores for token/user instead of server session.
 */
import { HttpMethod } from '@/lib/enums';
import { IApiRequestConfig, IRequestConfig } from '@/lib/types';
import { generateUniqueToken } from '@/lib/utils/string';
import { axiosInstance } from '@/services';
import { AxiosHeaders } from 'axios';
import { useTokenStore } from '../auth/stores';
import { useAuthStore } from '../auth/stores';

export async function backendRequest({
  url,
  resource,
  method,
  isAuthenticated,
  apiHost,
  apiVersion,
  params,
  data,
  resourceId,
  headers,
  responseType,
  logRequest = true,
}: IApiRequestConfig) {
  let customHeaders = new AxiosHeaders().setContentType('application/json');
  if (logRequest) {
    customHeaders.set('X-Request-Id', generateUniqueToken());
  }
  if (headers) {
    Object.keys(headers).forEach((key) => {
      customHeaders.set(key, headers[key]);
    });
  }
  if (isAuthenticated) {
    const token = useTokenStore.getState().accessToken;
    const auth = useAuthStore.getState();
    const roleIds = (auth.roles || [])
      .map((r: any) => r.id)
      .filter(Boolean)
      .join(',');

    if (token) {
      customHeaders.setAuthorization(`Bearer ${token}`);
    }
    customHeaders.set('roleIds', roleIds);
    if (auth.user?.userId) {
      customHeaders.set('X-User-Id', auth.user.userId);
    }
    if (auth.user?.email) {
      customHeaders.set('X-User-Email', auth.user.email);
    }
  }

  const hasFullUrl = !!url;
  if (!hasFullUrl) {
    url = apiVersion ? `${apiVersion}/${resource}` : `/${resource}`;
    if (resourceId) {
      url += `/${resourceId}`;
    }
  }

  const requestConfig: IRequestConfig = {
    method: method as HttpMethod,
    ...(responseType ? { responseType } : {}),
    ...(data ? { data } : {}),
    ...(params ? { params } : {}),
    headers: customHeaders,
    url: url as string,
  };

  if (!hasFullUrl) {
    requestConfig.baseURL = apiHost;
  }

  return axiosInstance(requestConfig);
}
