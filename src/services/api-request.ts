import { HttpMethod } from '@/lib/enums';
import { IApiRequestConfig } from '@/lib/types';
import { AxiosHeaders } from 'axios';
import { backendRequest } from './back-end-manager';

interface ExtendedApiRequestConfig extends IApiRequestConfig {
  responseType?: 'arraybuffer';
  includeResponseHeaders?: boolean;
}

const convertToAxiosHeaders = (
  headers: Record<string, string>,
): AxiosHeaders => {
  const axiosHeaders = new AxiosHeaders();
  for (const key in headers) {
    if (headers.hasOwnProperty(key)) {
      axiosHeaders.set(key, headers[key]);
    }
  }
  return axiosHeaders;
};

export const apiRequest = async ({
  method = HttpMethod.GET,
  isAuthenticated = true,
  responseType,
  includeResponseHeaders,
  requestName,
  ...rest
}: ExtendedApiRequestConfig) => {
  try {
    const defaultHeaders = {
      ...rest.headers,
    };

    if (
      responseType === 'arraybuffer' &&
      requestName !== 'exportFilteredLeads'
    ) {
      defaultHeaders['Content-Type'] = 'blob';
    }

    // Removed service-specific auth details for simplicity

    const config = {
      method,
      isAuthenticated,
      ...rest,
      headers: convertToAxiosHeaders(defaultHeaders),
      responseType,
    };

    const response = await backendRequest(config);

    if (includeResponseHeaders) {
      return {
        data: response.data,
        headers: response.headers,
      };
    } else {
      return { data: response.data };
    }
  } catch (error) {
    throw error;
  }
};
