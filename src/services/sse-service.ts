import { streamingAxios } from '@/services/streaming-axios';
import { useTokenStore } from '@/stores/token-store';
import { logError } from '@/services/logger';
import axios, { CancelTokenSource } from 'axios';

export interface SSEConnectionConfig<T> {
  onMessage: (data: T) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
  parseData?: (raw: unknown) => T | null;
  method?: 'GET' | 'POST';
  body?: unknown;
  autoReconnect?: boolean;
}

interface InternalConfig<T> extends SSEConnectionConfig<T> {
  endpoint: string;
  cancelSource?: CancelTokenSource;
  retryTimeout?: NodeJS.Timeout;
}

const activeConnections = new Map<string, CancelTokenSource>();
const connectionConfigs = new Map<string, InternalConfig<unknown>>();
const intentionalDisconnects = new Set<string>();

const RETRY_DELAY = 10000;

function defaultParseData<T>(raw: unknown): T | null {
  if (raw && typeof raw === 'object' && 'data' in raw) {
    return (raw as { data: T }).data;
  }
  return raw as T;
}

function parseSSEMessage<T>(
  text: string,
  customParser?: (raw: unknown) => T | null,
): T | null {
  const lines = text.split('\n');
  for (const line of lines) {
    if (line.startsWith('data:')) {
      const jsonStr = line.slice(5).trim();
      if (jsonStr) {
        try {
          const parsed = JSON.parse(jsonStr);
          return customParser
            ? customParser(parsed)
            : defaultParseData<T>(parsed);
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

async function createConnection<T>(
  connectionId: string,
  config: InternalConfig<T>,
): Promise<void> {
  const cancelSource = axios.CancelToken.source();
  config.cancelSource = cancelSource;
  activeConnections.set(connectionId, cancelSource);

  try {
    const token = await useTokenStore.getState().getToken();
    if (!token) {
      throw new Error('No access token available');
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'text/event-stream',
      'Cache-Control': 'no-cache',
      ...(config.method === 'POST' && { 'Content-Type': 'application/json' }),
    };

    const axiosConfig = {
      headers,
      cancelToken: cancelSource.token,
      responseType: 'stream' as const,
      adapter: 'fetch' as const,
    };

    const response =
      config.method === 'POST'
        ? await streamingAxios.post(config.endpoint, config.body, axiosConfig)
        : await streamingAxios.get(config.endpoint, axiosConfig);

    const reader = response.data.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const messages = buffer.split('\n\n');
      buffer = messages.pop() || '';

      for (const message of messages) {
        if (message.trim()) {
          const data = parseSSEMessage<T>(message, config.parseData);
          if (data) {
            config.onMessage(data);
          }
        }
      }
    }

    // Process any remaining data in buffer
    if (buffer.trim()) {
      const data = parseSSEMessage<T>(buffer, config.parseData);
      if (data) {
        config.onMessage(data);
      }
    }

    // Stream completed normally
    activeConnections.delete(connectionId);
    connectionConfigs.delete(connectionId);
    config.onComplete?.();
  } catch (error) {
    if (axios.isCancel(error)) return;

    logError(`SSE error for ${connectionId}: ${error}`);
    config.onError?.(error as Error);

    activeConnections.delete(connectionId);

    // Only auto-reconnect if enabled (default: true for backwards compatibility)
    const shouldReconnect = config.autoReconnect !== false;
    if (shouldReconnect && !intentionalDisconnects.has(connectionId)) {
      const savedConfig = connectionConfigs.get(
        connectionId,
      ) as InternalConfig<T>;
      if (savedConfig) {
        savedConfig.retryTimeout = setTimeout(() => {
          if (!intentionalDisconnects.has(connectionId)) {
            createConnection(connectionId, savedConfig);
          }
        }, RETRY_DELAY);
      }
    }
  }
}

export function connectSSE<T>(
  connectionId: string,
  endpoint: string,
  config: SSEConnectionConfig<T>,
): void {
  if (activeConnections.has(connectionId)) return;

  const existingConfig = connectionConfigs.get(
    connectionId,
  ) as InternalConfig<T>;
  if (existingConfig?.retryTimeout) {
    clearTimeout(existingConfig.retryTimeout);
  }

  const internalConfig: InternalConfig<T> = {
    ...config,
    endpoint,
  };

  connectionConfigs.set(
    connectionId,
    internalConfig as InternalConfig<unknown>,
  );
  intentionalDisconnects.delete(connectionId);

  createConnection(connectionId, internalConfig);
}

export function disconnectSSE(connectionId: string): void {
  intentionalDisconnects.add(connectionId);

  const config = connectionConfigs.get(connectionId);
  if (config?.retryTimeout) {
    clearTimeout(config.retryTimeout);
  }

  const cancelSource = activeConnections.get(connectionId);
  if (cancelSource) {
    cancelSource.cancel('Connection closed intentionally');
    activeConnections.delete(connectionId);
  }

  connectionConfigs.delete(connectionId);
  intentionalDisconnects.delete(connectionId);
}

export function disconnectAllSSE(): void {
  activeConnections.forEach((_, id) => intentionalDisconnects.add(id));
  connectionConfigs.forEach((config, id) => {
    if (config.retryTimeout) clearTimeout(config.retryTimeout);
    intentionalDisconnects.add(id);
  });

  activeConnections.forEach((source) =>
    source.cancel('All connections closed'),
  );
  activeConnections.clear();
  connectionConfigs.clear();
  intentionalDisconnects.clear();
}

export function isSSEConnected(connectionId: string): boolean {
  return activeConnections.has(connectionId);
}
