# DZone Vite

## Environment Variables

Copy `.env.example` to `.env` and fill in the values.

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | Yes | — | Backend API gateway URL (e.g. `https://dzone-dev2.digitalzoneus.com`) |
| `VITE_APP_ENV` | Yes | — | App environment (`development`, `qa`, `uat`, `production`) |
| `VITE_SECRET_KEY` | Yes | — | Encryption key for client-side crypto |
| `VITE_AUTH_SESSION_TIMEOUT` | No | `1` | Auth session timeout in days |
| `VITE_LOGGER_URL` | No | — | Remote logger endpoint URL |
| `VITE_LOG_HTTP_REQUEST_DETAILS` | No | `true` | Log full HTTP request details (`true`/`false`) |
| `VITE_LOG_HTTP_RESPONSE_DETAILS` | No | `true` | Log full HTTP response details (`true`/`false`) |
| `VITE_GA_TRACKING_ID` | No | — | Google Analytics tracking ID |
| `VITE_CLARITY_TRACKING_ID` | No | — | Microsoft Clarity tracking ID |
| `VITE_SENTRY_DSN` | No | — | Sentry DSN — Sentry is disabled if empty |
| `VITE_SENTRY_ENVIRONMENT` | No | Vite `MODE` | Sentry environment tag (falls back to Vite mode) |
| `VITE_SENTRY_TRACES_SAMPLE_RATE` | No | `1.0` | Performance tracing sample rate (`0.0`–`1.0`) |
| `VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE` | No | `0.1` | Session replay sample rate (`0.0`–`1.0`) |
| `VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE` | No | `1.0` | Replay capture rate when an error occurs (`0.0`–`1.0`) |
