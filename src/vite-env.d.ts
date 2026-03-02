/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_ENV: string;
  readonly VITE_SECRET_KEY: string;
  readonly VITE_GA_TRACKING_ID?: string;
  readonly VITE_CLARITY_TRACKING_ID?: string;
  readonly VITE_LOGGER_URL?: string;
  readonly VITE_AUTH_SESSION_TIMEOUT?: string;
  readonly VITE_LOG_HTTP_REQUEST_DETAILS?: string;
  readonly VITE_LOG_HTTP_RESPONSE_DETAILS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
