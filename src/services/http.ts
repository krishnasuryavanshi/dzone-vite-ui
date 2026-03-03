import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { logHttpRequest } from './logger';
const onRequest = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  logRequest(config);
  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  logResponse(response);
  return { data: response?.data, headers: response.headers } as AxiosResponse;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  logResponse(error, true);
  const { statusText, status, data } = (error.response as AxiosResponse) ?? {};

  return Promise.reject({ error, statusText, status, data });
};

export function setupInterceptorsTo(
  axiosInstance: AxiosInstance,
): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}

const instance = axios.create(); // Browser handles TLS natively

export const axiosInstance = setupInterceptorsTo(instance);

const logResponse = (
  requestResult: AxiosError | AxiosResponse,
  isError = false,
) => {
  try {
    const config = requestResult.config;
    const response = (
      isError ? (requestResult as AxiosError).response : requestResult
    ) as AxiosResponse;
    let data: Record<string, unknown> = {
      requestId: config?.headers?.['X-Request-Id'],
      baseURL: config?.baseURL,
      url: config?.url,
      method: config?.method,
      status: response?.status,
      time: new Date().toISOString(),
    };

    if (import.meta.env.VITE_LOG_HTTP_RESPONSE_DETAILS !== 'false') {
      const details = {
        responseHeaders: JSON.stringify(response?.headers),
        responseData: JSON.stringify(response?.data),
      };
      data = { ...data, ...details };
    }
    logHttpRequest(data, isError);
  } catch (error) {}
};

const logRequest = (config: InternalAxiosRequestConfig) => {
  try {
    let data: Record<string, unknown> = {
      requestId: config?.headers?.['X-Request-Id'],
      baseURL: config?.baseURL,
      url: config?.url,
      method: config?.method,
      time: new Date().toISOString(),
    };

    if (import.meta.env.VITE_LOG_HTTP_REQUEST_DETAILS !== 'false') {
      data = {
        ...data,
        payload: JSON.stringify(config?.data),
        params: JSON.stringify(config?.params),
        requestHeaders: JSON.stringify(config?.headers),
      };
    }
    logHttpRequest(data);
  } catch (error) {}
};
