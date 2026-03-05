/**
 * Low-level backend request handler with Zustand auth integration.
 */
import { HttpMethod } from '@/lib/enums';
import { IApiRequestConfig, IRequestConfig } from '@/lib/types';
import { generateUniqueToken } from '@/lib/utils/string';
import { axiosInstance } from '@/services';
import { AxiosHeaders } from 'axios';
import { useTokenStore } from '../auth/stores';

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
  const customHeaders = new AxiosHeaders().setContentType('application/json');
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

    if (token) {
      customHeaders.setAuthorization(`Bearer ${token}`);
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
